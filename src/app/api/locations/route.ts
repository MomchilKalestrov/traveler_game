import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import connect   from '@logic/mongoose/mongoose';
import userCheck from '@logic/usercheck';
import locations from '@logic/mongoose/locations';
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
        // Get all locations
        const all = await locations.aggregate([ ...localeSelector(locale) ]);
        // Close the connection
        return NextResponse.json(all, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };