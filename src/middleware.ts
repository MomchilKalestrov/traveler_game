'use server';
import { NextResponse, NextRequest } from 'next/server';
 
export const middleware = (request: NextRequest) => {
    const username = request.cookies.get('username');
    const password = request.cookies.get('password');

    const slug = request.nextUrl.pathname.split('/')[1];
    
    if (username && password) return NextResponse.next();
    
    return NextResponse.redirect(new URL(`/${ slug }/login`, request.url));
}

export const config = {
    matcher: [
        '/:lang*'
    ]
}