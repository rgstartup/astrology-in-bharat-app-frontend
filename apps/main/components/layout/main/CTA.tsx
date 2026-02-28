import React from 'react'

const CTA = () => {
  return (
    <section className="py-[50px] bg-cover bg-center bg-no-repeat relative bg-[#301118] bg-[url('/images/back-over.jpg')] bg-fixed">
      {/* Overlay if needed, or assuming the background image is dark. Using a dark fallback just in case */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container relative z-10">
        <div className="row align-items-center">
          <div className="col-lg-8 col-md-12 text-center text-lg-start">
            <h2 className="text-[32px] font-bold mb-[15px] text-white">
              Ready to Get Accurate Astrology Guidance?
            </h2>
            <p className="text-lg text-[#ffdcb2] mb-[30px] lg:mb-0 max-w-[700px] mx-auto lg:mx-0">
              Connect with verified astrologers today and get personalized
              solutions for love, career, health, and life problems.
            </p>
          </div>

          <div className="col-lg-4 col-md-12 text-center text-lg-end">
            <a
              href="#"
              className="inline-block py-3 px-[40px] bg-orange text-white rounded-[30px] text-lg font-semibold hover:opacity-90 hover:-translate-y-1 transition-all shadow-[0_4px_15px_rgba(255,107,0,0.4)]"
            >
              Consult Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA

