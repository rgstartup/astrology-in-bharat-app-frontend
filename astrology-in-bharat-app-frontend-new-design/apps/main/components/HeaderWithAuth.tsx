"use client";
import { Header } from "@repo/ui";
import { useAuth } from "@/context/AuthContext";

export default function HeaderWithAuth() {
    const { logout, isAuthenticated, user } = useAuth();

    // Map context user to Header's UserProfile format
    const userProfile = user ? {
        id: user.id,
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }
    } : null;

    return <Header onLogout={logout} isAuthenticated={isAuthenticated} userProfile={userProfile} />;
}
