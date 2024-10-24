import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const GET = async () => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    let top100: any = {};

    try {
        await client.connect();
        const userCollection = client.db('TestDB').collection('UserCollection');
        top100 = await userCollection.aggregate([
            { $project: { _id: 0, password: 0 } },
            { $sort: { xp: -1 } },
            { $limit: 100 }
        ]).toArray();
        
        await client.close(true);
        return NextResponse.json(top100, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    }
}

export { GET };