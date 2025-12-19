"use client"
import React from "react";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Retrograde Mercury",
    date: "Dec 18, 2024",
    excerpt:
      "What happens when Mercury goes retrograde? Learn how it affects your communication, travel, and technology.",
    image: "/images/ser1.jpg", // Placeholder
  },
  {
    id: 2,
    title: "The Power of Gemstones",
    date: "Dec 15, 2024",
    excerpt:
      "Discover the healing properties of gemstones and how wearing the right one can change your fortune.",
    image: "/images/ser2.jpg", // Placeholder
  },
  {
    id: 3,
    title: "Kundli Matching: Why it Matters",
    date: "Dec 10, 2024",
    excerpt:
      "Is Kundli matching really necessary for a happy marriage? We explore the astrological reasons behind it.",
    image: "/images/ser3.jpg", // Placeholder
  },
  {
    id: 4,
    title: "Daily Horoscope Predictions",
    date: "Dec 05, 2024",
    excerpt:
      "Get your daily dose of celestial guidance. See what the stars have aligned for you today.",
    image: "/images/ser4.jpg", // Placeholder
  },
  {
    id: 5,
    title: "Vastu Shastra for Home",
    date: "Nov 28, 2024",
    excerpt:
      "Simple Vastu tips to bring peace, prosperity, and positive energy into your living space.",
    image: "/images/ser5.jpg", // Placeholder
  },
  {
    id: 6,
    title: "Tarot Reading for Beginners",
    date: "Nov 20, 2024",
    excerpt:
      "A comprehensive guide to starting your journey with Tarot cards. Learn the meanings of the Major Arcana.",
    image: "/images/ser6.jpg", // Placeholder
  },
];

const BlogPage = () => {
  return (
    <section className="blog-list-section">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="title-primary color-secondary">Our Latest Blogs</h1>
          <p className="p-lg mt-2">Insights, Wisdom, and Celestial Guidance</p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-card">
              <div className="blog-img-wrapper">
                {/* Using a placeholder image if real ones aren't available */}
                <img
                  src={post.image}
                  alt={post.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x250?text=Astrology+Blog";
                  }}
                />
              </div>
              <div className="blog-content">
                <span className="blog-date">{post.date}</span>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <Link href={`#`} className="read-more-btn">
                  Read More <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
