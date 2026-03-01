import axiosInstance from "../utils/axiosConfig";

export const AddReviewAPI = async (data) => {
  try {
  const response = await axiosInstance.post("/api/reviews", data);
  return { status: response.status, data: response.data };  
} catch (error) {
  if (error.response?.data) {
    return { status: error.response.status, error: error.response.data.message };
  } else if (
    error.code === "ECONNABORTED" ||
    error.message === "Network Error"
  ) {
    return { status: 0, error: "Connection timed out. Please try again later." };
  }
  return { status: 0, error: "Something went wrong." };
}

};
