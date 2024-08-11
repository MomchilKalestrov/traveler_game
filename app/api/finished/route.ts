import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GET = async (request: Request) => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const args = cookies();
    let names: any = {};

    try {
        await client.connect();
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");
        names = await collection.aggregate([{
            $match: { username: args.get('username')?.value }
        }]).toArray();
        return NextResponse.json(names[0].finished);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: 'An error has occured.' });
    };
};

export { GET };