"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@repo/design/shadcn";
import { clientAPI } from "@/actions";
import { getClientProfile, applyCoupon, getMyRewards } from "@/libs/api-profile";
import { loadRazorpay } from "@/libs/razorpay";
import { useAuthStore } from "@/store/__authStore";
import { useCartStore } from "@/store/cartStore";
import { Product, AddressDto } from "@/lib/types";
import { getErrorMessage } from "@repo/lib";

export const useCheckout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartTotal } = useCartStore();
  const { user, balance, refreshBalance } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [useSplitPayment, setUseSplitPayment] = useState(false);
  const [walletAmountToUse, setWalletAmountToUse] = useState(0);

  const [platformFee, setPlatformFee] = useState(50);

  useEffect(() => {
    const fetchPlatformFee = async () => {
      const result = await clientAPI.get<any>("/settings/platform-fee");
      if (result.ok && result.data) {
        setPlatformFee(Number(result.data.platform_fee) || 0);
      }
    };
    fetchPlatformFee();
  }, []);

  const [buyNowInfo, setBuyNowInfo] = useState<{
    productId: string;
    quantity: number;
  } | null>(null);

  const isOrder = searchParams.get("type") === "order";
  const expertName = searchParams.get("name") || "Expert";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const duration = searchParams.get("duration") || "15";
  const expertId = searchParams.get("expertId");

  useEffect(() => {
    if (isOrder) {
      const q = searchParams.toString();
      router.replace(`/shop/checkout${q ? `?${q}` : ""}`);
    }
  }, [isOrder, searchParams, router]);

  useEffect(() => {
    const fetchRewards = async () => {
      const [res, err] = await getMyRewards();
      if (!err && res) {
        setAvailableCoupons(res.data || res);
      }
    };
    fetchRewards();
  }, []);

  const baseTotal = isOrder
    ? buyNowInfo
      ? Number(directProduct?.sale_price || directProduct?.price || 0) *
      buyNowInfo.quantity
      : cartTotal
    : parseInt(searchParams.get("total") || "300");

  const shippingCharge = useMemo(() => {
    if (!isOrder) return 0;
    if (buyNowInfo && directProduct) {
      return (directProduct as any).is_shipping_chargeable ? Number((directProduct as any).shipping_charge) || 0 : 0;
    }

    // Calculate shipping per merchant for cart
    let shipping = 0;
    const merchantShippingMap = new Map<string, number>();
    cartItems.forEach((item: any) => {
      if (item.product?.is_shipping_chargeable) {
        const merchantId = item.product?.merchant_id || 'platform';
        const currentMax = merchantShippingMap.get(merchantId) || 0;
        const charge = Number(item.product?.shipping_charge) || 0;
        if (charge > currentMax) {
          merchantShippingMap.set(merchantId, charge);
        }
      }
    });

    merchantShippingMap.forEach((charge) => {
      shipping += charge;
    });

    return shipping;
  }, [isOrder, buyNowInfo, directProduct, cartItems]);

  const total = Math.max(0, baseTotal - discountAmount) + (isOrder ? platformFee + shippingCharge : 0);

  useEffect(() => {
    if (isOrder && buyNowInfo?.productId) {
      const fetchDirectProduct = async () => {
        setLoadingProduct(true);
        const result = await clientAPI.get<any>(`/products/${buyNowInfo.productId}`);

        if (!result.ok) {
          console.error("Failed to fetch product for direct buy:", result.error);
        } else if (result.data) {
          setDirectProduct(result.data.data || result.data);
        }
        setLoadingProduct(false);
      };
      fetchDirectProduct();
    }
  }, [isOrder, buyNowInfo?.productId]);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.warning("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    const sType = searchParams.get("type") || (isOrder ? "product" : "chat");

    const result = await applyCoupon(couponCode.trim(), baseTotal, sType);

    if (!result.ok) {
      console.error("Coupon Error:", result.error);
      toast.error(getErrorMessage(result.error) || "Failed to apply coupon");
      setIsApplying(false);
      return;
    }

    const data = result.data.data || result.data;
    const disc = data.discountAmount;
    const isSuccess = data.success;

    if (isSuccess && disc !== undefined) {
      setDiscountAmount(Number(disc));
      setAppliedCoupon(data.coupon || { code: couponCode });
      toast.success(data.message || `Coupon applied! You saved ₹${disc}`);
    } else {
      toast.error(
        data.message ||
        "This coupon cannot be applied to this order. Check minimum order value or expiry.",
      );
    }
    setIsApplying(false);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  const [address, setAddress] = useState<AddressDto>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "India",
    zip_code: "",
    phone: "",
    alternate_phone: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchProfileAddress = async () => {
      setLoadingProfile(true);
      const [profile, error] = await getClientProfile();
      if (!error && profile) {
        if (profile.addresses && profile.addresses.length > 0) {
          const defaultAddr = profile.addresses[0];
          setAddress({
            line1: defaultAddr.line1 || "",
            line2: defaultAddr.line2 || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            country: defaultAddr.country || "India",
            zip_code:
              defaultAddr.zip_code || defaultAddr.zipCode || "",
            phone: defaultAddr.phone || profile.phone || "",
            alternate_phone: defaultAddr.alternate_phone || "",
          });
        } else {
          setAddress(prev => ({ ...prev, phone: profile.phone || "", alternate_phone: "" }));
        }
      } else if (error) {
        console.error("Failed to load profile for address:", error);
      }
      setLoadingProfile(false);
    };

    fetchProfileAddress();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (isOrder) {
      if (
        !address.line1 ||
        !address.city ||
        !address.state ||
        !address.zip_code ||
        !address.phone
      ) {
        toast.error("Please fill in all required shipping address fields");
        return;
      }
    }

    setIsProcessing(true);

    // ── Full Wallet Payment ──
    if (paymentMethod === "wallet") {
      if (balance < total) {
        toast.error("Insufficient wallet balance. Please recharge or select another method.");
        setIsProcessing(false);
        return;
      }

      let payload: any;
      let endpoint: string;

      if (isOrder) {
        payload = {
          shipping_address: address,
          product_id: buyNowInfo ? String(buyNowInfo.productId) : undefined,
          quantity: buyNowInfo ? Number(buyNowInfo.quantity) : undefined,
          coupon_code: appliedCoupon?.code || undefined,
          payment_method: "wallet",
        };
        endpoint = "/order";
      } else {
        payload = {
          expert_name: expertName,
          expert_id: expertId ? parseInt(expertId) : undefined,
          amount: total,
          coupon_code: appliedCoupon?.code || undefined,
          type: "consultation",
        };
        endpoint = "/consultation/book-with-wallet";
      }

      const result = await clientAPI.post<any>(endpoint, payload);

      if (!result.ok) {
        console.error("Wallet Payment Error:", result.error);
        toast.error(getErrorMessage(result.error) || "Wallet payment failed. Please try again.");
      } else if (result.data) {
        toast.success(isOrder ? "Order placed successfully using wallet!" : "Consultation booked successfully!");
        refreshBalance();
        if (isOrder && !buyNowInfo) useCartStore.getState().resetCart();
        if (isOrder) {
          router.push("/client/profile?tab=orders");
        } else {
          const params = new URLSearchParams({ name: expertName });
          router.push(`/chat?${params.toString()}`);
        }
      }
      setIsProcessing(false);
      return;
    }

    // ── Split Payment (Wallet + Razorpay) ──
    if (useSplitPayment && walletAmountToUse > 0 && isOrder) {
      const razorpayAmount = total - walletAmountToUse;

      if (walletAmountToUse > balance) {
        toast.error(`Insufficient wallet balance. You have ₹${balance} but trying to use ₹${walletAmountToUse}.`);
        setIsProcessing(false);
        return;
      }
      if (razorpayAmount <= 0) {
        toast.error("Wallet amount covers full order. Please select Wallet as payment method.");
        setIsProcessing(false);
        return;
      }

      try {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          setIsProcessing(false);
          return;
        }

        // Step 1: Create order on backend (wallet portion is deducted here)
        const splitOrderPayload = {
          shipping_address: address,
          product_id: buyNowInfo ? String(buyNowInfo.productId) : undefined,
          quantity: buyNowInfo ? Number(buyNowInfo.quantity) : undefined,
          coupon_code: appliedCoupon?.code || undefined,
          payment_method: "split",
          wallet_amount_to_use: walletAmountToUse,
        };
        console.log("[CHECKOUT] Split payment order payload:", splitOrderPayload);
        const splitOrderResult = await clientAPI.post<any>("/order", splitOrderPayload);

        if (!splitOrderResult.ok) {
          toast.error(getErrorMessage(splitOrderResult.error) || "Failed to initiate split payment.");
          setIsProcessing(false);
          return;
        }

        const splitOrderData = (splitOrderResult.data as any)?.data ?? splitOrderResult.data;
        const dbOrderId = splitOrderData.id;
        const razorpayAmountDue = splitOrderData.razorpay_amount_due ?? razorpayAmount;

        // Step 2: Create Razorpay order for remaining amount
        const paymentOrderResult = await clientAPI.post<any>("/payment/orders/create", {
          amount: razorpayAmountDue,
          type: "product",
          coupon_code: undefined, // already applied
          notes: {
            is_order: true,
            order_id: dbOrderId,
            split_payment: true,
            wallet_amount_used: walletAmountToUse,
          },
        });

        if (!paymentOrderResult.ok) {
          toast.error(getErrorMessage(paymentOrderResult.error) || "Failed to create Razorpay order.");
          setIsProcessing(false);
          return;
        }

        const paymentOrderData: any = (paymentOrderResult.data as any)?.data ?? paymentOrderResult.data;
        const { id: order_id, amount, currency, key_id } = paymentOrderData || {};

        if (!order_id || !amount || !currency) throw new Error("Invalid payment order response");

        const options = {
          key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: "Astrology in Bharat",
          description: `Split Payment - ₹${walletAmountToUse} from Wallet + ₹${razorpayAmountDue} via Razorpay`,
          order_id,
          handler: async (response: any) => {
            try {
              const verifyResult = await clientAPI.post<any>("/payment/orders/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shipping_address: address,
              });
              if (!verifyResult.ok) {
                toast.error(getErrorMessage(verifyResult.error) || "Payment verification failed!");
                setIsProcessing(false);
                return;
              }
              const verifyPayload: any = (verifyResult.data as any)?.data ?? verifyResult.data;
              if (verifyPayload?.success) {
                toast.success("Order placed! ₹" + walletAmountToUse + " from wallet + ₹" + razorpayAmountDue + " via Razorpay.");
                refreshBalance();
                if (!buyNowInfo) useCartStore.getState().resetCart();
                router.push("/client/profile?tab=orders");
              } else {
                toast.error("Payment verification failed!");
              }
            } catch (err) {
              toast.error("Error verifying payment.");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: { name: user?.name || "", email: user?.email || "", contact: "" },
          theme: { color: "#fd6410" },
          modal: { ondismiss: () => { setIsProcessing(false); } },
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
        return;
      } catch (err: any) {
        toast.error(err.message || "Something went wrong with the split payment.");
        setIsProcessing(false);
        return;
      }
    }

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      let dbOrderId = null;
      if (isOrder) {
        const orderPayload = {
          shipping_address: address,
          product_id: buyNowInfo ? String(buyNowInfo.productId) : undefined,
          quantity: buyNowInfo ? Number(buyNowInfo.quantity) : undefined,
          coupon_code: appliedCoupon?.code || undefined,
        };
        console.log("[CHECKOUT] Razorpay order payload (initial):", orderPayload);
        console.info("[CHECKOUT] Final Order Payload being sent to server:", JSON.stringify(orderPayload, null, 2));
        const createOrderResult = await clientAPI.post<any>(
          "/order",
          orderPayload,
        );

        if (!createOrderResult.ok) {
          console.error("Failed to create order:", createOrderResult.error);
          toast.error(getErrorMessage(createOrderResult.error) || "Failed to create order. Please try again.");
          setIsProcessing(false);
          return;
        }

        const orderData = (createOrderResult.data as any)?.data ?? createOrderResult.data;
        dbOrderId = orderData.id;
        sessionStorage.removeItem("buyNowItem");
      }

      const paymentOrderPayload = {
        amount: total,
        type: isOrder ? "product" : "consultation",
        coupon_code: appliedCoupon?.code,
        notes: {
          expert_name: expertName,
          is_order: isOrder,
          order_id: dbOrderId,
          discount_applied: discountAmount,
        },
      };

      const orderResult = await clientAPI.post<any>(
        "/payment/orders/create",
        paymentOrderPayload,
      );

      if (!orderResult.ok) {
        console.error("Order Creation Error:", orderResult.error);
        toast.error(getErrorMessage(orderResult.error) || "Failed to create payment order.");
        setIsProcessing(false);
        return;
      }
      const orderPayloadData: any = (orderResult.data as any)?.data ?? orderResult.data;
      const { id: order_id, amount, currency, key_id } =
        orderPayloadData || {};

      if (!order_id || !amount || !currency) {
        throw new Error("Invalid payment order response");
      }

      const options = {
        key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Astrology in Bharat",
        description: isOrder
          ? "Product Purchase"
          : `Consultation with ${expertName}`,
        order_id: order_id,
        handler: async (response: any) => {
          try {
            const verifyResult = await clientAPI.post<any>(
              "/payment/orders/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shipping_address: isOrder ? address : undefined,
              },
            );

            if (!verifyResult.ok) {
              console.error("Verification error:", verifyResult.error);
              toast.error(getErrorMessage(verifyResult.error) || "Payment verification failed!");
              setIsProcessing(false);
              return;
            }

            const verifyPayload: any = (verifyResult.data as any)?.data ?? verifyResult.data;
            if (verifyPayload?.success) {
              toast.success(
                isOrder ? "Order placed successfully!" : "Payment successful!",
              );

              if (isOrder && !buyNowInfo) {
                useCartStore.getState().resetCart();
              }

              if (isOrder) {
                router.push("/client/profile?tab=orders");
              } else {
                const params = new URLSearchParams({ name: expertName });
                router.push(`/chat?${params.toString()}`);
              }
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
          name: user?.name || "",
          email: user?.email || "",
          contact: "",
        },
        theme: {
          color: "#fd6410",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(
        err.response?.data?.message || "Something went wrong with the payment.",
      );
      setIsProcessing(false);
    }
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setBuyNowInfo((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, quantity: newQty };
      sessionStorage.setItem("buyNowItem", JSON.stringify(updated));
      return updated;
    });
  };

  return {
    isOrder,
    loadingProfile,
    address,
    handleAddressChange,
    buyNowInfo,
    handleQuantityChange,
    directProduct,
    cartItems,
    expertName,
    date,
    time,
    duration,
    couponCode,
    setCouponCode,
    appliedCoupon,
    isApplying,
    availableCoupons,
    handleApplyCoupon,
    handleRemoveCoupon,
    discountAmount,
    total,
    paymentMethod,
    setPaymentMethod,
    balance,
    handlePayment,
    isProcessing,
    // Split Payment
    useSplitPayment,
    setUseSplitPayment,
    walletAmountToUse,
    setWalletAmountToUse,
    platformFee,
    shippingCharge,
  };
};
