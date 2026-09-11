import { api } from "@/actions";
import { IPaginatedSpecializationResponse } from "@repo/lib";

export async function fetchSpecializations() {
  return api.get<IPaginatedSpecializationResponse>("/expert/specializations");
}

export default fetchSpecializations;
