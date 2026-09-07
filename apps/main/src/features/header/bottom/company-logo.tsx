import Link from "next/link";
import Image from "next/image";

const CompanyLogo = () => {
  return (
    <Link
      className="flex-shrink-0 mr-2 sm:mr-4 w-[160px] sm:w-[210px] lg:w-[240px] flex items-center"
      href="/"
    >
      <Image
        src="/images/web-logo.png"
        alt="logo"
        width={240}
        height={80}
        loading="eager"
        priority
        quality={100}
        unoptimized
        style={{ width: "100%", height: "auto", maxHeight: "65px" }}
        className="object-contain"
      />
    </Link>
  );
};

export default CompanyLogo;
