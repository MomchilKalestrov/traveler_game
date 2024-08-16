import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GET = async (request: Request) => {
    const cookie = cookies();
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const args = new URL(request.url).searchParams;
    if(!args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' });
    let userInfo: any = {};
    let locations: any = {};

    const username = args.get('username')?.toLowerCase() === 'CURRENT_USER' ? cookie.get('username')?.value : args.get('username');

    try {
        // Connect to the database
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
        // Find the user
        userInfo = (await collection.aggregate([{
            $match: { username: username }
        }]).toArray())[0];
        if(!userInfo)
            return NextResponse.json({ error: 'User not found.' });
        // Get the locations
        locations = await collection.aggregate([
            { $project: { _id: 0, name: 1, location: 1 } },
            { $match:   { name: { $in: userInfo.finished } } }
        ]).toArray();
        // Return the locations
        await client.close();
        return NextResponse.json(locations);
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' });
    };
};

export { GET };