import apiClient from "./apiClient";
import { Profile } from "../components/ProfileManagement/types";

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
