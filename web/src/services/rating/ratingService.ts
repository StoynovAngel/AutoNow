import apiClient from '../apiClient';

export interface Rating {
    id: number;
    orderId: number;
    rating: number;
    comment?: string;
    createdAt: string;
}

export const ratingService = {
    getRatingsByDriverId: async (driverId: string): Promise<Rating[]> => {
        const {data} = await apiClient.get(`/ratings/driver/${driverId}`);
        return data;
    }
};
