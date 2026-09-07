"use client";

import { PATHS } from "@repo/routes";
import { headerTranslations, useLanguageStore } from "@repo/store";
import { useRouter } from "next/navigation";

interface AuthCTAProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ButtonProps {
  text: string;
  action: () => void;
}

const SignInButton = (props: ButtonProps) => {
  return (
    <button
      onClick={props.action}
      className="flex-1 bg-orange text-white py-2 rounded-xl font-bold border-0"
    >
      {props.text}
    </button>
  );
};

const SignUpButton = (props: ButtonProps) => {
  return (
    <button
      onClick={props.action}
      className="flex-1 bg-white/10 border border-white/20 text-white py-2 rounded-xl font-bold"
    >
      {props.text}
    </button>
  );
};

const AuthCTA = (props: AuthCTAProps) => {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const t = headerTranslations[lang] || headerTranslations.en;

  const signInAction = () => {
    props.setIsMenuOpen(false);
    router.push(PATHS.SIGN_IN);
  };

  const signInText = t.signIn || "Sign In";
  const signUpText = t.register || "Register";

  const signUpAction = () => {
    props.setIsMenuOpen(false);
    router.push(PATHS.REGISTER);
  };

  return (
    <div className="flex gap-2 px-3 py-2">
      <SignInButton action={signInAction} text={signInText} />
      <SignUpButton action={signUpAction} text={signUpText} />
    </div>
  );
};

export default AuthCTA;
