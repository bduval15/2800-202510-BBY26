/**
 * middleware.js
 * Automatic session renewal for page transfers 
 * 
 * @author Conner Ponton
 * 
 * @author ChatGPT
 * Utilized as a guide to setting up the logic of this file
 */
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

console.log('🔍 Middleware is running!');

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to /login if user is not authenticated
  const isAuthPage = req.nextUrl.pathname === '/login-page';

  if (!session && !isAuthPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login-page';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/main-feed-page', '/profile', '/dashboard/:path*', '/app/:path*'],
};