import { apiV2 } from "@/actions";
import { IPaginatedSpecializationResponse } from "@repo/lib";

export async function fetchSpecializations() {
  return apiV2.get<IPaginatedSpecializationResponse>("/expert/specializations");
}

export default fetchSpecializations;
