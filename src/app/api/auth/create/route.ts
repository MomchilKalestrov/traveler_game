import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import {
    validateName,
    validateEmail
} from '@logic/validate';
import sendVerificationEmail from './verify';
import connect from '@logic/mongoose/mongoose';
import users   from '@logic/mongoose/user';

const POST = async (request: NextRequest) => {
    const { username, password, email } = await request.json();
    const cookie = cookies();

    if (!username || !password)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });
    if (password.length < 8)
        return NextResponse.json({ error: 'Password must be atleast 8 symbols long.' }, { status: 412 });
    if (!validateName(username))
        return NextResponse.json({ error: 'Invalid username.' }, { status: 412 });
    if (!validateEmail(email))
        return NextResponse.json({ error: 'Invalid email.' }, { status: 412 });

    try {
        // Connect to the DB
        await connect();
        // Check if a user with the same username/email already exists
        const userExists  = await users.findOne({ username });
        const emailExists = await users.findOne({ email });
        if(userExists) 
            return NextResponse.json({ error: 'Username already taken.' }, { status: 400 });
        if(emailExists) 
            return NextResponse.json({ error: 'Email already taken.' }, { status: 400 });
        // Create a new user
        const result = users.create({
            username,
            password,
            email
        });
        // Send verification email
        await sendVerificationEmail((await result)._id, email);
        // Close the connection
        return new NextResponse(null, { status: 201 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    };
};

export { POST };