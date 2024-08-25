import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import userCheck from '../usercheck';

const POST = async (request: NextRequest) => {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ error: 'Missing parameters.' });
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const cookie = cookies();
    let names: any = {};

    if(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' });

    try {
        // Connect to the database
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
        // Get the user
        names = (await collection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray())[0];
        if (names.started.includes(body.name))
            return NextResponse.json({ error: 'User is already tracking this location.' });
        // Remove the location from the tracked
        await collection.updateOne(
            { username: cookie.get('username')?.value },
            { $push: { started: body.name } }
        );
        await client.close();
        return NextResponse.json({ success: true });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close();
        return NextResponse.json({ error: 'An error has occured.' });
    };
};

export { POST };