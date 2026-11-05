import api from "./api";

const profileService = {
  registerNGO: async (data) => {
    const response = await api.post("/ngos/register", data);
    return response.data;
  },

  registerVolunteer: async (data) => {
    const response = await api.post("/volunteers/register", data);
    return response.data;
  },
};

export default profileService;
