import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import users     from '@logic/mongoose/user';
import userCheck from '@logic/usercheck';
import connect   from '@logic/mongoose/mongoose';

const POST = async (request: NextRequest) => {
    const args = new URL(request.url).searchParams;
    const requestedUsername = args.get('username');
    
    const cookie = await cookies();
    const currentUsername = cookie.get('username')?.value;
    const currentPassword = cookie.get('password')?.value;

    if (!requestedUsername)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    if (requestedUsername === currentUsername)
        return NextResponse.json({ error: 'You cannot unfollow yourself.' }, { status: 400 });
    if (!(await userCheck(currentUsername, currentPassword)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the DB
        await connect();
        // Check if the user exists
        const currentUser   = await users.findOne({ username: currentUsername   });
        const requestedUser = await users.findOne({
            username: requestedUsername,
            verified: true
        });
        if (!requestedUser || !currentUser)
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        // Check if the user is following the requested user
        if (!currentUser.following.includes(requestedUsername))
            return NextResponse.json({ error: 'User is not following this user.' }, { status: 400 });
        // Unfollow the user
        await users.updateOne(
            { username: cookie.get('username')?.value },
            { $pull: { following: requestedUsername } }
        );
        await users.updateOne(
            { username: args.get('username') },
            { $pull: { followers: currentUsername } }
        );
        // Close the connection
        return new NextResponse(null, { status: 204 });
    }
    catch (error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    }
};

export { POST };