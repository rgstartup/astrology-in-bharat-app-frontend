import React from "react";

interface DisputesTabProps {
    disputes: any[];
    loading: boolean;
    onViewChat: (dispute: any) => void;
}

const DisputesTab: React.FC<DisputesTabProps> = ({ disputes, loading, onViewChat }) => {
    if (loading) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading tickets...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#fff3e0", color: "#fb8c00" }}>
                        <i className="fa-solid fa-headset"></i>
                    </span>
                    My Support Tickets
                </h5>
            </div>
            <div className="card-body p-4 pt-0">
                {disputes.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-3">
                            <i className="fa-solid fa-ticket fa-3x text-light"></i>
                        </div>
                        <h6 className="fw-bold">No Active Tickets</h6>
                        <p className="text-muted small">If you have any issues with orders or consultations, report them to see them here.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="bg-light border-0">
                                <tr>
                                    <th className="border-0 px-3 py-3 small text-uppercase text-muted">Ticket ID</th>
                                    <th className="border-0 py-3 small text-uppercase text-muted">Category</th>
                                    <th className="border-0 py-3 small text-uppercase text-muted">Status</th>
                                    <th className="border-0 py-3 small text-uppercase text-muted text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {disputes.map((dispute) => (
                                    <tr key={dispute.id}>
                                        <td className="px-3 py-3">
                                            <span className="fw-bold">#DS-{dispute.id}</span>
                                            <div className="small text-muted">
                                                {new Date(dispute.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark border">{dispute.category}</span>
                                            <div className="small text-muted mt-1 text-truncate" style={{ maxWidth: '200px' }}>
                                                {dispute.description}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${dispute.status === 'open' ? 'bg-info' :
                                                    dispute.status === 'pending' ? 'bg-warning' :
                                                        dispute.status === 'resolved' ? 'bg-success' : 'bg-secondary'
                                                }`}>
                                                {dispute.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button
                                                onClick={() => onViewChat(dispute)}
                                                className="btn btn-primary btn-sm rounded-pill px-3"
                                                style={{ fontSize: '12px' }}
                                            >
                                                View Chat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisputesTab;


