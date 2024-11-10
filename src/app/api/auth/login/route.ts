import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { md5 } from 'js-md5';

import users from '@logic/mongoose/user';

const POST = async (request: NextRequest) => {
    const args: URLSearchParams = new URL(request.url).searchParams;
    const username = args.get('username');
    const password = args.get('password');

    const cookie = await cookies();
    
    if(!username || !password)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    
    try {
        // Connect to the DB
        await mongoose.connect(process.env.MONGODB_URI as string);
        // Check if the data already exists
        const dataExists = await users.findOne({
            username: username,
            password: md5(password)
        });
        if(!dataExists) {
            await mongoose.connection.close();
            return NextResponse.json({ error: 'Incorrect credentials.' }, { status: 403 });
        };
        // Set the user's credentials
        cookie.set('username', username);
        cookie.set('password', md5(password));
        // Close the connection
        await mongoose.connection.close();
        return new NextResponse(null, { status: 204 });
    } catch(error) {
        await mongoose.connection.close();
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    };
};

export { POST };