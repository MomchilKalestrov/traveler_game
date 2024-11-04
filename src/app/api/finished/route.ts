import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { user } from '@logic/types';

const GET = async (request: NextRequest) => {
    const cookie = await cookies();
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const args = new URL(request.url).searchParams;
    if(!args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    let user: user;
    let locations: Array<any>;

    const username = args.get('username')?.toUpperCase() === 'CURRENT_USER' ? cookie.get('username')?.value : args.get('username');

    try {
        // Connect to the database
        await client.connect();
        const userCollection = client.db('TestDB').collection('UserCollection');
        const locationCollection = client.db('TestDB').collection('LocationCollection');
        // Find the user
        user = (
            await userCollection.aggregate([{
                $match: { username: username }
            }]).toArray()
        )[0] as user;
        
        locations = await locationCollection.aggregate([
            { $project: { _id: 0 } },
            { $match:   { name: { $in: user.finished.map(l => l.location) } } }
        ]).toArray();
        
        if(!user) {
            await client.close(true);
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
        // Return the locations
        await client.close(true);
        return NextResponse.json(locations, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };