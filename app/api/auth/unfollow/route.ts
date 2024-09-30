import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import userCheck from '@logic/usercheck';
import { MongoClient } from 'mongodb';

const POST = async (request: NextRequest) => {
    const args = new URL(request.url).searchParams;
    const cookie = cookies();
    const client = new MongoClient(process.env.MONGODB_URI as string);

    if (!args.get('username'))
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    if (args.get('username') === cookie.get('username')?.value)
        return NextResponse.json({ error: 'You cannot unfollow yourself.' }, { status: 400 });

    if (await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        client.connect();
        const userCollection = client.db('TestDB').collection('UserCollection');

        const currentUser = (await userCollection.aggregate([{
            $match: { username: cookie.get('username')?.value }
        }]).toArray())[0];
        const requestedUser = (await userCollection.aggregate([{
            $match: { username: args.get('username') }
        }]).toArray())[0];
    
        if (!requestedUser || !currentUser) {
            await client.close(true);
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        if (!currentUser.following.includes(args.get('username'))) {
            await client.close(true);
            return NextResponse.json({ error: 'User is not following this user.' }, { status: 400 });
        }

        await userCollection.updateOne(
            { username: cookie.get('username')?.value },
            { $set: {
                following: currentUser.following.filter((username: string) => username !== args.get('username'))
            } }
        );
        await userCollection.updateOne(
            { username: args.get('username') },
            { $set: {
                followers: requestedUser.following.filter((username: string) => username !== cookie.get('username')?.value)
            } }
        );

        await client.close(true);
        return new NextResponse(null, { status: 204 });
    }
    catch (error) {
        console.log('An exception has occured:\n', error);
        await client.close(true);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    }
};

export { POST };