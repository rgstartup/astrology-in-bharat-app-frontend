"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@repo/routes";
import { toast } from "react-toastify";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import apiClient, { getClientProfile, updateClientProfile, createClientProfile, uploadClientDocument, ClientProfileData, AddressDto, getAllChatSessions, getChatHistory, getMyOrders, getWalletTransactions } from "@/libs/api-profile";
import * as LucideIcons from "lucide-react";
import { loadRazorpay } from "@/libs/razorpay";
import { getNotificationSocket, connectNotificationSocket } from "@packages/ui/src/utils/socket";

import WishlistGrid from "@/components/features/profile/WishlistGrid";

const { Plus, CheckCircle2 } = LucideIcons as any;

// Types - imported from api-profile
type ProfileData = ClientProfileData;

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { clientUser, isClientAuthenticated, clientLoading, clientBalance } = useClientAuth();

  const [profileData, setProfileData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(false);

  // Section-based editing/saving states
  const [editingSections, setEditingSections] = useState({
    personal: false,
    address: false,
    astro: false,
    settings: false
  });
  const [savingSections, setSavingSections] = useState({
    personal: false,
    address: false,
    astro: false,
    settings: false
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/images/aa.webp");

  // Wallet Recharge State
  const [rechargeAmount, setRechargeAmount] = useState<number>(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const rechargeOptions = [100, 200, 500, 1000, 2000, 5000];

  const { refreshBalance } = useClientAuth();

  // Consultation History State
  const [consultationHistory, setConsultationHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // State for active tab
  const [walletView, setWalletView] = useState<'recharge' | 'history'>('recharge');

  // Order collapse state
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  const toggleOrder = (orderId: number) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleRecharge = async () => {
    if (rechargeAmount < 100) {
      toast.error("Minimum recharge amount is ₹100");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Load Razorpay Script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load.");
        return;
      }

      // 2. Create Order on Backend
      const orderRes = await apiClient.post("/payment/orders/create", {
        amount: rechargeAmount,
        type: 'wallet_recharge'
      });

      const { id: order_id, amount, currency, key_id } = orderRes.data;

      // 3. Open Razorpay Modal
      const options = {
        key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Astrology in Bharat",
        description: "Wallet Recharge",
        order_id: order_id,
        handler: async (response: any) => {
          try {
            // 4. Verify Payment on Backend
            const verifyRes = await apiClient.post("/payment/orders/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success(`Successfully recharged ₹${rechargeAmount}!`);
              refreshBalance();
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            toast.error("Error verifying payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: profileData.full_name || clientUser?.name || "",
          email: clientUser?.email || "",
        },
        theme: {
          color: "#fd6410",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();

    } catch (err: any) {
      console.error("Recharge error:", err);
      toast.error(err.response?.data?.message || "Recharge failed. Please try again.");
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    if (!clientLoading && !isClientAuthenticated) {
      router.push("/sign-in?callbackUrl=/profile");
    }
  }, [clientLoading, isClientAuthenticated, router]);


  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 Loading profile via API client");
      const data = await getClientProfile();

      if (data) {
        console.log("📊 Profile loaded successfully:", data);
        setProfileData(data);
        if (data.profile_picture) {
          setImagePreview(data.profile_picture);
        }
      }
    } catch (error: any) {
      console.error("❌ Error loading profile:", error);
      // 404 is OK - means new user with no profile yet
      if (error.response?.status !== 404) {
        setErrorMessage("Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isClientAuthenticated) {
      loadProfile();
    }
  }, [isClientAuthenticated, loadProfile]);

  // Load consultation history when history tab is active
  useEffect(() => {
    const loadConsultationHistory = async () => {
      if (activeTab === "history" && isClientAuthenticated) {
        setLoadingHistory(true);
        try {
          const sessions = await getAllChatSessions();
          console.log("📜 Consultation History loaded:", sessions);
          setConsultationHistory(sessions);
        } catch (error) {
          console.error("Failed to load consultation history:", error);
          toast.error("Failed to load consultation history");
        } finally {
          setLoadingHistory(false);
        }
      }
    };
    loadConsultationHistory();
  }, [activeTab, isClientAuthenticated]);

  // Load orders when orders tab is active
  useEffect(() => {
    const loadOrders = async () => {
      if (activeTab === "orders" && isClientAuthenticated) {
        setLoadingOrders(true);
        try {
          const myOrders = await getMyOrders();
          console.log("🛍️ Orders loaded:", myOrders);
          setOrders(myOrders);
        } catch (error: any) {
          console.error("Failed to load orders:", error);
          if (error.response?.status === 404) {
            toast.error("Orders API not found. Please contact backend team.");
          } else {
            toast.error("Failed to load orders");
          }
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    loadOrders();
  }, [activeTab, isClientAuthenticated]);

  // Load wallet transactions when wallet tab is active
  useEffect(() => {
    const loadTransactions = async () => {
      if (activeTab === "wallet" && isClientAuthenticated) {
        setLoadingTransactions(true);
        try {
          const transactions = await getWalletTransactions();
          console.log("💰 Wallet Transactions loaded:", transactions);
          setWalletTransactions(transactions || []);
        } catch (error) {
          console.error("Failed to load wallet transactions:", error);
        } finally {
          setLoadingTransactions(false);
        }
      }
    };
    loadTransactions();
  }, [activeTab, isClientAuthenticated]);

  // Socket.IO - Real-Time Order Updates
  useEffect(() => {
    if (!isClientAuthenticated || !clientUser?.id) return;

    // Connect socket
    connectNotificationSocket(clientUser.id);
    const socket = getNotificationSocket();

    // Listen for order status updates
    const handleOrderUpdate = (data: any) => {
      console.log('📦 Real-time order update:', data);
      toast.success(data.message || 'Order status updated');

      // Update order status in real-time
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === data.orderId
            ? { ...order, status: data.status, cancellationReason: data.cancellationReason }
            : order
        )
      );
    };

    socket.on('order_status_updated', handleOrderUpdate);

    return () => {
      socket.off('order_status_updated', handleOrderUpdate);
    };
  }, [isClientAuthenticated, clientUser?.id]);

  // Function to open chat history modal
  const handleViewChat = async (session: any) => {
    try {
      setSelectedSession(session);
      setShowChatModal(true);
      const messages = await getChatHistory(session.id);
      setChatMessages(messages);
    } catch (error) {
      console.error("Failed to load chat messages:", error);
      toast.error("Failed to load chat messages");
    }
  };


  // Handle image upload dynamically (immediate) - following astrologer dashboard pattern
  const handleImageChange = async (file: File) => {
    // 1. Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 2. Upload immediately for "dynamic" experience
    try {
      setSavingSections(prev => ({ ...prev, personal: true }));
      console.log("📸 Starting image upload. File details:", { name: file.name, size: file.size, type: file.type });
      console.log("🔍 Auth state:", { isClientAuthenticated, userId: clientUser?.id });

      // Use the centralized upload function
      const uploadResult = await uploadClientDocument(file);
      console.log("☁️ Upload response from server:", uploadResult);

      if (uploadResult && uploadResult.url) {
        const imageUrl = uploadResult.url;
        console.log("✅ Received Cloudinary URL:", imageUrl);

        // Update local state
        setProfileData(prev => ({ ...prev, profile_picture: imageUrl }));
        setImagePreview(imageUrl);

        // PERSIST to profile immediately
        try {
          console.log("💾 Persisting image URL to profile...");
          const savedProfile = await updateClientProfile({ profile_picture: imageUrl });
          console.log("✅ Persist success:", savedProfile);
          setSuccessMessage("Profile picture updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (saveError: any) {
          console.error("❌ Error persisting profile picture:", saveError);
          setErrorMessage("Failed to save profile picture to profile");
        }
      } else {
        console.warn("⚠️ Upload response missing URL:", uploadResult);
        setErrorMessage("Upload succeeded but no URL returned");
      }
    } catch (error: any) {
      console.error("❌ Error uploading profile picture:", error);
      const errorDetail = error.response?.data?.message || error.message || "Unknown error";
      setErrorMessage(`Failed to upload profile picture: ${errorDetail}`);
      setTimeout(() => setErrorMessage(""), 8000);
    } finally {
      setSavingSections(prev => ({ ...prev, personal: false }));
    }
  };

  // Handle input changes
  const handleInputChange = (key: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddressChange = (index: number, key: keyof AddressDto, value: string) => {
    setProfileData(prev => {
      const addresses = [...(prev.addresses || [])];
      if (!addresses[index]) {
        addresses[index] = { line1: '', city: '', state: '', country: '', zipCode: '' };
      }
      addresses[index] = { ...addresses[index], [key]: value };
      return { ...prev, addresses };
    });
  };

  // Handle sectional form submission
  const handleSaveSection = async (section: keyof typeof editingSections) => {
    setSavingSections(prev => ({ ...prev, [section]: true }));
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 1. Determine fields for the specific section
      let sectionFields: string[] = [];
      switch (section) {
        case 'personal':
          sectionFields = ['full_name', 'username', 'phone', 'gender', 'marital_status', 'occupation', 'about_me'];
          break;
        case 'address':
          sectionFields = ['addresses'];
          break;
        case 'astro':
          sectionFields = ['date_of_birth', 'time_of_birth', 'place_of_birth'];
          break;
        case 'settings':
          sectionFields = ['language_preference'];
          break;
      }

      const payload: any = {};

      // Only include fields for this section
      sectionFields.forEach(field => {
        if (profileData[field as keyof ProfileData] !== undefined) {
          payload[field] = profileData[field as keyof ProfileData];
        }
      });

      // Business logic & scrubbing
      if (section === 'personal' && (!payload.gender || payload.gender.trim() === '')) {
        payload.gender = 'other';
      }

      if (section === 'address' && payload.addresses && Array.isArray(payload.addresses)) {
        payload.addresses = payload.addresses.map((addr: any) => {
          const { createdAt, updatedAt, user, profile_client, ...cleanAddr } = addr;
          return cleanAddr;
        });
      }

      console.log(`📤 Submitting ${section} data:`, payload);

      const savedData = await updateClientProfile(payload);
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);

      if (savedData) {
        setProfileData(prev => ({ ...prev, ...savedData }));
      }

      setEditingSections(prev => ({ ...prev, [section]: false }));
    } catch (error: any) {
      console.error(`❌ Error updating ${section}:`, error);
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      setErrorMessage(`Failed to update ${section}: ${errMsg}`);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setSavingSections(prev => ({ ...prev, [section]: false }));
    }
  };


  // Sidebar Menu Items
  const menuItems = [
    { icon: "fa-regular fa-user", label: "Personal Profile", id: "profile" },
    { icon: "fa-solid fa-wallet", label: "My Wallet", id: "wallet" },
    { icon: "fa-regular fa-heart", label: "My Wishlist", id: "wishlist" },
    { icon: "fa-solid fa-clock-rotate-left", label: "Consultation History", id: "history" },
    { icon: "fa-solid fa-bag-shopping", label: "My Orders", id: "orders" },
    { icon: "fa-solid fa-scroll", label: "My Kundli Reports", id: "reports" },
  ];


  // Only show full-page loader if we are doing initial load and have no data yet
  if ((loading || clientLoading) && !profileData?.id) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Breadcrumb & Title */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item"><a href="/" className="text-muted text-decoration-none">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page" style={{ color: "#fd6410" }}>Profile</li>
              </ol>
            </nav>
            <h1 className="h3 fw-bold mb-1">User Account</h1>
            <p className="text-muted">Manage your cosmic identity and preferences</p>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {/* Sidebar Column */}
          <div className="col-lg-3">

            {/* Navigation Menu */}
            <div className="card border-0  rounded-4 overflow-hidden">
              <div className="card border-0  rounded-4 mb-4 text-center p-3">
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
                        color: "#fd6410",
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



              <div className=" bg-white border-0 pt-3 px-3">
                <small className="text-uppercase  fw-bold" style={{ fontSize: "11px", letterSpacing: "1px", color: "black" }}>ACCOUNT MENU</small>
              </div>
              <div className=" p-2">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className={` border-0 rounded-3 d-flex align-items-center px-3 py-2 mb-1 transition-all  text-black
                        hover:bg-orange-light hover:text-black hover:font-bold ${activeTab === item.id ? 'font-bold' : 'text-gray-500'}`}
                    style={activeTab === item.id ? { backgroundColor: "#fd6410", color: "white" } : {}}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                    }}
                  >
                    <i className={`${item.icon} me-3`} style={{ width: "20px", color: activeTab === item.id ? "#fff" : "inherit" }}></i>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="col-lg-9">
            {/* Feedback Messages */}
            {successMessage && (
              <div className="alert alert-success border-0 shadow-sm rounded-3 mb-4" role="alert">
                <i className="fa-solid fa-check-circle me-2"></i> {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4" role="alert">
                <i className="fa-solid fa-exclamation-circle me-2"></i> {errorMessage}
              </div>
            )}

            {/* Tab Content */}
            {activeTab === "profile" && (
              <>
                {/* Personal Details Card */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">
                      <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#ffefe5", color: "#fd6410" }}>
                        <i className="fa-regular fa-id-card"></i>
                      </span>
                      Personal Details
                    </h5>
                    {!editingSections.personal ? (
                      <button
                        type="button"
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-orange-200"
                        onClick={() => setEditingSections(prev => ({ ...prev, personal: true }))}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold transition-all"
                          onClick={() => setEditingSections(prev => ({ ...prev, personal: false }))}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingSections.personal}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-green-200"
                          onClick={() => handleSaveSection('personal')}
                        >
                          {savingSections.personal ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-4">


                      <div className="col-md-12">
                        <label className="text-muted small fw-bold text-uppercase mb-1">Full Name</label>
                        {editingSections.personal ? (
                          <input
                            type="text"
                            className="form-control fw-bold"
                            value={profileData.full_name || ""}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="fw-bold mb-0 text-xl">{profileData.full_name || "Not set"}</p>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="text-muted small fw-bold text-uppercase mb-1">User Name</label>
                        {editingSections.personal ? (
                          <input
                            type="text"
                            className="form-control fw-bold"
                            value={profileData.username || ""}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                          />
                        ) : (
                          <p className="fw-bold mb-0">{profileData.username || "Not set"}</p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted small fw-bold text-uppercase mb-1">EMAIL ADDRESS</label>
                        <p className="fw-bold mb-0">{clientUser?.email || "Not set"}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted small fw-bold text-uppercase mb-1">PHONE NUMBER</label>
                        {editingSections.personal ? (
                          <input
                            type="text"
                            className="form-control fw-bold"
                            value={profileData.phone || ""}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        ) : (
                          <div className="d-flex align-items-center">
                            <p className="fw-bold mb-0 me-2">{profileData.phone || "Not set"}</p>
                            {profileData.phone && <span className="badge bg-success bg-opacity-10 text-success px-2 py-1" style={{ fontSize: "10px" }}>VERIFIED</span>}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="text-muted small fw-bold text-uppercase mb-1">GENDER</label>
                        {editingSections.personal ? (
                          <select
                            className="form-select fw-bold"
                            value={profileData.gender || ""}
                            onChange={(e) => handleInputChange('gender', e.target.value as any)}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <p className="fw-bold mb-0 text-capitalize">{profileData.gender || "Not set"}</p>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="text-muted small fw-bold text-uppercase mb-1">MARITAL STATUS</label>
                        {editingSections.personal ? (
                          <select
                            className="form-select fw-bold"
                            value={profileData.marital_status || ""}
                            onChange={(e) => handleInputChange('marital_status', e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <p className="fw-bold mb-0 text-capitalize">{profileData.marital_status || "Not set"}</p>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="text-muted small fw-bold text-uppercase mb-1">OCCUPATION</label>
                        {editingSections.personal ? (
                          <input
                            type="text"
                            className="form-control fw-bold"
                            value={profileData.occupation || ""}
                            onChange={(e) => handleInputChange('occupation', e.target.value)}
                            placeholder="e.g. Software Engineer, Business Owner"
                          />
                        ) : (
                          <p className="fw-bold mb-0">{profileData.occupation || "Not set"}</p>
                        )}
                      </div>

                      <div className="col-md-12">
                        <label className="text-muted small fw-bold text-uppercase mb-1">ABOUT ME / NOTES FOR ASTROLOGER</label>
                        {editingSections.personal ? (
                          <textarea
                            className="form-control fw-bold"
                            rows={3}
                            value={profileData.about_me || ""}
                            onChange={(e) => handleInputChange('about_me', e.target.value)}
                            placeholder="Share your spiritual journey or specific problems you're seeking guidance for..."
                          />
                        ) : (
                          <p className="fw-medium mb-0 text-gray-600 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
                            {profileData.about_me || "Share details about yourself to help astrologers provide better guidance."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Details Card */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">
                      <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#e2f8ff", color: "#00b4d8" }}>
                        <i className="fa-solid fa-location-dot"></i>
                      </span>
                      Address Details
                    </h5>
                    {!editingSections.address ? (
                      <button
                        type="button"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-blue-100"
                        onClick={() => setEditingSections(prev => ({ ...prev, address: true }))}
                      >
                        <i className="fa-solid fa-map-pin"></i>
                        Edit Address
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold transition-all"
                          onClick={() => setEditingSections(prev => ({ ...prev, address: false }))}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingSections.address}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-green-200"
                          onClick={() => handleSaveSection('address')}
                        >
                          {savingSections.address ? "Saving..." : "Save Address"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body p-4">
                    {editingSections.address ? (
                      <div className="row g-3">
                        <div className="col-md-12">
                          <label className="text-muted small fw-bold text-uppercase mb-1">Address Line 1</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profileData.addresses?.[0]?.line1 || ""}
                            onChange={(e) => handleAddressChange(0, 'line1', e.target.value)}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="text-muted small fw-bold text-uppercase mb-1">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profileData.addresses?.[0]?.line2 || ""}
                            onChange={(e) => handleAddressChange(0, 'line2', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold text-uppercase mb-1">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profileData.addresses?.[0]?.city || ""}
                            onChange={(e) => handleAddressChange(0, 'city', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="text-muted small fw-bold text-uppercase mb-1">State</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profileData.addresses?.[0]?.state || ""}
                            onChange={(e) => handleAddressChange(0, 'state', e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="text-muted small fw-bold text-uppercase mb-1">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profileData.addresses?.[0]?.country || ""}
                            onChange={(e) => handleAddressChange(0, 'country', e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="text-muted small fw-bold text-uppercase mb-1">Zip Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profileData.addresses?.[0]?.zipCode || ""}
                            onChange={(e) => handleAddressChange(0, 'zipCode', e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        {profileData.addresses && profileData.addresses.length > 0 ? (
                          <div className="d-flex align-items-start gap-3">
                            <i className="fa-solid fa-map-location-dot text-muted mt-1"></i>
                            <div>
                              <p className="fw-bold mb-0">{profileData.addresses[0]?.line1}</p>
                              {profileData.addresses[0]?.line2 && <p className="text-muted mb-0">{profileData.addresses[0]?.line2}</p>}
                              <p className="text-muted mb-0">
                                {profileData.addresses[0]?.city}, {profileData.addresses[0]?.state}, {profileData.addresses[0]?.country} - {profileData.addresses[0]?.zipCode}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted italic mb-0">No address set. Click Edit to add one.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Astro Birth Details Card */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">
                      <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#f0f2f5", color: "#333" }}>
                        <i className="fa-regular fa-calendar"></i>
                      </span>
                      Astro Birth Details
                    </h5>
                    {!editingSections.astro ? (
                      <button
                        type="button"
                        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-purple-100"
                        onClick={() => setEditingSections(prev => ({ ...prev, astro: true }))}
                      >
                        <i className="fa-solid fa-moon"></i>
                        Edit Birth Data
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold transition-all"
                          onClick={() => setEditingSections(prev => ({ ...prev, astro: false }))}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingSections.astro}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md shadow-green-200"
                          onClick={() => handleSaveSection('astro')}
                        >
                          {savingSections.astro ? "Saving..." : "Save Birth Data"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-4">
                      <div className="col-md-4">
                        <label className="text-muted small fw-bold text-uppercase mb-1">DATE OF BIRTH</label>
                        {editingSections.astro ? (
                          <input
                            type="date"
                            className="form-control fw-bold"
                            value={profileData.date_of_birth || ""}
                            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                          />
                        ) : (
                          <p className="fw-bold mb-0 text-dark"><i className="fa-regular fa-calendar me-2 text-warning"></i>{profileData.date_of_birth || "Not set"}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="text-muted small fw-bold text-uppercase mb-1">TIME OF BIRTH</label>
                        {editingSections.astro ? (
                          <input
                            type="time"
                            className="form-control fw-bold"
                            value={profileData.time_of_birth || ""}
                            onChange={(e) => handleInputChange('time_of_birth', e.target.value)}
                          />
                        ) : (
                          <p className="fw-bold mb-0 text-dark"><i className="fa-regular fa-clock me-2 text-warning"></i>{profileData.time_of_birth || "Not set"}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="text-muted small fw-bold text-uppercase mb-1">BIRTH PLACE</label>
                        {editingSections.astro ? (
                          <input
                            type="text"
                            className="form-control fw-bold"
                            value={profileData.place_of_birth || ""}
                            onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                            placeholder="City, Country"
                          />
                        ) : (
                          <p className="fw-bold mb-0 text-dark"><i className="fa-solid fa-location-dot me-2 text-warning"></i>{profileData.place_of_birth || "Not set"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings & Preferences Card */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">
                      <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#e8f0fe", color: "#4285f4" }}>
                        <i className="fa-solid fa-sliders"></i>
                      </span>
                      Settings & Preferences
                    </h5>
                    {editingSections.settings ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg font-bold transition-all text-sm"
                          onClick={() => setEditingSections(prev => ({ ...prev, settings: false }))}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingSections.settings}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-bold transition-all text-sm shadow-md"
                          onClick={() => handleSaveSection('settings')}
                        >
                          {savingSections.settings ? "Saving..." : "Save"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700 font-bold text-sm"
                        onClick={() => setEditingSections(prev => ({ ...prev, settings: true }))}
                      >
                        Modify Preferences
                      </button>
                    )}
                  </div>
                  <div className="card-body p-4">
                    <div className="row align-items-center mb-4">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-1">Preferred Language</h6>
                        <p className="text-muted small mb-0">Language for horoscopes and consultation</p>
                      </div>
                      <div className="col-md-4 text-end">
                        {editingSections.settings ? (
                          <select
                            className="form-select form-select-sm d-inline-block w-auto"
                            value={profileData.language_preference || "english"}
                            onChange={(e) => handleInputChange('language_preference', e.target.value)}
                          >
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                          </select>
                        ) : (
                          <span className="badge bg-light text-dark px-3 py-2 border rounded-pill">
                            <i className="fa-solid fa-globe me-2"></i>
                            {profileData.language_preference === 'hindi' ? 'Hindi' : 'English / Hindi'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="row align-items-center mb-4">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-1">Email Notifications</h6>
                        <p className="text-muted small mb-0">Receive daily horoscope and offers</p>
                      </div>
                      <div className="col-md-4 text-end">
                        <div className="form-check form-switch d-inline-block">
                          <input className="form-check-input" type="checkbox" role="switch" id="emailNotif" defaultChecked style={{ backgroundColor: "#fd6410", borderColor: "#fd6410" }} />
                        </div>
                      </div>
                    </div>

                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h6 className="fw-bold mb-1">App Theme</h6>
                        <p className="text-muted small mb-0">Switch between light and dark mode</p>
                      </div>
                      <div className="col-md-4 text-end">
                        <button type="button" className="btn btn-light rounded-circle"><i className="fa-solid fa-moon"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "wishlist" && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                  <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#ffebee", color: "#e53935" }}>
                      <i className="fa-solid fa-heart"></i>
                    </span>
                    My Wishlist
                  </h5>
                </div>
                <div className="card-body p-4 pt-0">
                  <WishlistGrid />
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="card border-0 shadow-xl rounded-3xl mb-6 overflow-hidden">
                {/* Header with gradient */}
                <div className="card-header bg-gradient-to-r from-orange-500 to-amber-500 border-0 pt-6 px-6 pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
                        <i className="fa-solid fa-wallet text-xl text-white"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xl mb-1">My Wallet</h5>
                        <p className="text-white/80 text-sm">Recharge & manage your balance</p>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    {/* Toggle Button */}
                    <div className="flex bg-white/20 backdrop-blur-md rounded-full p-1.5 border border-white/10">
                      <button
                        onClick={() => setWalletView('recharge')}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${walletView === 'recharge'
                            ? 'bg-white text-orange-600 shadow-md transform scale-105'
                            : 'text-white/90 hover:bg-white/10'
                          }`}
                      >
                        <i className="fa-solid fa-plus-circle text-[10px]"></i>
                        Add Money
                      </button>
                      <button
                        onClick={() => setWalletView('history')}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${walletView === 'history'
                            ? 'bg-white text-orange-600 shadow-md transform scale-105'
                            : 'text-white/90 hover:bg-white/10'
                          }`}
                      >
                        <i className="fa-solid fa-list text-[10px]"></i>
                        Transactions
                      </button>
                    </div>
                  </div>

                  {/* Balance Display */}
                  <div className="relative">
                    <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-sm text-center border border-white/20">
                      <p className="text-white/80 text-xs font-bold uppercase mb-2 tracking-wider">
                        <i className="fa-solid fa-circle-info mr-2"></i>
                        Available Balance
                      </p>
                      <div className="flex items-center justify-center mb-1">
                        <span className="text-white text-3xl mr-2">₹</span>
                        <h1 className="font-black text-white text-5xl">
                          {clientBalance?.toLocaleString() || '0'}
                        </h1>
                      </div>
                      <p className="text-white/70 text-sm">
                        Last updated: Just now
                      </p>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute -top-3 right-6 w-14 h-14 rounded-full bg-white/10 z-0"></div>
                    <div className="absolute -bottom-3 left-6 w-10 h-10 rounded-full bg-white/10 z-0"></div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-6 pt-8">

                  {walletView === 'recharge' ? (
                    <>
                      {/* Recharge Section */}
                      <div className="mb-0">
                        {/* Section Header */}
                        <div className="mb-6">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                              <i className="fa-solid fa-money-bill-transfer text-orange-500"></i>
                            </div>
                            <h6 className="font-bold text-gray-800 text-lg">Add Money to Wallet</h6>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Select a package or enter custom amount. Minimum recharge: ₹100
                          </p>
                        </div>

                        {/* Custom Amount Input */}
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-6">
                          <div className="grid md:grid-cols-2 gap-4 items-center">
                            <div>
                              <div className="flex items-center mb-2">
                                <i className="fa-solid fa-pencil text-gray-400 mr-2"></i>
                                <label className="font-bold text-gray-700">Enter Custom Amount</label>
                              </div>
                              <p className="text-gray-500 text-sm">Enter any amount between ₹100 - ₹50,000</p>
                            </div>
                            <div>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 font-bold">₹</span>
                                </div>
                                <input
                                  type="number"
                                  value={rechargeAmount}
                                  onChange={(e) => setRechargeAmount(parseInt(e.target.value) || 0)}
                                  className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl font-bold text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                  placeholder="0"
                                  min="100"
                                  max="50000"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Recharge Options */}
                        <div className="mb-8">
                          <div className="flex items-center mb-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-lg mr-3">
                              <i className="fa-solid fa-bolt text-amber-500"></i>
                            </div>
                            <h6 className="font-bold text-gray-800 text-lg">Quick Recharge Options</h6>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {rechargeOptions.map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setRechargeAmount(amt)}
                                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] group ${rechargeAmount === amt
                                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg'
                                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                                  }`}
                              >
                                {/* Active indicator */}
                                {rechargeAmount === amt && (
                                  <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <i className="fa-solid fa-check text-white text-xs"></i>
                                  </div>
                                )}

                                {/* Amount */}
                                <div className="flex items-center mb-2">
                                  <span className="text-lg font-bold mr-1">₹</span>
                                  <span className={`text-3xl font-black ${rechargeAmount === amt ? 'text-orange-600' : 'text-gray-800'
                                    }`}>
                                    {amt}
                                  </span>
                                </div>

                                {/* Bonus for larger amounts */}
                                {amt >= 1000 && (
                                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${rechargeAmount === amt
                                    ? 'bg-green-500 text-white'
                                    : 'bg-green-100 text-green-700'
                                    }`}>
                                    +{(amt * 0.05).toFixed(0)} bonus
                                  </span>
                                )}

                                {/* Hover effect */}
                                <div className="absolute inset-0 rounded-2xl bg-orange-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mb-6">
                          <button
                            type="button"
                            onClick={handleRecharge}
                            disabled={isProcessing || rechargeAmount < 100}
                            className={`w-full py-5 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-between shadow-lg ${isProcessing || rechargeAmount < 100
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-orange-500 hover:to-amber-500 hover:shadow-xl hover:-translate-y-0.5'
                              }`}
                          >
                            {isProcessing ? (
                              <>
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                  <span>Processing Recharge...</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mr-4">
                                    <i className="fa-solid fa-bolt text-white text-xl"></i>
                                  </div>
                                  <div className="text-left">
                                    <div className="text-white">Recharge ₹{rechargeAmount.toLocaleString()}</div>
                                    <div className="text-white/80 text-sm font-normal">Click to proceed to payment</div>
                                  </div>
                                </div>
                                <i className="fa-solid fa-arrow-right text-xl"></i>
                              </>
                            )}
                          </button>

                          {/* Validation message */}
                          {rechargeAmount > 0 && rechargeAmount < 100 && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center">
                              <i className="fa-solid fa-exclamation-triangle text-amber-500 mr-3 text-xl"></i>
                              <div>
                                <p className="font-bold text-amber-700">Minimum recharge amount is ₹100</p>
                                <p className="text-amber-600 text-sm mt-1">Please enter ₹100 or more to proceed</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Transaction History Table */}
                      <div className="mt-0 pt-0">
                        <div className="flex items-center justify-between mb-6">
                          <h6 className="font-bold text-gray-800 text-lg flex items-center">
                            <i className="fa-solid fa-clock-rotate-left mr-3 text-orange-500 bg-orange-100 p-2 rounded-lg"></i>
                            Transaction History
                          </h6>
                          <button
                            onClick={() => setWalletView('recharge')}
                            className="text-sm font-medium text-orange-600 hover:text-orange-700"
                          >
                            <i className="fa-solid fa-arrow-left mr-1"></i> Back to Recharge
                          </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-gray-50/80 text-gray-700 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
                                <tr>
                                  <th className="px-6 py-4">Date</th>
                                  <th className="px-6 py-4">Description</th>
                                  <th className="px-6 py-4 text-center">Type</th>
                                  <th className="px-6 py-4 text-right">Amount</th>
                                  <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody className="text-sm">
                                {loadingTransactions ? (
                                  <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                      <div className="flex flex-col items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
                                        <p>Loading transactions...</p>
                                      </div>
                                    </td>
                                  </tr>
                                ) : !walletTransactions || walletTransactions.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                      <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                          <i className="fa-solid fa-receipt text-2xl text-gray-300"></i>
                                        </div>
                                        <p>No transactions found.</p>
                                      </div>
                                    </td>
                                  </tr>
                                ) : (
                                  walletTransactions.map((tx: any, idx: number) => (
                                    <tr key={tx.id || idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                      <td className="px-6 py-4 text-gray-600">
                                        <div className="font-medium text-gray-900">
                                          {new Date(tx.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                          })}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                          {new Date(tx.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800">{tx.description || tx.reason || 'Wallet Transaction'}</div>
                                        <div className="text-xs text-gray-400 mt-0.5 font-mono">#{tx.transactionId || tx.id}</div>
                                      </td>
                                      <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${tx.type === 'debit'
                                          ? 'bg-red-50 text-red-600 border border-red-100'
                                          : 'bg-green-50 text-green-600 border border-green-100'
                                          }`}>
                                          {tx.type === 'debit' ? (
                                            <><i className="fa-solid fa-arrow-up mr-1 transform rotate-45"></i> Debit</>
                                          ) : (
                                            <><i className="fa-solid fa-arrow-down mr-1 transform rotate-45"></i> Credit</>
                                          )}
                                        </span>
                                      </td>
                                      <td className={`px-6 py-4 text-right font-black text-base ${tx.type === 'debit' ? 'text-red-500' : 'text-green-500'
                                        }`}>
                                        {tx.type === 'debit' ? '-' : '+'}₹{tx.amount}
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${tx.status === 'success' ? 'text-green-600 bg-green-50' :
                                          tx.status === 'failed' ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'
                                          }`}>
                                          {tx.status || 'Success'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

            )}

            {activeTab === "history" && (
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
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-3 mb-2">
                                <div
                                  className="rounded-circle overflow-hidden"
                                  style={{ width: "48px", height: "48px", border: "2px solid #fd6410" }}
                                >
                                  <img
                                    src={session.expert?.user?.avatar || "/images/astro-img1.png"}
                                    alt={session.expert?.user?.name || "Expert"}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-1">
                                    {session.expert?.user?.name || "Expert Consultation"}
                                  </h6>
                                  <p className="text-muted small mb-0">
                                    <i className="fa-regular fa-calendar me-1"></i>
                                    {new Date(session.createdAt).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>

                              <div className="d-flex gap-2 flex-wrap mt-2">
                                <span
                                  className={`badge px-3 py-1 ${session.status === 'completed'
                                    ? 'bg-success bg-opacity-10 text-success'
                                    : session.status === 'expired'
                                      ? 'bg-warning bg-opacity-10 text-warning'
                                      : 'bg-info bg-opacity-10 text-info'
                                    }`}
                                  style={{ fontSize: "11px" }}
                                >
                                  <i className={`fa-solid ${session.status === 'completed'
                                    ? 'fa-check-circle'
                                    : session.status === 'expired'
                                      ? 'fa-clock'
                                      : 'fa-spinner'
                                    } me-1`}></i>
                                  {session.status === 'completed' ? 'Completed' : session.status === 'expired' ? 'Expired' : session.status}
                                </span>

                                {session.isFree && (
                                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1" style={{ fontSize: "11px" }}>
                                    <i className="fa-solid fa-gift me-1"></i>
                                    Free Session
                                  </span>
                                )}

                                <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-1" style={{ fontSize: "11px" }}>
                                  <i className="fa-solid fa-clock me-1"></i>
                                  {session.durationMins || 0} mins
                                </span>

                                {session.totalCost > 0 && (
                                  <span className="badge bg-dark bg-opacity-10 text-dark px-3 py-1" style={{ fontSize: "11px" }}>
                                    <i className="fa-solid fa-indian-rupee-sign me-1"></i>
                                    ₹{session.totalCost}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleViewChat(session)}
                              className="btn btn-sm text-white px-4 py-2 rounded-3 fw-bold shadow-sm"
                              style={{ backgroundColor: "#fd6410" }}
                            >
                              <i className="fa-solid fa-message me-2"></i>
                              View Chat
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}


            {activeTab === "orders" && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                  <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#f3e5f5", color: "#8e24aa" }}>
                      <i className="fa-solid fa-bag-shopping"></i>
                    </span>
                    My Orders
                  </h5>
                </div>
                <div className="card-body p-4 pt-0">
                  {loadingOrders ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted small mt-3">Loading your orders...</p>
                    </div>
                  ) : !orders || orders.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i className="fa-solid fa-box-open fa-3x text-light"></i>
                      </div>
                      <h6 className="fw-bold">No Orders Found</h6>
                      <p className="text-muted small">You haven't placed any orders yet.</p>
                      <a href="/shop" className="btn btn-outline-primary btn-sm mt-3 rounded-pill px-4">Browse Shop</a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order: any) => {
                        const isExpanded = expandedOrders[order.id]; // Default collapsed
                        return (
                          <div
                            key={order.id}
                            className="border rounded-3 p-4 hover:bg-gray-50 transition-all mb-3"
                            style={{ borderColor: "#e0e0e0" }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                {/* Header Section */}
                                <div
                                  className="d-flex align-items-center justify-content-between mb-3 cursor-pointer"
                                  onClick={() => toggleOrder(order.id)}
                                >
                                  <div>
                                    <h6 className="fw-bold mb-1">
                                      Order #{order.id}
                                    </h6>
                                    <p className="text-muted small mb-0">
                                      <i className="fa-regular fa-calendar me-1"></i>
                                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                  <div className="d-flex align-items-center gap-3">
                                    <span
                                      className={`badge px-3 py-2 rounded-pill ${order.status === 'completed' || order.status === 'paid'
                                        ? 'bg-success bg-opacity-10 text-success'
                                        : order.status === 'pending'
                                          ? 'bg-warning bg-opacity-10 text-warning'
                                          : 'bg-secondary bg-opacity-10 text-secondary'
                                        }`}
                                    >
                                      {order.status?.toUpperCase() || 'UNKNOWN'}
                                    </span>

                                    {/* Toggle Button */}
                                    <button
                                      className="btn btn-sm btn-light rounded-circle d-flex align-items-center justify-content-center border"
                                      style={{ width: '32px', height: '32px' }}
                                      onClick={(e) => { e.stopPropagation(); toggleOrder(order.id); }}
                                    >
                                      <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-muted`}></i>
                                    </button>
                                  </div>
                                </div>

                                {/* Collapsible Content */}
                                {isExpanded && (
                                  <div className="animate-in slide-in-from-top-2 duration-300">
                                    {/* Order Items */}
                                    {order.items && order.items.length > 0 && (
                                      <div className="mb-3 bg-light p-3 rounded-3">
                                        {order.items.map((item: any, idx: number) => (
                                          <div key={idx} className="d-flex align-items-center mb-2 last:mb-0">
                                            <div className="me-3 text-muted" style={{ width: "20px" }}>
                                              {item.quantity}x
                                            </div>
                                            <div className="flex-grow-1">
                                              <span className="fw-medium text-dark">{item.product?.name || "Product"}</span>
                                            </div>
                                            <div className="fw-bold">
                                              ₹{item.price}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Order Tracker UI */}
                                    <div className="mt-4 pt-3 border-top">
                                      {/* ... Tracker CSS ... */}
                                      <style dangerouslySetInnerHTML={{
                                        __html: `
                                        @keyframes shimmer {
                                          0% { background-position: -100% 0; }
                                          100% { background-position: 200% 0; }
                                        }
                                        .tracker-bar-animated {
                                          background: linear-gradient(90deg, #198754 0%, #6ee7b7 50%, #198754 100%);
                                          background-size: 200% 100%;
                                          animation: shimmer 2s infinite linear;
                                          box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
                                        }
                                        @keyframes pulse-green {
                                          0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.7); }
                                          70% { box-shadow: 0 0 0 8px rgba(25, 135, 84, 0); }
                                          100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
                                        }
                                        .step-pulse {
                                          animation: pulse-green 2s infinite;
                                        }
                                      `}} />
                                      <div className="position-relative d-flex justify-content-between text-center mx-4 my-2">
                                        {/* Progress Bar Background */}
                                        <div className="position-absolute top-50 start-0 translate-middle-y w-100 bg-light rounded-pill" style={{ height: "4px", zIndex: 0 }}></div>

                                        {/* Active Progress Bar */}
                                        <div
                                          className="position-absolute top-50 start-0 translate-middle-y rounded-pill transition-all tracker-bar-animated"
                                          style={{
                                            height: "6px",
                                            zIndex: 0,
                                            width: (() => {
                                              const s = order.status?.toLowerCase();
                                              if (s === 'delivered' || s === 'completed') return '100%';
                                              if (s === 'shipped' || s === 'dispatched') return '75%';
                                              if (s === 'packed') return '50%';
                                              if (s === 'processing' || s === 'accepted') return '25%';
                                              return '5%';
                                            })()
                                          }}
                                        ></div>

                                        {/* Steps */}
                                        {[
                                          { label: 'Placed', icon: 'fa-clipboard-check', activeStates: ['pending', 'placed', 'processing', 'packed', 'shipped', 'delivered', 'completed'] },
                                          { label: 'Packed', icon: 'fa-box-open', activeStates: ['packed', 'shipped', 'delivered', 'completed'] },
                                          { label: 'Shipped', icon: 'fa-truck-fast', activeStates: ['shipped', 'delivered', 'completed'] },
                                          { label: 'Delivered', icon: 'fa-house-circle-check', activeStates: ['delivered', 'completed'] }
                                        ].map((step, i) => {
                                          const s = order.status?.toLowerCase() || 'pending';
                                          const isCompleted = step.activeStates.includes(s);

                                          // Determine if this is the CURRENT active step (for pulsing)
                                          let isCurrent = false;
                                          if (step.label === 'Placed' && (s === 'pending' || s === 'placed' || s === 'processing')) isCurrent = true;
                                          if (step.label === 'Packed' && s === 'packed') isCurrent = true;
                                          if (step.label === 'Shipped' && (s === 'shipped' || s === 'dispatched')) isCurrent = true;
                                          if (step.label === 'Delivered' && (s === 'delivered' || s === 'completed')) isCurrent = true;

                                          return (
                                            <div key={i} className="position-relative z-10 bg-white px-2">
                                              <div
                                                className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 border-2 ${isCompleted ? 'bg-success border-success text-white' : 'bg-white border-secondary text-secondary'} ${isCurrent ? 'step-pulse' : ''}`}
                                                style={{ width: "32px", height: "32px", fontSize: "14px", transition: "all 0.3s" }}
                                              >
                                                <i className={`fa-solid ${step.icon}`}></i>
                                              </div>
                                              <p className={`small mb-0 fw-bold ${isCompleted ? 'text-success' : 'text-muted'}`} style={{ fontSize: "11px" }}>
                                                {step.label}
                                              </p>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      {order.status === 'cancelled' && (
                                        <div className="text-center mt-3 text-danger fw-bold bg-danger bg-opacity-10 p-3 rounded">
                                          <div className="mb-2">
                                            <i className="fa-solid fa-ban me-2"></i> Order Cancelled
                                          </div>
                                          {order.cancellationReason && (
                                            <div className="text-sm fw-normal text-danger mt-2 border-top border-danger border-opacity-25 pt-2">
                                              <strong>Reason:</strong> {order.cancellationReason}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
                                      <div>
                                        <span className="text-muted small">Total Amount</span>
                                        <h5 className="fw-bold text-dark mb-0">₹{order.totalAmount || order.amount}</h5>
                                      </div>
                                      {order.status === 'pending' && (
                                        <button className="btn btn-sm btn-primary rounded-pill px-4">
                                          Pay Now
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reports" && (
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
            )}

          </div>
        </div>

        {/* Chat History Modal */}
        {showChatModal && selectedSession && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              zIndex: 9999,
              backdropFilter: "blur(8px)"
            }}
            onClick={() => setShowChatModal(false)}
          >
            <div
              className="bg-white rounded-4 shadow-lg overflow-hidden"
              style={{ maxWidth: "800px", width: "90%", maxHeight: "90vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="d-flex justify-content-between align-items-center p-4 border-bottom" style={{ backgroundColor: "#fd6410" }}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle overflow-hidden"
                    style={{ width: "48px", height: "48px", border: "3px solid white" }}
                  >
                    <img
                      src={selectedSession.expert?.user?.avatar || "/images/astro-img1.png"}
                      alt={selectedSession.expert?.user?.name || "Expert"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-white">
                      {selectedSession.expert?.user?.name || "Expert Consultation"}
                    </h5>
                    <p className="small mb-0 text-white opacity-75">
                      <i className="fa-regular fa-calendar me-1"></i>
                      {new Date(selectedSession.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="btn btn-light rounded-circle p-2"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="p-4 overflow-auto" style={{ maxHeight: "60vh" }}>
                {chatMessages.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fa-solid fa-message fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No messages in this consultation</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {chatMessages.map((msg: any, index: number) => (
                      <div
                        key={msg.id || index}
                        className={`d-flex gap-3 ${msg.senderType === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div
                          className="rounded-circle overflow-hidden flex-shrink-0"
                          style={{
                            width: "40px",
                            height: "40px",
                            border: `2px solid ${msg.senderType === 'user' ? '#fd6410' : '#e0e0e0'}`
                          }}
                        >
                          <img
                            src={msg.senderType === 'user'
                              ? (profileData.profile_picture || "https://avatar.iran.liara.run/public/boy?username=User")
                              : (selectedSession.expert?.user?.avatar || "/images/astro-img1.png")
                            }
                            alt={msg.senderType}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <div className={`flex-grow-1 ${msg.senderType === 'user' ? 'text-end' : 'text-start'}`} style={{ maxWidth: "70%" }}>
                          <div
                            className={`p-3 rounded-3 ${msg.senderType === 'user'
                              ? 'bg-primary bg-opacity-10 text-dark'
                              : 'bg-light text-dark'
                              }`}
                            style={{
                              borderRadius: msg.senderType === 'user' ? "20px 20px 5px 20px" : "20px 20px 20px 5px"
                            }}
                          >
                            <p className="mb-1" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                              {msg.content}
                            </p>
                            <small className="text-muted" style={{ fontSize: "11px" }}>
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                : ''
                              }
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-top bg-light">
                <div className="d-flex gap-2 justify-content-between align-items-center">
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                      <i className="fa-solid fa-clock me-1"></i>
                      Duration: {selectedSession.durationMins || 0} mins
                    </span>
                    {selectedSession.totalCost > 0 && (
                      <span className="badge bg-dark bg-opacity-10 text-dark px-3 py-2">
                        <i className="fa-solid fa-indian-rupee-sign me-1"></i>
                        Cost: ₹{selectedSession.totalCost}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="btn btn-secondary px-4 py-2 rounded-3"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div >
  );
};

export default ProfilePage;
