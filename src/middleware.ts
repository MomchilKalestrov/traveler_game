import { NextResponse, NextRequest } from 'next/server';

const languages: string[] = ['en', 'bg'];
 
export const middleware = (request: NextRequest) => {
    const url = request.nextUrl.pathname!
    
    const username = request.cookies.get('username')?.value;
    const password = request.cookies.get('password')?.value;
    const userlocale = request.cookies.get('locale')?.value || 'en';

    const [ slug, page ] = url.split('/').splice(1);
    
    if (
        userlocale !== slug && page &&
        languages.includes(slug) &&
        languages.includes(userlocale)
    )
        return NextResponse.redirect(new URL(`/${ userlocale }/${ page }`, request.url));
    
    if (
	    (username && password) ||
	    !languages.includes(slug) ||
        url.includes('login') ||
        url.includes('about')
    )
        return NextResponse.next();
    
    return NextResponse.redirect(new URL(`/${ slug }/login`, request.url));
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|[^/]+/login|[^/]+/about).*)'
    ]
};
