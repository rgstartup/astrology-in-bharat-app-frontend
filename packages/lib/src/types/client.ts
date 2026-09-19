import { UserStatusEnum } from "../enums";
import { Media } from "./media";

export interface ClientPreferences {
  languages?: string[];
  topics?: number[];
  specializations?: number[];
  professions?: number[];
  communication_channel?: "chat" | "call" | "both";
  receive_daily_panchang?: boolean;
  [key: string]: unknown;
}

export interface Client {
  id: string;
  public_id?: string;
  /**
   * @deprecated uid has been renamed to public_id
   */
  uid?: string;
  is_blocked: boolean;
  name: string;
  first_name: string;
  last_name: string | null;
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
  time_of_birth: string;
  place_of_birth: string;
  marital_status: string;
  occupation: string;
  about_me: string;
  total_spending: number;
  status: UserStatusEnum;
  preferences: ClientPreferences;
  created_at: string;
  updated_at: string;
}
