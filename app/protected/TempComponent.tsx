"use client";

import { ReactNode, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { FetchRequestFactory } from "@/utils/fetch";
import Pagination from "@/components/ui/Pagination";
import { PaginationMetadata } from "@/utils/pagination";
import { Book } from "@/utils/interfaces";
import { Table } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type GetBooksResponse = Array<
  Book & {
    authors: Array<{
      id: number;
      name: string;
      email: string;
    }>;
  }
>;

const supabase = createClient();

export default function TempComponentPage() {
  const [pagination, setPagination] = useState<PaginationMetadata | undefined>(
    undefined
  );
  const [books, setBooks] = useState<GetBooksResponse>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(undefined);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(10);
  const [filterAuthor, setFilterAuthor] = useState<string | undefined>(
    undefined
  );
  const [sortByPublishDate, setSortByPublishDate] = useState<"desc" | "asc">(
    "desc"
  );

  useEffect(() => {
    async function fetchData() {
      console.log(
        `supabase functions url: ${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}`
      ); // TODO REMOVE
      const { body } = await new FetchRequestFactory()
        .baseUrl(process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL as string)
        .path("books")
        .query({}) // TODO add queries
        .create()
        .get<{
          metadata: PaginationMetadata;
          books: GetBooksResponse;
        }>({
          headers: {
            Authorization: (await supabase.auth.getSession()).data.session!
              .access_token,
          },
        });
      if (body) {
        setPagination(body.metadata);
        setBooks(body.books);
      }
    }

    fetchData().catch(setError);
  }, []);

  const nextPage = () => {
    if (pagination && page < pagination.totalPages) {
      setPage(page + 1);
    }
  };
  const prevPage = () => page > 1 && setPage(page - 1);

  function loadingRows() {
    const rows: Array<ReactNode> = [];
    while (rows.length < size) {
      rows.push(
        <Table.Row key={rows.length + 1}>
          <Table.RowHeaderCell>
            <Skeleton />
          </Table.RowHeaderCell>
          <Table.Cell className="hidden lg:table-cell">
            <Skeleton />
          </Table.Cell>
          <Table.Cell>
            <Skeleton />
          </Table.Cell>
          <Table.Cell>
            <Skeleton />
          </Table.Cell>
          <Table.Cell>
            <Skeleton />
          </Table.Cell>
        </Table.Row>
      );
    }

    return rows;
  }

  return (
    <div>
      <Table.Root className="min-w-full my-5" layout="auto" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden lg:table-cell">
              Summary
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Authors</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              onClick={() =>
                setSortByPublishDate(
                  sortByPublishDate === "desc" ? "asc" : "desc"
                )
              }
            >
              Publish Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading
            ? loadingRows()
            : books.map((book) => (
                <Table.Row key={book.id}>
                  <Table.RowHeaderCell>{book.title}</Table.RowHeaderCell>
                  <Table.Cell className="hidden lg:table-cell">
                    {book.summary}
                  </Table.Cell>
                  <Table.Cell>
                    {book.authors.map(({ name }) => name).join(", ")}
                  </Table.Cell>
                  <Table.Cell>{book.publish_date.toDateString()}</Table.Cell>
                  <Table.Cell>{book.price}</Table.Cell>
                </Table.Row>
              ))}
        </Table.Body>
      </Table.Root>
      {pagination && (
        <Pagination
          metadata={pagination}
          setPage={setPage}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      )}
    </div>
  );
}
