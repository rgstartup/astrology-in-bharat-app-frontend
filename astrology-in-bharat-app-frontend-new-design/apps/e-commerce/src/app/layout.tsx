import { Poppins, Outfit } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@repo/styles";
import { Footer, Header } from "@repo/ui";
import { CartProvider } from "@/context/CartContext";
import CartModal from "@/components/CartModal";
import FloatingCartButton from "@/components/FloatingCartButton";

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

export const metadata = {
  title: "Astrology E-Commerce",
  description: "Shop premium astrology products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-white text-black font-pl">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartModal />
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
