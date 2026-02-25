import apiClient from "./apiClient";
import { Profile, Todo } from "../components/ProfileManagement/types";

export const getProfile = async () => {
    const response = await apiClient.get<any>('/expert');
    return response;
};

export const updateProfile = async (data: Partial<Profile>) => {
    return apiClient.patch<any>('/expert', data);
};

export const createProfile = async (data: Partial<Profile>) => {
    return apiClient.post<any>('/expert', data);
};

export const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response: any = await apiClient.upload('/expert/upload-file', formData);
    return response;
};

// Segmented Updates
export const updatePersonalInfo = async (data: any) => {
    return apiClient.patch<any>('/expert/personal-info', data);
};

export const updatePricing = async (data: any) => {
    return apiClient.patch<any>('/expert/pricing', data);
};

export const updateBankDetails = async (bankDetails: string) => {
    return apiClient.patch<any>('/expert/bank-details', { bank_details: bankDetails });
};

export const updatePortfolio = async (data: any) => {
    return apiClient.patch<any>('/expert/portfolio', data);
};

export const updateCertificates = async (certificates: string[]) => {
    return apiClient.patch<any>('/expert/certificates', { certificates });
};

export const updateDocuments = async (documents: any[]) => {
    return apiClient.patch<any>('/expert/documents', { documents });
};

export const updateExperience = async (experience: any[]) => {
    return apiClient.patch<any>('/expert/experience', { detailed_experience: experience });
};

// Bank Account APIs
export const getBankAccounts = async () => {
    const response = await apiClient.get<any>('/expert/bank-accounts');
    return response;
};

export const addBankAccount = async (data: any) => {
    const response = await apiClient.post<any>('/expert/bank-accounts', data);
    return response;
};

export const updateBankAccount = async (id: string, data: any) => {
    const response = await apiClient.patch<any>(`/expert/bank-accounts/${id}`, data);
    return response;
};

export const deleteBankAccount = async (id: string) => {
    const response = await apiClient.delete<any>(`/expert/bank-accounts/${id}`);
    return response;
};

export const setPrimaryBankAccount = async (id: string) => {
    const response = await apiClient.patch<any>(`/expert/bank-accounts/${id}/set-primary`);
    return response;
};

// Todo APIs
export const getTodos = async (): Promise<Todo[]> => {
    const response = await apiClient.get<any>('/expert/todos');
    return response;
};

export const createTodo = async (text: string): Promise<Todo> => {
    const response = await apiClient.post<any>('/expert/todos', { text });
    return response;
};

export const updateTodo = async (id: number, updates: Partial<Todo>): Promise<Todo> => {
    const response = await apiClient.patch<any>(`/expert/todos/${id}`, updates);
    return response;
};

export const deleteTodoApi = async (id: number) => {
    return apiClient.delete<any>(`/expert/todos/${id}`);
};
