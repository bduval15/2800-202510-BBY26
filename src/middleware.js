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
    
    const isAuthPage = req.nextUrl.pathname === '/login-page';
    const isProtectedRoute = [
      '/about-page',
      '/add-form',
      '/deals-page',
      '/hacks-page',
      '/main-feed-page',
      '/map-page',
      '/profile'
    ].some(path => req.nextUrl.pathname.startsWith(path));

    // Redirect authenticated users from login
    if (user && isAuthPage) {
      return NextResponse.redirect(new URL('/main-feed-page', req.url));
    }

    // Redirect unauthenticated users
    if (!user && !isAuthPage && isProtectedRoute) {
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
    '/login-page',
    '/about-page/:path*',
    '/add-form/:path*',
    '/deals-page/:path*',
    '/hacks-page/:path*',
    '/main-feed-page/:path*',
    '/map-page/:path*',
    '/profile/:path*'
  ]
};