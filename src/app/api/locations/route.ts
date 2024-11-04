import { MongoClient } from 'mongodb';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const GET = async () => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    let names: Array<any> = [];

    try {
        await client.connect();
        const locationCollection = client.db('TestDB').collection('LocationCollection');
        names = await locationCollection.aggregate([
            { $project: { _id: 0 } }
        ]).toArray();
        await client.close(true);
        return NextResponse.json(names, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };