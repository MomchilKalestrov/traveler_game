import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose    from 'mongoose';

import userCheck from '@logic/usercheck';
import users     from '@logic/mongoose/user';

const POST = async (request: NextRequest) => {
    const args = new URL(request.url).searchParams;
    const requestedUsername = args.get('username');
    
    const cookie = await cookies();
    const currentUsername = cookie.get('username')?.value;
    const currentPassword = cookie.get('password')?.value;

    if (!requestedUsername)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    if (requestedUsername === currentUsername)
        return NextResponse.json({ error: 'You cannot follow yourself.' }, { status: 400 });
    if (!(await userCheck(currentUsername, currentPassword)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the DB
        await mongoose.connect(process.env.MONGODB_URI as string);
        // Check if the user exists
        const currentUser   = await users.findOne({ username: currentUsername   });
        const requestedUser = await users.findOne({ username: requestedUsername });
        if (!requestedUser) {
            await mongoose.connection.close();
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        };
        // Check if the user is already following the requested user
        if (currentUser.following.includes(requestedUsername)) {
            await mongoose.connection.close();
            return NextResponse.json({ error: 'User is already following this user.' }, { status: 400 });
        };
        // Follow the user
        await users.updateOne(
            { username: currentUsername },
            { $push: { following: requestedUsername } }
        );
        await users.updateOne(
            { username: requestedUsername },
            { $push: { following: currentUsername } }
        );
        // Close the connection
        await mongoose.connection.close();
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        await mongoose.connection.close();
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };