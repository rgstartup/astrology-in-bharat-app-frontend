export interface WalletRechargePack {
  amount: number;
  label: string;
  bonus?: number;
  popular?: boolean;
}

export const WALLET_RECHARGE_PACKS: WalletRechargePack[] = [
  { amount: 100, label: "₹100" },
  { amount: 250, label: "₹250" },
  { amount: 500, label: "₹500", popular: true, bonus: 25 },
  { amount: 1000, label: "₹1,000", bonus: 100 },
  { amount: 2000, label: "₹2,000", bonus: 300 },
];
