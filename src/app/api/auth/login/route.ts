import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import session from '@logic/mongoose/session';
import user from '@logic/mongoose/user';
import { createHash } from 'crypto';

const oneMonth: number = 60 * 60 * 24 * 30;

const POST = async (request: NextRequest) => {
    const { username, password } = await request.json();

    const cookie = cookies();

    try {
        // Check if the user exists and their credentials are correct.
        const hashedPassword = createHash('sha256').update(password).digest('hex');
        const userExists = await user.findOne({ username, password: hashedPassword });
        if (!userExists)
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        console.log("User exists");
        // Create a new session
        const sessionId = (await session.create({ username }))._id.toString();
        // Set the user's credentials
        (await cookie).set('username',  username,  { maxAge: oneMonth });
        (await cookie).set('sessionId', sessionId, { maxAge: oneMonth });
        // Close the connection
        return new NextResponse(null, { status: 204 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    };
};

export { POST };