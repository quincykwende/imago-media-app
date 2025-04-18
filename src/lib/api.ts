import axios from 'axios';
import { SearchResponse } from '@/types/media';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SearchParams {
    query?: string;
    photographer?: string;
    from_date?: string;
    to_date?: string;
    page?: number;
    size?: number;
}

export const searchMedia = async (
    params: SearchParams
): Promise<{ data: SearchResponse }> => {
    try {
        return await axios.get<SearchResponse>(`${API_BASE_URL}/api/v1/search`, {
            params: {
                ...params,
                query: params.query || '*',
            },
        });
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
};

