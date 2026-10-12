"use client";

import type { useChatPrep } from "../../hooks/use-chat-prep";

export type ChatPrepController = ReturnType<typeof useChatPrep>;

export type PrepExpert = NonNullable<ChatPrepController["expert"]>;
