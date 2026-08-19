import { api, ApiError } from "./api";
import { Profile, Todo } from "@/types/profile";

export const getProfile = async (): Promise<[any | null, ApiError | null]> => {
    const [res, error] = await api.get('/expert');
    if (error) return [null, error];
    const data = (res as any)?.data ?? res;
    return [data, null];
};

export const updateProfile = async (data: Partial<Profile>): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert', data);
};

export const createProfile = async (data: Partial<Profile>): Promise<[any | null, ApiError | null]> => {
    return api.post<any>('/expert', data);
};

export const uploadDocument = async (file: File): Promise<[any | null, ApiError | null]> => {
    const formData = new FormData();
    formData.append('file', file);

    // Use relative URL so auth cookies are included automatically
    const [res, error] = await api.post(`/expert/upload-file`, formData);
    if (error) return [null, error];
    const data = (res as any)?.data ?? res;
    return [data, null];
};

/** Max video file size: 50MB */
export const MAX_VIDEO_SIZE_MB = 50;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

/**
 * Upload large files (videos) DIRECTLY to backend - bypasses Vercel 4.5MB serverless limit.
 * Steps:
 *  1. Client-side size check (50MB max) with clear error
 *  2. Fetch access token from server-side route (reads httpOnly cookie)
 *  3. Upload FormData directly to backend URL with Bearer token
 */
export const uploadVideo = async (file: File): Promise<[any | null, ApiError | null]> => {
    // 1. Client-side size check
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        return [null, new ApiError(413, `File too large (${sizeMB}MB). Maximum allowed size is ${MAX_VIDEO_SIZE_MB}MB.`)];
    }

    try {
        // 2. Get auth token from server-side (reads httpOnly cookie)
        const tokenRes = await fetch('/api/get-upload-token', { credentials: 'include' });
        if (!tokenRes.ok) {
            return [null, new ApiError(401, 'Session expired. Please login again.')];
        }
        const { token } = await tokenRes.json();

        // 3. Upload DIRECTLY to backend - completely bypasses Vercel
        const backendUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543/api/v1')
            .replace(/\/+$/, '');

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${backendUrl}/expert/upload-file`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            const msg = json?.message || (res.status === 413 ? `File too large. Max ${MAX_VIDEO_SIZE_MB}MB allowed.` : 'Upload failed');
            return [null, new ApiError(res.status, msg)];
        }

        const data = json?.data ?? json;
        return [data, null];
    } catch (err: any) {
        return [null, new ApiError(0, err?.message || 'Network error during upload')];
    }
};



// Segmented Updates
export const updatePersonalInfo = async (data: any): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert/personal-info', data);
};

export const updatePricing = async (data: any): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert/pricing', data);
};

export const updateExpertStatus = async (isAvailable: boolean): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert/status', { is_available: isAvailable });
};

export const updateBankDetails = async (bankDetails: string): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert/bank-details', { bank_details: bankDetails });
};

export const updatePortfolio = async (data: any): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert/portfolio', data);
};

export const updateCertificates = async (certificates: string[]): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert/certificates', { certificates });
};

export const updateDocuments = async (documents: any[]): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert/documents', { documents });
};

export const updateExperience = async (experience: any[]): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>('/expert/experience', { detailed_experience: experience });
};

// Bank Account APIs
export const getBankAccounts = async (): Promise<[any | null, ApiError | null]> => {
    const [res, error] = await api.get('/expert/bank-accounts');
    if (error) return [null, error];
    const data = (res as any)?.data ?? res;
    return [data, null];
};

export const addBankAccount = async (data: any): Promise<[any | null, ApiError | null]> => {
    const [res, error] = await api.post<any>('/expert/bank-accounts', data);
    if (error) return [null, error];
    const respData = (res as any)?.data ?? res;
    return [respData, null];
};

export const updateBankAccount = async (id: string, data: any): Promise<[any | null, ApiError | null]> => {
    const [res, error] = await api.patch<any>(`/expert/bank-accounts/${id}`, data);
    if (error) return [null, error];
    const respData = (res as any)?.data ?? res;
    return [respData, null];
};

export const deleteBankAccount = async (id: string): Promise<[any | null, ApiError | null]> => {
    return api.delete<any>(`/expert/bank-accounts/${id}`);
};

export const setPrimaryBankAccount = async (id: string): Promise<[any | null, ApiError | null]> => {
    return api.patch<any>(`/expert/bank-accounts/${id}/set-primary`);
};

// Todo APIs
export const getTodos = async (): Promise<[Todo[] | null, ApiError | null]> => {
    const [res, error] = await api.get('/expert/todos');
    if (error) return [null, error];
    const data = ((res as any)?.data ?? res) as Todo[];
    return [data, null];
};

export const createTodo = async (text: string): Promise<[Todo | null, ApiError | null]> => {
    const [res, error] = await api.post<any>('/expert/todos', { text });
    if (error) return [null, error];
    const data = ((res as any)?.data ?? res) as Todo;
    return [data, null];
};

export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<[Todo | null, ApiError | null]> => {
    const [res, error] = await api.patch<any>(`/expert/todos/${id}`, updates);
    if (error) return [null, error];
    const data = ((res as any)?.data ?? res) as Todo;
    return [data, null];
};

export const deleteTodoApi = async (id: string): Promise<[any | null, ApiError | null]> => {
    return api.delete<any>(`/expert/todos/${id}`);
};

// Puja APIs
export const upsertPujaApi = async (data: any, id?: string): Promise<[any | null, ApiError | null]> => {
    const url = id ? `/expert/puja?id=${id}` : '/expert/puja';
    const [res, error] = await api.post(url, data);
    if (error) return [null, error];
    const respData = (res as any)?.data ?? res;
    return [respData, null];
};

export const deletePujaApi = async (id: string): Promise<[any | null, ApiError | null]> => {
    return api.delete<any>(`/expert/puja/${id}`);
};
