import { MediaSource } from "../enums/media-source.enum";

export interface Media {
  id: number;
  url: string;
  source: MediaSource;
  public_id?: string | null;
  mime_type?: string | null;
  alt_text?: string | null;
  file_name?: string | null;
  created_at: Date;
  updated_at: Date;
}
