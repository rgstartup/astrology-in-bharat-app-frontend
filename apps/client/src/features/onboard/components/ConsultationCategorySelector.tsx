"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getConsultationTopicsAction } from "@/actions/consultation";
import { type IConsultationTopic, type PaginationMeta } from "@repo/lib";
import { Button } from "@/components/ui/button";

interface ConsultationCategorySelectorProps {
  selected?: number[];
  onChange: (topics: number[]) => void;
}

const PAGE_SIZE = 12;

export const ConsultationCategorySelector: React.FC<
  ConsultationCategorySelectorProps
> = ({ selected = [], onChange }) => {
  const [topics, setTopics] = useState<IConsultationTopic[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = useCallback(
    async (targetPage: number, isInitial = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
          setError(null);
        } else {
          setIsLoadingMore(true);
        }

        const res = await getConsultationTopicsAction({
          page: targetPage,
          limit: PAGE_SIZE,
        });

        if (res.success && res.data) {
          setTopics((prev) => {
            if (targetPage === 1) return res.data!;
            const existingIds = new Set(prev.map((t) => t.id));
            const newItems = res.data!.filter((t) => !existingIds.has(t.id));
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
            (err as Error)?.message || "Failed to load consultation topics"
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
    fetchTopics(1, true);
  }, [fetchTopics]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    const nextPage = page + 1;
    fetchTopics(nextPage, false);
  };

  const hasNextPage =
    pagination?.hasNextPage ??
    (pagination ? page < pagination.totalPages : false);

  const toggleTopic = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-foreground">
          Topics You Are Seeking Guidance On
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
            onClick={() => fetchTopics(1, true)}
            className="underline font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : topics.length === 0 ? (
        <div className="p-6 rounded-2xl border border-dashed border-stone-300 text-center text-xs text-muted-foreground">
          No consultation topics available at the moment.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2.5">
            {topics.map((topic) => {
              const isSelected = selected.includes(topic.id);

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleTopic(topic.id)}
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
                  <span>{topic.title}</span>
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
