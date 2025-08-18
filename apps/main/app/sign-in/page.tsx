
// import Image from 'next/image'
// import Link from 'next/link'
// import React from 'react'


// const page = () => {
//     return (
//         <section className="signin-part">
//             <div className="container">
//                 <div className="row">
//                     <div className="col-lg-5">

//                         <div className="banner-data">
//                             <h3>
//                                 <span style={{ color: 'var(--secondary-color)' }}>Sign In</span> to
//                                 <br />
//                                 <span style={{ color: 'var(--primary-color)' }}>
//                                     Astrology Bharat
//                                 </span>
//                             </h3>
//                             <p>
//                                 Join us and unlock personalized astrology insights just for you.
//                                 <br />
//                                 Create your free account in seconds and start your journey
//                                 today!
//                             </p>
//                         </div>
//                         <div className="popular-astrology m-hidden pt-2">
//                             <h3 className="astrology-heading">Popular Astrology</h3>
//                             <div className="row pt-3">
//                                 <div className="col-lg-4 col-sm-6 col-md-4 col-6">
//                                     <div className="horoscopes-link">
//                                         <div className="horoscopes-items">
//                                             <Image
//                                                 src="/images/astro-img1.png"
//                                                 alt="Popular Astrology"
//                                                 height={80}
//                                                 width={80}
//                                             />
//                                             <h6>Aries</h6>
//                                             <small style={{ fontSize: '15px' }}>Vastu, Vedic</small>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-lg-4 col-sm-6 col-md-4 col-6">
//                                     <div>
//                                         <div className="horoscopes-items">
//                                             <Image
//                                                 src="/images/astro-img1.png"
//                                                 alt="Popular Astrology"
//                                                 height={80}
//                                                 width={80}
//                                             />
//                                             <h6>Tarus</h6>
//                                             <small style={{ fontSize: '12px' }}>Vastu, Vedic</small>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-lg-4 col-sm-6 col-md-4 col-6">
//                                     <div>
//                                         <div className="horoscopes-items">
//                                             <Image
//                                                 src="/images/astro-img1.png"
//                                                 alt="Popular Astrology"
//                                                 height={80}
//                                                 width={80}
//                                             />
//                                             <h6>Tarus</h6>
//                                             <small style={{ fontSize: '12px' }}>Vedic, Vastu</small>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-6 col-sm-12">
//                         <div className="form-data">
//                             <div className="sign-form-heading">
//                                 <h6>
//                                     Welcome to <br />
//                                     <span style={{ color: 'var(--primary-color)' }}>
//                                         Astrology Bharat
//                                     </span>
//                                 </h6>
//                                 <h6>
//                                     No Account <br />
//                                     <Link href="#" className="sign-up">Sign Up</Link>
//                                 </h6>
//                             </div>
//                             <div className="sign-in-heading">
//                                 <h2 style={{ color: 'var(--primary-color)' }}>Sign In</h2>
//                             </div>
//                             <div className="social-links d-flex pt-3">
//                                 <div className="social-button">
//                                     <Image
//                                         src="/images/google-color-svgrepo-com.svg"
//                                         alt=""
//                                         height={25}
//                                         width={25}
//                                     />
//                                     <small>Sign In Google</small>
//                                 </div>
//                                 <div className="links-images">
//                                     <div className="social-button2">
//                                         <Image
//                                             src="/images/facebook-1-svgrepo-com.svg"
//                                             alt=""
//                                             height={30}
//                                             width={30}
//                                         />
//                                         <small>Facebook</small>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="form-email mt-4">
//                                 <label htmlFor="email">Enter your username or email address</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     id="email"
//                                     placeholder="Username or email address"
//                                 />
//                             </div>
//                             <div className="form-password mt-4">
//                                 <label htmlFor="password">Enter Your Password Here</label>
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     id="password"
//                                     placeholder="Enter Password"
//                                 />
//                             </div>
//                             <Link href="#" className="forget-password">
//                                 Forget Password
//                             </Link>
//                             <button className="sign-button">
//                                 <Link href="#">Sign In</Link>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default page


import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <section className="signin-part">
      <div className="container">
        <div className="row">
          {/* Left Side */}
          <div className="col-lg-5">
            <div className="banner-data">
              <h3>
                <span style={{ color: "var(--secondary-color)" }}>Sign In</span>{" "}
                to
                <br />
                <span style={{ color: "var(--primary-color)" }}>
                  Astrology Bharat
                </span>
              </h3>
              <p className="text-muted">
                Join us and unlock personalized astrology insights just for you.
                <br />
                Create your free account in seconds and start your journey
                today!
              </p>
            </div>

            {/* Popular Astrology Section */}
            <div className="popular-astrology m-hidden pt-3">
              <h3 className="astrology-heading mb-3">Popular Astrology</h3>
              <div className="row g-3">
                {[
                  { name: "Aries", desc: "Vastu, Vedic" },
                  { name: "Tarus", desc: "Vastu, Vedic" },
                  { name: "Tarus", desc: "Vedic, Vastu" },
                ].map((item, idx) => (
                  <div className="col-lg-4 col-sm-6 col-md-4 col-6" key={idx}>
                    <div className="horoscopes-items text-center">
                      <Image
                        src="/images/astro-img1.png"
                        alt="Popular Astrology"
                        height={80}
                        width={80}
                      />
                      <h6 className="fw-bold mt-2">{item.name}</h6>
                      <small className="text-muted" style={{ fontSize: "13px" }}>
                        {item.desc}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="col-lg-6 col-sm-12 ms-auto">
            <div className="form-data shadow-sm p-4 rounded bg-white">
              {/* Heading */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  Welcome to <br />
                  <span style={{ color: "var(--primary-color)" }}>
                    Astrology Bharat
                  </span>
                </h6>
                <h6 className="mb-0">
                  No Account? <br />
                  <Link href="#" className="sign-up fw-bold">
                    Sign Up
                  </Link>
                </h6>
              </div>

              <div className="sign-in-heading mb-4">
                <h2 style={{ color: "var(--primary-color)" }}>Sign In</h2>
              </div>

              {/* Social Login */}
              <div className="social-links d-flex gap-3 mb-4">
                <div className="social-button d-flex align-items-center gap-2 border px-3 py-2 rounded">
                  <Image
                    src="/images/google-color-svgrepo-com.svg"
                    alt="Google"
                    height={22}
                    width={22}
                  />
                  <small>Sign in with Google</small>
                </div>
                <div className="social-button2 d-flex align-items-center gap-2 border px-3 py-2 rounded">
                  <Image
                    src="/images/facebook-1-svgrepo-com.svg"
                    alt="Facebook"
                    height={22}
                    width={22}
                  />
                  <small>Facebook</small>
                </div>
              </div>

              {/* Email */}
              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Enter your username or email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Username or email address"
                />
              </div>

              {/* Password */}
              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Enter Your Password Here
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter Password"
                />
              </div>

              {/* Forget password */}
              <div className="d-flex justify-content-end mb-3">
                <Link href="#" className="forget-password text-decoration-none">
                  Forget Password?
                </Link>
              </div>

              {/* Submit button */}
              <button className="sign-button w-100 btn btn-primary">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
