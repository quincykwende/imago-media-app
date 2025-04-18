export interface MediaMetadata {
    image_id: string;
    date?: string;
    photographer?: string;
    width?: number;
    height?: number;
    copyright?: string;
}

export interface MediaItem {
    id: string;
    title: string;
    image: string;
    metadata: MediaMetadata;
}

export interface SearchResponse {
    count: number;
    results: MediaItem[];
    next_page?: number;
}

export interface SearchParams {
    query?: string;
    photographer?: string;
    from_date?: string;
    to_date?: string;
    page?: number;
    size?: number;
}
