// Example: How to use the API client in your components/pages

import apiClient from './apiClient';

// Example 1: Fetching data
export const fetchExperts = async () => {
    try {
        const response = await apiClient.get('/expert/profile/list', {
            params: {
                limit: 20,
                offset: 0,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching experts:', error);
        throw error;
    }
};

// Example 2: Posting data
export const updateProfile = async (profileData: any) => {
    try {
        const response = await apiClient.put('/user/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

// Example 3: Deleting data
export const deleteItem = async (itemId: string) => {
    try {
        const response = await apiClient.delete(`/items/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

// Example 4: With custom headers
export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

// Example 5: Using in a service class
export class ExpertService {
    static async getAll(params?: { limit?: number; offset?: number }) {
        const response = await apiClient.get('/expert/profile/list', { params });
        return response.data;
    }

    static async getById(id: number) {
        const response = await apiClient.get(`/expert/profile/${id}`);
        return response.data;
    }

    static async create(data: any) {
        const response = await apiClient.post('/expert/profile', data);
        return response.data;
    }

    static async update(id: number, data: any) {
        const response = await apiClient.put(`/expert/profile/${id}`, data);
        return response.data;
    }

    static async delete(id: number) {
        const response = await apiClient.delete(`/expert/profile/${id}`);
        return response.data;
    }
}

/*
 * REACT COMPONENT USAGE EXAMPLE
 * 
 * Create this in a .tsx file in your app:
 * 
 * "use client";
 * import { useEffect, useState } from 'react';
 * import apiClient from '@/lib/apiClient';
 * 
 * export const ExampleComponent = () => {
 *   const [data, setData] = useState(null);
 *   const [loading, setLoading] = true);
 * 
 *   useEffect(() => {
 *     const loadData = async () => {
 *       try {
 *         const result = await apiClient.get('/some-endpoint');
 *         setData(result.data);
 *       } catch (error) {
 *         // Error will be handled by interceptor
 *         // If token refresh fails, user will be redirected to /sign-in
 *         console.error('Error:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 * 
 *     loadData();
 *   }, []);
 * 
 *   if (loading) return <div>Loading...</div>;
 * 
 *   return <div>{JSON.stringify(data)}</div>;
 * };
 */
