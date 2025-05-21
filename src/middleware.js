/**
 * middleware.js
 * 
 * Authentication middleware handling:
 * - Automatic session renewal during page navigation
 * - Protection of authorized routes
 * - Redirection logic for authenticated/unauthenticated users
 * 
 * @author Conner Ponton
 * @author ChatGPT - Assisted with initial setup guidance
 */

import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

/**
 * Authentication Middleware
 * 
 * @function middleware
 * @async
 * @description Handles user authentication state for route access:
 * - Renews sessions automatically
 * - Redirects authenticated users from auth pages
 * - Protects routes from unauthorized access
 * @param {Object} req - Incoming request object
 * @returns {NextResponse} Response object with appropriate redirects or next()
 */
export default async function middleware(req) {
  try {
    // Initialize Supabase client with middleware support
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    // Get current user session
    const { data: { user } } = await supabase.auth.getUser();

    // Define authentication page check
    const isAuthPage = req.nextUrl.pathname === '/login-page';
    
    // List of protected routes requiring authentication
    const isProtectedRoute = [
      '/about-page',
      '/add-form',
      '/deals-page',
      '/hacks-page',
      '/main-feed-page',
      '/map-page',
      '/profile'
    ].some(path => req.nextUrl.pathname.startsWith(path));

    // Redirect authenticated users from auth pages to main feed
    if (user && isAuthPage) {
      return NextResponse.redirect(new URL('/main-feed-page', req.url));
    }

    // Protect routes from unauthenticated access
    if (!user && !isAuthPage && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login-page', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // Fail open - allow request through on error
    return NextResponse.next();
  }
}

/**
 * Middleware Configuration
 * @description Defines routes that trigger the middleware
 * Uses Next.js matcher patterns for route matching
 */
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