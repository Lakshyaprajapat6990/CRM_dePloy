import axiosInstance from "../utils/axiosConfig";

export const UploadItemImg = async (data) => {
  const transformData = (data) => {
    const formData = new FormData();

    if (Array.isArray(data)) {
      data.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file); // append file
        }
      });
    } else if (data instanceof File) {
      formData.append("images", data);
    }

    return formData;
  };

  try {
    const formattedData = transformData(data);
    const response = await axiosInstance.post(`/api/files/getImageUrl`, formattedData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    if (error.response?.data) {
      return {
        status: error.response.status,
        error: error.response.data.message,
      };
    } else if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error"
    ) {
      return {
        status: 0,
        error: "Connection timed out. Please try again later.",
      };
    }
    return { status: 0, error: "Something went wrong." };
  }
};

