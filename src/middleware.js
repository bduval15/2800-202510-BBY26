/**
 * middleware.js
 * Automatic session renewal for page transfers and denial of unauthorized users
 * 
 * @author Conner Ponton
 * 
 * @author ChatGPT
 * Utilized as a guide to setting up the logic of this file
 */
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export default async function middleware(req) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const { data: { user } } = await supabase.auth.getUser();
    console.log('User from session:', user?.id); // Log user ID (safer)

    const isAuthPage = req.nextUrl.pathname === '/login-page';

    // Redirect unauthenticated users
    if (!user && !isAuthPage) {
      console.log('Redirecting to login...');
      return NextResponse.redirect(new URL('/login-page', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/about-page/:path*',
    '/add-form/:path*',
    '/deals-page/:path*',
    '/hacks-page/:path*',
    '/main-feed-page/:path*',
    '/map-page/:path*',
    '/profile/:path*',
  ],
};
