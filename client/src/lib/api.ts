import { apiRequest } from "./queryClient";
import type { MosqueWithDonations, Donation } from "@shared/schema";

export const api = {
  mosques: {
    getAll: async (params?: { search?: string; city?: string; size?: string }): Promise<MosqueWithDonations[]> => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('q[name_cont]', params.search);
      if (params?.city) searchParams.append('q[city_eq]', params.city);
      if (params?.size) searchParams.append('q[size_eq]', params.size);
      
      const url = `http://localhost:3000/mosques.json${searchParams.toString() ? `?${searchParams}` : ''}`;
      const response = await apiRequest('GET', url);
      return response.json();
    },

    getById: async (id: string): Promise<MosqueWithDonations> => {
      const response = await apiRequest('GET', `http://localhost:3000/mosques/${id}.json`);
      return response.json();
    },

    getDonations: async (id: string): Promise<Donation[]> => {
      const response = await apiRequest('GET', `https://8c5e51da-5a16-4d16-80d2-f9dc5f1086e2-00-25czk4ja6iuyf.spock.replit.dev/api/mosques/${id}/donations`);
      return response.json();
    }
  }
};
