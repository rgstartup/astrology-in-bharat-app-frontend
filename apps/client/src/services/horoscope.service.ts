import { clientAPI, API_ROUTES } from "@/actions";
import { ApiError } from "@repo/safe-fetch";

export const HoroscopeService = {
    getDailyHoroscope: async (sign: string, lang?: string) => {
        return await clientAPI.get(API_ROUTES.ASTROLOGY.HOROSCOPE_DAILY, {
            params: { 
                sign: sign.toLowerCase(), 
                ...(lang && { lang })
            }
        });
    }
};
