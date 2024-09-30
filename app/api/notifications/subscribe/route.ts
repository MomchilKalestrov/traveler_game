import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const POST = async (request: NextRequest) => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const body = await request.json();
    

    if(!body || !body.endpoint || !body.keys) return NextResponse.json({ error: 'Invalid request.' }, { status: 412 });

    try {
        await client.connect();
        const subscriptionCollection = client.db('TestDB').collection('SubscriptionCollection');

        await subscriptionCollection.updateOne(
            { subscribersInfo: true },
            { $push: { subscribers: body } }
        );

        await client.close(true);
        return new NextResponse(null, { status: 204 });
    }
    catch (error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    }
}

export { POST };