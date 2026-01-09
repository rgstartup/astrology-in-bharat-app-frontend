import React from "react";

export const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="vid-part">
                <div
                    className="skeleton skeleton-circle"
                    style={{ width: "120px", height: "120px" }}
                ></div>
            </div>
            <div
                className="skeleton skeleton-text"
                style={{ width: "60%", marginTop: "15px" }}
            ></div>
            <div
                className="skeleton skeleton-text"
                style={{ width: "80%" }}
            ></div>
            <div
                className="skeleton skeleton-text"
                style={{ width: "40%" }}
            ></div>
            <div
                className="skeleton skeleton-text"
                style={{ width: "50%" }}
            ></div>
            <div
                className="skeleton skeleton-text"
                style={{
                    width: "70%",
                    height: "35px",
                    borderRadius: "25px",
                    marginTop: "10px",
                }}
            ></div>
        </div>
    );
};

export const AstrologerGridSkeleton = ({ count = 8 }: { count?: number }) => {
    return (
        <div className="astro-grid">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};
