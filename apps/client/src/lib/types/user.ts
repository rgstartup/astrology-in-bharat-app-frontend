import type { Media } from "@repo/lib";

export interface User {
  id: string;
  public_id?: string;
  name: string;
  first_name?: string;
  last_name?: string | null;
  email: string;
  roles?: string[];
  /** @deprecated Soon to be deprecated. Use avatar_media instead */
  avatar?: string;
  avatar_media?: Media | null;
  phone?: string;
}

export interface Client {
  id: string;
  public_id?: string;
  /** @deprecated uid has been renamed to public_id */
  uid?: string;
  name: string;
  first_name?: string;
  last_name?: string | null;
  email: string;
  /** @deprecated Soon to be deprecated. Use avatar_media instead */
  avatar?: string;
  avatar_media?: Media | null;
  phone?: string;
}
