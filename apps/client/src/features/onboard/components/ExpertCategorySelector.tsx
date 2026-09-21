"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSpecializationsAction } from "@/actions/specialization";
import { type Specialization, type PaginationMeta } from "@repo/lib";
import { Button } from "@/components/ui/button";

interface ExpertCategorySelectorProps {
  selected?: (string | number)[];
  onChange: (specializations: (string | number)[]) => void;
}

const PAGE_SIZE = 12;

export const ExpertCategorySelector: React.FC<ExpertCategorySelectorProps> = ({
  selected = [],
  onChange,
}) => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecializations = useCallback(
    async (targetPage: number, isInitial = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
          setError(null);
        } else {
          setIsLoadingMore(true);
        }

        const res = await getSpecializationsAction({
          page: targetPage,
          limit: PAGE_SIZE,
        });

        if (res.success && res.data) {
          setSpecializations((prev) => {
            if (targetPage === 1) return res.data!;
            const existingIds = new Set(prev.map((s) => s.id));
            const newItems = res.data!.filter((s) => !existingIds.has(s.id));
            return [...prev, ...newItems];
          });
          if (res.meta) {
            setPagination(res.meta);
          }
          setPage(targetPage);
        } else if (res.error && targetPage === 1) {
          setError(res.error);
        }
      } catch (err) {
        if (targetPage === 1) {
          setError(
            (err as Error)?.message || "Failed to load specializations"
          );
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSpecializations(1, true);
  }, [fetchSpecializations]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    const nextPage = page + 1;
    fetchSpecializations(nextPage, false);
  };

  const hasNextPage =
    pagination?.hasNextPage ??
    (pagination ? page < pagination.totalPages : false);

  const toggleSpecialization = (id: string | number) => {
    if (selected.includes(id as any)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-foreground">
          Preferred Astrologer & Expert Types
        </label>
        <span className="text-xs text-muted-foreground font-medium">
          Select one or more
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 rounded-xl border border-border bg-stone-100/80 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5 text-xs text-destructive flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => fetchSpecializations(1, true)}
            className="underline font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : specializations.length === 0 ? (
        <div className="p-6 rounded-2xl border border-dashed border-stone-300 text-center text-xs text-muted-foreground">
          No specializations available at the moment.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2.5">
            {specializations.map((spec) => {
              const isSelected = selected.includes(spec.id as any);

              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => toggleSpecialization(spec.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 border cursor-pointer outline-none select-none",
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 border-emerald-600 ring-1 ring-emerald-600/20 shadow-2xs scale-[1.02]"
                      : "bg-white text-foreground border-border hover:border-emerald-400/50 hover:bg-emerald-50/30 shadow-2xs hover:shadow-xs"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-bold",
                      isSelected
                        ? "text-emerald-700 font-extrabold"
                        : "text-emerald-600/60 font-bold"
                    )}
                  >
                    #
                  </span>
                  <span>{spec.title}</span>
                  {isSelected && (
                    <Check className="size-3.5 ml-0.5 stroke-[2.5] text-emerald-700" />
                  )}
                </button>
              );
            })}
          </div>

          {hasNextPage && (
            <div className="pt-1">
              <Button
                type="button"
                variant="link"
                disabled={isLoadingMore}
                onClick={handleLoadMore}
                className="h-auto p-0 text-xs font-semibold text-orange hover:text-orange/80 cursor-pointer inline-flex items-center gap-1.5"
              >
                {isLoadingMore && (
                  <Loader2 className="size-3.5 animate-spin" />
                )}
                <span>View more</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
