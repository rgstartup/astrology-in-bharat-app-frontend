import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
    return (
        <section className="signin-part ">
            <div className="container">
                <div className="row align-items-center">
                    {/* Left Side */}
                    <div className="col-lg-5 mb-4 mb-lg-0">
                        <div className="banner-data mb-4">
                            <h3 className="fw-bold lh-sm">
                                <span style={{ color: "var(--secondary-color)" }}>Sign Up</span> to <br />
                                <span style={{ color: "var(--primary-color)" }}>Astrology Bharat</span>
                            </h3>
                            <p className="text-muted mt-3">
                                Create your free account and explore personalized astrology insights. <br />
                                Start your journey with us today!
                            </p>
                        </div>

                        <div className="popular-astrology m-hidden pt-2">
                            <h4 className="astrology-heading mb-3">Popular Astrology</h4>
                            <div className="row g-3">
                                {["Aries", "Taurus", "Gemini"].map((sign, i) => (
                                    <div key={i} className="col-4">
                                        <div className="horoscopes-items text-center p-3 rounded shadow-sm bg-white h-100">
                                            <Image
                                                src="/images/astro-img1.png"
                                                alt={`${sign} Astrology`}
                                                height={80}
                                                width={80}
                                            />
                                            <h6 className="mt-2">{sign}</h6>
                                            <small className="text-muted">Vastu, Vedic</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Signup Form */}
                    <div className="col-lg-7 col-sm-12">
                        <div className="form-data p-4 rounded shadow-sm bg-white">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h6 className="mb-1">Welcome to</h6>
                                    <h5 style={{ color: "var(--primary-color)" }}>Astrology Bharat</h5>
                                </div>
                                <div className="text-end">
                                    <h6 className="mb-1">Already have an account?</h6>
                                    <Link href="/signin" className="sign-up fw-semibold text-decoration-none">
                                        Sign In
                                    </Link>
                                </div>
                            </div>

                            <div className="sign-in-heading mb-4">
                                <h2 style={{ color: "var(--primary-color)" }}>Sign Up</h2>
                            </div>

                            {/* Social Login */}
                            <div className="d-flex gap-3 mb-4 flex-wrap">
                                <button className="social-button d-flex align-items-center gap-2 px-3 py-2 border rounded bg-light w-auto">
                                    <Image
                                        src="/images/google-color-svgrepo-com.svg"
                                        alt="Google Login"
                                        height={20}
                                        width={20}
                                    />
                                    <small className="fw-medium">Sign Up with Google</small>
                                </button>
                                <button className="social-button2 d-flex align-items-center gap-2 px-3 py-2 border rounded bg-light w-auto">
                                    <Image
                                        src="/images/facebook-1-svgrepo-com.svg"
                                        alt="Facebook Login"
                                        height={20}
                                        width={20}
                                    />
                                    <small className="fw-medium">Facebook</small>
                                </button>
                            </div>

                            {/* Signup Form */}
                            <form>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="firstName" className="form-label fw-semibold">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label fw-semibold">
                                            Last Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            className="form-control"
                                            placeholder="Enter Last Name"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Enter Email Address"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label fw-semibold">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Enter Password"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirm Password"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mt-4 py-2 fw-semibold sign-button w-100 btn btn-primary">
                                    Sign Up
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;
