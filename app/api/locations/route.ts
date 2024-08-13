import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GET = async (request: Request) => {
    const args = cookies();
    const client = new MongoClient(process.env.MONGODB_URI as string);
    let names: Array<any> = [];

    try {
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
        names = await collection.aggregate([
            { $project: { _id: 0 } },
            { $match:   { name: { $exists: true } } }
        ]).toArray();
        await client.close();
        return NextResponse.json(names);
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close();
        return NextResponse.json({ error: 'An error has occured.' });
    };
};

export { GET };