import React from 'react';

interface ProfileSidebarProps {
    profileData: any;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    imagePreview: string;
    handleImageChange: (file: File) => void;
    savingSections: {
        personal: boolean;
        address: boolean;
        astro: boolean;
        settings: boolean;
    };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    profileData,
    activeTab,
    setActiveTab,
    imagePreview,
    handleImageChange,
    savingSections
}) => {
    const menuItems = [
        { icon: "fa-regular fa-user", label: "Personal Profile", id: "profile" },
        { icon: "fa-solid fa-wallet", label: "My Wallet", id: "wallet" },
        { icon: "fa-solid fa-gift", label: "My Rewards", id: "rewards" },
        { icon: "fa-regular fa-heart", label: "My Wishlist", id: "wishlist" },
        { icon: "fa-solid fa-clock-rotate-left", label: "Consultation History", id: "history" },
        { icon: "fa-solid fa-bag-shopping", label: "My Orders", id: "orders" },
        { icon: "fa-solid fa-scroll", label: "My Kundli Reports", id: "reports" },
        { icon: "fa-solid fa-circle-question", label: "My Support Tickets", id: "disputes" },
        { icon: "fa-solid fa-bell", label: "All Notifications", id: "notifications" },
        { icon: "fa-solid fa-headset", label: "Help & Support", id: "support" },
    ];

    return (
        <div className="sticky top-24">
            <div className="card border-0 rounded-top-4 mb-0 p-3 shadow-lg" style={{ backgroundColor: "white" }}>
                <div className="card-body p-0 d-flex align-items-center gap-3">
                    <div className="position-relative d-inline-block flex-shrink-0">
                        <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3px solid #fff",
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        }}>
                            {savingSections.personal ? (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                </div>
                            ) : (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            )}
                        </div>
                        <label
                            htmlFor="profile-upload"
                            className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm cursor-pointer mb-0"
                            style={{
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#301118",
                                border: "1px solid #fff",
                                transition: "all 0.3s ease",
                                transform: "translate(20%, 20%)"
                            }}
                            title="Update Profile Picture"
                        >
                            <i className="fa-solid fa-camera" style={{ fontSize: "10px" }}></i>
                            <input
                                id="profile-upload"
                                type="file"
                                className="d-none"
                                accept="image/*"
                                onChange={(e) => {
                                    console.log("📁 File input onChange triggered!");
                                    if (e.target.files && e.target.files[0]) {
                                        handleImageChange(e.target.files[0]);
                                    }
                                }}
                            />
                        </label>
                    </div>

                    <div className="text-start">
                        <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-1">
                            {profileData.username || "User Name"}
                            <i className="fa-solid fa-check-circle text-brown" style={{ fontSize: "12px" }}></i>
                        </h6>
                    </div>
                </div>
            </div>

            {/* Navigation Menu - Scrollable */}
            <div
                className="card border-0 rounded-bottom-4 overflow-y-auto shadow-lg bg-brown"
                style={{
                    maxHeight: "calc(100vh - 120px)",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255, 255, 255, 0.5) transparent"
                }}
            >
                <div className="border-0 pt-3 px-3">
                    <small className="text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "1px", color: "white" }}>ACCOUNT MENU</small>
                </div>
                <div className=" p-2">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className={`border-0 rounded-3 d-flex align-items-center px-3 py-3 mb-1 transition-all text-decoration-none ${activeTab === item.id
                                ? 'fw-bold shadow-sm'
                                : ''
                                }`}
                            style={
                                activeTab === item.id
                                    ? { backgroundColor: "#FF6B00", color: "white" }
                                    : { color: "white" }
                            }
                            onMouseEnter={(e) => {
                                if (activeTab !== item.id) {
                                    e.currentTarget.style.backgroundColor = "#FF6B00";
                                    e.currentTarget.style.color = "white";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== item.id) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "white";
                                }
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(item.id);
                            }}
                        >
                            <i className={`${item.icon} me-3`} style={{ width: "20px" }}></i>
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;


