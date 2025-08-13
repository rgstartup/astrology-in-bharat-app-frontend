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
  ];

  return (
    <>
      {/* Top Banner */}
      <section
        className="products-banner mb-5"
        style={{
          backgroundImage: "url('/images/banner-2.png')",
          objectFit: "cover",
          backgroundPosition:'center center'
        }}
      >
        <div className="overlay" style={{ height: "80vh" }}></div>
      </section>

      {/* Store Product Grid */}
      <section className="store-products">
        <div className="container">
          <h2 className="section-heading heading text-center mb-5">
            Our Products
          </h2>
          <div className="product-slider-container">
            <div className="row ">
              {products.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="ser-card vert-move">
                    <img
                      src={product.image}
                      alt="Test"
                      className="services-img w-100 mb-3"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <h4>{product.title}</h4>
                    <p className="p-sm text-muted">{product.description}</p>
                    <div className=" mt-auto pt-3">
                      <h5 className="mb-0 fw-bold">{product.price}</h5>
                      <button className="btn btn-primary orderNowbtn mt-3">
                        <Link href="/product-single">
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
    </>
  );
};

export default page;
