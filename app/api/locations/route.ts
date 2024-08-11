import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GET = async (request: Request) => {
    const args = cookies();
    const client = new MongoClient(process.env.MONGODB_URI as string);
    let names: Array<any> = [];
    let user:  Array<any> = [];

    try {
        await client.connect();
        const db = client.db("TestDB");
        const collection = db.collection("TestCollection");
        names = await collection.aggregate([
            {
                $project: {
                    name: 1,
                    _id: 0
                }
            },
            { 
                $match: { name: { $exists: true } }
            }
        ]).toArray();

        user = await collection.aggregate([{
            $match: { username: args.get('username')?.value }
        }]).toArray();

        names = names.filter((name) =>
            !user[0].started.includes(name.name) &&
            !user[0].finished.includes(name.name)
        );
        console.log(names);
    } catch(error) {
        console.log(error);
    };

    return NextResponse.json(names);
};

export { GET };