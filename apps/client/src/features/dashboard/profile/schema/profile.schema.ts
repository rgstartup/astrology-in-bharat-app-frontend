import { z } from "zod";

export const profileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  last_name: z
    .string()
    .trim()
    .max(50, "Last name must be less than 50 characters")
    .nullable()
    .optional(),
  email: z.email("Invalid email address").nullable().optional(),
  phone: z.string().nullable().optional(),
  gender: z.enum(["male", "female", "other"] as const),
  date_of_birth: z.string().nullable().optional(),
  time_of_birth: z.string().nullable().optional(),
  place_of_birth: z.string().nullable().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
