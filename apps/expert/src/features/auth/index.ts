// components
export { AuthHeader } from "./components/AuthHeader";
export { AuthFooter, type AuthFooterProps } from "./components/AuthFooter";
export { GoogleLoginButton, type GoogleLoginButtonProps } from "./components/GoogleLoginButton";
export { ExpertShowcaseCard } from "./components/ExpertShowcaseCard";
export {
  BrandingStats,
  BrandingStatsSkeleton,
  BrandingStatsView,
  type BrandingStatsData,
} from "./components/BrandingStats";
export { LoginForm, type LoginFormProps } from "./components/LoginForm";
export { RegisterForm, type RegisterFormProps } from "./components/RegisterForm";
export { OtpVerification, type OtpVerificationProps } from "./components/OtpVerification";

// actions
export {
  loginAction,
  type ILoginResponse,
  type LoginActionError,
  type LoginActionResult,
} from "./actions/login.action";
export {
  registerAction,
  type IRegisterResponse,
  type RegisterActionError,
  type RegisterActionResult,
} from "./actions/register.action";

// schemas
export { RegisterSchema, type RegisterFormData } from "./schemas/register.schema";
export { LoginSchema, type LoginFormData } from "./schemas/login.schema";

// hooks
export { useGoogleLogin } from "./hooks/useGoogleLogin";

