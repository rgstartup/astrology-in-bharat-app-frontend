import { Link } from "@/i18n/navigation";
import Image from "next/image";

const CompanyLogo = () => {
  return (
    <Link
      className="flex-shrink-0 mr-2 sm:mr-4 w-[130px] sm:w-[170px] lg:w-[190px] flex items-center"
      href="/"
    >
      <Image
        src="/images/web-logo.png"
        alt="logo"
        width={190}
        height={50}
        loading="eager"
        priority
        quality={100}
        unoptimized
        style={{ width: "100%", height: "auto", maxHeight: "42px" }}
        className="object-contain"
      />
    </Link>
  );
};

export default CompanyLogo;
