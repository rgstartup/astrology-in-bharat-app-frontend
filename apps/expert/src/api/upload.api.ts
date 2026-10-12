"use client";

import { createSafeFetchUploadInstance } from "@repo/safe-fetch";

const uploadApi = createSafeFetchUploadInstance({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
});

export default uploadApi;
