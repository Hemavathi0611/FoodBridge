import api from "./api";

const donationService = {
  createDonation: async (donationData) => {
    const response = await api.post("/donations", donationData);
    return response.data;
  },

  getMyDonations: async () => {
    const response = await api.get("/donations/my");
    return response.data;
  },

  getAvailableDonations: async () => {
    const response = await api.get("/donations/available");
    return response.data;
  },

  getMyAcceptedDonations: async () => {
    const response = await api.get("/donations/accepted");
    return response.data;
  },

  acceptDonation: async (donationId) => {
    const response = await api.patch(`/donations/${donationId}/accept`);
    return response.data;
  },
};

export default donationService;
