import { cookies } from 'next/headers';
import { put }     from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import userCheck from '@logic/usercheck';

const POST = async (request: NextRequest) => {
    const cookie = await cookies();
    const username = cookie.get('username')?.value;
    const password = cookie.get('password')?.value;
    const blob = await request.blob();

    if (!(await userCheck(username, password)))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    if (!blob)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    await put(`/profile/${ username }.png`, blob, {
        access: 'public',
        addRandomSuffix: false,
        cacheControlMaxAge: 0
    });
    revalidatePath('/');

    return new NextResponse(null, { status: 204 });
};

export { POST };