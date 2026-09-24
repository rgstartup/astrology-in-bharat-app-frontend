import { UserStatusEnum } from "../enums";
import { Address } from "./address";
import { Media } from "./media";

export interface ClientPreferences {
  languages?: string[];
  topics?: number[];
  specializations?: (string | number)[];
  professions?: number[];
  communication_channel?: "chat" | "call" | "both";
  receive_daily_panchang?: boolean;
  [key: string]: unknown;
}

export interface Client {
  id: string;
  public_id: string | null;
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
  avatar_media: Media | null;
  date_of_birth: string | null;
  time_of_birth: string | null;
  place_of_birth: string | null;
  gender: IGender;
  phone: string;
  phone_verified_at: Date;
  marital_status: string | null;
  occupation: string | null;
  about_me: string | null;
  total_spending: number;
  status: UserStatusEnum;
  preferences: ClientPreferences;
  addresses: Address[] | null;
  created_at: string;
  updated_at: string;
}

export type IGender = "male" | "female" | "other";
