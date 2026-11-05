import api from "./api";

const pickupService = {
  getMyPickups: async () => {
    const response = await api.get("/pickups/my");
    return response.data;
  },

  assignVolunteer: async (donationId, data) => {
    const response = await api.post(
      `/pickups/donations/${donationId}/assign`,
      data
    );
    return response.data;
  },

  updatePickupStatus: async (pickupId, data) => {
    const response = await api.patch(
      `/pickups/${pickupId}/status`,
      data
    );
    return response.data;
  },
};

export default pickupService;
