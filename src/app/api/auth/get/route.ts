import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import mongoose    from 'mongoose';

import users from '@logic/mongoose/user';

const GET = async (request: NextRequest) => {
    const args = new URL(request.url).searchParams;
    const requestedUsername = args.get('username');

    const cookie = await cookies();
    const currentUsername = cookie.get('username')?.value;

    if(!requestedUsername)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    const username = requestedUsername === 'CURRENT_USER' ? currentUsername : requestedUsername;
    // This is when the body value was `CURRENT_USER` but the cookie was undefined
    if(!username)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        // Connect to the DB
        await mongoose.connect(process.env.MONGODB_URI as string);
        // Check if the user exists
        const userInfo = await users.findOne({ username: username }, { password: 0, _id: 0 });
        if (!userInfo)
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        // Close the connection
        await mongoose.connection.close();
        return NextResponse.json(userInfo, { status: 200 });
    } catch(error) {
        await mongoose.connection.close();
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };