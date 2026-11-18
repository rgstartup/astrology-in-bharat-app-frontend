import { IExpert } from "@repo/lib";
import { PaginationMeta } from "@repo/lib";

/**
 * Response format returned by the expert API envelope instance.
 * For paginated endpoints, returns { data: T[], meta: PaginationMeta }.
 */
export interface IFetchExpertsResponse {
  data: IExpert[];
  meta: PaginationMeta;
}
