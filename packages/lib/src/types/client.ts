import { Media } from "./media";

export interface Client {
  id: string;
  public_id?: string;
  /**
   * @deprecated uid has been renamed to public_id
   */
  uid?: string;
  is_blocked: boolean;
  name: string;
  email: string;
  /**
   * @deprecated avatar is soon to be deprecated. Use avatar_media instead.
   */
  avatar?: string;
  avatar_media?: Media | null;
  date_of_birth: string;
  gender: string;
  phone: string;
  phone_verified_at: Date;
  preferences: any;
  language_preference: any;
  time_of_birth: string;
  place_of_birth: string;
  marital_status: string;
  occupation: string;
  about_me: string;
  total_spending: number;
  status: string;
  created_at: string;
  updated_at: string;
}
