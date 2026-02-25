import { Inter } from 'next/font/google'
import "@/styles/index.css"
import { AuthInitializer } from '@/components/layout/AuthInitializer'
import { cookies } from "next/headers";

const inter = Inter({ subsets: ['latin'] })

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CLIENT_API_URL } from '@/lib/config';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let initialUser = null;

  if (accessToken) {
    try {
      const response = await fetch(`${CLIENT_API_URL}/expert`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const text = await response.text();
        if (text) {
          try {
            const data = JSON.parse(text);
            // Construct full user object like the store does
            initialUser = { ...data.user, ...data, profileId: data.id };

            // Final sanity check for expert role
            const isExpert = initialUser?.roles?.some(
              (r: any) => (typeof r === 'string' ? r : r.name).toUpperCase() === "EXPERT"
            );

            if (!isExpert) {
              initialUser = null;
            }
          } catch (e) {
            console.error("Failed to parse astrologer profile JSON:", e);
          }
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


