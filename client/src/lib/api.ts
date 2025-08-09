import { apiRequest } from "./queryClient";
import type { MosqueWithDonations, Donation } from "@shared/schema";

export const api = {
  mosques: {
    getAll: async (params?: { search?: string; city?: string; size?: string }): Promise<MosqueWithDonations[]> => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.city) searchParams.append('city', params.city);
      if (params?.size) searchParams.append('size', params.size);
      
      const url = `/api/mosques${searchParams.toString() ? `?${searchParams}` : ''}`;
      const response = await apiRequest('GET', url);
      return response.json();
    },

    getById: async (id: string): Promise<MosqueWithDonations> => {
      const response = await apiRequest('GET', `/api/mosques/${id}`);
      return response.json();
    },

    getDonations: async (id: string): Promise<Donation[]> => {
      const response = await apiRequest('GET', `/api/mosques/${id}/donations`);
      return response.json();
    }
  }
};
