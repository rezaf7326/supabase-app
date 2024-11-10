"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function TempComponentPage() {
  const [authors, setAuthors] = useState<any[] | null>(null);
  const [books, setBooks] = useState<any[] | null>(null);
  const [authorBooks, setAuthorBooks] = useState<any[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: authorsRes } = await supabase.from("authors").select();
      setAuthors(authorsRes);
      const { data: booksRes } = await supabase.from("books").select();
      setBooks(booksRes);
      const { data: authorsBooksRes } = await supabase
        .from("authors_books")
        .select();
      setAuthorBooks(authorsBooksRes);
    };
    fetchData();
  }, []);

  return (
    <div>
      <pre>
        {JSON.stringify(
          {
            authors,
            books,
            authorBooks,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
