import { md5 } from 'js-md5';
import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

const POST = async (request: NextRequest) => {
    const args: URLSearchParams = new URL(request.url).searchParams;
    
    if (!args.get('password') || !args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    if ((args.get('username') as string).length < 3)
        return NextResponse.json({ error: 'Username must be atleast 3 symbols long.' }, { status: 412 });
    if ((args.get('password') as string).length < 8)
        return NextResponse.json({ error: 'Password must be atleast 8 symbols long.' }, { status: 412 });

    const client = new MongoClient(process.env.MONGODB_URI as string);

    try {
        // Connect to the MongoDB
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
        // Check if the data already exists
        const dataExists = await collection.findOne({ username: args.get('username') });
        if(dataExists) {
            await client.close();
            return NextResponse.json({ error: 'User with the same username already exists.' }, { status: 400 });
        }
        // Insert the data
        await collection.insertOne({
            username: args.get('username'),
            password: md5(args.get('password') || ''),
            started: [],
            finished: []
        });
        // Set the cookies
        const user = cookies();
        user.set('username', args.get('username') || '');
        user.set('password', md5(args.get('password') || ''));
        
        await client.close();
        return NextResponse.json({ success: true }, { status: 201 });
    }
    catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close();
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    };
};

export { POST };