import { apiV2 } from "@/actions";
import { Specialization } from "@repo/lib";

export async function fetchSpecializations() {
  return apiV2.get<Specialization[]>("/expert/specializations");
}

export default fetchSpecializations;
