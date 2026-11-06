"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "@/i18n";
import { useSearchParams } from "next/navigation";
import { toast } from "@repo/design/shadcn";
import { getClientProfile } from "@/libs/api-profile";
import { loadRazorpay } from "@/libs/razorpay";
import { useAuthStore } from "@/store/authStore";
import { useShopStore } from "../stores/shop.store";
import { ShopOrderService } from "../services/shop-order.service";
import { ShopProductService } from "../services/shop-product.service";
import type { Product } from "@repo/lib";
import { getErrorMessage, type CartItem } from "@repo/lib";
import { getProductPrice } from "../utils/product-adapter";

interface ShopShippingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone: string;
  alternate_phone?: string;
}

export const useShopCheckout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { cartItems, cartTotal, platformFee, resetCart } = useShopStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [buyNowInfo, setBuyNowInfo] = useState<{
    productId: string;
    quantity: number;
  } | null>(null);

  // Read buyNow state from query params or sessionStorage
  useEffect(() => {
    const urlProductId = searchParams.get("productId");
    const urlQuantity = searchParams.get("quantity");

    if (urlProductId) {
      setBuyNowInfo({
        productId: urlProductId,
        quantity: parseInt(urlQuantity || "1", 10),
      });
    } else {
      const stored = sessionStorage.getItem("buyNowItem");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setBuyNowInfo(parsed);
        } catch (e) {
          console.error("Error parsing buyNowItem:", e);
        }
      }
    }
  }, [searchParams]);

  // Fetch product for direct buy
  useEffect(() => {
    if (buyNowInfo?.productId) {
      setLoadingProduct(true);
      ShopProductService.getProductById(buyNowInfo.productId).then((prod) => {
        setDirectProduct(prod);
        setLoadingProduct(false);
      });
    }
  }, [buyNowInfo?.productId]);

  // Address
  const [address, setAddress] = useState<ShopShippingAddress>({
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
    const fetchAddress = async () => {
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
            zip_code: defaultAddr.zip_code || defaultAddr.zipCode || "",
            phone: defaultAddr.phone || profile.phone || "",
            alternate_phone: defaultAddr.alternate_phone || "",
          });
        } else {
          setAddress((prev: ShopShippingAddress) => ({
            ...prev,
            phone: profile.phone || "",
          }));
        }
      }
      setLoadingProfile(false);
    };
    fetchAddress();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev: ShopShippingAddress) => ({ ...prev, [name]: value }));
  };

  // Calculations
  const baseTotal = buyNowInfo
    ? (Number(getProductPrice(directProduct!) || 0) *
        buyNowInfo.quantity)
    : cartTotal;

  const shippingCharge = useMemo(() => {
    if (buyNowInfo && directProduct) {
      const variant = directProduct.variants?.[0];
      const fulfillment = variant?.fulfillment;
      return fulfillment?.shipping_fee || 0;
    }

    let shipping = 0;
    const merchantShippingMap = new Map<string, number>();
    cartItems.forEach((item: any) => {
      if (item.product?.is_shipping_chargeable) {
        const merchantId = item.product?.merchant_id || "platform";
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
  }, [buyNowInfo, directProduct, cartItems]);

  const total =
    Math.max(0, baseTotal - discountAmount) + platformFee + shippingCharge;

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.warning("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    const [res, error] = await ShopOrderService.applyCoupon(
      couponCode.trim(),
      baseTotal,
    );

    if (error) {
      toast.error(getErrorMessage(error) || "Failed to apply coupon");
      setIsApplying(false);
      return;
    }

    const data = res.data || res;
    const disc = data.discountAmount;
    if (data.success && disc !== undefined) {
      setDiscountAmount(Number(disc));
      setAppliedCoupon(data.coupon || { code: couponCode });
      toast.success(data.message || `Coupon applied! Saved ₹${disc}`);
    } else {
      toast.error(
        data.message || "This coupon cannot be applied to this order.",
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

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setBuyNowInfo((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, quantity: newQty };
      sessionStorage.setItem("buyNowItem", JSON.stringify(updated));
      return updated;
    });
  };

  // Pure Razorpay Payment Flow — ZERO WALLET
  const handlePayment = async () => {
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

    setIsProcessing(true);

    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Please check connection.");
        setIsProcessing(false);
        return;
      }

      // Step 1: Create Order in DB
      const orderPayload = {
        shipping_address: address,
        product_id: buyNowInfo ? String(buyNowInfo.productId) : undefined,
        quantity: buyNowInfo ? Number(buyNowInfo.quantity) : undefined,
        coupon_code: appliedCoupon?.code || undefined,
      };

      const [createOrderRes, createError] =
        await ShopOrderService.createOrder(orderPayload);

      if (createError) {
        toast.error(getErrorMessage(createError) || "Failed to create order.");
        setIsProcessing(false);
        return;
      }

      const orderData = (createOrderRes as any)?.data ?? createOrderRes;
      const dbOrderId = orderData.id;
      sessionStorage.removeItem("buyNowItem");

      // Step 2: Create Razorpay Order
      const [orderRes, orderError] = await ShopOrderService.createPaymentOrder({
        amount: total,
        type: "product",
        coupon_code: appliedCoupon?.code,
        notes: {
          is_order: true,
          order_id: dbOrderId,
          discount_applied: discountAmount,
        },
      });

      if (orderError) {
        toast.error(getErrorMessage(orderError) || "Payment initiation failed.");
        setIsProcessing(false);
        return;
      }

      const orderPayloadData: any = (orderRes as any)?.data ?? orderRes;
      const { id: order_id, amount, currency, key_id } =
        orderPayloadData || {};

      if (!order_id || !amount || !currency) {
        throw new Error("Invalid payment order response");
      }

      const options = {
        key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Astrology in Bharat Shop",
        description: "Product Purchase",
        order_id,
        handler: async (response: any) => {
          try {
            const [verifyRes, verifyError] =
              await ShopOrderService.verifyPaymentOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shipping_address: address,
              });

            if (verifyError) {
              toast.error(
                getErrorMessage(verifyError) || "Verification failed!",
              );
              setIsProcessing(false);
              return;
            }

            const verifyPayload: any = (verifyRes as any)?.data ?? verifyRes;
            if (verifyPayload?.success) {
              toast.success("Order placed successfully!");
              if (!buyNowInfo) resetCart();
              router.push("/shop/orders");
            } else {
              toast.error("Payment verification failed!");
            }
          } catch {
            toast.error("Error verifying payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: address.phone || "",
        },
        theme: {
          color: "#111111", // Charcoal per Intercom-Airbnb design
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong during checkout.");
      setIsProcessing(false);
    }
  };

  return {
    address,
    loadingProfile,
    handleAddressChange,
    buyNowInfo,
    directProduct,
    loadingProduct,
    handleQuantityChange,
    cartItems,
    couponCode,
    setCouponCode,
    appliedCoupon,
    isApplying,
    handleApplyCoupon,
    handleRemoveCoupon,
    discountAmount,
    shippingCharge,
    platformFee,
    total,
    handlePayment,
    isProcessing,
  };
};
