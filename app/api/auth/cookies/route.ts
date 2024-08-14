import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GET = async (request: NextRequest) =>
    NextResponse.json({
        username: cookies().get('username') || null,
        password: cookies().get('password') || null
    });

export { GET };