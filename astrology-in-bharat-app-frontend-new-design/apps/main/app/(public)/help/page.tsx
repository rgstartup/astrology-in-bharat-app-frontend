"use client";

import React, { useState } from "react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const HelpSupport = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const categories = [
    { id: "all", name: "All", icon: "fa-list" },
    { id: "account", name: "Account", icon: "fa-user" },
    { id: "booking", name: "Booking", icon: "fa-calendar-check" },
    { id: "payment", name: "Payment", icon: "fa-credit-card" },
    { id: "consultation", name: "Consultation", icon: "fa-comments" },
    { id: "technical", name: "Technical", icon: "fa-laptop" },
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I create an account?",
      answer:
        "Click on 'Sign Up' at the top right corner, fill in your details including name, email, and password. You'll receive a verification email to activate your account.",
      category: "account",
    },
    {
      id: 2,
      question: "How can I book a consultation with an astrologer?",
      answer:
        "Browse our astrologers, select the one you prefer, choose 'Book Now', fill in your birth details, select date and time, and proceed to payment.",
      category: "booking",
    },
    {
      id: 3,
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.",
      category: "payment",
    },
    {
      id: 4,
      question: "Can I reschedule my consultation?",
      answer:
        "Yes, you can reschedule up to 2 hours before your appointment. Go to 'My Bookings', select your appointment, and click 'Reschedule'.",
      category: "booking",
    },
    {
      id: 5,
      question: "What if I face technical issues during a live session?",
      answer:
        "Please check your internet connection first. If issues persist, contact our support team immediately via chat or call our helpline. We'll reconnect you or reschedule at no extra cost.",
      category: "technical",
    },
    {
      id: 6,
      question: "How do I reset my password?",
      answer:
        "Click on 'Sign In', then 'Forgot Password'. Enter your registered email, and you'll receive a password reset link.",
      category: "account",
    },
    {
      id: 7,
      question: "Are consultations confidential?",
      answer:
        "Absolutely. All consultations are 100% confidential. Your personal information and consultation details are protected as per our privacy policy.",
      category: "consultation",
    },
    {
      id: 8,
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Refunds are processed on a case-by-case basis. If you face any issues, please contact support within 24 hours of your consultation for resolution.",
      category: "payment",
    },
    {
      id: 9,
      question: "How long does a typical consultation last?",
      answer:
        "Consultation durations range from 15 to 60 minutes depending on what you select during booking. You can choose the duration that suits your needs.",
      category: "consultation",
    },
    {
      id: 10,
      question: "How do I download my consultation report?",
      answer:
        "After your consultation, visit 'My Consultations' in your profile. Click on the specific consultation and you'll find the 'Download Report' button.",
      category: "technical",
    },
  ];

  const filteredFAQs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert(
      "Thank you for contacting us! We'll get back to you within 24 hours."
    );
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="banner-part">
        <div className="overlay-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12 text-center">
                <h1 className="mb-3">
                  Help & <span style={{ color: "#daa23e" }}>Support</span>
                </h1>
                <p className="text-black" style={{ fontSize: "18px" }}>
                  We&apos;re here to assist you. Find answers to common
                  questions or reach out to us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 bg-cream">
        <div className="container">
          {/* Quick Help Cards */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="title-lg text-center mb-4 color-primary">
                How Can We Help You?
              </h2>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
              <div className="help-card vert-move">
                <div className="help-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <h5 className="color-primary">Call Us</h5>
                <p className="p-sm">+91-9876543210</p>
                <p className="p-xs text-muted">Mon-Sun: 9 AM - 9 PM</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
              <div className="help-card vert-move">
                <div className="help-icon">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <h5 className="color-primary">Email Us</h5>
                <p className="p-sm">support@astrologyinbharat.com</p>
                <p className="p-xs text-muted">Response within 24 hrs</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
              <div className="help-card vert-move">
                <div className="help-icon">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <h5 className="color-primary">Live Chat</h5>
                <p className="p-sm">Chat with our team</p>
                <button className="btn-global btn-secondary btn-sm">
                  Start Chat
                </button>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
              <div className="help-card vert-move">
                <div className="help-icon">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <h5 className="color-primary">WhatsApp</h5>
                <p className="p-sm">+91-9876543210</p>
                <p className="p-xs text-muted">Quick Support</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="row mt-5">
            <div className="col-12">
              <h2 className="title-lg text-center mb-4 color-primary">
                Frequently Asked Questions
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="col-12 mb-4">
              <div className="faq-categories">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-btn ${activeCategory === cat.id ? "active" : ""}  `}
                    style={{ borderRadius: "20px" }}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span className="d-none d-sm-inline ms-2 ">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="col-lg-10 col-md-12 mx-auto">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="faq-item mb-3">
                  <div
                    className={`faq-question ${activeFAQ === faq.id ? "active" : ""}`}
                    onClick={() =>
                      setActiveFAQ(activeFAQ === faq.id ? null : faq.id)
                    }
                  >
                    <h6 className="mb-0 p-md fw-semi-bold">{faq.question}</h6>
                    <i
                      className={`fa-solid ${activeFAQ === faq.id ? "fa-chevron-up" : "fa-chevron-down"}`}
                    ></i>
                  </div>
                  {activeFAQ === faq.id && (
                    <div className="faq-answer">
                      <p className="p-sm mb-0">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="row mt-5">
            <div className="col-12">
              <h2 className="title-lg text-center mb-4 color-primary">
                Still Need Help? Contact Us
              </h2>
            </div>
            <div className="col-lg-8 col-md-10 mx-auto">
              <div className="contact-form-card">
                <form onSubmit={handleContactSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control help-input"
                        placeholder="Enter your name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control help-input"
                        placeholder="Enter your email"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Subject <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control help-input"
                        placeholder="What's this about?"
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            subject: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Message <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control help-input"
                        rows={5}
                        placeholder="Tell us more about your issue..."
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            message: e.target.value,
                          })
                        }
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 text-center mt-4">
                      <button
                        type="submit"
                        className="btn-global btn-primary px-5"
                      >
                        <i className="fa-solid fa-paper-plane me-2"></i>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="row mt-5">
            <div className="col-12">
              <h2 className="title-lg text-center mb-4 color-primary">
                Additional Resources
              </h2>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="resource-card vert-move">
                <i className="fa-solid fa-book resource-icon color-secondary"></i>
                <h5 className="color-primary mt-3">User Guide</h5>
                <p className="p-sm text-muted">
                  Complete guide to using our platform effectively
                </p>
                <a href="#" className="resource-link">
                  Read More <i className="fa-solid fa-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="resource-card vert-move">
                <i className="fa-solid fa-shield-halved resource-icon color-secondary"></i>
                <h5 className="color-primary mt-3">Privacy Policy</h5>
                <p className="p-sm text-muted">
                  Learn how we protect your data and privacy
                </p>
                <a href="#" className="resource-link">
                  Read More <i className="fa-solid fa-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="resource-card vert-move">
                <i className="fa-solid fa-file-contract resource-icon color-secondary"></i>
                <h5 className="color-primary mt-3">Terms & Conditions</h5>
                <p className="p-sm text-muted">
                  Understand our terms of service and policies
                </p>
                <a href="#" className="resource-link">
                  Read More <i className="fa-solid fa-arrow-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inline Styles for Help Page Specific Components */}
      <style>{`
        .help-card {
          background: #fff;
          border: 1px solid #daa23e73;
          border-radius: var(--radius-md);
          padding: 30px 20px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          height: 100%;
        }

        .help-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 15px;
          background: linear-gradient(135deg, #732882, #8a3399);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          color: #fff;
        }

        .help-card h5 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .faq-categories {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 20px;
        }

        .category-btn {
          background: #fff;
          border: 2px solid #daa23e;
          border-radius: var(--radius-full);
          padding: 10px 20px;
          color: #732882;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-btn:hover {
          background: #732882;
          color: #fff;
          border-color: #732882;
          transform: translateY(-2px);
        }

        .category-btn.active {
          background: #732882;
          color: #fff;
          border-color: #732882;
        }

        .faq-item {
          background: #fff;
          border: 1px solid #daa23e73;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .faq-question {
          padding: 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          background: #f8f9fa;
        }

        .faq-question.active {
          background: #ffe3b852;
          border-bottom: 1px solid #daa23e73;
        }

        .faq-question h6 {
          color: #732882;
          margin: 0;
        }

        .faq-question i {
          color: #daa23e;
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        .faq-answer {
          padding: 20px;
          background: #fff;
          color: #333;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .contact-form-card {
          background: #fff;
          border: 1px solid #daa23e73;
          border-radius: var(--radius-md);
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .help-input {
          border: 1px solid #daa23e73;
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          transition: all 0.3s ease;
        }

        .help-input:focus {
          border-color: #732882;
          box-shadow: 0 0 0 0.2rem rgba(115, 40, 130, 0.15);
          outline: none;
        }

        .resource-card {
          background: #fff;
          border: 1px solid #daa23e73;
          border-radius: var(--radius-md);
          padding: 30px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          height: 100%;
        }

        .resource-icon {
          font-size: 48px;
        }

        .resource-card h5 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .resource-link {
          color: #732882;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          margin-top: 10px;
          transition: all 0.3s ease;
        }

        .resource-link:hover {
          color: #daa23e;
          transform: translateX(5px);
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 14px;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .help-card {
            padding: 20px 15px;
          }

          .help-icon {
            width: 60px;
            height: 60px;
            font-size: 24px;
          }

          .category-btn {
            padding: 8px 12px;
            font-size: 14px;
          }

          .category-btn span {
            display: none;
          }

          .faq-question {
            padding: 15px;
          }

          .faq-answer {
            padding: 15px;
          }

          .contact-form-card {
            padding: 20px;
          }

          .resource-card {
            padding: 20px;
          }

          .resource-icon {
            font-size: 36px;
          }
        }

        @media (max-width: 500px) {
          .help-card h5 {
            font-size: 18px;
          }

          .faq-question h6 {
            font-size: 15px;
          }

          .category-btn {
            flex: 1;
            min-width: 60px;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default HelpSupport;
