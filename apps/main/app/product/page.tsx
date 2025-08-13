import Link from "next/link";
import React from "react";

const page: React.FC = () => {
  const products = [
    {
      id: 1,
      title: "Original Rudraksha Mala",
      image: "/images/product-1.webp",
      price: 899,
      description: "Authentic energised Rudraksha for peace and prosperity.",
    },
    {
      id: 2,
      title: "Astrology Kundli Report",
      image: "/images/product-2.webp",
      price: 499,
      description: "Detailed horoscope report by our expert astrologers.",
    },
    {
      id: 3,
      title: "Energised Gemstone Ring",
      image: "/images/product-3.jpg",
      price: 1599,
      description: "Certified natural gemstone ring for positive energy.",
    },
    {
      id: 4,
      title: "Vastu Yantra",
      image: "/images/product-4.jpg",
      price: 699,
      description: "Bring harmony in your home with sacred Vastu Yantra.",
    },
    {
      id: 5,
      title: "Crystal Healing Bracelet",
      image: "/images/product-5.jpg",
      price: 349,
      description: "Enhance health and wealth with crystal healing energy.",
    },
    {
      id: 6,
      title: "Hanuman Chalisa  Book",
      image: "/images/product-6.jpg",
      price: 149,
      description: "Carry divine blessings always with you.",
    },
    {
      id: 7,
      title: "Astrology Kundli Report",
      image: "/images/product-2.webp",
      price: 499,
      description: "Detailed horoscope report by our expert astrologers.",
    },
    {
      id: 8,
      title: "Energised Gemstone Ring",
      image: "/images/product-3.jpg",
      price: 1599,
      description: "Certified natural gemstone ring for positive energy.",
    },
  ];
  const purpose = [
    {
      id: 1,
      image: "/images/money.webp",
      title: "Money",
    },
    {
      id: 2,
      image: "/images/Love.webp",
      title: "Love",
    },
    {
      id: 3,
      image: "/images/Career.webp",
      title: "Career",
    },
    {
      id: 4,
      image: "/images/evil_eye.webp",
      title: "Evil Eye",
    },
    {
      id: 5,
      image: "/images/Health.webp",
      title: "Health",
    },
    {
      id: 6,
      image: "/images/Gifting.webp",
      title: "Gifting",
    },
  ];

  return (
    <>
      {/* Top Banner */}
      <section className="banner-part">
        <div className="overlay-hero">
          <div className="container">
            <h4 className=" text-white text-center  display-5 fw-semibold display-3">
              Our Prodcuts
            </h4>
          </div>
        </div>
      </section>

      {/* Best Sellers Product Grid */}
      <section className="store-products py-5 ">
        <div className="container">
          <h2 className="section-heading text-center mb-5 display-6 fw-semibold text-center mb-5">
            Best Sellers
          </h2>
          <div className="product-slider-container">
            <div className="row ">
              {products.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="ser-card vert-move">
                    <img
                      src={product.image}
                      alt="Image Not Found"
                      className="services-img w-100 mb-3"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <h4>{product.title}</h4>
                    <p className="p-sm text-muted">{product.description}</p>
                    <div className=" mt-auto pt-3">
                      <h5 className="mb-0 fw-bold">{product.price}</h5>
                      <button className="btn btn-primary orderNowbtn mt-3">
                        <Link href="/product/id">
                          <i className="fas fa-shopping-cart me-2"></i>
                          Add To Cart
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Purpose Section */}
      <section
        className="store-products py-50 bg-cream "
        style={{ marginBottom: "-90px", paddingBottom: "100px" }}
      >
        <div className="container">
          <h2 className="section-heading  text-center mb-5 display-6 fw-semibold  ">
            Shop By Purpose
          </h2>
          <div className="product-slider-container">
            <div className="row ">
              {purpose.map((item) => (
                <div key={item.id} className="col-lg-2 col-md-4 col-sm-6">
                  <div className=" vert-move">
                    <img
                      src={item.image}
                      alt="Image Not Found"
                      className="services-img w-100 mb-3"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    {/* <span>{item.title}</span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
