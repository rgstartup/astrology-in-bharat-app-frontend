import React from "react";
import {
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Heart,
  Briefcase,
  Coins,
  Activity,
  Gem,
  Flame,
  Clock,
  BookOpen,
  Compass,
} from "lucide-react";

export default function ExpertSeoContent({
  expertName,
}: {
  expertName: string;
}) {
  return (
    <section className="bg-slate-900 text-slate-100 py-16 mt-12 border-t border-slate-800">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="space-y-12">
          {/* Main Seeking Guidance Intro */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange/20 text-orange text-xs font-bold uppercase tracking-wider mb-3 border border-orange/30">
              <Sparkles className="size-3.5" />
              <span>Vedic Advisory Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Seeking Astrological Guidance from {expertName}
            </h2>
            <div className="mt-4 space-y-3 text-slate-300 text-sm leading-relaxed max-w-4xl">
              <p>
                Consulting a verified Vedic expert like{" "}
                <strong className="text-amber-400 font-bold">{expertName}</strong>{" "}
                can provide profound clarity during life&apos;s most confusing phases.
                Whether you are facing unexplained delays in marriage, sudden career
                hurdles, or ongoing health issues, a deep analysis of your Kundali
                (birth chart) can reveal the hidden planetary transits causing these
                blockages.
              </p>
            </div>

            {/* Scannable Advisory Benefit Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <Compass className="size-4.5 text-orange mb-2" />
                <h4 className="font-bold text-white text-xs sm:text-sm">Kundali Root-Cause Analysis</h4>
                <p className="text-xs text-slate-300 mt-1">Identify planetary transits causing delays in career, marriage, or health.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <Clock className="size-4.5 text-orange mb-2" />
                <h4 className="font-bold text-white text-xs sm:text-sm">Favorable Timing (Dashas)</h4>
                <p className="text-xs text-slate-300 mt-1">Align key decisions with auspicious planetary periods for maximum success.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/60">
                <Sparkles className="size-4.5 text-orange mb-2" />
                <h4 className="font-bold text-white text-xs sm:text-sm">Actionable Vedic Remedies</h4>
                <p className="text-xs text-slate-300 mt-1">Customized gemstone, mantra, and ritual solutions to restore balance.</p>
              </div>
            </div>
          </div>

          {/* Session Preparation Box */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange/10 to-amber-500/5 border border-amber-500/30 p-5 sm:p-6 rounded-2xl">
            <h3 className="text-base sm:text-lg font-black text-amber-400 mb-2 flex items-center gap-2">
              <BookOpen className="size-5 text-orange" />
              <span>Preparing for Your Consultation Session</span>
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              To get the most accurate predictions, please ensure you have your exact{" "}
              <strong className="text-white">Date of Birth, Time of Birth, and Place of Birth</strong>{" "}
              ready. If you don&apos;t know your exact time of birth, let the
              astrologer know at the beginning of the session so they can perform
              Birth Time Rectification (Prashna Kundali). Keep a pen and paper handy
              to note down specific remedies, lucky dates, or mantras!
            </p>
          </div>

          {/* Top Questions You Can Ask Grid */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-6 flex items-center gap-2">
              <HelpCircle className="size-6 text-orange" />
              <span>Key Questions You Can Ask {expertName}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Love & Relationships */}
              <div className="h-full flex flex-col justify-start bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl hover:border-orange/40 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <Heart className="size-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Love & Relationships
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li>&ldquo;When will I get married?&rdquo;</li>
                  <li>&ldquo;Is my current partner my soulmate?&rdquo;</li>
                  <li>&ldquo;How can I overcome Manglik Dosha?&rdquo;</li>
                  <li>&ldquo;Will my ex come back into my life?&rdquo;</li>
                </ul>
              </div>

              {/* Career & Business */}
              <div className="h-full flex flex-col justify-start bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl hover:border-orange/40 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Briefcase className="size-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Career & Business
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li>&ldquo;When is the best time to switch jobs?&rdquo;</li>
                  <li>&ldquo;Will a business partnership be lucky?&rdquo;</li>
                  <li>&ldquo;Why am I facing delays in promotion?&rdquo;</li>
                  <li>&ldquo;Should I pursue higher studies abroad?&rdquo;</li>
                </ul>
              </div>

              {/* Wealth & Finance */}
              <div className="h-full flex flex-col justify-start bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl hover:border-orange/40 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Coins className="size-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Wealth & Finance
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li>&ldquo;What are the yogas for wealth in my Kundali?&rdquo;</li>
                  <li>&ldquo;When will I be able to buy my own house?&rdquo;</li>
                  <li>&ldquo;How can I clear my debts faster?&rdquo;</li>
                  <li>&ldquo;Is stock market investment safe for me?&rdquo;</li>
                </ul>
              </div>

              {/* Health & Well-being */}
              <div className="h-full flex flex-col justify-start bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl hover:border-orange/40 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Activity className="size-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Health & Well-being
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li>&ldquo;Why am I facing continuous health issues?&rdquo;</li>
                  <li>&ldquo;When will I get relief from mental stress?&rdquo;</li>
                  <li>&ldquo;Are there any challenging planetary periods ahead?&rdquo;</li>
                </ul>
              </div>

              {/* Remedies & Gemstones */}
              <div className="h-full flex flex-col justify-start bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl hover:border-orange/40 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Gem className="size-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Remedies & Gemstones
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li>&ldquo;Which gemstone is best suited for my Lagna?&rdquo;</li>
                  <li>&ldquo;What daily mantras should I chant for peace?&rdquo;</li>
                  <li>&ldquo;Which Rudraksha should I wear for success?&rdquo;</li>
                </ul>
              </div>

              {/* Dosha & Rituals */}
              <div className="h-full flex flex-col justify-start bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl hover:border-orange/40 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-xl bg-orange/20 text-orange flex items-center justify-center shrink-0">
                    <Flame className="size-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm">
                    Dosha & Ceremonies
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li>&ldquo;Do I have Kaal Sarp or Pitra Dosha in my chart?&rdquo;</li>
                  <li>&ldquo;Which deity should I worship for prosperity?&rdquo;</li>
                  <li>&ldquo;What specific remedies can clear negativity?&rdquo;</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confidentiality & Security Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-start gap-4">
            <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="font-black text-white text-base">
                100% Secure & Confidential
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                We strictly adhere to privacy standards. All your chats and calls
                with the astrologer are end-to-end encrypted. Your personal phone
                number is masked through our telephony system and is never shared
                directly.
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-6">
              Frequently Asked Questions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                <h4 className="font-bold text-amber-400 text-sm mb-1.5">
                  How do I start a consultation?
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Simply click the &ldquo;Start Chat&rdquo;, &ldquo;Voice Call&rdquo;, or &ldquo;Video Call&rdquo;
                  button on the expert&apos;s profile. You will be prompted to recharge
                  your wallet if your balance is low. Once connected, billing is calculated on a per-minute basis.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                <h4 className="font-bold text-amber-400 text-sm mb-1.5">
                  What happens if my call gets disconnected?
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  If the call drops due to network issues, your wallet deduction
                  stops immediately. You can reconnect instantly to resume your
                  conversation from where you left off.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                <h4 className="font-bold text-amber-400 text-sm mb-1.5">
                  Can I ask multiple questions in one session?
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Yes! Once connected, you are free to discuss as many topics as
                  you need—career, marriage, business, or remedies. The astrologer
                  answers everything within your active session time.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/70">
                <h4 className="font-bold text-amber-400 text-sm mb-1.5">
                  Are all astrologers verified?
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Yes. Every astrologer on Astrology In Bharat goes through a
                  multi-stage verification process including background credentials,
                  scriptural knowledge, and predictive accuracy tests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
