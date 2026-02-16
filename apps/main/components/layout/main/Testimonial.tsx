import React from "react";

const Testimonial = () => {
  return (
    <section className="testimonial-section-cards bg-edeef1  space-section">
      <div className="container">
        <div className="light-card">
          <h2 className="title-line mb-3 c-1e0b0f">
            <span>What Our Users Say </span>
          </h2>
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12">
              {/* <!-- Testimonial Card --> */}
              <div className="bg-white rounded-[18px] p-6 max-w-[360px] transition duration-300 border border-primary/30 shadow-[0_10px_25px_rgba(0,0,0,0.08)] my-2.5 hover:-translate-y-1.5 mx-auto">
                <div className="flex items-center mb-3">
                  <div className="mr-3">
                    <img
                      src="/images/t1.png"
                      alt="User Review"
                      className="w-[55px] h-[55px] rounded-full object-cover border-[3px] border-primary"
                    />
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-[#32131a] m-0">
                      Rahul Sharma
                    </h5>
                    <span className="text-[15px] text-[#1a1a1a]">
                      Delhi, India
                    </span>
                  </div>
                </div>
                <div className="text-primary text-[25px] mb-1 tracking-[3px]">
                  ★★★★★
                </div>
                <p className="text-base text-[#311219] leading-[1.6]">
                  I had a great experience with Astrology in Bharat. The
                  astrologer was very accurate and guided me properly about my
                  career and future decisions.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12">
              {/* <!-- Testimonial Card --> */}
              <div className="bg-white rounded-[18px] p-6 max-w-[360px] transition duration-300 border border-primary/30 shadow-[0_10px_25px_rgba(0,0,0,0.08)] my-2.5 hover:-translate-y-1.5 mx-auto">
                <div className="flex items-center mb-3">
                  <div className="mr-3">
                    <img
                      src="/images/t1.png"
                      alt="User Review"
                      className="w-[55px] h-[55px] rounded-full object-cover border-[3px] border-primary"
                    />
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-[#32131a] m-0">
                      Rahul Sharma
                    </h5>
                    <span className="text-[15px] text-[#1a1a1a]">
                      Delhi, India
                    </span>
                  </div>
                </div>
                <div className="text-primary text-[25px] mb-1 tracking-[3px]">
                  ★★★★★
                </div>
                <p className="text-base text-[#311219] leading-[1.6]">
                  I had a great experience with Astrology in Bharat. The
                  astrologer was very accurate and guided me properly about my
                  career and future decisions.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12">
              {/* <!-- Testimonial Card --> */}
              <div className="bg-white rounded-[18px] p-6 max-w-[360px] transition duration-300 border border-primary/30 shadow-[0_10px_25px_rgba(0,0,0,0.08)] my-2.5 hover:-translate-y-1.5 mx-auto">
                <div className="flex items-center mb-3">
                  <div className="mr-3">
                    <img
                      src="images/t1.png"
                      alt="User Review"
                      className="w-[55px] h-[55px] rounded-full object-cover border-[3px] border-primary"
                    />
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-[#32131a] m-0">
                      Rahul Sharma
                    </h5>
                    <span className="text-[15px] text-[#1a1a1a]">
                      Delhi, India
                    </span>
                  </div>
                </div>
                <div className="text-primary text-[25px] mb-1 tracking-[3px]">
                  ★★★★★
                </div>
                <p className="text-base text-[#311219] leading-[1.6]">
                  I had a great experience with Astrology in Bharat. The
                  astrologer was very accurate and guided me properly about my
                  career and future decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
