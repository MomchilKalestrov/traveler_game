import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import userCheck from '../usercheck';

const GET = async (request: NextRequest) => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const cookie = cookies();
    let names: any = {};
    let locations: any = {};

    if(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
        names = (await collection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray())[0].started;
        locations = await collection.aggregate([
            { $project: { _id: 0, name: 1, location: 1 } },
            { $match:   { name: { $in: names } } }
        ]).toArray();
        
        await client.close();
        return NextResponse.json(locations, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close();
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    }
};

export { GET };