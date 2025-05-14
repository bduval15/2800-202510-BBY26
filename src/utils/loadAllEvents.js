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

  const [{ data: hacks }, { data: deals }, { data: savings }, { data: free_events }] =
    await Promise.all([
      supabase.from('hacks').select('*'),
      supabase.from('deals').select('*'),
      supabase.from('savings').select('*'),
      supabase.from('free_events').select('*'),
    ]);

  const annotate = (rows, id, name) => rows.map(r => ({ ...r, threadId: id, threadName: name }));
  return [
    ...annotate(hacks      || [], 'hacks',       'Hacks'),
    ...annotate(deals      || [], 'deals',       'Deals'),
    ...annotate(savings    || [], 'savings',     'Saving Tips'),
    ...annotate(free_events|| [], 'free-events', 'Free Events'),
  ];
}
