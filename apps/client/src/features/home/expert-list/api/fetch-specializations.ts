import { clientAPI } from "@/actions";
import { IPaginatedSpecializationResponse } from "@repo/lib";

export async function fetchSpecializations() {
  return clientAPI.get<IPaginatedSpecializationResponse>("/expert/specializations");
}

export default fetchSpecializations;
