import { clientAPI, API_ROUTES } from "@/actions";
import { AuthService } from "@/services/auth.service";
import { updateClientProfile as updateClientProfileBase } from "@/libs/api-profile";
import { PaginatedExpertResponse } from "@repo/lib";

/**
 * Client Dashboard SafeFetch API Client
 * All requests return envelope results ({ ok, data, error, meta }).
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
  return clientAPI.get<any>(`/astrology/birth-details?${query.toString()}`);
}

/**
 * @deprecated Legacy `/chat` REST. Migrate to a canonical
 * `GET /client/chat/active` once the backend exposes it; do not add new callers.
 */
export async function fetchActiveClientConsultation() {
  return clientAPI.get<any>("/chat/sessions/active-client");
}

export async function fetchDailyHoroscope(sign: string, lang: string = "en") {
  const effectiveSign = (sign || "gemini").toLowerCase();
  return clientAPI.get<any>(`/astrology/horoscope-daily?sign=${effectiveSign}&lang=${lang}`);
}

export async function fetchRecommendedExperts(limit: number = 4, sort: string = "rating") {
  return clientAPI.get<PaginatedExpertResponse>(`${API_ROUTES.EXPERTS.LIST}?limit=${limit}&sort=${sort}`);
}

export async function fetchRecentKundliReports() {
  return clientAPI.get<any>("/astrology/my-kundli-reports");
}

export async function fetchConsultationHistory(limit?: number) {
  const url = limit ? `/consultations/history?limit=${limit}` : "/consultations/history";
  return clientAPI.get<any>(url);
}

export async function fetchMyOrders(limit?: number) {
  const url = limit ? `/orders/my-orders?limit=${limit}` : "/orders/my-orders";
  return clientAPI.get<any>(url);
}

export async function fetchWalletBalance() {
  return AuthService.fetchBalance();
}
