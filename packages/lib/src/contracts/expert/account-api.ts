/**
 * Expert Account (Profile) API Response Contracts
 *
 * Mirrors backend ExpertAccountResponseDto
 * (src/internal/actors/expert/account/dto/response/expert-account-response.dto.ts)
 */

export interface ExpertAvatarMedia {
  id: string;
  public_id: string | null;
  url: string;
}

export interface ExpertIntroVideoMedia {
  id: string;
  public_id: string | null;
  url: string;
}

export interface ExpertProfessionItem {
  id: string;
  profession_id: string;
  title: string;
  slug: string;
  icon: string | null;
  is_primary: boolean;
}

export interface ExpertSpecializationItem {
  id: string;
  title: string;
  slug: string;
}

/** Profession available for selection (from GET /professions list). */
export interface ProfessionItem {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
}

/** Specialization available for selection (from GET /expert/specializations/available). */
export interface SpecializationItem {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ExpertConsultationPricing {
  id: string;
  call_price: number | null;
  video_call_price: number | null;
  chat_price: number | null;
}

export interface ExpertAccount {
  id: string;
  name: string | null;
  gender: string | null;
  about: string | null;
  languages: string | null;
  avatar: string | null;
  avatar_id: number | null;
  intro_video: string | null;
  intro_video_id: number | null;
  experience_in_years: number;
  avatar_media: ExpertAvatarMedia | null;
  intro_video_media: ExpertIntroVideoMedia | null;
  professions: ExpertProfessionItem[];
  specializations: ExpertSpecializationItem[];
  pricing: ExpertConsultationPricing | null;
}

export interface ExpertAccountResponse {
  success: boolean;
  data: ExpertAccount;
  message?: string;
}
