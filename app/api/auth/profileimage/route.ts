import { NextResponse, NextRequest } from 'next/server';
import userCheck from '../../usercheck';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

const POST = async (request: NextRequest) => {
    const cookie = cookies();
    const body = await request.json();

    if(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    if (!body.image)
        return NextResponse.json({ error: 'Missing parameters.' }, { status: 412 });

    console.log(body.image);
    
    try {
        const blob = await put(`user/${ cookie.get('username')?.value || '' }.png`, body.image, {
            access: 'public',
            contentType: 'image/png',
            addRandomSuffix: false
        });
        console.log(blob);
        return new NextResponse(null, { status: 204 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error uploading image.' }, { status: 500 });
    }
}

export { POST };