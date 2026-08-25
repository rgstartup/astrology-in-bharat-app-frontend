"use client";

interface HamburgerButtonProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HamburgerButton = (props: HamburgerButtonProps) => {
  const baseSpanClass = `block w-5 h-0.5 bg-gray-700 transition-all`;

  return (
    <button
      className="ml-auto lg:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 border-2 border-orange/50 bg-[#FAE8D6] hover:border-orange hover:bg-[#F2D9C1] transition-all"
      type="button"
      onClick={() => props.setIsMenuOpen(!props.isMenuOpen)}
      aria-label="Toggle navigation"
    >
      <span
        className={`${baseSpanClass} ${props.isMenuOpen ? "rotate-45 translate-y-[8px] bg-orange" : ""}`}
      />
      <span
        className={`${baseSpanClass} ${props.isMenuOpen ? "opacity-0" : ""}`}
      />
      <span
        className={`${baseSpanClass} ${props.isMenuOpen ? "-rotate-45 -translate-y-[8px] bg-orange" : ""}`}
      />
    </button>
  );
};

export default HamburgerButton;
