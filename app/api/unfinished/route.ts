import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const GET = async (request: Request) => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    let names: Array<any> = [];

    try {
        await client.connect();
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");
    } catch(error) {
        console.log(error);
    };

    return NextResponse.json(names);
};

export { GET };