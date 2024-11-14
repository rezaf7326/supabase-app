import React, { ReactNode } from "react";
import { PaginationMetadata } from "../../utils/pagination";
import { Button, Flex, Text } from "@radix-ui/themes";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

export default function Pagination({
  metadata,
  setPage,
  nextPage,
  prevPage,
}: {
  metadata: PaginationMetadata;
  setPage: (page: number) => void;
  nextPage?: () => void;
  prevPage?: () => void;
}) {
  const pageBtnElement = (page: number) => (
    <Button
      type="button"
      key={page}
      variant={page === metadata.currPage ? "outline" : "ghost"}
      onClick={() => setPage(page)}
    >
      {page}
    </Button>
  );

  const currPages: Array<number> = [];
  if (metadata.currPage) {
    if (metadata.currPage - 1 > 0) {
      currPages.push(metadata.currPage - 1);
    }
    currPages.push(metadata.currPage);
    if (metadata.currPage + 1 <= metadata.totalPages) {
      currPages.push(metadata.currPage + 1);
    }
  }
  const pageButtons: Array<ReactNode> = [];
  if (10 < metadata.totalPages) {
    const first = [1, 2, 3];
    const intersectsFirst = currPages.some((p) => first.includes(p));
    const last = [
      metadata.totalPages - 2,
      metadata.totalPages - 1,
      metadata.totalPages,
    ];
    const intersectsLast = currPages.some((p) => last.includes(p));
    const inTheMiddle = !intersectsFirst && !intersectsLast;

    if (intersectsFirst) {
      const firstSet = new Set([...first, 4, 5, 6]);
      currPages.forEach((p) => firstSet.add(p));
      firstSet.forEach((p) => pageButtons.push(pageBtnElement(p)));
      pageButtons.push(<Text key={Math.random().toString()}>...</Text>);
      last.forEach((p) => pageButtons.push(pageBtnElement(p)));
    }
    if (inTheMiddle) {
      first.forEach((p) => pageButtons.push(pageBtnElement(p)));
      if (first[first.length - 1] + 1 < currPages[0]) {
        pageButtons.push(<Text key={Math.random().toString()}>...</Text>);
      }
      currPages.forEach((p) => pageButtons.push(pageBtnElement(p)));
      if (currPages[currPages.length - 1] + 1 < last[0]) {
        pageButtons.push(<Text key={Math.random().toString()}>...</Text>);
      }
      last.forEach((p) => pageButtons.push(pageBtnElement(p)));
    }
    if (intersectsLast) {
      first.forEach((p) => pageButtons.push(pageBtnElement(p)));
      pageButtons.push(<Text key={Math.random().toString()}>...</Text>);
      const lastSet = new Set([
        metadata.totalPages - 5,
        metadata.totalPages - 4,
        metadata.totalPages - 3,
        ...last,
      ]);
      currPages.forEach((p) => lastSet.add(p));
      lastSet.forEach((p) => pageButtons.push(pageBtnElement(p)));
    }
  } else {
    for (let p = 1; p <= metadata.totalPages; p++) {
      pageButtons.push(pageBtnElement(p));
    }
  }

  return (
    <Flex
      gap={{ initial: "3", lg: "5" }}
      align="center"
      justify="center"
      direction={{ initial: "column", md: "row" }}
    >
      <Text
        weight="medium"
        color="gray"
        className="mr-1"
        size={{ initial: "2", sm: "3" }}
      >
        Page {metadata?.currPage} of {metadata?.totalPages} Pages
      </Text>
      <Flex gapX="3" align="center" justify="center">
        <Button type="button" variant="ghost" onClick={prevPage}>
          <DoubleArrowLeftIcon />
        </Button>
        {pageButtons}
        <Button type="button" variant="ghost" onClick={nextPage}>
          <DoubleArrowRightIcon />
        </Button>
      </Flex>
    </Flex>
  );
}
