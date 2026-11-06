import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";

/**
 * Root navigation container for pagination links and controls.
 *
 * @param props - Standard HTML nav component properties.
 * @returns JSX Element for pagination wrapper.
 */
function Pagination({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

/**
 * Unordered list container for pagination item elements.
 *
 * @param props - Standard HTML ul component properties.
 * @returns JSX Element for pagination list.
 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

/**
 * List item wrapper for individual pagination controls or links.
 *
 * @param props - Standard HTML li component properties.
 * @returns JSX Element for pagination list item.
 */
function PaginationItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="pagination-item"
      className={cn("", className)}
      {...props}
    />
  );
}

export type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon" | "xs" | "icon-xs" | "icon-sm" | "icon-lg";
} & React.ComponentProps<"a">;

/**
 * Interactive link representing a target page within pagination controls.
 *
 * @param props - Pagination link properties including active state and button variant size.
 * @returns JSX Element for pagination link anchor.
 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  const variant = isActive ? "outline" : "ghost";
  const ariaCurrent = isActive ? "page" : undefined;

  return (
    <a
      aria-current={ariaCurrent}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

/**
 * Previous page navigation button triggering backward page transitions.
 *
 * @param props - Pagination link properties with default previous configuration.
 * @returns JSX Element for previous pagination button.
 */
function PaginationPrevious({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span>{children ?? "Previous"}</span>
    </PaginationLink>
  );
}

/**
 * Next page navigation button triggering forward page transitions.
 *
 * @param props - Pagination link properties with default next configuration.
 * @returns JSX Element for next pagination button.
 */
function PaginationNext({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>{children ?? "Next"}</span>
      <ChevronRight className="size-4" />
    </PaginationLink>
  );
}

/**
 * Ellipsis representation for collapsed page numbers.
 *
 * @param props - Standard span properties.
 * @returns JSX Element representing skipped pagination ranges.
 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
