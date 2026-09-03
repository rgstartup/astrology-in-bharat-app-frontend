import React, { Suspense } from "react";
import { api } from "@/actions";
import LoadingSkeleton from "./loader";
import allowedParams from "./expert-list/data/allowed-params";

import ExpertDirectoryList from "./expert-list/ExpertDirectoryList";
import { IFetchExpertsResponse } from "./expert-list/api/fetch-expert";
import HomeExpertList from "./expert-list/HomeExpertList";

export interface ExpertListWrapperProps {
  searchParams: Record<string, string | string[] | undefined>;
  layout?: "slider" | "grid";
  title?: string;
}

async function ExpertListServer({
  searchParams,
  layout,
  title,
}: ExpertListWrapperProps) {
  const filteredParams = Object.keys(searchParams)
    .filter((key) => allowedParams.includes(key))
    .reduce(
      (obj, key) => {
        obj[key] = searchParams[key];
        return obj;
      },
      {} as Record<string, any>,
    );

  const [response, error] = await api.get<IFetchExpertsResponse>(
    `/experts/list`,
    {
      body: {
        limit: 20,
        offset: 0,
        ...filteredParams,
      },
    },
  );
  // console.log("Server Side - Expert Data Init:", response.data);

  const listProps = {
    initialExperts: response?.data,
    initialPagination: response?.pagination,
    initialError: error,
    title,
  };

  return layout === "grid" ? (
    <ExpertDirectoryList {...listProps} />
  ) : (
    <HomeExpertList {...listProps} />
  );
}

export default function ExpertListWrapper({
  searchParams,
  layout,
  title,
}: ExpertListWrapperProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ExpertListServer
        searchParams={searchParams}
        layout={layout}
        title={title}
      />
    </Suspense>
  );
}
