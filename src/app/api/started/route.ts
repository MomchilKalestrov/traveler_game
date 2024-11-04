import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import userCheck from '@logic/usercheck';

const GET = async () => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const cookie = await cookies();
    let names: any = {};
    let locations: any = {};

    console.log(cookie.get('username'))

    if(!(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || '')))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        await client.connect();
        const userCollection = client.db('TestDB').collection('UserCollection');
        names = (await userCollection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray())[0].started;

        const locationCollection = client.db('TestDB').collection('LocationCollection');
        locations = await locationCollection.aggregate([
            { $project: { _id: 0 } },
            { $match:   { name: { $in: names } } }
        ]).toArray();
        
        await client.close(true);
        return NextResponse.json(locations, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    }
};

export { GET };