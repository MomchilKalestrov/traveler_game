import webpush from 'web-push';
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

webpush.setVapidDetails(
    'mailto:kalestrov.mo@gmail.com',
    'BLHIkvcg6jS1TYx4vpkVVGULrdKAiWvC7c6rxh7Dp8V1kkP6MVGPlPhz5_I5S5fbV1-wM4cJrKWHQfqJ0SlZ_4o',
    'LvaUffx6Lhyg8phcqnuRhdKgOrYHIcCHxMPpcClLmws'
);

const GET = async () => {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    try {
        await client.connect();
        const collection = client.db('TestDB').collection('TestCollection');
    
        const subscriptions = (await collection.findOne({ subscribersInfo: true }) as any).subscribers;

        const notificationPayload = JSON.stringify({
            title: 'Suck my nuts nigga',
            body: 'This is a test notification.',
            icon: '/icons/notification.svg'
        });

        await Promise.all(subscriptions.map((subscription: any) => {
            if(subscription.endpoint && subscription.key)
                webpush.sendNotification(subscription, notificationPayload);
        }));
    
        await client.close();
    }
    catch (error) {
        await client.close();
        console.log('An exception has occured:\n', error);
    }

    return NextResponse.json({ success: true });
}

export { GET };