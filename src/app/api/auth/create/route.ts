import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import users        from '@logic/mongoose/user';
import validateName from '@logic/validateName';
import connect      from '@logic/mongoose/mongoose';

const POST = async (request: NextRequest) => {
    const args: URLSearchParams = new URL(request.url).searchParams;
    const username = args.get('username');
    const password = args.get('password');
    const cookie = await cookies();

    if (!username || !password)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    if (password.length < 8)
        return NextResponse.json({ error: 'Password must be atleast 8 symbols long.' }, { status: 412 });
    if (!validateName(username))
        return NextResponse.json({ error: 'Invalid username.' }, { status: 412 });

    try {
        // Connect to the DB
        await connect();
        // Check if a user with the same username already exists
        const userExists = await users.findOne({ username: username });
        if(userExists) 
            return NextResponse.json({ error: 'User with the same username already exists.' }, { status: 400 });
        // Create a new user
        await users.create({
            username: username,
            password: password,
        });
        cookie.set('username', username, { maxAge: 60 * 60 * 24 * 365 * 10 });
        cookie.set('password', password, { maxAge: 60 * 60 * 24 * 365 * 10 });
        // Close the connection
        return new NextResponse(null, { status: 201 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    };
};

export { POST };