import { SupabaseClient } from "npm:@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";
import { Pagination } from "./pagination.ts"; // FIXME: import from ../../../utils/pagination
import { InternalServerError } from 'npm:http-errors';
import { RequestHelper } from "./request.helper.ts";

export async function handleGetBooks(
  req: Request,
  supabase: SupabaseClient,
): Promise<Response> {
  console.log(`handling a new get books request: ${req.url}`);
  const { params, error: validationError } = new RequestHelper(req)
    .validateQueryParams({
      page: (val) => val === undefined || Number(val) > 1,
      size: (val) => val === undefined || Number(val) > 1,
      author_id: (val) => val === undefined || Number(val) > 1,
      publish_date: (val) => val === 'asc' || val === 'desc',
    });
  if (validationError) {
    return new Response(
      JSON.stringify(validationError),
      {
        status: validationError.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
  const pageParam = params['page'] as number || 1;
  const sizeParam = params['size'] as number || 10;
  const authorIdParam = params['author_id']; // to filter by
  const publishDateParam = params['publish_date']; // to sort by

  const from = (pageParam - 1) * sizeParam;
  const to = from + sizeParam - 1;

  let query = supabase
    .from("books")
    .select(
      `
        id, title, summary, about_authors, pages, edition, price, publish_date, created_at, updated_at,
        authors:authors_books (
          author_id,
          author:authors (name, email)
        )
      `,
      { count: "exact" }
    );

  if (authorIdParam) {
    query = query.eq("authors_books.author_id", authorIdParam);
  }
  if (publishDateParam) {
    query = query.order(
      "publish_date",
      { ascending: publishDateParam === "asc" }
    );
  }
  query = query.range(from, to);

  const { data: books, count, error } = await query;

  if (error) {
    console.error(error);
    const httpErr = new InternalServerError();
    return new Response(
      JSON.stringify(httpErr),
      {
        status: httpErr.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  console.log(`fetched ${count} books from the database`);
  const response = JSON.stringify({
    metadata: new Pagination(
      count || 0, pageParam, sizeParam).paginatedMetadata,
    books: books.map((book) => ({
      ...book,
      authors: book.authors.map(
        ({ author_id, author }) => ({
          id: author_id,
          name: Array.isArray(author) ? author[0]?.name : (author as any)?.name,
          email: Array.isArray(author) ? author[0]?.email : (author as any)?.email,
        }),
      ),
    })),
  });

  return new Response(response, {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
