"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import ChatPrepModal from "./chat-prep-modal.component";

export default function ConsultationPrepPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <ChatPrepModal
      expertId={id}
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    />
  );
}
