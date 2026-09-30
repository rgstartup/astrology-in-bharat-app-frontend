import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { ClientWalletTransaction } from "@repo/lib";
import { WalletTransactionTableRow } from "./WalletTransactionTableRow";

interface WalletTransactionTableProps {
  transactions: ClientWalletTransaction[];
}

export function WalletTransactionTable({
  transactions,
}: WalletTransactionTableProps) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="border-b border-slate-200 hover:bg-transparent">
            <TableHead className="w-[45%] text-xs font-bold text-slate-700">
              Transaction / Purpose
            </TableHead>
            <TableHead className="text-xs font-bold text-slate-700">
              Type
            </TableHead>
            <TableHead className="text-xs font-bold text-slate-700">
              Status
            </TableHead>
            <TableHead className="text-right text-xs font-bold text-slate-700">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx: any, idx: number) => (
            <WalletTransactionTableRow
              key={tx.id || tx._id || idx}
              tx={tx}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
