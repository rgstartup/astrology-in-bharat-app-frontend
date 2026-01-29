import React, { Suspense } from "react";
import AstrologerList from "./AstrologerList";
import { getExperts } from "@/libs/api-experts";

interface AstrologerListWrapperProps {
    searchParams: Record<string, string | string[] | undefined>;
}

async function AstrologerListServer({ searchParams }: AstrologerListWrapperProps) {
    // Fetch experts on the server using raw searchParams
    const response = await getExperts({
        limit: 20,
        offset: 0,
        ...searchParams,
    } as any);
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
