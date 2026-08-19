import { api } from "../lib/api";
import { API_ROUTES } from "../lib/api-routes";
import { ApiError } from "@repo/safe-fetch";

export const HoroscopeService = {
    getDailyHoroscope: async (sign: string, lang?: string): Promise<[any | null, ApiError | null]> => {
        return await api.get(API_ROUTES.ASTROLOGY.HOROSCOPE_DAILY, {
            params: { 
                sign: sign.toLowerCase(), 
                ...(lang && { lang })
            }
        }) as any;
    }
};
