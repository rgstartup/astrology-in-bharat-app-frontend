import React from "react";
import { JewelrySet } from "./types";
import {
    GiRing,
    GiDiamonds,
    GiNecklace,
    GiWristwatch,
    GiGoldBar,
} from "react-icons/gi";

export const premiumStyles = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-soft {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  @keyframes glitter {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
  .animate-glitter { animation: glitter 2s ease-in-out infinite; }
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(48, 17, 24, 0.1);
  }
  .text-burgundy { color: #301118; }
  .bg-burgundy { background-color: #301118; }
  .border-burgundy { border-color: #301118; }
  .text-gold { color: #d4af37; }
`;

export const cars = [
    "Maruti Alto",
    "Ford Endeavour",
    "Tata Tiago",
    "Maruti Swift Dzire",
    "Hyundai Verna",
    "Honda City",
    "Toyota Fortuner",
    " Hyundai i20",
    "Mahindra Scorpio",
    "Range Rover",
    "Hummer H2",
    "Mercedes Benz C-Class",
    "BMW 3 Series",
    "Audi A4",
    "Maruti Baleno",
    "Hyundai Creta",
    "Hummer H4",
    "Toyota Innova",
    "Mahindra Thar",
    "Skoda Superb"
];

export const jewelrySets: JewelrySet[] = [
    {
        name: "Classic Gold Set",
        items: ["3 Gold Rings", "2 Gold Chains", "1 Gold Watch"],
        icon: <GiRing className="text-[#d4af37]" size = { 20} />
    },
    {
        name: "Platinum Elegance",
        items: ["2 Platinum Rings", "2 Gold Chains", "1 Gold Bracelet"],
        icon: <GiDiamonds className="text-gray-300" size = { 20} />
    },
    {
        name: "Diamond Royalty",
        items: ["2 Gold Chains", "2 Diamond Rings", "1 Gold Ring", "1 Gold Kada"],
        icon: <GiDiamonds className="text-blue-300" size = { 20} />
    },
    {
        name: "Traditional Set",
        items: ["1 Heavy Gold Necklace", "2 Gold Bangles", "3 Gold Rings", "Gold Earrings"],
        icon: <GiNecklace className="text-[#d4af37]" size = { 20} />
    },
    {
        name: "Modern Collection",
        items: ["1 Platinum Watch", "2 Diamond Studs", "Gold Chain with Pendant", "2 Gold Rings"],
        icon: <GiWristwatch className="text-gray-300" size = { 20} />
    },
    {
        name: "Royal Heritage",
        items: ["Gold Crown", "2 Diamond Necklaces", "4 Gold Bangles", "3 Gold Rings"],
        icon: <GiGoldBar className="text-[#d4af37]" size = { 20} />
    },
    {
        name: "Minimalist Set",
        items: ["1 Gold Chain", "1 Gold Ring", "Gold Bracelet", "Simple Earrings"],
        icon: <GiRing className="text-[#d4af37]" size = { 20} />
    },
    {
        name: "Festive Collection",
        items: ["Heavy Gold Necklace", "2 Gold Armlets", "3 Gold Rings", "Nose Ring", "Anklet"],
        icon: <GiNecklace className="text-[#d4af37]" size = { 20} />
    },
    {
        name: "Business Executive",
        items: ["Rolex Watch", "2 Platinum Rings", "Gold Chain", "Cufflinks"],
        icon: <GiWristwatch className="text-gray-600" size = { 20} />
    },
    {
        name: "Wedding Set",
        items: ["Mangalsutra", "2 Gold Chains", "4 Gold Bangles", "3 Rings", "Gold Earrings"],
        icon: <GiDiamonds className="text-[#d4af37]" size = { 20} />
    }
];

export const landProperties = [
    "20 Marla Plot in City",
    "300 Marla Agricultural Land",
    "150 Bigha Farm Land",
    "10 Acre Orchard",
    "50 Marla Commercial Plot",
    "2000 Sq.Yd Residential Plot",
    "5 Acre Resort Land",
    "100 Marla Farm House Land",
    "75 Bigha Plantation Land",
    "15 Acre Industrial Plot",
    "40 Marla Villa Plot",
    "500 Marla Farmland",
    "25000 Bigha Garden Land ",
    "8 Acre Lake View Property",
    "60 Marla Hill View Plot",
    "120 Bigha Agricultural Field",
    "35 Marla Beach Front Land",
    "200 Acre Forest Land",
    "80 Marla City Center Plot",
    "250 Bigha Tea Estate"
];
