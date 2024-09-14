import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GET = async () =>
    NextResponse.json({
        username: cookies().get('username') || null,
        password: cookies().get('password') || null,   
    }, { status: 200 });

export { GET };