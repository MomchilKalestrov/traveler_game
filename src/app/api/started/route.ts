import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import users     from '@logic/mongoose/user';
import connect   from '@logic/mongoose/mongoose';
import locations from '@logic/mongoose/locations';
import userCheck from '@logic/usercheck';
import localeSelector from '@logic/mongoose/DBLanguageSelector';

const GET = async (request: NextRequest) => {
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const password = cookie.get('password')?.value;

    if(!(await userCheck(username, password)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    
    const args: URLSearchParams = new URL(request.url).searchParams;
    const locale = args.get('locale') || 'en';

    try {
        // Connect to the database
        await connect();
        // Check if the user exists
        const user = await users.findOne({ username: username });
        if(!user)
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        // Get the started locations
        const started = await locations.aggregate([
            { $match: { dbname: { $in: user.started } } },
            ...localeSelector(locale)
        ]);
        // Close the connection
        return NextResponse.json(started, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    }
};

export { GET };