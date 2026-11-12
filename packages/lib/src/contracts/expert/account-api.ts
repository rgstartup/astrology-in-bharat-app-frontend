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

export interface ExpertConsultationPricing {
  id: string;
  call_price: number | null;
  video_call_price: number | null;
  chat_price: number | null;
}

export interface ExpertAccount {
  id: string;
  name: string | null;
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
