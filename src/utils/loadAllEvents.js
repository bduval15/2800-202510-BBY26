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

// utils/loadAllEvents.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function loadAllEvents() {
  const tables = ['hacks', 'deals', 'events']

  const results = await Promise.all(
    tables.map(table => supabase.from(table).select('*'))
  )

  results.forEach((res, i) => {
    if (res.error) console.error(`Error loading ${tables[i]}:`, res.error)
  })

  return results.flatMap((res, i) => {
    return (res.data || []).map(row => ({
      ...row,
      table_id: tables[i]
    }))
  })
}
