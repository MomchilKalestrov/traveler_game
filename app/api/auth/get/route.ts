import { MongoClient } from 'mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const GET = async (request: NextRequest) => {
    const cookie = cookies();
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const args = new URL(request.url).searchParams;
    if(!args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' });
    let userInfo: any = {};

    const username = args.get('username')?.toUpperCase() === 'CURRENT_USER' ? cookie.get('username')?.value : args.get('username');
    // This is when the body value was `CURRENT_USER` but the cookie was undefined
    if(!username)
        return NextResponse.json({ error: 'Missing parameters.' });

    try {
        // Connect to the database
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
        // Find the user
        userInfo = (await collection.aggregate([
            { $project: { _id: 0, password: 0 }},
            { $match: { username: username } }
        ]).toArray())[0];
        if(!userInfo) return NextResponse.json({ error: 'User not found.' });
        // Return the locations
        await client.close();
        return NextResponse.json(userInfo);
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close();
        return NextResponse.json({ error: 'An error has occured.' });
    };
};

export { GET };