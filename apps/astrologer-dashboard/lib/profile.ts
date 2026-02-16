import apiClient from "./apiClient";
import { Profile, Todo } from "../components/ProfileManagement/types";

export const getProfile = async () => {
    const response = await apiClient.get('/expert');
    return response.data;
};

export const updateProfile = async (data: Partial<Profile>) => {
    return apiClient.patch('/expert', data);
};

export const createProfile = async (data: Partial<Profile>) => {
    return apiClient.post('/expert', data);
};

export const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/expert/upload-document', formData);
    return response.data;
};

// Segmented Updates
export const updatePersonalInfo = async (data: any) => {
    return apiClient.patch('/expert/personal-info', data);
};

export const updatePricing = async (data: any) => {
    return apiClient.patch('/expert/pricing', data);
};

export const updateBankDetails = async (bankDetails: string) => {
    return apiClient.patch('/expert/bank-details', { bank_details: bankDetails });
};

export const updatePortfolio = async (data: any) => {
    return apiClient.patch('/expert/portfolio', data);
};

export const updateCertificates = async (certificates: string[]) => {
    return apiClient.patch('/expert/certificates', { certificates });
};

export const updateDocuments = async (documents: any[]) => {
    return apiClient.patch('/expert/documents', { documents });
};

export const updateExperience = async (experience: any[]) => {
    return apiClient.patch('/expert/experience', { detailed_experience: experience });
};

// Bank Account APIs
export const getBankAccounts = async () => {
    const response = await apiClient.get('/expert/bank-accounts');
    return response.data;
};

export const addBankAccount = async (data: any) => {
    const response = await apiClient.post('/expert/bank-accounts', data);
    return response.data;
};

export const updateBankAccount = async (id: string, data: any) => {
    const response = await apiClient.patch(`/expert/bank-accounts/${id}`, data);
    return response.data;
};

export const deleteBankAccount = async (id: string) => {
    const response = await apiClient.delete(`/expert/bank-accounts/${id}`);
    return response.data;
};

export const setPrimaryBankAccount = async (id: string) => {
    const response = await apiClient.patch(`/expert/bank-accounts/${id}/set-primary`);
    return response.data;
};

// Todo APIs
export const getTodos = async (): Promise<Todo[]> => {
    const response = await apiClient.get('/expert/todos');
    return response.data;
};

export const createTodo = async (text: string): Promise<Todo> => {
    const response = await apiClient.post('/expert/todos', { text });
    return response.data;
};

export const updateTodo = async (id: number, updates: Partial<Todo>): Promise<Todo> => {
    const response = await apiClient.patch(`/expert/todos/${id}`, updates);
    return response.data;
};

export const deleteTodoApi = async (id: number) => {
    return apiClient.delete(`/expert/todos/${id}`);
};


