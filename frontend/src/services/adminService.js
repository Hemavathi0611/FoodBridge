import api from "./api";

const adminService = {
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  getPendingNGOs: async () => {
    const response = await api.get("/admin/ngos/pending");
    return response.data;
  },

  updateNGOApproval: async (ngoId, data) => {
    const response = await api.patch(
      `/admin/ngos/${ngoId}/approval`,
      data
    );
    return response.data;
  },

  getAllVolunteers: async () => {
    const response = await api.get("/admin/volunteers");
    return response.data;
  },

  updateVolunteerVerification: async (volunteerId, data) => {
    const response = await api.patch(
      `/admin/volunteers/${volunteerId}/verification`,
      data
    );
    return response.data;
  },
};

export default adminService;
