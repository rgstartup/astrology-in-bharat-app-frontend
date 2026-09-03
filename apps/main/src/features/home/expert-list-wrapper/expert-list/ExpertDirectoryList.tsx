"use client";

import ExpertList, { type ExpertListProps } from ".";
import ExpertGrid from "./components/ExpertGrid";

type ExpertDirectoryListProps = Omit<ExpertListProps, "children">;

export default function ExpertDirectoryList(props: ExpertDirectoryListProps) {
  return (
    <ExpertList {...props}>
      {({
        experts,
        loading,
        hasMore,
        initialError,
        lang,
        t,
        handleLoadMore,
      }) => (
        <ExpertGrid
          experts={experts}
          loading={loading}
          hasMore={hasMore}
          initialError={initialError}
          lang={lang}
          t={t}
          handleLoadMore={handleLoadMore}
        />
      )}
    </ExpertList>
  );
}
