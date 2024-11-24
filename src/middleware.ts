import { NextResponse, NextRequest } from 'next/server';
 
export const middleware = (request: NextRequest) => {
    const username = request.cookies.get('username');
    const password = request.cookies.get('password');
    
    if (username && password) return NextResponse.next();
    
    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: [
        '/home',
        '/map',
        '/profile',
        '/leaderboard'
    ]
}