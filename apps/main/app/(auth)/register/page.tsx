import React, { Suspense } from "react";
import SignUpForm from "@/components/features/auth/SignUpForm";
import TopExpertsSection from "@/components/features/auth/TopExpertsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Astrology Bharat",
  description: "Create your free account and start your cosmic journey today.",
};

export default function RegisterPage() {
  return (
    <section className="signin-part">
      <div className="container">
        <div className="row">
          {/* Left Section (Static) */}
          <div className="col-lg-5">
            <div className="banner-data">
              <h3>
                <span style={{ color: "var(--secondary-color)" }}>Sign Up</span>{" "}
                to <br />
                <span style={{ color: "var(--primary-color)" }}>
                  Astrology Bharat
                </span>
              </h3>
              <p className="text-muted">
                Join us and unlock personalized astrology insights.
              </p>
            </div>

            {/* Top Experts (Client Component) */}
            <TopExpertsSection />
          </div>

          {/* Right Form Section (Client Component) */}
          <div className="col-lg-7 col-sm-12 ms-auto">
            <Suspense fallback={<div>Loading form...</div>}>
              <SignUpForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
