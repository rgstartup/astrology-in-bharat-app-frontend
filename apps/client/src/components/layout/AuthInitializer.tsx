
"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

interface IAuthInitializer {
    children: React.ReactNode,
}

export const AuthInitializer = ({ children }: IAuthInitializer) => {

    const init = useAuthStore((state) => state.init);

    useEffect(() => {
        init();
    }, []);

    return <>{children}</>;
};
