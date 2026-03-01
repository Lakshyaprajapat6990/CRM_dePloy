import axiosInstance from "../utils/axiosConfig";

export const LoginAPI = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/users/admin/login", credentials);

    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    if (error?.response && error?.response?.data) {
      const statusCode = error?.response?.status;
      switch (statusCode) {
        case 400:
          return { error: error.response?.data?.msg || "Invalid request" };
        case 401:
          return { error: error.response?.data?.msg || "Invalid credentials" };
        case 404:
          return { error: error.response?.data?.msg || "User not found" };
        case 500:
          return { error: "Server error. Please try again later." };
        default:
          return { error: error.response?.data?.msg || "Something went wrong" };
      }
    } else if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error"
    ) {
      return { error: "Connection timed out. Please try again later." };
    } else {
      return { error: "Unexpected error occurred" };
    }
  }
};
