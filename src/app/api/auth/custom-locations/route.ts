import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import connect from '@logic/mongoose/mongoose';
import communityMadeLocations from '@logic/mongoose/communityMadeLocations';
import userCheck from '@logic/usercheck';

const GET = async () => {
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const sessionId = cookie.get('sessionId')?.value;

    if(!(await userCheck(username, sessionId)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    try {
        connect();

        const locations = await communityMadeLocations.find({ author: username }, { __v: 0 });

        return NextResponse.json(locations, { status: 200 });
    } catch (error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

const validate = ({ name, location }: { name?: string, location?: { lat: number, lng: number } }) =>
    typeof name === 'string' &&
    typeof location?.lat === 'number' &&
    typeof location?.lng === 'number';

const create = async (
    { name, location }: { name?: string, location?: { lat: number, lng: number } },
    username: string
) => {
    if (!validate({ name, location })) return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    try {
        connect();

        const locationExists = await communityMadeLocations.findOne({ name });
        if (locationExists) return NextResponse.json({ error: 'Location already exists.' }, { status: 400 });

        await communityMadeLocations.create({
            name,
            location,
            author: username
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

// THE FIRST "E" IS IN CYRILLIC !!!!
// I just wanted the function to be delete, but it's a reserved keyword.
const dеlete = async (name: string | null, username: string) => {
    try {
        connect();

        const locationExists = await communityMadeLocations.findOne({ name, author: username });
        if (!locationExists) return NextResponse.json({ error: 'Location not found.' }, { status: 404 });

        await communityMadeLocations.deleteOne({ name });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.log('An exception has occured:\n', error);
        return NextResponse.json({ error: 'An error has occured.' }, { status: 500 });
    };
};

const POST = async (request: NextRequest) => {
    const params = new URL(request.url).searchParams;
    const mode = params.get('mode');

    if (!mode) return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const sessionId = cookie.get('sessionId')?.value;

    if (!(await userCheck(username, sessionId, { xp: { $gte: 500 } })))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    if (mode === 'create')
        return create(await request.json(), username as string);
    else if (mode === 'delete')
        return dеlete(params.get('name'), username as string);

    return NextResponse.json({ error: 'Invalid mode.' }, { status: 412 });
};

export { GET, POST };