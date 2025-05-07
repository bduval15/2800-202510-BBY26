
## This document was created with the aid of ChatGPT for bulk writing and fact checking

# Supabase Integration Guide (Loaf Life Project)

This file explains how Supabase is integrated into the project and how to correctly use the Supabase client (`clientDB` for client-side `getServerDB()` for server-side).

---

## File Location

Supabase logic is defined in:

```
/src/services/supabaseClient.js
```

This file includes:

- **`clientDB`**: for use in browser-based (client-side) code.
- **`getServerDB()`**: for secure server-side functions (e.g., admin tasks or protected APIs).

---

## Environment Variables

These variables must be defined in `.env.local` for your Supabase client to work:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key  # ONLY USED ON SERVER
```

---

## Supabase Client Usage

### Client-side (`clientDB`)

Use `clientDB` when working in components that run in the browser, like login or signup pages.

```js
import { clientDB } from "@/services/supabaseClient";

const { error } = await clientDB.auth.signInWithPassword({ email, password });
```

### Server-side (`getServerDB()`)

Use `getServerDB()` in API routes, `getServerSideProps`, or edge/server functions only.

```js
import { getServerDB } from "@/services/supabaseClient";

const serverDB = getServerDB();
const { data, error } = await serverDB
  .from('resources')
  .select('*');
```

**Important:** This function throws an error if run on the client, ensuring your service key stays protected.

---

## Authentication Flow Example

Used in `/app/login-page/page.js`:

```js
const { error } = await clientDB.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: window.location.origin,
    skipEmailConfirmation: true
  }
});
```

After signing up, the user is automatically logged in using:

```js
await clientDB.auth.signInWithPassword({ email, password });
```

---

## Session Handling

- Client session persists with `persistSession: true` (default in Supabase).
- Auto-refresh and session detection are enabled.

These options are configured in:

```js
auth: {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
}
```

---

## Querying Data

Basic query:

```js
const { data, error } = await clientDB
  .from('hacks')
  .select('*')
  .eq('category', 'Meal Hacks');
```

For example:

```js
const { data, error } = await clientDB
  .from('pins')
  .insert([{ title: 'Free Pizza', category: 'Free Food' }]);
```

---

## Common Pitfalls

- Make sure `.env.local` is properly loaded—restart your dev server after changing it.
- Never expose `SUPABASE_SERVICE_KEY` to the frontend.
- Always check `typeof window !== 'undefined'` before using `window` objects.
- Use client-side auth functions only in components, not in API routes.

---

## Helpful Dev Tools

- [Supabase Studio](https://app.supabase.com/): GUI to browse tables and auth settings
- [Supabase Docs](https://supabase.com/docs): All SDK and feature references

---

## Related Resources

- [`@supabase/supabase-js` GitHub](https://github.com/supabase/supabase-js)
- [Using Supabase with Next.js](https://supabase.com/docs/guides/with-nextjs)

---

## Cleanup

If you’re done with auth testing and want to clear sessions:

```js
await clientDB.auth.signOut();
```
