import { SupabaseClient } from "npm:@supabase/supabase-js";
import { Pagination } from './pagination.ts'; // FIXME: import from ../../../utils/pagination

function parsePositive(value: unknown): number | undefined {
  return value && !isNaN(Number(value))
    ? Number(value)
    : undefined;
}

export async function handleGetBooks(req: Request, supabase: SupabaseClient): Promise<Response> {
  console.log(`handling a new get books request: ${req.url}`);
  const { searchParams } = new URL(req.url);
  const pageParam = parsePositive(searchParams.get('page')) || 1;
  const sizeParam = parsePositive(searchParams.get('size')) || 10;
  const authorIdParam = searchParams.get('author_id'); // to filter by
  const publishDateParam = searchParams.get('publish_date'); // to sort by

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
  console.log('printing query object...'); // TODO REMOVE
  console.dir(query, { depth: 15 }); // TODO REMOVE

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
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 },
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
  console.log('response', response); // TODO REMOVE

  return new Response(response, {
    headers: { "Content-Type": "application/json" },
  });
}
