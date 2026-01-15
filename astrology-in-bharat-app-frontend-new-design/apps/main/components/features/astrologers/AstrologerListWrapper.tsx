import React, { Suspense } from "react";
import AstrologerList from "./AstrologerList";
import { getExperts } from "@/libs/api-experts";

interface AstrologerListWrapperProps {
    searchParams: Record<string, string | string[] | undefined>;
}

async function AstrologerListServer({ searchParams }: AstrologerListWrapperProps) {
    // Fetch experts on the server
    const response = await getExperts({
        limit: 20,
        offset: 0,
        q: typeof searchParams.q === "string" ? searchParams.q : undefined,
        specializations:
            typeof searchParams.specializations === "string"
                ? searchParams.specializations
                : undefined,
        sort: typeof searchParams.sort === "string" ? searchParams.sort : undefined,
        languages:
            typeof searchParams.languages === "string"
                ? searchParams.languages
                : undefined,
        minPrice: Number(searchParams.minPrice) || undefined,
        maxPrice: Number(searchParams.maxPrice) || undefined,
        state:
            typeof searchParams.state === "string" ? searchParams.state : undefined,
    });
    console.log("Server Side - Astrologer Data Init:", response.data);

    return (
        <AstrologerList
            initialExperts={response.data}
            initialPagination={response.pagination}
            initialError={response.error}
        />
    );
}

function LoadingSkeleton() {
    return (
        <section className="astrologer-list back-img">
            <div className="container">
                <h2 className="title-line color-light">
                    <span>Find Your Astrologer</span>
                </h2>
                <div className="flex overflow-x-auto gap-4 py-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div className="skeleton-card min-w-[300px]" key={i}>
                            <div className="vid-part">
                                <div className="skeleton skeleton-circle" style={{ width: '120px', height: '120px' }}></div>
                            </div>
                            <div className="skeleton skeleton-text" style={{ width: '60%', marginTop: '15px' }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '70%', height: '35px', borderRadius: '25px', marginTop: '10px' }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function AstrologerListWrapper({ searchParams }: AstrologerListWrapperProps) {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <AstrologerListServer searchParams={searchParams} />
        </Suspense>
    );
}
