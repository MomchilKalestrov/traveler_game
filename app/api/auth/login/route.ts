import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';
import { md5 } from 'js-md5';

const POST = async (request: NextRequest) => {
    const args: URLSearchParams = new URL(request.url).searchParams;
    
    if(!args.get('password') || !args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    
    const client = new MongoClient(process.env.MONGODB_URI as string);
    
    try {
        // Connect to the MongoDB
        await client.connect();
        const userCollection = client.db('TestDB').collection('UserCollection');
        // Check if the data already exists
        const dataExists = await userCollection.findOne({
            username: args.get('username'),
            password: md5(args.get('password') || '')
        });
        if(!dataExists) {
            await client.close(true);
            return NextResponse.json({ error: 'Incorrect credentials.' }, { status: 401 });
        }
        // Set the cookies
        const user = await cookies();
        user.set('username', args.get('username') || '', {
            maxAge: Date.now() + 365 * 24 * 60 * 60 * 1000
        });
        user.set('password', md5(args.get('password') || ''), {
            maxAge: Date.now() + 365 * 24 * 60 * 60 * 1000
        });
        await client.close(true);
        return new NextResponse(null, { status: 204 });
    }
    catch(error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    };
};

export { POST };