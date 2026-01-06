import React from "react";

const FreeServicesPage = () => {
  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold text-center mb-4">Free Services</h1>
      <p className="lead text-center text-muted">
        Access our complimentary astrology tools and services.
      </p>
      <div className="row g-4 mt-4">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm rounded-4 p-5 text-center">
            <h2 className="h4 mb-3">Coming Soon</h2>
            <p>A variety of free astrology services are under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeServicesPage;
