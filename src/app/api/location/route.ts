import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import locations from '@logic/mongoose/locations';
import connect   from '@logic/mongoose/mongoose';
import userCheck from '@logic/usercheck';
import localeSelector from '@logic/mongoose/DBLanguageSelector';

const GET = async (request: NextRequest) => {
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const sessionId = cookie.get('sessionId')?.value;
    const locale   = cookie.get('locale')?.value || 'en';

    if(!(await userCheck(username, sessionId)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    
    const params: URLSearchParams = new URL(request.url).searchParams;
    const name = params.get('name');

    if (!name) return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        // Connect to the database
        await connect();
        // Get the location
        const location = (await locations.aggregate([
            { $match: { dbname: name } },
            ...localeSelector(locale)
        ]))[0];
        
        if (!location)
            return NextResponse.json({ error: 'Location not found.' }, { status: 404 });
        // Close the connection
        return NextResponse.json(location, { status: 200 });
    } catch(error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

export { GET };