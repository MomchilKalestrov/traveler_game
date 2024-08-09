import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server';

const GET = async (request: Request) => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    let names: Array<any> = [];

    try {
        await client.connect();
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");
        names = await collection.aggregate([
            {
                $match: {
                    name: new URL(request.url).searchParams.get('name')
                }
            },
            {
                $project: {
                    _id: 0
                }
            } 
        ]).toArray();
    } catch(error) {
        console.log(error);
    };

    return NextResponse.json(names);
};

export { GET };