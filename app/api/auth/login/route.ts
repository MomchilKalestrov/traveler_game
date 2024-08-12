import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';
import { md5 } from 'js-md5';

const POST = async (request: NextRequest) => {
    const args: URLSearchParams = new URL(request.url).searchParams;
    
    if(!args.get('password') || !args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' });
    
    const client = new MongoClient(process.env.MONGODB_URI as string);
    
    try {
        // Connect to the MongoDB
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
        // Check if the data already exists
        const dataExists = await collection.findOne({
            username: args.get('username'),
            password: md5(args.get('password') || '')
        });
        if(!dataExists)
            return NextResponse.json({ error: 'Incorrect credentials.' });
        // Set the cookies
        const user = cookies();
        user.set('username', args.get('username') || '');
        user.set('password', md5(args.get('password') || ''));
        client.close();
    }
    catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close();
        return NextResponse.json({ error: 'An error occurred.' });
    };
    
    return NextResponse.json({ success: true });
};

export { POST };