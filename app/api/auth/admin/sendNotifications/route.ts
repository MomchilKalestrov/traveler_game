import { MongoClient } from "mongodb";
import webpush from 'web-push';
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { md5 } from "js-md5";

webpush.setVapidDetails(
    'mailto:kalestrov.mo@gmail.com',
    'BLHIkvcg6jS1TYx4vpkVVGULrdKAiWvC7c6rxh7Dp8V1kkP6MVGPlPhz5_I5S5fbV1-wM4cJrKWHQfqJ0SlZ_4o',
    'LvaUffx6Lhyg8phcqnuRhdKgOrYHIcCHxMPpcClLmws'
);

const POST = async (request: NextRequest) => {
    const cookie = cookies();
    const client = new MongoClient(process.env.MONGODB_URI as string);
    const body = await request.json();
    const passphrase: string = cookie.get('passphrase')?.value || '';

    if (passphrase !== md5(process.env.ADMIN_PASS as string))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if(!body || !body.title || !body.message || !body.image)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
    
        const subscriptions = (await collection.findOne({ subscribersInfo: true }) as any).subscribers;

        subscriptions.map((subscription: any) => {
            console.log('endpoint: ' + subscription.endpoint);
            if(subscription.endpoint && subscription.keys)
                webpush.sendNotification(subscription, JSON.stringify({
                    title: body.title,
                    body: body.message,
                    icon: body.icon
                }));
        });
    
        await client.close();
        return NextResponse.json({ success: true }, { status: 204 });
    }
    catch (error) {
        await client.close();
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occurred.' }, { status: 500 });
    }
}

export { POST };