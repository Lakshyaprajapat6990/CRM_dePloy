import axiosInstance from "../utils/axiosConfig";
export const CreateChadhavaAPI = async (data, itemImage) => {
  console.log("Data being sent to CreateChadhavaAPI:", itemImage);
  try {
    // Build JSON object matching backend structure
    const jsonPayload = {
      title: data.title,
      titleHi: data.titleHi,
      subtitle: data.subtitle,
      subtitleHi: data.subtitleHi,
      chadhava: data.chadhava,
      desc: data.description,
      desc_hi: data.descriptionHi,
      mandir: data.mandir.value,
      mandirHi: data.mandirHi.value,
      items: (data.cItem || []).map((item, i) => ({
        title: item.title || "",
        titleHi: item.titleHi || "",
        description: item.description || "",
        descriptionHi: item.descriptionHi || "",
        price: item.price || 0,
        image: item.imageUrl || "",
      })),
      benefit: (data.benefit || []).map((b) => ({
        title: b.title || "",
        titleHi: b.titleHi || "",
        description: b.description || "",
        descriptionHi: b.descriptionHi || "",
      })),
        faq: Array.isArray(data.faq)
    ? data.faq.map((f) => ({
        question: f.question || "",
        questionHi: f.questionHi || "",
        answer: f.answer || "",
        answerHi: f.answerHi || "",
      }))
    : [],
    };

    const response = await axiosInstance.post("/api/chadhavas", jsonPayload, {
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
