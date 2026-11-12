import api from "@/api/api";
import { API_ROUTES } from "@/utils/api.routes";
import { createSafeFetchUploadInstance, type Result, ApiError } from "@repo/safe-fetch";

const uploadInstance = createSafeFetchUploadInstance()
  .extend({ credentials: "omit" });

export interface SignedUploadParams {
  signature: string;
  timestamp: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: string;
  uploadUrl: string;
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
}

export interface VerifiedUpload {
  secureUrl: string;
  publicId: string;
  [key: string]: unknown;
}

interface UploadResponse {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

/**
 * Step 1: Ask backend for signed upload params.
 * api_secret never leaves the server.
 * Returns api's native Result: { ok, data, error }.
 * Caller unwraps the { message, data } envelope via unwrap(res.data).
 */
export const getAvatarUploadSignature = async (folder?: string) => {
  return api.post<{ data: SignedUploadParams }>(
    API_ROUTES.AVATAR.UPLOAD_SIGNATURE,
    { folder },
  );
};

/**
 * Step 3: Tell backend to re-fetch the asset from storage (source of truth),
 * validate constraints, and persist secureUrl to the user record.
 */
export const verifyAvatarUpload = async (
  publicId: string,
  options?: {
    folder?: string;
    maxSizeBytes?: number;
    allowedMimeTypes?: string[];
  },
) => {
  return api.post<{ data: VerifiedUpload }>(API_ROUTES.AVATAR.VERIFY, {
    publicId: publicId,
    folder: options?.folder ?? "avatars",
    maxSizeBytes: options?.maxSizeBytes,
    allowedMimeTypes: options?.allowedMimeTypes,
  });
};

/**
 * Step 2: Upload file directly to storage (bypasses our backend entirely).
 *
 * Requires Cloudinary CORS: add the frontend origin to Cloudinary's
 * "Allowed CORS origins" (e.g. https://yourapp.com). Without this, the
 * browser blocks the cross-origin POST and fetch throws "Failed to fetch".
 */
export const uploadDirectToCloud = async (
  file: File,
  params: SignedUploadParams,
  onProgress?: (percent: number) => void,
): Promise<Result<UploadResponse>> => {
  if (!params.uploadUrl) {
    return {
      ok: false,
      error: new ApiError(0, "Upload URL is missing from signed params"),
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", params.apiKey);
  formData.append("timestamp", params.timestamp);
  formData.append("signature", params.signature);
  formData.append("folder", params.folder);
  formData.append("resource_type", params.resourceType);

  return uploadInstance.upload<UploadResponse>(params.uploadUrl, formData, {
    onUploadProgress: (progress) => {
      if (onProgress && progress.percent !== null) {
        onProgress(progress.percent);
      }
    },
  });
};
