import { apiRequest } from "./queryClient";
import type { MosqueWithDonations, Donation } from "@shared/schema";

export const api = {
  mosques: {
    getAll: async (params?: { search?: string; city?: string; size?: string }): Promise<MosqueWithDonations[]> => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('q[name_cont]', params.search);
      if (params?.city) searchParams.append('q[city_eq]', params.city);
      if (params?.size) searchParams.append('q[size_eq]', params.size);
      
      const url = `https://masajid-admin.rabeh.sy/mosques.json${searchParams.toString() ? `?${searchParams}` : ''}`;
      const response = await apiRequest('GET', url);
      return response.json();
    },

    getById: async (id: string): Promise<MosqueWithDonations> => {
      const response = await apiRequest('GET', `https://masajid-admin.rabeh.sy/mosques/${id}.json`);
      return response.json();
    }
  }
};
