import "@/styles/index.css"
import { AuthInitializer } from '@/components/layout/AuthInitializer'
import { SocketConnectionManager } from '@/components/layout/SocketConnectionManager';
import { cookies } from "next/headers";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CLIENT_API_URL } from '@/lib/config';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

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
            // data could be the full profile or a stub {id: null, user: {...}}
            const userData = data.user || {};
            const combinedData = { ...userData, ...data };

            initialUser = { 
              ...combinedData,
              profileId: data.id,
              userId: data.user_id || data.userId || userData.id
            };

            // Roles can be on the top-level data or on data.user
            const roles: any[] = combinedData.roles || userData.roles || [];
            const isExpert = roles.some(
              (r: any) => (typeof r === 'string' ? r : r?.name || '').toUpperCase() === "EXPERT"
            );

            if (!isExpert) {
              initialUser = null;
            }
          } catch (e) {
            console.error("Failed to parse expert profile JSON:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching expert profile server-side:", error);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <ReactQueryProvider>
          <AuthInitializer initialUser={initialUser}>
            <SocketConnectionManager />
            {children}
            <ToastContainer position="top-right" />
            <ToastContainer containerId="notification" position="bottom-right" />
          </AuthInitializer>
        </ReactQueryProvider>
      </body>
    </html>
  )
}


