// Example: How to use the API client in your components/pages

import { api } from './src/api';

/**
 * 🚀 API Client Usage Guide (Modernized)
 * The modernized API client (api) uses a [data, error] tuple pattern.
 * This simplifies error handling and eliminates try-catch blocks everywhere.
 */

async function exampleGetRequest() {
    // 1. All GET requests use the .get method
    const [data, error] = await api.get<any>('/expert/profile/list', {
        params: { limit: 10, offset: 0 }
    });

    if (error) {
        console.error('Failed to fetch experts:', error.message);
        return;
    }

    console.log('Experts list:', data);
}

async function examplePostRequest(profileData: any) {
    // 2. POST/PUT/PATCH requests use their respective methods
    const [data, error] = await api.put('/user/profile', profileData);

    if (error) {
        // Error object contains status, message, and backend errors
        if (error.status === 422) {
             console.error('Validation errors:', error.body?.errors);
        }
        return;
    }

    console.log('Profile updated successfully:', data);
}

async function exampleDeleteRequest(itemId: string) {
    const [data, error] = await api.delete(`/items/${itemId}`);

    if (error) {
        alert('Could not delete item!');
        return;
    }

    console.log('Item deleted');
}

async function exampleFileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // 3. For FormData, use api directly with { method, body } to bypass JSON stringification
    const [data, error] = await api<any>('/upload', {
        method: 'POST',
        body: formData,
    });

    if (error) {
        console.error('File upload failed');
        return;
    }

    console.log('File uploaded:', data.url);
}

/**
 * ─── BEST PRACTICES ──────────────────────────────────────────────────────────
 * 1. ALWAYS destructure [data, error].
 * 2. Check for `error` first before using `data`.
 * 3. Use generic types for `data` when possible: api.get<MyUser[]>('/users').
 * 4. For FormData (file uploads), use the base api(...) call as shown above.
 */

// ─── MIGRATION STATUS ────────────────────────────────────────────────────────
/**
 * All apps and packages have been successfully migrated to the new 
 * standardized `api` client. 
 * 
 * Standard Pattern:
 * const [data, error] = await api.get('/endpoint');
 */

/*
 * REACT COMPONENT USAGE EXAMPLE
 * 
 * Create this in a .tsx file in your app:
 * 
 * "use client";
 * import { useEffect, useState } from 'react';
 * import { api } from '@/lib/api';
 * 
 * export const ExampleComponent = () => {
 *   const [data, setData] = useState(null);
 *   const [loading, setLoading] = useState(true);
 *   const [errorMsg, setErrorMsg] = useState("");
 * 
 *   useEffect(() => {
 *     const loadData = async () => {
 *       const [result, error] = await api.get('/some-endpoint');
 *       
 *       if (error) {
 *         setErrorMsg(error.message);
 *       } else {
 *         setData(result);
 *       }
 *       setLoading(false);
 *     };
 * 
 *     loadData();
 *   }, []);
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (errorMsg) return <div>Error: {errorMsg}</div>;
 * 
 *   return <div>{JSON.stringify(data)}</div>;
 * };
 */
