import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Client } from "@/lib/types";
import { PATHS } from "@repo/routes";
import { HeaderTranslations } from "@repo/store";

interface IProfileDropdown {
  showProfileDropdown: boolean;
  setShowProfileDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  user: Client | null;
  handleLogout: (redirectUrl?: string) => void;
  t: HeaderTranslations;
}

const ProfileDropdown: React.FC<IProfileDropdown> = (props) => {
  const { showProfileDropdown, setShowProfileDropdown, user, t, handleLogout } =
    props;

  if (!showProfileDropdown) return null;

  return (
    <div
      className="absolute bg-white shadow-2xl rounded-2xl overflow-hidden"
      style={{
        top: "140%",
        right: "0",
        minWidth: "280px",
        zIndex: 1000,
        animation: "fadeInUp 0.3s ease-out",
        boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
        border: "1px solid rgba(242, 94, 10, 0.1)",
      }}
    >
      {/* User Header Section */}
      <div className="p-3 mb-1 bg-orange" style={{ color: "white" }}>
        <div className="flex items-center gap-3">
          <div
            className="rounded-full overflow-hidden border-2 border-white shadow-sm"
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "white",
            }}
          >
            <Image
              src={user?.avatar ?? ""}
              alt="User"
              width={50}
              height={50}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="overflow-hidden">
            <p
              className="mb-0 font-bold truncate"
              style={{
                fontSize: "16px",
                letterSpacing: "0.2px",
              }}
            >
              {user?.name || "User Name"}
            </p>
            <div className="flex items-center gap-1 opacity-90">
              <i
                className="fa-solid fa-envelope"
                style={{ fontSize: "10px" }}
              />
              <p className="mb-0 truncate" style={{ fontSize: "11px" }}>
                {user?.email || user?.phone || "Verified Profile"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <Link
          href={PATHS.PROFILE}
          className="flex items-center gap-3 px-3 py-2 no-underline text-gray-800 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all mb-1"
          onClick={() => setShowProfileDropdown(false)}
          style={{ fontSize: "14px" }}
        >
          <div
            className="rounded-full flex items-center justify-center shadow-sm bg-orange/10 text-orange"
            style={{ width: "34px", height: "34px" }}
          >
            <i className="fa-solid fa-user-circle" />
          </div>
          <span className="font-medium">{t.myProfile}</span>
        </Link>

        <Link
          href={`${PATHS.PROFILE}?tab=wallet`}
          className="flex items-center gap-3 px-3 py-2 no-underline text-gray-800 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all mb-1"
          onClick={() => setShowProfileDropdown(false)}
          style={{ fontSize: "14px" }}
        >
          <div
            className="rounded-full flex items-center justify-center shadow-sm bg-orange/10 text-orange"
            style={{ width: "34px", height: "34px" }}
          >
            <i className="fa-solid fa-wallet" />
          </div>
          <span className="font-medium">{t.myWallet}</span>
        </Link>

        <div className="my-2 border-b opacity-50 mx-2" />

        <button
          onClick={() => {
            setShowProfileDropdown(false);
            handleLogout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 border-0 bg-transparent text-red-600 rounded-xl hover:bg-red-50 transition-all"
          style={{ fontSize: "14px" }}
        >
          <div
            className="bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-sm"
            style={{ width: "34px", height: "34px" }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
          </div>
          <span className="font-bold">{t.logout}</span>
        </button>
      </div>

      <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                }`}</style>
    </div>
  );
};

export default ProfileDropdown;
