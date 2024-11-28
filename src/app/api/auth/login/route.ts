import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import users   from '@logic/mongoose/user';
import connect from '@src/logic/mongoose/mongoose';

const POST = async (request: NextRequest) => {
    const args: URLSearchParams = new URL(request.url).searchParams;
    const username = args.get('username');
    const password = args.get('password');

    console.log('Username:', username);
    console.log('Password:', password);

    const cookie = await cookies();
    
    if(!username || !password)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    
    try {
        // Connect to the DB
        await connect();
        // Check if the data already exists
        const dataExists = await users.findOne({
            username: username,
            password: password
        });
        if(!dataExists) 
            return NextResponse.json({ error: 'Incorrect credentials.' }, { status: 403 });
        // Set the user's credentials
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