"use client";

import React, { Suspense } from "react";
import UserDetailFormHero from "./UserDetailFormHero";
import UserDetailPersonalFields from "./UserDetailPersonalFields";
import UserDetailBookingFields from "./UserDetailBookingFields";
import UserDetailSummaryBox from "./UserDetailSummaryBox";
import { useUserDetailForm } from "./useUserDetailForm";

const UserDetailFormContent = () => {
  const {
    expertName,
    rate,
    formData,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    duration,
    setDuration,
    totalAmount,
    errors,
    setErrors,
    handleChange,
    handleSubmit,
  } = useUserDetailForm();

  return (
    <div className="min-h-screen bg-white">
      <UserDetailFormHero expertName={expertName} />

      <section className="py-12 md:py-16 bg-[#ffe3b852]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              {/* Info Card */}
              <div className="bg-white border border-[#daa23e73] rounded-2xl shadow-sm mb-8 overflow-hidden">
                <div className="p-6 md:p-8 text-center flex flex-col items-center">
                  <div className="flex items-center justify-center mb-4">
                    <i className="fa-solid fa-star text-[#daa23e] text-2xl mr-3"></i>
                    <h5 className="text-xl font-semibold text-[#732882] m-0">
                      Why We Need Your Birth Details
                    </h5>
                  </div>
                  <p className="text-gray-600 leading-relaxed max-w-2xl">
                    Your birth details help our expert experts create an
                    accurate birth chart and provide personalized predictions
                    based on planetary positions at your birth time.
                  </p>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white border-0 shadow-2xl rounded-2xl overflow-hidden">
                <div className="p-6 md:p-10">
                  <h4 className="text-2xl font-bold text-center mb-8 text-[#732882]">
                    Personal Details
                  </h4>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <UserDetailPersonalFields
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                    />

                    <UserDetailBookingFields
                      bookingDate={bookingDate}
                      bookingTime={bookingTime}
                      duration={duration}
                      errors={errors}
                      setBookingDate={setBookingDate}
                      setBookingTime={setBookingTime}
                      setDuration={setDuration}
                      clearError={(field) =>
                        setErrors((prev) => ({ ...prev, [field]: "" }))
                      }
                    />

                    <UserDetailSummaryBox
                      rate={rate}
                      duration={duration}
                      totalAmount={totalAmount}
                    />

                    <div className="text-center pt-8">
                      <button
                        type="submit"
                        className="group relative inline-flex items-center justify-center px-10 py-4 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl bg-gradient-to-r from-[#732882] to-[#8a3399] min-w-[280px]"
                      >
                        Proceed to Pay
                        <i className="fa-solid fa-arrow-right ml-3 transition-transform group-hover:translate-x-1"></i>
                      </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-6 flex items-center justify-center">
                      <i className="fa-solid fa-lock mr-2"></i>
                      Your information is secure and will only be used for
                      astrological consultation
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const UserDetailForm = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="w-12 h-12 border-4 border-[#732882] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <UserDetailFormContent />
    </Suspense>
  );
};

export default UserDetailForm;
