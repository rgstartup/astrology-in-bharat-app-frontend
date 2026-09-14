import React from "react";

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({
  title,
  children,
}) => {
  return (
    <section className="banner-part light-back min-h-[600px] px-0 pt-4 pb-8 sm:pt-6 sm:pb-10 md:pt-8 md:pb-16 lg:pt-8 lg:pb-20">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="contant-hero w-full bg-white/90 backdrop-blur-sm px-5 py-8 sm:px-8 sm:py-10 md:px-14 md:py-14 lg:px-16 lg:py-16 rounded-xl sm:rounded-[20px] border border-primary/20 shadow-lg">
          <div className="mb-8 text-left sm:mb-10">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#2b1b1b] mb-4">
              {title}
            </h1>
            <div className="w-20 sm:w-24 h-1 bg-primary rounded-full"></div>
          </div>
          <div
            className="static-content text-[#333333] leading-relaxed text-sm md:text-base
                        [&_h2]:text-xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-[#301118] [&_h2]:mt-8 [&_h2]:mb-4 
                        [&_h3]:text-lg [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:text-[#301118] [&_h3]:mt-6 [&_h3]:mb-3 
                        [&_p]:mb-5 [&_p]:break-words
                        [&_ul]:mb-5 [&_ul]:pl-5 sm:[&_ul]:pl-8 [&_ul]:list-disc 
                        [&_li]:mb-2 [&_li]:break-words"
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaticPageLayout;
