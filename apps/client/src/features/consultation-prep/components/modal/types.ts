"use client";

import type { useConsultationPrep } from "../../hooks/use-consultation-prep";

export type ConsultationPrepController = ReturnType<typeof useConsultationPrep>;

export type PrepExpert = NonNullable<ConsultationPrepController["expert"]>;
