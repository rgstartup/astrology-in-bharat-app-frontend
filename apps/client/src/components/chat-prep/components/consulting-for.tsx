"use client";

import { useTranslations } from "next-intl";
import type { SomeoneElseData } from "@/actions/chat";

type Props = {
  askSomeoneElse: boolean;
  setAskSomeoneElse: (val: boolean) => void;
  someoneElseData: SomeoneElseData;
  setSomeoneElseData: (val: SomeoneElseData) => void;
};

const inputClass =
  "w-full px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:border-[#FF5500] outline-none text-sm font-medium text-slate-900 transition-colors";

const labelClass =
  "text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block";

const ConsultingFor = ({
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
}: Props) => {
  const tx = useTranslations("Chat.expertPreview");
  const set = (patch: Partial<SomeoneElseData>) =>
    setSomeoneElseData({ ...someoneElseData, ...patch });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-full">
        {(
          [
            { value: true, label: tx("myself") },
            { value: false, label: tx("someoneElse") },
          ] as const
        ).map((opt) => (
          <button
            key={opt.label}
            type="button"
            aria-pressed={askSomeoneElse === opt.value}
            onClick={() => setAskSomeoneElse(opt.value)}
            className={`py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              askSomeoneElse === opt.value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {!askSomeoneElse && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
          <div>
            <label className={labelClass}>{tx("fullName")}</label>
            <input
              type="text"
              placeholder={tx("enterName")}
              value={someoneElseData.name}
              onChange={(e) => set({ name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{tx("gender")}</label>
              <select
                value={someoneElseData.gender}
                onChange={(e) => set({ gender: e.target.value })}
                className={inputClass}
              >
                <option value="">{tx("select")}</option>
                <option value="male">{tx("male")}</option>
                <option value="female">{tx("female")}</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{tx("birthDate")}</label>
              <input
                type="date"
                value={someoneElseData.dob}
                onChange={(e) => set({ dob: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{tx("birthTime")}</label>
              <input
                type="time"
                value={someoneElseData.tob}
                onChange={(e) => set({ tob: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{tx("birthPlace")}</label>
              <input
                type="text"
                placeholder={tx("cityCountry")}
                value={someoneElseData.pob}
                onChange={(e) => set({ pob: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultingFor;
