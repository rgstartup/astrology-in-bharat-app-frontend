// "use server";

import { api } from "@/actions";
import { AuthService } from "@/services/auth.service";
import {
  getClientProfile,
  updateClientProfile as updateClientProfileBase,
} from "@/libs/api-profile";

/**
 * Client Dashboard SafeFetch API Client
 * All requests return [data, error] tuples.
 */

export async function fetchClientProfile() {
  return AuthService.fetchProfile();
}

export async function updateClientProfile(payload: any) {
  return updateClientProfileBase(payload);
}

export async function fetchBirthAstrologyDetails(params: {
  datetime: string;
  lat: string | number;
  lon: string | number;
}) {
  const query = new URLSearchParams({
    datetime: params.datetime,
    lat: String(params.lat),
    lon: String(params.lon),
  });
  return api.get<any>(`/astrology/birth-details?${query.toString()}`);
}

export async function fetchActiveClientConsultation() {
  return api.get<any>("/chat/sessions/active-client");
}

export async function fetchDailyHoroscope(sign: string, lang: string = "en") {
  const effectiveSign = (sign || "gemini").toLowerCase();
  return api.get<any>(
    `/astrology/horoscope-daily?sign=${effectiveSign}&lang=${lang}`,
  );
}

export async function fetchRecommendedExperts(
  limit: number = 4,
  sort: string = "rating",
) {
  return api.get<any>(`/expert/account/list?limit=${limit}&sort=${sort}`);
}

export async function fetchRecentKundliReports() {
  return api.get<any>("/astrology/my-kundli-reports");
}

export async function fetchConsultationHistory(limit?: number) {
  const url = limit
    ? `/consultations/history?limit=${limit}`
    : "/consultations/history";
  return api.get<any>(url);
}

export async function fetchMyOrders(limit?: number) {
  const url = limit ? `/orders/my-orders?limit=${limit}` : "/orders/my-orders";
  return api.get<any>(url);
}

export async function fetchWalletBalance() {
  return AuthService.fetchBalance();
}
