import axios from "axios";

const ApiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

// Request interceptor
ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    console.log("URL: ", config.url);
    console.log("Stored token: ", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization: ", config.headers.Authorization);
    } else {
      console.log("No token found");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default ApiService;



