import apiClient from "./apiClient";
import { Profile } from "../components/ProfileManagement/types";

export const getProfile = async () => {
    const response = await apiClient.get('/expert/profile');
    return response.data;
};

export const updateProfile = async (data: Partial<Profile>) => {
    return apiClient.patch('/expert/profile', data);
};

export const createProfile = async (data: Partial<Profile>) => {
    return apiClient.post('/expert/profile', data);
};

export const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/expert/profile/upload-document', formData);
    return response.data;
};
