import { createClient } from "@/utils/supabase/client";
import { Pagination } from '@/utils/pagination';

const supabase = createClient();

function parsePositive(value: unknown): number | undefined {
  return value && !isNaN(Number(value))
    ? Number(value)
    : undefined;
}

export async function handleGetBooks(req: Request): Promise<Response> {
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
          author:authors (name, sur_name, email)
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify({
    metadata: new Pagination(
      count || 0, pageParam, sizeParam).paginatedMetadata,
    books,
  }), {
    headers: { "Content-Type": "application/json" },
  });
}
