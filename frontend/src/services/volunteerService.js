import api from "./api";

const volunteerService = {
  getAvailableVolunteers: async () => {
    const response = await api.get("/volunteers/available");
    return response.data;
  },
};

export default volunteerService;
