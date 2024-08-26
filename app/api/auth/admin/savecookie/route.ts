import webpush from 'web-push';
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { md5 } from 'js-md5';

webpush.setVapidDetails(
    'mailto:kalestrov.mo@gmail.com',
    'BLHIkvcg6jS1TYx4vpkVVGULrdKAiWvC7c6rxh7Dp8V1kkP6MVGPlPhz5_I5S5fbV1-wM4cJrKWHQfqJ0SlZ_4o',
    'LvaUffx6Lhyg8phcqnuRhdKgOrYHIcCHxMPpcClLmws'
);

const POST = async (request: any) => {
    const cookie = cookies();
    const args = await request.json();

    if (!args.passphrase) return NextResponse.json({ error: 'Missing parameters.' });
    
    cookie.set('passphrase', md5(args.passphrase));
    return NextResponse.json({ success: true });
}

export { POST };