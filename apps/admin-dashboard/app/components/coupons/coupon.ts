export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: "active" | "inactive" | "expired";
  createdBy: string;
}



