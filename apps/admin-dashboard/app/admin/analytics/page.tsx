"use client";
import React from "react";

export default function AnalyticsPage() {
  return (
    <div>
      <h2 className="mb-4">Analytics Dashboard</h2>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="bi bi-graph-up me-2"></i>Monthly Revenue</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Chart data will be displayed here
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0"><i className="bi bi-people me-2"></i>User Growth</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Chart data will be displayed here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}