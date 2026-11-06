import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@repo/design/shadcn";

export interface ShopPaginationProps {
  currentPage: number;
  lastPage: number;
  buildPageHref: (page: number) => string;
}

/**
 * Compact shop catalog pagination component using Shadcn pagination primitives.
 *
 * @param props - Current page, total pages count, and page URL builder callback.
 * @returns JSX Element containing pagination navigation, or null when only single page exists.
 */
export function ShopPagination({
  currentPage,
  lastPage,
  buildPageHref,
}: ShopPaginationProps): React.JSX.Element | null {
  if (lastPage <= 1) {
    return null;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < lastPage;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {hasPrev && (
          <PaginationItem>
            <PaginationPrevious href={buildPageHref(currentPage - 1)} />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            isActive
            href={buildPageHref(currentPage)}
            size="default"
            className="px-3"
          >
            Page {currentPage} of {lastPage}
          </PaginationLink>
        </PaginationItem>

        {hasNext && (
          <PaginationItem>
            <PaginationNext href={buildPageHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
