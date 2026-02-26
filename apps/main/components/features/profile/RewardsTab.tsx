import React from "react";
import { toast } from "react-toastify";

interface RewardsTabProps {
    notifications?: any[]; // It was in the code, but maybe not used in this tab. The file name is RewardsTab.
    loadingRewards: boolean;
    rewards: any[];
}

const RewardsTab: React.FC<RewardsTabProps> = ({
    loadingRewards,
    rewards
}) => {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                        <i className="fa-solid fa-gift"></i>
                    </span>
                    My Rewards & Coupons
                </h5>
            </div>
            <div className="card-body p-4 pt-0">
                {loadingRewards ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-orange-500 mb-3" role="status"></div>
                        <p className="text-muted">Fetching your rewards...</p>
                    </div>
                ) : rewards.length === 0 ? (
                    <div className="text-center py-5 bg-gray-50 rounded-xl border border-dashed">
                        <div className="mb-4">
                            <i className="fa-solid fa-ticket fa-3xl text-gray-300"></i>
                        </div>
                        <h6 className="fw-bold text-gray-500">No Rewards Available</h6>
                        <p className="text-muted small">Keep using our services to earn special gift coupons!</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {rewards.map((userCoupon: any, idx: number) => {
                            const coupon = userCoupon.coupon || userCoupon;

                            // Robust data extraction
                            const d_value = coupon.value || coupon.discountValue || 0;
                            const d_type = coupon.type || coupon.discountType || 'percentage';
                            const d_minOrder = coupon.minOrderValue || coupon.min_order_value || userCoupon.minOrderValue || userCoupon.min_order_value || '0';
                            const d_expiry = coupon.expiryDate || coupon.expiry_date || userCoupon.expiryDate || userCoupon.expiry_date;
                            const d_isUsed = userCoupon.is_used || userCoupon.isUsed || false;

                            return (
                                <div key={userCoupon.id || idx} className="col-md-6">
                                    <div className={`border border-dashed border-2 rounded-xl p-4 relative overflow-hidden transition-all ${d_isUsed ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200 hover:bg-orange-100/50'}`}>
                                        {d_isUsed ? (
                                            <div className="absolute top-0 right-0 bg-gray-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                                                USED
                                            </div>
                                        ) : (
                                            <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                                                ACTIVE
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`${d_isUsed ? 'bg-gray-100' : 'bg-white'} p-2 rounded-lg shadow-sm`}>
                                                <i className={`fa-solid ${d_type === 'percentage' ? 'fa-percent' : 'fa-gift'} text-2xl ${d_isUsed ? 'text-gray-400' : 'text-orange-500'}`}></i>
                                            </div>
                                            <div>
                                                <h6 className={`font-bold text-lg mb-0 tracking-wide ${d_isUsed ? 'text-gray-500' : 'text-gray-800'}`}>
                                                    {coupon.code}
                                                </h6>
                                                <p className={`${d_isUsed ? 'text-gray-400' : 'text-orange-600'} font-bold text-sm`}>
                                                    {d_type === 'percentage' ? `${d_value}% OFF` : `Flat ₹${d_value} OFF`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-[10px] text-gray-500 mb-4 bg-white/60 p-2 rounded-lg">
                                            <span><i className="fa-solid fa-circle-info mr-1"></i>Min Order: ₹{d_minOrder}</span>
                                            {d_expiry && (
                                                <span><i className="fa-regular fa-clock mr-1"></i>Exp: {new Date(d_expiry).toLocaleDateString()}</span>
                                            )}
                                        </div>

                                        <button
                                            disabled={d_isUsed}
                                            className={`w-full font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm ${d_isUsed ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white'}`}
                                            onClick={() => {
                                                if (!d_isUsed) {
                                                    navigator.clipboard.writeText(coupon.code);
                                                    toast.success("Coupon code copied!");
                                                }
                                            }}
                                        >
                                            <i className="fa-regular fa-copy"></i>
                                            {d_isUsed ? 'Already Redeemed' : 'Copy Code'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-5 text-center p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="text-blue-600 text-xs mb-0">
                        <i className="fa-solid fa-circle-info me-2"></i>
                        Rewards are automatically visible here when assigned by our experts or admin.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RewardsTab;


