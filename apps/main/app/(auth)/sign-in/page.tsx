import React, { Suspense } from "react";
import SignInForm from "@/components/features/auth/SignInForm";
import TopExpertsSection from "@/components/features/auth/TopExpertsSection";
import { Metadata } from "next";
import authContent from "@/public/data/auth-content.json";

export const metadata: Metadata = {
  title: "Sign In - Astrology Bharat",
  description: "Sign in to your account and unlock personalized astrology insights.",
};

export default function SignInPage() {
  const { signIn } = authContent;

  return (
    <section className="signin-part">
      <div className="container">
        <div className="row">
          {/* Left Side: Branding and Astrology Info (Server Rendered Static Part) */}
          <div className="col-lg-5">
            <div className="banner-data">
              <h3>
                <span style={{ color: "var(--secondary-color)" }}>Sign In</span>{" "}
                to
                <br />
                <span className="text-orange">
                  Astrology Bharat
                </span>
              </h3>
              <p className="text-muted">
                {signIn.description1}
                <br />
                {signIn.description2}
              </p>
            </div>

            {/* Top Experts (Client Component because it fetches data) */}
            <TopExpertsSection />
          </div>

          {/* Right Side - Sign In Form (Client Component) */}
          <div className="col-lg-7 col-sm-12 ms-auto">
            <Suspense fallback={<div>Loading form...</div>}>
              <SignInForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
