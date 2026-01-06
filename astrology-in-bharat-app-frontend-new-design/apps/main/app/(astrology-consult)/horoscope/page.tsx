import React from "react";

const HoroscopePage = () => {
  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold text-center mb-4">Horoscope</h1>
      <p className="lead text-center text-muted">
        Get your daily, weekly, and monthly horoscope predictions.
      </p>
      <div className="row g-4 mt-4">
        {/* Placeholder for Horoscope content */}
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm rounded-4 p-5 text-center">
            <h2 className="h4 mb-3">Coming Soon</h2>
            <p>
              We are currently working on bringing you the most accurate
              horoscope predictions based on your zodiac sign.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoroscopePage;
