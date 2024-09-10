import { NextResponse, NextRequest } from 'next/server';
import userCheck from '../../usercheck';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

const POST = async (request: NextRequest) => {
    const cookie = cookies();
    const body = await request.json();

    if(await userCheck(cookie.get('username')?.value || '', cookie.get('password')?.value || ''))
        return NextResponse.json({ error: 'Invalid credentials.' });

    if (!body.image)
        return NextResponse.json({ error: 'Missing parameters.' });
    
    try {
        const blob = await put(`/user/${ cookie.get('username')?.value || '' }`, body.image, {
            access: 'public',
            contentType: 'image/png',
            addRandomSuffix: false
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        return NextResponse.json({ error: 'Error uploading image.' });
    }
}

export { POST };