import axiosInstance from "../utils/axiosConfig";

export const CreateTempleAPI = async (data) => {
  console.log("apicall", data);

  // Transform form values to JSON payload as per mongoose schema
  const transformData = (data) => {
    return {
      title: data.title,
      titleHi: data.titleHi,
      location: data.location?.value || "",
      locationHi: data.locationHi?.value || "",
      subTitle: data.subtitle,
      subTitleHi: data.subtitleHi,
      bhagwan: data.bhagwan,
      bhagwanHi: data.bhagwanHi,
      templeDescription: data.description,
      templeDescriptionHi: data.descriptionHi,
      longDescription: data.longDescription,
      longDescriptionHi: data.longDescriptionHi,
      // If images and images_hi are arrays of files, you must upload these separately first and provide URLs here.
      // images: data.logoImages?.map((file) => ({
      //   url: file.uploadedUrl || "", // assuming uploadedUrl is set after upload
      //   delete_url: file.deleteUrl || "",
      // })) || [],
      // images_hi: data.logoImagesHi?.map((file) => ({
      //   url: file.uploadedUrl || "",
      //   delete_url: file.deleteUrl || "",
      // })) || [],
      // Add other fields if needed, e.g., is_active, sequence_number, items, etc.
    };
  };

  try {
    const jsonPayload = transformData(data);

    const response = await axiosInstance.post("/api/temples", jsonPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.status === 200 || response?.status === 201) {
      return response?.data;
    }
  } catch (error) {
    if (error.response?.data) {
      return { error: error.response.data.msg };
    } else if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error"
    ) {
      return { error: "Connection timed out. Please try again later." };
    }
    console.error(error);
    return { error: "Something went wrong." };
  }
};
