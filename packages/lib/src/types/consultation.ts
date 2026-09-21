import { PaginatedResponse } from "./paginated.response";

export interface IConsultationTopic {
  id: number;
  title: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface IConsultationTopicResponse extends PaginatedResponse<IConsultationTopic> {}
