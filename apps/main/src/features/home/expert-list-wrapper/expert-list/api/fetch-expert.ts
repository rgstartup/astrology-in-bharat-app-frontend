import { Expert } from "@repo/lib";

export interface IFetchExpertsResponse {
  data: Expert[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    total: number;
  };
}
