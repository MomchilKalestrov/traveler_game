import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import userCheck from '../usercheck';
import { finished } from 'stream';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
}

const POST = async (request: Request) => {
    const args = await request.json();
    if (!args.name || !args.location.lat || !args.location.lng)
        return NextResponse.json({ error: 'Missing parameters.' });
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const cookie = cookies();
    let location: any = {};
    let user: any = {};

    if(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' });

    try {
        // Connect to the database
        await client.connect();
        const db = client.db('TestDB');
        const collection = db.collection('TestCollection');
        // Get the user
        user = await collection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray();
        // Get the tracked locations
        let started = user[0].started;
        if (!started.includes(args.name))
            return NextResponse.json({ error: 'User isn\'t tracking this location.' });
        // Get the location
        location = (await collection.aggregate([{
            $match: { name: args.name }
        }]).toArray())[0];
        if(!location) return NextResponse.json({ error: 'Location not found.' });
        // Calculate the distance
        // If the user is within 100 meters of the location, remove it from the tracked
        const distance = haversineDistance(
            args.location.lat,
            args.location.lng,
            location.location.lat['$Decimal128'],
            location.location.lng['$Decimal128']
        );
        if(distance > 100) return NextResponse.json({ error: 'User is not within 100 meters of the location.' });
        // Remove the location from the tracked
        await collection.updateOne(
            { username: cookie.get('username')?.value },
            { $set: { started: started.filter((name: string) => name !== args.name) } }
        );
        // Add to finished
        await collection.updateOne(
            { username: cookie.get('username')?.value },
            { $push: { finished: args.name } }
        );
        client.close();
        return NextResponse.json({ ok: true });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close();
        return NextResponse.json({ error: 'An error has occured.' });
    };
};

export { POST };