"use client";

import React, { useEffect, useMemo } from "react";
import ExpertListHeader from "./components/ExpertListHeader";
import ExpertFilterModal from "./components/ExpertFilterModal";
import ExpertSortModal from "./components/ExpertSortModal";
import dummyExperts from "./data/dummy-experts.json";
import { useExpertListStore } from "@/store/useExpertListStore";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { Expert } from "@repo/lib";

const fallbackExperts: Expert[] = dummyExperts.map(
  ({ user, languages, ...expert }) => ({
    ...expert,
    is_blocked: false,
    name: user.name,
    email: "",
    avatar: user.avatar,
    phone: "",
    gender: "",
    date_of_birth: "",
    languages: languages.join(", "),
    total_likes: 0,
    total_reviews: 0,
    consultation_count: 0,
    chat_price: expert.price,
    call_price: expert.price,
    video_call_price: expert.price,
    about_me: "",
    total_earning: 0,
    razorpay_contact_id: null,
    agent_commission_rate: null,
    created_at: "",
    updated_at: "",
  }),
);

interface ExpertListProps {
  initialExperts: Expert[];
  initialPagination?: {
    total: number;
    hasMore: boolean;
  };
  initialError?: string;
  title?: string;
  children: React.ReactNode;
}

const ExpertList: React.FC<ExpertListProps> = ({
  initialExperts,
  initialPagination,
  initialError,
  title,
  children,
}) => {
  const t = useTranslations("Home");

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showSortModal, setShowSortModal] = React.useState(false);

  const { filterState, ...store } = useExpertListStore();
  const { setExperts, setHasMore } = store;

  const hasActiveFilters = useMemo(() => {
    return (
      filterState.language !== "" ||
      filterState.minPrice !== 0 ||
      filterState.maxPrice !== 1000 ||
      filterState.addressState !== "" ||
      filterState.serviceType !== "all" ||
      filterState.minRating !== 0 ||
      filterState.onlyOnline !== false ||
      filterState.sortBy !== "newest"
    );
  }, [filterState]);

  const isFiltered =
    store.searchQuery.trim() !== "" ||
    store.selectedSpecialization !== "" ||
    hasActiveFilters;

  const displayExperts = useMemo(
    () =>
      !store.loading &&
      !isFiltered &&
      initialExperts.length > 0 &&
      initialExperts.length < 4
        ? [
            ...initialExperts,
            ...fallbackExperts.slice(0, 4 - initialExperts.length),
          ]
        : !store.loading && !isFiltered && initialExperts.length === 0
          ? fallbackExperts
          : initialExperts,
    [initialExperts, isFiltered, store.loading],
  );

  useEffect(() => {
    setExperts(displayExperts);
    setHasMore(initialPagination?.hasMore ?? false);
  }, [displayExperts, initialPagination?.hasMore, setExperts, setHasMore]);

  useEffect(() => {
    if (!initialError) return;

    toast.error(initialError, {
      toastId: `expert-list-${initialError}`,
    });
  }, [initialError]);

  return (
    <section
      id="our-experts"
      className="pt-6 pb-10 relative overflow-hidden"
      style={{
        backgroundColor: "#301118",
        backgroundImage: "url(/images/bg-dark.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <ExpertListHeader
          title={title || t("expertSection.title")}
          hasActiveFilters={hasActiveFilters}
          onOpenFilter={() => setShowFilterModal(true)}
          onOpenSort={() => setShowSortModal(true)}
        />

        <ExpertFilterModal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          applyFilters={() => {
            store.setFilterState(store.localFilter);
            setShowFilterModal(false);
          }}
          resetFilters={() => {
            store.resetState();
            setShowFilterModal(false);
          }}
        />

        <ExpertSortModal
          show={showSortModal}
          onHide={() => setShowSortModal(false)}
          sortBy={filterState.sortBy}
          setSortBy={(val: string) =>
            store.setFilterState({ ...filterState, sortBy: val })
          }
          applySort={() => setShowSortModal(false)}
        />

        {children}
      </div>
    </section>
  );
};

export default ExpertList;
