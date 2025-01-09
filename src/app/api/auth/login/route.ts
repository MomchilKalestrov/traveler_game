import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import userCheck from '@logic/usercheck';

const POST = async (request: NextRequest) => {
    const args: URLSearchParams = new URL(request.url).searchParams;
    const username = args.get('username') as string;
    const password = args.get('password') as string;

    const cookie = cookies();

    try {
        // Check if the user exists and their credentials are correct.  
        if (!(await userCheck(username, password)))
            return NextResponse.json({ error: 'Incorrect credentials.' }, { status: 403 });
        // Set the user's credentials
        (await cookie).set('username', username, { maxAge: 60 * 60 * 24 * 365 * 10 });
        (await cookie).set('password', password, { maxAge: 60 * 60 * 24 * 365 * 10 });
        // Close the connection
        return new NextResponse(null, { status: 201 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
    };
};

export { POST };