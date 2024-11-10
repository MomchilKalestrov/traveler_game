import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const GET = async () => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    let locations: Array<any> = [];

    try {
        await client.connect();
        const locationCollection = client.db('TestDB').collection('LocationCollection');
        locations = await locationCollection.aggregate([
            { $project: { _id: 0 } }
        ]).toArray();
        console.log('Locations:', locations);
        await client.close(true);
        return NextResponse.json(locations, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };