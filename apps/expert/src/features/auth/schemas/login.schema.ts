import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  otp: z.string().optional(),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
