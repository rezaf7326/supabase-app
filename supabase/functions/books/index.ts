// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js";
import { handleGetBooks } from "./get-books.ts";

Deno.serve(async (req) => {
  const supaUrl = Deno.env.get('_SUPABASE_URL') as string;
  const supaSecret = Deno.env.get('_SUPABASE_SERVICE_KEY') as string;
  const supabase = createClient(supaUrl, supaSecret);

  if (req.method === 'GET') {
    return handleGetBooks(req, supabase);
  }

  return new Response(
    JSON.stringify({ error: 'Method Not Allowed' }),
    { status: 405 },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/books' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
