/**
 * SessionWatcher.jsx
 * Loaf Life – Session watcher to automatically delete sessions over time.
 *
 * @author Conner Ponton
 * 
 * @author ChatGPT
 * Utilized for help designing the watcher and error checking 
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';

export default function SessionWatcher() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await clientDB.auth.getSession();
      if (!session) {
        console.log('No session found, redirecting...');
        router.push('/login-page');
      }
    };

    // Check on mount
    checkSession();

    // Watch for future changes
    const { data: subscription } = clientDB.auth.onAuthStateChange((event) => {
      console.log('[Auth Event]', event);

      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESH_FAILED') {
        clientDB.auth.signOut();
        router.push('/login');
      }
    });

    return () => subscription?.subscription.unsubscribe();
  }, [router]);

  return null;
}