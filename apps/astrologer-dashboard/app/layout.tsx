import { Inter } from 'next/font/google'
import "@/styles/index.css"
import { AuthInitializer } from '@/components/layout/AuthInitializer'
import { cookies } from "next/headers";

const inter = Inter({ subsets: ['latin'] })

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const cleanApiBase = API_URL.replace(/\/api\/v1\/?$/, "");

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let initialUser = null;

  if (accessToken) {
    try {
      const response = await fetch(`${cleanApiBase}/api/v1/expert`, {
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Construct full user object like the store does
        initialUser = { ...data.user, ...data, profileId: data.id };

        // Final sanity check for expert role
        const isExpert = initialUser?.roles?.some(
          (r: any) => (typeof r === 'string' ? r : r.name).toUpperCase() === "EXPERT"
        );

        if (!isExpert) {
          initialUser = null;
          // Note: Middleware usually handles redirection, but safety first
        }
      }
    } catch (error) {
      console.error("Error fetching astrologer profile server-side:", error);
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer initialUser={initialUser}>
          {children}
          <ToastContainer position="top-right" />
        </AuthInitializer>
      </body>
    </html>
  )
}


