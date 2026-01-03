import React from 'react'
import { useRef } from 'react';

const AstrologerList = () => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    
      const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
          const { current } = scrollContainerRef;
          const scrollAmount = 200;
          if (direction === "left") {
            current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
          } else {
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        }
      };

const cardScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollCards = (direction: "left" | "right") => {
    if (cardScrollRef.current) {
      const { current } = cardScrollRef;
      const scrollAmount = 300; // Scrolls approximately one card width
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
   
    
          <section className="astrologer-list back-img">
            <div className="container">
              <h2 className="title-line color-light">
                <span>Find Your Astrologer</span>
              </h2>
              <div className="row align  ">
                <div className="col-sm-5">
                  <div className="search-box">
                    <input
                      type="text"
                      className="bg-white"
                      placeholder="Search Astrologer, Type, Language..."
                    />
                    <button>Search</button>
                  </div>
                </div>
                <div className="col-sm-3 text-end">
                  <a href="#" className="filter-btn">
                    <i className="fa-solid fa-filter"></i> Filter
                  </a>
                  <a href="#" className="filter-btn sort-btn">
                    <i className="fa-solid fa-sort"></i> Sort
                  </a>
                </div>
                <div className="col-sm-4 d-flex align-items-center">
                  <button
                    onClick={() => scroll("left")}
                    className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full mr-2 hover:bg-[#fd64101a] transition flex-shrink-0"
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <div
                    className="flex gap-2.5 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-2.5 [&::-webkit-scrollbar]:hidden w-full px-1"
                    id="list-slider"
                    ref={scrollContainerRef}
                  >
                    <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                      Numerology
                    </div>
                    <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                      Vedic
                    </div>
                    <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                      Zodiac Compatibility
                    </div>
                    <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                      Astrocartography
                    </div>
                    <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                      Lunar Node Analysis
                    </div>
                  </div>
                  <button
                    onClick={() => scroll("right")}
                    className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full ml-2 hover:bg-[#fd64101a] transition flex-shrink-0"
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
    
              <div className="flex items-center relative mt-4">
                <button
                  onClick={() => scrollCards("left")}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
                  style={{ background: "transparent" }}
                >
                  <i className="fa-solid fa-chevron-left fa-2x"></i>
                </button>
    
                <div
                  className="flex-1 min-w-0 flex overflow-x-auto gap-4 scroll-smooth [&::-webkit-scrollbar]:hidden py-4"
                  ref={cardScrollRef}
                >
                  <div className="astro-card min-w-[300px]">
                    <div className="vid-part">
                      <img
                        src="images/astro-img1.png"
                        alt="Pandit Sharma"
                        className="astro-profile-img"
                      />
                      <span
                        className="play-vid fa-beat"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        {" "}
                        <i className="fa-solid fa-circle-play "></i>{" "}
                      </span>
                    </div>
                    <div className="rating-star">★★★★★</div>
                    <div className="astro-name">Parbhat Sharma</div>
                    <div className="astro-tags">Vedic | Numerology</div>
                    <div className="astro-info">
                      <strong>Exp:</strong> 21 Years
                    </div>
                    <div className="astro-info">
                      <strong>Lang:</strong> Hindi, English
                    </div>
                    <div className="astro-info">
                      <strong>Price:</strong> ₹25/min
                    </div>
                    <div className="astro-actions">
                      <button>
                        <i className="fa-regular fa-comment-dots"></i> Chat
                      </button>
                      <button className="call">
                        <i className="fa-solid fa-phone-volume"></i> Call
                      </button>
                    </div>
                  </div>
    
                  <div
                    className="modal fade "
                    id="exampleModal"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h4
                            className="modal-title-astro-about "
                            id="exampleModalLabel"
                          >
                            Meet Astrologer Parbhata Giri Introduction Video
                          </h4>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <div className="modal-body">
                          <iframe
                            width="100%"
                            height="500"
                            src="https://www.youtube.com/embed/INoPh_oRooU"
                            title="शिव जी ने माता पार्वती को क्यों दिया ये भयंकर श्राप 😱😱 ?  #shivshankar #mataparvati"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
    
                  <div className="rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] text-center transition-transform duration-300 border border-[#fd6410] bg-white p-3 hover:-translate-y-1 relative items-center min-w-[300px]">
                    <div className="relative w-[150px] mx-auto">
                      <img
                        src="images/astro-img1.png"
                        alt="Pandit Sharma"
                        className="w-[120px] h-[120px] object-cover rounded-full mb-2 border border-[#daa23e]"
                      />
                    </div>
                    <div className="text-[#fd6410] text-[22px]">★★★★★</div>
                    <div className="text-[18px] font-semibold mb-0.5 text-[#301118]">
                      Pandit Sharma
                    </div>
                    <div className="inline-block bg-[#fd6410] text-white text-sm px-2.5 py-1 rounded-[20px] mt-1.5 mb-0">
                      Vedic | Numerology
                    </div>
                    <div className="text-base my-2 text-[#1a1a1a]">
                      <strong>Exp:</strong> 21 Years
                    </div>
                    <div className="text-base my-2 text-[#1a1a1a]">
                      <strong>Lang:</strong> Hindi, English
                    </div>
                    <div className="text-base my-2 text-[#1a1a1a]">
                      <strong>Price:</strong> ₹25/min
                    </div>
                    <div className="flex justify-center gap-2.5 mt-4">
                      <button className="flex-1 py-2 px-3 rounded-[25px] border border-[#fd6410] text-sm bg-[#fd6410] text-white hover:bg-[#301118] transition-all cursor-pointer">
                        <i className="fa-regular fa-comment-dots"></i> Chat
                      </button>
                      <button className="flex-1 py-2 px-3 rounded-[25px] border border-[#fd6410] text-sm bg-white text-black hover:bg-[#301118] hover:text-white transition-all cursor-pointer">
                        <i className="fa-solid fa-phone-volume"></i> Call
                      </button>
                    </div>
                  </div>
    
                  <div className="astro-card min-w-[300px]">
                    <div className="vid-part">
                      <img
                        src="images/astro-img1.png"
                        alt="Pandit Sharma"
                        className="astro-profile-img"
                      />
                    </div>
                    <div className="rating-star">★★★★★</div>
                    <div className="astro-name">Pandit Sharma</div>
                    <div className="astro-tags">Vedic | Numerology</div>
                    <div className="astro-info">
                      <strong>Exp:</strong> 21 Years
                    </div>
                    <div className="astro-info">
                      <strong>Lang:</strong> Hindi, English
                    </div>
                    <div className="astro-info">
                      <strong>Price:</strong> ₹25/min
                    </div>
                    <div className="astro-actions">
                      <button>
                        <i className="fa-regular fa-comment-dots"></i> Chat
                      </button>
                      <button className="call">
                        <i className="fa-solid fa-phone-volume"></i> Call
                      </button>
                    </div>
                  </div>
    
                  <div className="astro-card min-w-[300px]">
                    <div className="vid-part">
                      <img
                        src="images/astro-img1.png"
                        alt="Pandit Sharma"
                        className="astro-profile-img"
                      />
                    </div>
                    <div className="rating-star">★★★★★</div>
                    <div className="astro-name">Pandit Sharma</div>
                    <div className="astro-tags">Vedic | Numerology</div>
                    <div className="astro-info">
                      <strong>Exp:</strong> 21 Years
                    </div>
                    <div className="astro-info">
                      <strong>Lang:</strong> Hindi, English
                    </div>
                    <div className="astro-info">
                      <strong>Price:</strong> ₹25/min
                    </div>
                    <div className="astro-actions">
                      <button>
                        <i className="fa-regular fa-comment-dots"></i> Chat
                      </button>
                      <button className="call">
                        <i className="fa-solid fa-phone-volume"></i> Call
                      </button>
                    </div>
                  </div>
    
                  <div className="astro-card min-w-[300px]">
                    <div className="vid-part">
                      <img
                        src="images/astro-img1.png"
                        alt="Pandit Sharma"
                        className="astro-profile-img"
                      />
                    </div>
                    <div className="rating-star">★★★★★</div>
                    <div className="astro-name">Pandit Sharma</div>
                    <div className="astro-tags">Vedic | Numerology</div>
                    <div className="astro-info">
                      <strong>Exp:</strong> 21 Years
                    </div>
                    <div className="astro-info">
                      <strong>Lang:</strong> Hindi, English
                    </div>
                    <div className="astro-info">
                      <strong>Price:</strong> ₹25/min
                    </div>
                    <div className="astro-actions">
                      <button>
                        <i className="fa-regular fa-comment-dots"></i> Chat
                      </button>
                      <button className="call">
                        <i className="fa-solid fa-phone-volume"></i> Call
                      </button>
                    </div>
                  </div>
    
                  <div className="astro-card min-w-[300px]">
                    <div className="vid-part">
                      <img
                        src="images/astro-img1.png"
                        alt="Pandit Sharma"
                        className="astro-profile-img"
                      />
                    </div>
                    <div className="rating-star">★★★★★</div>
                    <div className="astro-name">Pandit Sharma</div>
                    <div className="astro-tags">Vedic | Numerology</div>
                    <div className="astro-info">
                      <strong>Exp:</strong> 21 Years
                    </div>
                    <div className="astro-info">
                      <strong>Lang:</strong> Hindi, English
                    </div>
                    <div className="astro-info">
                      <strong>Price:</strong> ₹25/min
                    </div>
                    <div className="astro-actions">
                      <button>
                        <i className="fa-regular fa-comment-dots"></i> Chat
                      </button>
                      <button className="call">
                        <i className="fa-solid fa-phone-volume"></i> Call
                      </button>
                    </div>
                  </div>
    
                  <div className="astro-card min-w-[300px]">
                    <div className="vid-part">
                      <img
                        src="images/astro-img1.png"
                        alt="Pandit Sharma"
                        className="astro-profile-img"
                      />
                    </div>
                    <div className="rating-star">★★★★★</div>
                    <div className="astro-name">Pandit Sharma</div>
                    <div className="astro-tags">Vedic | Numerology</div>
                    <div className="astro-info">
                      <strong>Exp:</strong> 21 Years
                    </div>
                    <div className="astro-info">
                      <strong>Lang:</strong> Hindi, English
                    </div>
                    <div className="astro-info">
                      <strong>Price:</strong> ₹25/min
                    </div>
                    <div className="astro-actions">
                      <button>
                        <i className="fa-regular fa-comment-dots"></i> Chat
                      </button>
                      <button className="call">
                        <i className="fa-solid fa-phone-volume"></i> Call
                      </button>
                    </div>
                  </div>
    
                  <div className="astro-card min-w-[300px]">
                    <div className="vid-part">
                      <img
                        src="images/astro-img1.png"
                        alt="Pandit Sharma"
                        className="astro-profile-img"
                      />
                    </div>
                    <div className="rating-star">★★★★★</div>
                    <div className="astro-name">Pandit Sharma</div>
                    <div className="astro-tags">Vedic | Numerology</div>
                    <div className="astro-info">
                      <strong>Exp:</strong> 21 Years
                    </div>
                    <div className="astro-info">
                      <strong>Lang:</strong> Hindi, English
                    </div>
                    <div className="astro-info">
                      <strong>Price:</strong> ₹25/min
                    </div>
                    <div className="astro-actions">
                      <button>
                        <i className="fa-regular fa-comment-dots"></i> Chat
                      </button>
                      <button className="call">
                        <i className="fa-solid fa-phone-volume"></i> Call
                      </button>
                    </div>
                  </div>
                </div>
    
                <button
                  onClick={() => scrollCards("right")}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
                  style={{ background: "transparent" }}
                >
                  <i className="fa-solid fa-chevron-right fa-2x"></i>
                </button>
              </div>
    
              <div className="view-all">
                <a href="#" className="btn-link wfc m-auto">
                  <i className="fa-regular fa-user"></i> View All Astrologers
                </a>
              </div>
            </div>
          </section>
  )
}

export default AstrologerList