"use client";

import Link from "next/link";
import CalculatorMenu from "../calculator-menu";

interface MobileSubMenuProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMobileSubMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showMobileSubMenu: boolean;
}

const MobileSubMenu = (props: MobileSubMenuProps) => {
  const closeMenu = () => {
    props.setIsMenuOpen(false);
    props.setShowMobileSubMenu(false);
  };

  if (!props.showMobileSubMenu) return null;

  return (
    <ul
      className="list-none pl-3 pb-2"
      style={{
        borderLeft: "3px solid var(--primary-color, #e67e22)",
      }}
    >
      {CalculatorMenu().map((item) => (
        <li
          key={item.href}
          className="py-2.5 border-b border-white/5 last:border-0 ml-4"
        >
          <Link
            href={item.href}
            className="no-underline text-white/70 hover:text-orange transition-all"
            style={{ fontSize: "14px" }}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MobileSubMenu;
