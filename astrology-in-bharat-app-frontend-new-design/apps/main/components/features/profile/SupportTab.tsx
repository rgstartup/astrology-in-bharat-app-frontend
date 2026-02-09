import React from "react";

interface SupportTabProps {
    supportSettings: {
        email?: string;
        whatsapp?: string;
        phone?: string;
    };
}

const SupportTab: React.FC<SupportTabProps> = ({ supportSettings }) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}>
                        <i className="fa-solid fa-headset"></i>
                    </span>
                    Help & Support
                </h5>
                <p className="text-muted small mb-0 mt-2">We're here to help you with any questions or concerns</p>
            </div>
            <div className="card-body p-4">
                {/* Quick Contact Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 bg-light h-100 hover:shadow-md transition-all">
                            <div className="card-body text-center p-4">
                                <div className="mb-3">
                                    <i className="fa-solid fa-envelope fa-2x" style={{ color: "#fd6410" }}></i>
                                </div>
                                <h6 className="fw-bold mb-2">Email Support</h6>
                                <p className="text-primary small mb-3 fw-bold">{supportSettings.email || 'support@astrologyinbharat.com'}</p>
                                <a href={`mailto:${supportSettings.email || 'support@astrologyinbharat.com'}`} className="btn btn-sm btn-outline-primary rounded-pill">
                                    <i className="fa-solid fa-paper-plane me-2"></i>
                                    Send Email
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 bg-light h-100 hover:shadow-md transition-all">
                            <div className="card-body text-center p-4">
                                <div className="mb-3">
                                    <i className="fa-brands fa-whatsapp fa-2x" style={{ color: "#25D366" }}></i>
                                </div>
                                <h6 className="fw-bold mb-2">WhatsApp</h6>
                                <p className="text-success small mb-3 fw-bold">{supportSettings.whatsapp || '+91 9876543210'}</p>
                                <a href={`https://wa.me/${(supportSettings.whatsapp || '+919876543210').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success rounded-pill">
                                    <i className="fa-brands fa-whatsapp me-2"></i>
                                    Chat Now
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 bg-light h-100 hover:shadow-md transition-all">
                            <div className="card-body text-center p-4">
                                <div className="mb-3">
                                    <i className="fa-solid fa-phone fa-2x" style={{ color: "#fd6410" }}></i>
                                </div>
                                <h6 className="fw-bold mb-2">Phone Support</h6>
                                <p className="text-primary small mb-3 fw-bold">{supportSettings.phone || '+91 9876543210'}</p>
                                <a href={`tel:${supportSettings.phone || '+919876543210'}`} className="btn btn-sm btn-outline-primary rounded-pill">
                                    <i className="fa-solid fa-phone me-2"></i>
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Additional Resources */}
                <div className="mt-5 p-4 rounded-3" style={{ backgroundColor: "#fff7ed" }}>
                    <h6 className="fw-bold mb-3">
                        <i className="fa-solid fa-lightbulb me-2" style={{ color: "#fd6410" }}></i>
                        Additional Resources
                    </h6>
                    <ul className="list-unstyled mb-0">
                        <li className="mb-2">
                            <i className="fa-solid fa-circle-check me-2 text-success"></i>
                            <a href="/terms" className="text-decoration-none">Terms & Conditions</a>
                        </li>
                        <li className="mb-2">
                            <i className="fa-solid fa-circle-check me-2 text-success"></i>
                            <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
                        </li>
                        <li className="mb-2">
                            <i className="fa-solid fa-circle-check me-2 text-success"></i>
                            <a href="/refund-policy" className="text-decoration-none">Refund & Cancellation Policy</a>
                        </li>
                        <li className="mb-0">
                            <i className="fa-solid fa-circle-check me-2 text-success"></i>
                            <a href="/about" className="text-decoration-none">About Us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SupportTab;
