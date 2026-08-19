import React, { Suspense } from "react";
import ExpertList from "./ExpertList";
import { getExperts } from "@/libs/api-experts";
import { ExpertGridSkeleton } from "./SkeletonCard";

import { ExpertListWrapperProps } from "@/lib/types";

async function ExpertListServer({ searchParams, layout, title }: ExpertListWrapperProps) {
    // Filter searchParams to only include allowed expert query parameters
    const allowedParams = [
        'limit', 'offset', 'q', 'specializations', 'location',
        'state', 'minRating', 'minExperience', 'languages',
        'minPrice', 'maxPrice', 'sort', 'onlineOnly',
        'service', 'online', 'rating'
    ];

    const filteredParams = Object.keys(searchParams)
        .filter(key => allowedParams.includes(key))
        .reduce((obj, key) => {
            obj[key] = searchParams[key];
            return obj;
        }, {} as Record<string, any>);

    const response = await getExperts({
        limit: 20,
        offset: 0,
        ...filteredParams,
    } as any);
    // console.log("Server Side - Expert Data Init:", response.data);

    return (
        <ExpertList
            initialExperts={response.data}
            initialPagination={response.pagination}
            initialError={response.error}
            layout={layout}
            title={title}
        />
    );
}

function LoadingSkeleton() {
    return (
        <section className="py-[100px] relative overflow-hidden" 
            style={{
                backgroundColor: '#301118',
                backgroundImage: 'url(/images/bg-dark.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh'
            }}
        >
            <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 w-full">
                <div className="relative mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Your Expert</h2>
                    <div className="w-48 h-1 bg-orange"></div>
                </div>
                <div className="w-full">
                    <ExpertGridSkeleton count={8} />
                </div>
            </div>
        </section>
    );
}

export default function ExpertListWrapper({ searchParams, layout, title }: ExpertListWrapperProps) {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <ExpertListServer searchParams={searchParams} layout={layout} title={title} />
        </Suspense>
    );
}


