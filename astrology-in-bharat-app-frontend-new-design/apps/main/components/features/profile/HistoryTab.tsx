import React from "react";

interface HistoryTabProps {
    loadingHistory: boolean;
    consultationHistory: any[];
    onViewDetails: (session: any) => void;
    onReportIssue: (session: any) => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({
    loadingHistory,
    consultationHistory,
    onViewDetails,
    onReportIssue
}) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#e3f2fd", color: "#1e88e5" }}>
                        <i className="fa-solid fa-clock-rotate-left"></i>
                    </span>
                    Consultation History
                </h5>
            </div>
            <div className="card-body p-4 pt-0">
                {loadingHistory ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted small mt-3">Loading your consultation history...</p>
                    </div>
                ) : consultationHistory.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <i className="fa-solid fa-calendar-check fa-3x text-light"></i>
                        </div>
                        <h6 className="fw-bold">No Consultations Yet</h6>
                        <p className="text-muted small">Your future consultations will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {consultationHistory.map((session: any) => (
                            <div
                                key={session.id}
                                className="border rounded-3 p-4 hover:bg-gray-50 transition-all"
                                style={{ borderColor: "#e0e0e0" }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-center" style={{ width: "40px", height: "40px" }}>
                                            <i className="fa-solid fa-user-astronaut"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold">{session.expert?.user?.name || "Astrologer"}</h6>
                                            <small className="text-muted">{new Date(session.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                    <span className={`badge ${session.status === 'completed' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-${session.status === 'completed' ? 'success' : 'warning'} px-3 py-2 rounded-pill`}>
                                        {session.status}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-dark">₹{session.totalCost || 0}</span>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={() => onViewDetails(session)}
                                            className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                        >
                                            View Details
                                        </button>
                                        {(session.status === 'issue_reported' || session.status === 'dispute_raised') ? (
                                            <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill d-flex align-items-center">
                                                <i className="fa-solid fa-triangle-exclamation me-1"></i>
                                                Issue Reported
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => onReportIssue(session)}
                                                className="text-danger small fw-bold text-decoration-none bg-transparent border-0"
                                            >
                                                <i className="fa-solid fa-circle-exclamation me-1"></i>
                                                Report Issue
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryTab;
