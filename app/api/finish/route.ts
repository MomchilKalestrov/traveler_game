import { MongoClient } from 'mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import userCheck from '@logic/usercheck';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
}

const POST = async (request: NextRequest) => {
    const args = await request.json();
    if (!args.name || !args.location.lat || !args.location.lng)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const cookie = cookies();
    let location: any = {};
    let user: any = {};

    if(!await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the database
        await client.connect();
        const userCollection = client.db('TestDB').collection('UserCollection');
        // Get the user
        user = await userCollection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray();
        // Get the tracked locations
        let started = user[0].started;
        if (!started.includes(args.name)) {
            await client.close(true);
            return NextResponse.json({ error: 'User isn\'t tracking this location.' }, { status: 412 });
        }
        // Get the location
        location = (await userCollection.aggregate([{
            $match: { name: args.name }
        }]).toArray())[0];
        if(!location) {
            await client.close(true);
            return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
        }
        // Calculate the distance
        // If the user is within 100 meters of the location, remove it from the tracked
        const distance = haversineDistance(
            args.location.lat,
            args.location.lng,
            parseFloat(location.location.lat.toString()),
            parseFloat(location.location.lng.toString())
        );
        
        if(distance > 100) {
            await client.close(true);
            return NextResponse.json({ error: 'User is not within 100 meters of the location.' }, { status: 400 });
        }
        // Remove the location from the tracked
        await userCollection.updateOne(
            { username: cookie.get('username')?.value },
            { $set: { started: started.filter((name: string) => name !== args.name) } }
        );
        // Add to finished
        await userCollection.updateOne(
            { username: cookie.get('username')?.value },
            { $push: { finished: {
                location: args.name,
                time: Date.now(),
            } as any } }
        );
        await client.close(true);
        // it should stay like this!!!!
        return NextResponse.json({ success: true }, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };