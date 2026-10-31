export {
  loginAction,
  resendOtpAction,
  registerAction,
  verifyOtpAction,
} from "./api";
export type {
  LoginFormData,
  RegisterFormData,
  VerifyOtpFormData,
  AuthActionResponse,
} from "./api";

export {
  GoogleLoginButton,
  type GoogleLoginButtonProps,
} from "./components/GoogleLoginButton.component";
export {
  OtpVerification,
  type OtpVerificationProps,
} from "./components/OtpVerification.component";

export { default as SignInForm, default as LoginForm } from "./components/signin";
export { default as SignUpForm, default as RegisterForm } from "./components/signup";

export { default as TopExpertsSection } from "./components/TopExpertsSection";
export { ShowcaseCard } from "./components/ShowcaseCard";
export { AuthHeader } from "./components/AuthHeader";

export { useGoogleLogin } from "@/hooks/use-google-login";
