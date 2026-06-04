import customAPI from './ApiClient';

export interface RatingRequest {
    orderId: number;
    rating: number;
    comment?: string;
}

export interface RatingResponse {
    id: number;
    orderId: number;
    rating: number;
    comment?: string;
    createdAt?: string;
}

export const submitRating = async (payload: RatingRequest): Promise<RatingResponse> => {
    const response = await customAPI.post<RatingResponse>('api/ratings', payload);
    return response.data;
};
