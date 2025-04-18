import axios from 'axios';
import { SearchResponse, SearchParams } from '@/types/media';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const searchMedia = async (params: SearchParams) => {
    try {
        // src/lib/api.ts
        const cleanParams = Object.fromEntries(
            Object.entries(params)
                .filter(([key, value]) => {
                    // temporal fix to bypass eslint issues @ts-ignore seems not to work
                    void(key);
                    return value !== undefined && value !== null && value !== '';
                })
        );

        return await axios.get<SearchResponse>(`${API_BASE_URL}/api/v1/search`, {
            params: cleanParams,
        });
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
};
