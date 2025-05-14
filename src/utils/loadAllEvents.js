/**
 * loadAllEvents.js
 * Loaf Life – Grabs all events from Supabase
 * and stores them in an array for loading.
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function loadAllEvents() {
  const [hRes, dRes, sRes, feRes] = await Promise.all([
    supabase.from('hacks').select('*'),
    supabase.from('deals').select('*'),
    supabase.from('savings').select('*'),
    supabase.from('events').select('*'),
  ]);

  if (hRes.error || dRes.error || sRes.error || feRes.error) {
    console.error(
      'Error fetching threads:',
      hRes.error, dRes.error, sRes.error, feRes.error
    );
  }

  const annotate = (rows, id, name) =>
    (rows || []).map(r => ({ ...r, threadId: id, threadName: name }));

  return [
    ...annotate(hRes.data, 'hacks', 'Hacks'),
    ...annotate(dRes.data, 'deals', 'Deals'),
    ...annotate(sRes.data, 'savings', 'Saving Tips'),
    ...annotate(feRes.data, 'events', 'Free Events'),
  ];
}

