import Image from "next/image";
import Link from "next/link";
import React from "react";

const Featured4Cards = () => {
  return (
    <div className="row mt-2">
      <div className="col-sm-3 col-6">
        <Link href="/our-astrologers">
          <div className="card-hero text-center">
            <Image
              src="/images/icon1.png"
              alt="Live Chat"
              width={60}
              height={60}
              className="mx-auto"
            />
            <h5>Live Chat Support</h5>
            <p className="color-light">
              Get instant answers from expert astrologers through live chat
              sessions.
            </p>
          </div>
        </Link>
      </div>

      <div className="col-sm-3 col-6">
        <Link href="/our-astrologers">
          <div className="card-hero flex flex-col items-center text-center">
            <Image src="/images/icon2.png" alt="Speak" width={60} height={60} />
            <h5 className="mt-2">Speak with Astrologer</h5>
            <p className="color-light">
              Connect via phone call for personal guidance on your life
              questions.
            </p>
          </div>
        </Link>
      </div>

      <div className="col-sm-3 col-6">
        <Link href="/buy-products">
          <div className="card-hero flex flex-col items-center text-center">
            <Image src="/images/icon3.png" alt="Store" width={60} height={60} />
            <h5 className="mt-2">Astrology Product Store</h5>
            <p className="color-light">
              Shop gemstones, yantras, and spiritual items recommended by
              experts.
            </p>
          </div>
        </Link>
      </div>

      <div className="col-sm-3 col-6">
        <Link href="/online-puja">
          <div className="card-hero flex flex-col items-center text-center">
            <Image src="/images/icon4.png" alt="Pooja" width={60} height={60} />
            <h5 className="mt-2">Book A Pooja</h5>
            <p className="color-light">
              Book religious ceremonies & rituals performed by experienced
              priests.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Featured4Cards;
