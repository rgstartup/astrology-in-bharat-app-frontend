import React from "react";

interface StaticPageLayoutProps {
    title: string;
    children: React.ReactNode;
}

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ title, children }) => {
    return (
        <section className="banner-part light-back p-20 md:py-20 min-h-[600px]">
            <div className="container">
                <div className="contant-hero bg-white/90 backdrop-blur-sm px-10 py-12 md:px-20 md:py-20 rounded-[20px] border border-primary/20 shadow-lg" style={{ paddingLeft: "60px", paddingRight: "60px" }}>
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-bold text-[#2b1b1b] mb-4">
                            {title}
                        </h1>
                        <div className="w-24 h-1 bg-primary rounded-full mx-auto md:mx-0"></div>
                    </div>
                    <div className="static-content text-[#333333] leading-relaxed text-sm md:text-base
                        [&_h2]:text-xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-[#301118] [&_h2]:mt-8 [&_h2]:mb-4 
                        [&_h3]:text-lg [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:text-[#301118] [&_h3]:mt-6 [&_h3]:mb-3 
                        [&_p]:mb-5 
                        [&_ul]:mb-5 [&_ul]:pl-10 [&_ul]:list-disc 
                        [&_li]:mb-2">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StaticPageLayout;
