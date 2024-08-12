import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import userCheck from '../usercheck';

const GET = async (request: Request) => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const cookie = cookies();
    let names: any = {};

    if(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' });

    try {
        await client.connect();
        const db = client.db('TestDB');
        const collection = db.collection('TestCollection');
        names = await collection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray();
        await client.close();
        return NextResponse.json(names[0].started);
    } catch(error) {
        console.log(error);
        console.log('An exception has occured:\n', error);
        await client.close();
        return NextResponse.json({ error: 'An error has occured.' });
    }
};

export { GET };