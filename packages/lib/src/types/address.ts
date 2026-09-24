import { AddressTag } from "../enums";

export interface Address {
  id?: number;
  line1: string;
  line2?: string;
  house_no?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  pincode?: string;
  is_primary?: boolean;
  tag?: AddressTag;
}
