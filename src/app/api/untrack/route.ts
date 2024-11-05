import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import userCheck from '@logic/usercheck';

const POST = async (request: NextRequest) => {
    const args = await request.json();
    if (!args.name)
        return NextResponse.json({ error: 'Missing parameters.' });
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const cookie = await cookies();
    let names: any = {};

    if(!(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || '')))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the database
        await client.connect();
        const userCollection = client.db('TestDB').collection('UserCollection');
        // Get the user
        names = await userCollection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray();
        // Get the tracked locations
        let started = names[0].started;
        if (!started.includes(args.name)) {
            await client.close(true);
            return NextResponse.json({ error: 'User isn\'t tracking this location.' }, { status: 400 });
        }
        // Remove the location from the tracked
        await userCollection.updateOne(
            { username: cookie.get('username')?.value },
            { $set: { started: started.filter((name: string) => name !== args.name) } }
        );
        await client.close(true);
        return new NextResponse(null, { status: 204 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };