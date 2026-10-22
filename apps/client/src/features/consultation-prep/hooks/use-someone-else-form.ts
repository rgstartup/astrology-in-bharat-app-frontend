"use client";

import { useState } from "react";
import { type SomeoneElseData } from "@/actions/chat";

const EMPTY_SOMEONE_ELSE: SomeoneElseData = {
  name: "",
  gender: "",
  dob: "",
  tob: "",
  pob: "",
};

/**
 * "Consult on behalf of someone else" member-details form state.
 */
export function useSomeoneElseForm() {
  const [askSomeoneElse, setAskSomeoneElse] = useState(true);
  const [someoneElseData, setSomeoneElseData] =
    useState<SomeoneElseData>(EMPTY_SOMEONE_ELSE);

  return { askSomeoneElse, setAskSomeoneElse, someoneElseData, setSomeoneElseData };
}
