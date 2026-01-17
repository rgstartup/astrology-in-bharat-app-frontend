import { apiClient } from "@packages/ui/src/context/ClientAuthContext";

export interface ClientProfileData {
    id?: number;
    userId?: number;
    full_name?: string;
    username?: string;
    date_of_birth?: string;
    time_of_birth?: string;
    place_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    preferences?: string;
    language_preference?: string;
    profile_picture?: string;
    addresses?: AddressDto[];
}

export interface AddressDto {
    id?: number;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    tag?: string;
}

export const getClientProfile = async () => {
    const response = await apiClient.get('/client');
    return response.data;
};

export const updateClientProfile = async (data: Partial<ClientProfileData>) => {
    const response = await apiClient.patch('/client', data);
    return response.data;
};

export const createClientProfile = async (data: Partial<ClientProfileData>) => {
    const response = await apiClient.post('/client', data);
    return response.data;
};

export const uploadClientDocument = async (file: File): Promise<{ url: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/client/upload-document', formData);
    return response.data;
};

export default apiClient;
