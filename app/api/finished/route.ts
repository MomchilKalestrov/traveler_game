import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GET = async (request: Request) => {
    const cookie = cookies();
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const args = new URL(request.url).searchParams;
    if(!args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' });
    let name: any = {};

    const username = args.get('username')?.toLowerCase() === '<|current|>' ? cookie.get('username')?.value : args.get('username');

    try {
        // Connect to the database
        await client.connect();
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");
        // Find the user
        name = (await collection.aggregate([{
            $match: { username: username }
        }]).toArray())[0];
        if(!name)
            return NextResponse.json({ error: 'User not found.' });
        
        client.close();
        return NextResponse.json(name.finished);
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' });
    };
};

export { GET };