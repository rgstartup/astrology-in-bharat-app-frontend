import React from "react";

const ReportsTab: React.FC = () => {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#e8f5e9", color: "#43a047" }}>
                        <i className="fa-solid fa-scroll"></i>
                    </span>
                    My Kundli Reports
                </h5>
            </div>
            <div className="card-body p-4 pt-5 text-center">
                <div className="mb-4">
                    <i className="fa-solid fa-file-invoice fa-3x text-light"></i>
                </div>
                <h6 className="fw-bold">No Reports Available</h6>
                <p className="text-muted small">Generate your first Kundali report to see it here.</p>
            </div>
        </div>
    );
};

export default ReportsTab;
