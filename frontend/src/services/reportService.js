import api from "./api";

const reportService = {
  getDonationListings: async (params = {}) => {
    const response = await api.get("/reports/donations", { params });
    return response.data;
  },

  getPickupStatus: async (params = {}) => {
    const response = await api.get("/reports/pickups", { params });
    return response.data;
  },

  getFoodRedistributed: async (params = {}) => {
    const response = await api.get("/reports/food-redistributed", { params });
    return response.data;
  },

  getDonorActivity: async (params = {}) => {
    const response = await api.get("/reports/donor-activity", { params });
    return response.data;
  },
};

export default reportService;
