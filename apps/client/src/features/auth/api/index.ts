export { loginAction } from "./login.action";
export { resendOtpAction } from "./resend-otp.action";
export { registerAction } from "./register.action";
export { verifyOtpAction } from "./verify-otp.action";

// Re-export auth domain types for consumers of this feature's public API.
export type {
  LoginFormData,
  RegisterFormData,
  VerifyOtpFormData,
  AuthActionResponse,
} from "@/lib/types";
