import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import users from '@logic/mongoose/user';
import connect from '@logic/mongoose/mongoose';

const GET = async (request: NextRequest) => {
    const args = new URL(request.url).searchParams;
    const requestedUsername = args.get('username') || 'CURRENT_USER';

    const cookie = await cookies();
    const currentUsername = cookie.get('username')?.value;

    const username = requestedUsername === 'CURRENT_USER' ? currentUsername : requestedUsername;
    // This is when the value was `CURRENT_USER` but the cookie was undefined
    if(!username)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        // Connect to the DB
        await connect();
        // Check if the user exists
        const userInfo = await users.findOne({
            username: username,
            verified: true
        }, { password: 0, _id: 0, __v: 0, email: 0, verified: 0 });
        if (!userInfo)
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        // Close the connection
        return NextResponse.json(userInfo, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };