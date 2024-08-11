import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const POST = async (request: Request) => {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: 'Missing parameters.' });
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const cookie = cookies();
    let names: any = {};

    try {
        // Connect to the database
        await client.connect();
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");
        // Get the user
        names = await collection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray();
        if (names.length === 0)
            return NextResponse.json({ error: 'User not found.' });
        // Get the tracked locations
        let started = names[0].started;
        if (!started.includes(body.name))
            return NextResponse.json({ error: 'User isn\'t tracking this location.' });
        // Remove the location from the tracked
        await collection.updateOne(
            { username: cookie.get('username')?.value },
            { $set: { started: started.filter((name: string) => name !== body.name) } }
        );
        client.close();
        return NextResponse.json({ ok: true });
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: 'An error has occured.' });
    };
};

export { POST };