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

    // Bypass Next.js proxy for file uploads to avoid proxy timeouts (30s limit on Vercel/Next)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6543/api/v1';
    const [res, error] = await api.post(`${backendUrl}/expert/upload-file`, formData);
    if (error) return [null, error];
    const data = (res as any)?.data ?? res;
    return [data, null];
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
