import { api as http } from "@/lib/api";

export interface State {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  state_id: string;
}

export const fetchStates = async (): Promise<State[]> => {
  const [data, error] = await http.get<State[]>("/locations/states");
  if (error) {
    console.warn("⚠️ Failed to fetch states:", error);
    return [];
  }
  return data || [];
};

export const fetchDistricts = async (stateId: string): Promise<District[]> => {
  if (!stateId) return [];
  const [data, error] = await http.get<District[]>(`/locations/districts?state_id=${stateId}`);
  if (error) {
    console.warn("⚠️ Failed to fetch districts:", error);
    return [];
  }
  return data || [];
};
