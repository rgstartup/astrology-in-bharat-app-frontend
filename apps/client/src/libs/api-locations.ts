import { clientAPI } from "@/actions";

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
  const result = await clientAPI.get<State[]>("/locations/states");
  if (!result.ok) {
    console.warn("⚠️ Failed to fetch states:", result.error);
    return [];
  }
  return result.data || [];
};

export const fetchDistricts = async (stateId: string): Promise<District[]> => {
  if (!stateId) return [];
  const result = await clientAPI.get<District[]>(`/locations/districts?state_id=${stateId}`);
  if (!result.ok) {
    console.warn("⚠️ Failed to fetch districts:", result.error);
    return [];
  }
  return result.data || [];
};
