import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

import users     from '@logic/mongoose/user';
import userCheck from '@logic/usercheck';
import connect   from '@logic/mongoose/mongoose';

const POST = async (request: NextRequest) => {
    const { name } = await request.json();
    if (!name)
        return NextResponse.json({ error: 'Missing parameters.' });
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const password = cookie.get('password')?.value;

    if(!(await userCheck(username, password)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        // Connect to the database
        await connect();
        // Get the user
        const user = await users.findOne({ username: username });
        if (user.started.includes(name)) 
            return NextResponse.json({ error: 'User is already tracking this location.' }, { status: 404 });
        // Start tracking the location
        await users.updateOne(
            { username: username },
            { $push: { started: name } }
        );
        // Close the connection
        return new NextResponse(null, { status: 204 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { POST };