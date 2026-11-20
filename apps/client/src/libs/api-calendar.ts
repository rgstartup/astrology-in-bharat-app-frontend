import { clientAPI } from "@/actions";
import { getErrorMessage } from '@repo/lib';

export interface CalendarDay {
  date: string;       // ISO format: YYYY-MM-DD
  dayName: string;    // Monday, Tuesday, etc.
  festivals?: string[]; // Array of vrat/festival names, if any
}

export interface PanchangData {
  tithi: { name: string; start: string; end: string };
  nakshatra: { name: string; start: string; end: string };
  karana: { name: string; start: string; end: string };
  yoga: { name: string; start: string; end: string };
  shubhMuhurat: { abhijit?: { start: string; end: string }; brahma?: { start: string; end: string } };
  ashubhMuhurat: { rahuKalam: { start: string; end: string }; yamaganda: { start: string; end: string } };
  sunrise: string;
  sunset: string;
  moonrise: string;
}

export interface FestivalItem {
  name: string;
  date: string;
  description?: string;
}

export const getMonthlyCalendar = async (
  year: number,
  month: number,
  lat: string = '28.6139',
  lon: string = '77.2090',
  lang: string = 'hi'
): Promise<{ success: boolean; data: CalendarDay[]; error?: string }> => {
  try {
    const query = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
      lat,
      lon,
      lang,
    });

    const result = await clientAPI.get<any>(`/calendar/monthly?${query.toString()}`, { cache: 'no-store' } as any);

    if (!result.ok) {
      console.warn(`[API Calendar] Fetch monthly warning:`, getErrorMessage(result.error));
      return { success: false, data: [], error: 'failed_to_fetch' };
    }

    return { success: true, data: result.data?.data || result.data || [] };
  } catch (error: any) {
    console.error(`[API Calendar] Fetch monthly error:`, error);
    return { success: false, data: [], error: 'failed_to_fetch' };
  }
};

export const getDailyPanchang = async (
  date: string,
  lat: string = '28.6139',
  lon: string = '77.2090',
  lang: string = 'hi'
): Promise<{ success: boolean; data: PanchangData | null; error?: string }> => {
  try {
    const query = new URLSearchParams({ date, lat, lon, lang });
    const result = await clientAPI.get<any>(`/calendar/panchang/daily?${query.toString()}`, { cache: 'no-store' } as any);

    if (!result.ok) {
      console.warn(`[API Calendar] Fetch daily panchang warning:`, getErrorMessage(result.error));
      return { success: false, data: null, error: 'failed_to_fetch' };
    }

    return { success: true, data: result.data?.data || result.data || null };
  } catch (error: any) {
    console.error(`[API Calendar] Fetch daily panchang error:`, error);
    return { success: false, data: null, error: 'failed_to_fetch' };
  }
};

export const getYearlyFestivals = async (
  year: number,
  lang: string = 'hi'
): Promise<{ success: boolean; data: FestivalItem[]; error?: string }> => {
  try {
    const query = new URLSearchParams({ year: year.toString(), lang });
    const result = await clientAPI.get<any>(`/calendar/festivals?${query.toString()}`, { cache: 'no-store' } as any);

    if (!result.ok) {
      console.warn(`[API Calendar] Fetch yearly festivals warning:`, getErrorMessage(result.error));
      return { success: false, data: [], error: 'failed_to_fetch' };
    }

    return { success: true, data: result.data?.data || result.data || [] };
  } catch (error: any) {
    console.error(`[API Calendar] Fetch yearly festivals error:`, error);
    return { success: false, data: [], error: 'failed_to_fetch' };
  }
};

export const getFestivalDetails = async (
  name: string,
  lang: string = 'hi'
): Promise<{ success: boolean; data: any; error?: string }> => {
  try {
    const query = new URLSearchParams({ name, lang });
    const result = await clientAPI.get<any>(`/calendar/festival-details?${query.toString()}`, { cache: 'no-store' } as any);

    if (!result.ok) {
      console.warn(`[API Calendar] Fetch festival details warning:`, getErrorMessage(result.error));
      return { success: false, data: null, error: 'failed_to_fetch' };
    }

    return { success: true, data: result.data?.data || result.data || null };
  } catch (error: any) {
    console.error(`[API Calendar] Fetch festival details error:`, error);
    return { success: false, data: null, error: 'failed_to_fetch' };
  }
};
