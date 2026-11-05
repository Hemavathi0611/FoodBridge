import api from "./api";

const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);

    if (response.data.token) {
      localStorage.setItem("foodbridge_token", response.data.token);
    }

    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    if (response.data.token) {
      localStorage.setItem("foodbridge_token", response.data.token);
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("foodbridge_token");
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
};

export default authService;
