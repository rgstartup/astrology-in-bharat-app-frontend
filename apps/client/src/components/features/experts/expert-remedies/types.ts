import {
  ProductGroup,
  ProductType,
  ExpertProductRelationType,
  Expert,
  Product,
  ExpertProduct,
} from "@repo/lib";

export type RemedyTabKey =
  | "reports"
  | "rituals"
  | "gemstones"
  | "books"
  | "consultations";

export interface RemedyItem {
  id: string | number;
  name: string;
  slug?: string;
  categoryName: string;
  description: string;
  shortDescription?: string;
  productGroup: ProductGroup;
  productType?: ProductType | string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  features?: string[];
  durationOrPages?: string;
  badgeText?: string;
  isPopular?: boolean;
  ctaText?: string;
  ctaLink?: string;
  relationType?: ExpertProductRelationType | string;
  inStock?: boolean;
}

export interface RemedyTabConfig {
  key: RemedyTabKey;
  label: string;
  shortLabel: string;
  sublabel: string;
  productGroup: ProductGroup;
  description: string;
  highlightTag: string;
}

export interface ExpertRemediesSectionProps {
  expertId: string;
  expertName?: string;
  expert?: Expert;
  initialProducts?: (ExpertProduct | Product | RemedyItem)[];
  initialTab?: RemedyTabKey;
}
