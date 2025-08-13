import type { Metadata } from "next";
import { Poppins, Outfit } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
// import BootstrapScriptLoader from "@/libs/BootstrapScriptLoader";
import "@fortawesome/fontawesome-free/css/all.min.css"; // FontAwesome
import "@/styles/style.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Astrology In Bharat",
  description: "Astrology In Bharat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
        />
      </head>
      <body className={`${outfit.variable} ${poppins.variable} `}>
        <Header />
        {children}
        <Footer />
        {/* <BootstrapScriptLoader /> */}
      </body>
    </html>
  );
}
