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
            {/* Profile Card - Fixed at top */}
            <div className="card border-0 rounded-top-4 mb-0 text-center p-3 shadow-lg" style={{ backgroundColor: "white" }}>
                <div className="card-body">
                    <div className="position-relative d-inline-block mb-3">
                        <div style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "4px solid #fff",
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                            margin: "0 auto"
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
                            className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow-sm p-2 cursor-pointer"
                            style={{
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "var(--primary, #F25E0A)",
                                border: "2px solid #fff",
                                transition: "all 0.3s ease"
                            }}
                            title="Update Profile Picture"
                        >
                            <i className="fa-solid fa-camera" style={{ fontSize: "14px" }}></i>
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

                    <h5 className="fw-bold mb-1">{profileData.username || "User Name"} <i className="fa-solid fa-check-circle text-primary small"></i></h5>
                </div>
            </div>

            {/* Navigation Menu - Scrollable */}
            <div
                className="card border-0 rounded-bottom-4 overflow-y-auto shadow-lg"
                style={{
                    backgroundColor: "#F25E0A",
                    maxHeight: "calc(100vh - 350px)",
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
                                    ? { backgroundColor: "#2d1111", color: "white" }
                                    : { color: "white" }
                            }
                            onMouseEnter={(e) => {
                                if (activeTab !== item.id) {
                                    e.currentTarget.style.backgroundColor = "#2d1111";
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
