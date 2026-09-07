"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Headset, 
  Mail, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  FileText,
  Info,
  ArrowRight,
  Send,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StatsSkeleton } from "@/components/ui/Skeleton";

interface SupportSettings {
  email: string;
  phone: string;
  whatsapp: string;
}

export default function HelpCenterPage() {
  const { data: support, isLoading } = useQuery<SupportSettings>({
    queryKey: ['support-settings'],
    queryFn: async () => {
      const res = await fetch('/api/v1/settings/support', { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch support settings");
      return res.json();
    }
  });

  const cards = [
    {
      title: "Email Support",
      value: support?.email || "support@astrologyinbharat.com",
      icon: Mail,
      actionText: "Send Email",
      href: `mailto:${support?.email || "support@astrologyinbharat.com"}`,
      color: "bg-orange-50 text-[#fd6410] border-orange-100",
      btnClass: "hover:bg-[#fd6410] hover:text-white"
    },
    {
      title: "WhatsApp",
      value: support?.whatsapp || "+91-9999999999",
      icon: MessageSquare,
      actionText: "Chat Now",
      href: `https://wa.me/${(support?.whatsapp || "+919999999999").replace(/[^0-9]/g, "")}`,
      color: "bg-green-50 text-emerald-600 border-green-100",
      btnClass: "hover:bg-emerald-600 hover:text-white"
    },
    {
      title: "Phone Support",
      value: support?.phone || "+91-9999999999",
      icon: Phone,
      actionText: "Call Now",
      href: `tel:${support?.phone || "+919999999999"}`,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      btnClass: "hover:bg-blue-600 hover:text-white"
    }
  ];

  const legalLinks = [
    { label: "Terms & Conditions", href: "/terms", icon: FileText },
    { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
    { label: "Refund Policy", href: "/refund-policy", icon: ArrowRight },
    { label: "About Us", href: "/about", icon: Info }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="w-20 h-20 bg-orange-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-[#fd6410] shadow-lg shadow-orange-900/10">
          <Headset className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Help & <span className="text-[#fd6410]">Support</span>
        </h1>
        <p className="text-gray-500 font-medium text-sm mt-2">
          We're here to help you with any questions or concerns regarding your shop
        </p>
      </div>

      {isLoading ? (
        <div className="p-8">
          <StatsSkeleton />
        </div>
      ) : (
        <>
          {/* Support Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, idx) => (
              <div 
                key={idx}
                className="group bg-white rounded-[3rem] p-10 text-center border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className={cn("inline-flex items-center justify-center p-6 rounded-3xl mb-8 group-hover:scale-110 transition-transform duration-500", card.color)}>
                  <card.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">{card.title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-8 break-all px-2">{card.value}</p>
                <a 
                  href={card.href}
                  target={card.title === "WhatsApp" ? "_blank" : undefined}
                  rel={card.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 px-8 py-3.5 bg-gray-50 text-gray-900 rounded-2xl font-semibold text-sm transition-all border border-gray-100",
                    card.btnClass
                  )}
                >
                  {card.title === "Email Support" ? <Send className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                  {card.actionText}
                </a>
                
                {/* Background Decoration */}
                <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:scale-150 transition-transform duration-700">
                  <card.icon className="w-48 h-48" />
                </div>
              </div>
            ))}
          </div>

          {/* Legal & Additional Resources */}
          <div className="bg-gray-900 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Additional Resources</h2>
                  <p className="text-white/60 text-sm font-medium">Check out our policies and guidelines</p>
                </div>
                <div className="h-[1px] md:h-12 w-12 md:w-[1px] bg-white/10" />
                <p className="max-w-md text-sm text-white/60 font-medium leading-relaxed">
                  Transparency is our priority. Feel free to review our documentation to understand how we protect your shop and data.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {legalLinks.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.href}
                    className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#fd6410]/20 rounded-xl flex items-center justify-center text-[#fd6410]">
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#fd6410] opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-5 blur-[80px] translate-y-1/2 -translate-x-1/2 rounded-full" />
          </div>
        </>
      )}
    </div>
  );
}
