import axiosInstance from "../utils/axiosConfig";

export const CreatePoojaAPI = async (data) => {
  const transformData = (data) => {
    const formData = new FormData();

    // Simple Strings
    formData.append("title", data.title);
    formData.append("titleHi", data.titleHi);
    formData.append("subtitle", data.subtitle);
    formData.append("subtitleHi", data.subtitleHi);

    // Locations
    formData.append("location", data.originator?.value || "");
    formData.append("locationHi", data.originatorHi?.value || "");

    // Date
    if (data.capDate) {
      formData.append("capDate", new Date(data.capDate).toISOString());
    }

    // if (Array.isArray(data.logoImages)) {
    //   data.logoImages.forEach((file) => {
    //     formData.append("images", file);
    //   });
    // }
    // if (Array.isArray(data.logoImagesHi)) {
    //   data.logoImagesHi.forEach((file) => {
    //     formData.append("imagesHi", file);
    //   });
    // }
    if (data.price?.type?.[0]) {
      const p = data.price.type[0];
      console.log("family amount ", p.family?.amaount)
      formData.append("price[0][single][amaount]", p.single?.amaount ?? "");
      formData.append(
        "price[0][single][description]",
        p.single?.description ?? ""
      );
      formData.append(
        "price[0][single][descriptionHi]",
        p.single?.descriptionHi ?? ""
      );

      formData.append("price[0][couple][amaount]", p.couple?.amaount ?? "");
      formData.append(
        "price[0][couple][description]",
        p.couple?.description ?? ""
      );
      formData.append(
        "price[0][couple][descriptionHi]",
        p.couple?.descriptionHi ?? ""
      );

      formData.append("price[0][family][amaount]", p.family?.amaount ?? "");
      formData.append(
        "price[0][family][description]",
        p.family?.description ?? ""
      );
      formData.append(
        "price[0][family][descriptionHi]",
        p.family?.descriptionHi ?? ""
      );
    }

    // Benefit array
    if (Array.isArray(data.benefit)) {
      data.benefit.forEach((b, i) => {
        formData.append(`benefit[${i}][title]`, b.title || "");
        formData.append(`benefit[${i}][titleHi]`, b.titleHi || "");
        formData.append(`benefit[${i}][description]`, b.description || "");
        formData.append(`benefit[${i}][descriptionHi]`, b.descriptionHi || "");
      });
    }

    // FAQ array
    if (Array.isArray(data.faq)) {
      data.faq.forEach((f, i) => {
        formData.append(`faq[${i}][question]`, f.question || "");
        formData.append(`faq[${i}][questionHi]`, f.questionHi || "");
        formData.append(`faq[${i}][answer]`, f.answer || "");
        formData.append(`faq[${i}][answerHi]`, f.answerHi || "");
      });
    }

     if (Array.isArray(data.items)) {
    
      data.items.forEach((b, i) => {
        formData.append(`items[${i}][title]`, b.title || "");
        formData.append(`items[${i}][titleHi]`, b.titleHi || "");
        formData.append(`items[${i}[description]`, b.description || "");
        formData.append(`items[${i}[descriptionHi]`, b.descriptionHi || "");
        formData.append(`items[${i}][price]`, b.price || "");
        formData.append(`items[${i}][image]`, b.img || "");
      });
    }
    return formData;
  };

  try {
  const formattedData = transformData(data);
  const response = await axiosInstance.post("/api/poojas", formattedData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return { status: response.status, data: response.data };  // Always return an object
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
