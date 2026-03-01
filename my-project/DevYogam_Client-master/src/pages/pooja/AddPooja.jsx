import { Box, Button, Typography, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import { CustomTextField, GlobalCssStyles } from "../../style/GlobalCSS";
import { FieldArray, Form, Formik } from "formik";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AsyncCreatableSelect from "react-select/async-creatable";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import * as Yup from "yup";
import { CreatePoojaAPI } from "../../services/CreatePoojaAPI";
import UploadIcon from "../../assests/upload-icon.svg";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { GetAllTempleAPI } from "../../services/GetAllTempleAPI";
import { useNavigate } from "react-router-dom";
import { CreatePoojaFile } from "../../services/CreatePoojaFile";

const MAX_LOGOS = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Pooja Title is required"),
  titleHi: Yup.string().required("पूजा का शीर्षक आवश्यक है"),
  subtitle: Yup.string().required("Subtitle is required"),
  subtitleHi: Yup.string().required("उपशीर्षक आवश्यक है"),
  originator: Yup.object()
    .nullable()
    .required("Location (English) is required"),
  originatorHi: Yup.object().nullable().required("स्थान (हिंदी) आवश्यक है"),
  capDate: Yup.date().nullable().required("Date is required"),
  file: Yup.mixed().required("Image (English) is required"),
  fileHi: Yup.mixed().required("चित्र (हिंदी) आवश्यक है"),
  logoImages: Yup.array()
    .min(1, "At least 1 logo image is required")
    .max(MAX_LOGOS, `Maximum ${MAX_LOGOS} images allowed`)
    .of(
      Yup.mixed()
        .test("fileType", "Unsupported Format", (file) =>
          file ? SUPPORTED_FORMATS.includes(file.type) : true
        )
        .test("fileSize", "File too large", (file) =>
          file ? file.size <= MAX_SIZE : true
        )
    ),
  logoImagesHi: Yup.array()
    .min(1, "At least 1 logo image is required")
    .max(MAX_LOGOS, `Maximum ${MAX_LOGOS} images allowed`)
    .of(
      Yup.mixed()
        .test("fileType", "Unsupported Format", (file) =>
          file ? SUPPORTED_FORMATS.includes(file.type) : true
        )
        .test("fileSize", "File too large", (file) =>
          file ? file.size <= MAX_SIZE : true
        )
    ),
  // price: Yup.object().shape({
  //   single: Yup.number()
  //     .typeError("Single Price must be a number")
  //     .required("Single Price is required"),
  //   singleDesc: Yup.string().required("Single Price Description required"),
  //   singleDescHi: Yup.string().required("Single Price Description required"),
  //   couple: Yup.number()
  //     .typeError("Couple Price must be a number")
  //     .required("Couple Price is required"),
  //   coupleDesc: Yup.string().required("Couple Price Description required"),
  //   coupleDescHi: Yup.string().required("Couple Price Description required"),
  //   family: Yup.number()
  //     .typeError("Family Price must be a number")
  //     .required("Family Price is required"),
  //   familyDesc: Yup.string().required("Family Price Description required"),
  //   familyDescHi: Yup.string().required("Family Price Description required"),
  // }),
  benefit: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required("Title is required"),
        titleHi: Yup.string().required("शीर्षक आवश्यक है"),
        description: Yup.string().required("Description is required"),
        descriptionHi: Yup.string().required("विवरण आवश्यक है"),
      })
    )
    .min(1, "At least one benefit is required")
    .max(3, "Maximum 3 benefits allowed")
    .required("Benefits are required"),
  faq: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        questionHi: Yup.string().required("प्रश्न आवश्यक है"),
        answer: Yup.string().required("Answer is required"),
        answerHi: Yup.string().required("उत्तर आवश्यक है"),
      })
    )
    .min(1, "At least one FAQ is required")
    .max(5, "Maximum 5 FAQs allowed")
    .required("FAQs are required"),
});

const initialValues = {
  title: "",
  titleHi: "",
  subtitle: "",
  subtitleHi: "",
  originator: null,
  originatorHi: null,
  capDate: null,
  file: null,
  fileHi: null,
  logoImages: [],
  logoImagesHi: [],
  price: {
    type: [
      {
        single: {
          amaount: null,
          description: "",
          descriptionHi: "",
        },
        couple: {
          amaount: null,
          description: "",
          descriptionHi: "",
        },
        family: {
          amaount: null,
          description: "",
          descriptionHi: "",
        },
      },
    ],
  },

  benefit: [{ title: "", titleHi: "", description: "", descriptionHi: "" }],
  faq: [{ question: "", questionHi: "", answer: "", answerHi: "" }],
  items: [
    {
      title: "",
      titleHi: "",
      description: "",
      descriptionHi: "",
      price: "",
      img: "",
    },
  ],
};

export default function AddPooja({ open, handleClose }) {
  const [poojaData, setPoojaData] = useState(initialValues);
  const [templeList, setTempleList] = useState([]);
  const [templeListHi, setTempleListHi] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getTemple = async () => {
    const res = await GetAllTempleAPI();
    const english = (res || []).map((item) => ({
      value: item?.title || "",
      label: item?.title || "",
    }));
    const hindi = (res || []).map((item) => ({
      value: item?.titleHi || item?.title || "",
      label: item?.titleHi || "",
    }));
    setTempleList(english);
    setTempleListHi(hindi);
  };

  useEffect(() => {
    getTemple();
  }, []);

  const locationOptionsHi = [...templeListHi];

  const locationOptions = [...templeList];

  const loadLocationOptions = (inputValue, callback) => {
    const filtered = locationOptions.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };

  const loadLocationOptionsHi = (inputValue, callback) => {
    const filtered = locationOptionsHi.filter((opt) =>
      opt.label.includes(inputValue)
    );
    callback(filtered);
  };

  const handleLogoImagesUpload = (event, values, setFieldValue) => {
    const files = Array.from(event.target.files);
    const combined = [...(values.logoImages || []), ...files].slice(
      0,
      MAX_LOGOS
    );
    setFieldValue("logoImages", combined);
    setFieldValue(
      "newLogoImages",
      [...(values.newLogoImages || []), ...files].slice(0, MAX_LOGOS)
    );
  };
  const removeLogoImage = (index, values, setFieldValue) => {
    const updated = [...values.logoImages];
    const removedFile = updated[index];
    if (removedFile && removedFile._id) {
      setFieldValue("removedLogoImageIds", [
        ...(values.removedLogoImageIds || []),
        removedFile._id,
      ]);
    } else {
      setFieldValue(
        "newLogoImages",
        (values.newLogoImages || []).filter((file) => file !== removedFile)
      );
    }

    updated.splice(index, 1);
    setFieldValue("logoImages", updated);
  };
  const handleLogoImagesUploadHi = (event, values, setFieldValue) => {
    const files = Array.from(event.target.files);
    const combined = [...(values.logoImagesHi || []), ...files].slice(
      0,
      MAX_LOGOS
    );
    setFieldValue("logoImagesHi", combined);
    setFieldValue(
      "newLogoImagesHi",
      [...(values.newLogoImagesHi || []), ...files].slice(0, MAX_LOGOS)
    );
  };
  const removeLogoImageHi = (index, values, setFieldValue) => {
    const updated = [...values.logoImagesHi];
    const removedFile = updated[index];
    if (removedFile && removedFile._id) {
      setFieldValue("removedLogoImageIdsHi", [
        ...(values.removedLogoImageIdsHi || []),
        removedFile._id,
      ]);
    } else {
      setFieldValue(
        "newLogoImagesHi",
        (values.newLogoImagesHi || []).filter((file) => file !== removedFile)
      );
    }

    updated.splice(index, 1);
    setFieldValue("logoImagesHi", updated);
  };
//   const handleSubmit = async (val) => {
//     const formData = new FormData();
//     Object.keys(val).forEach((key) => {
//       if (key === "logoImages") {
//         val.logoImages.forEach((file) => {
//           formData.append("logoImages", file);
//         });
//       } else if (key === "logoImagesHi") {
//         val.logoImages.forEach((file) => {
//           formData.append("logoImagesHi", file);
//         });
//       } else if (key === "price") {
//         formData.append("price", JSON.stringify(val.price));
//       } else if (key === "originator" || key === "originatorHi") {
//         formData.append(key, val[key]?.value || "");
//       } else if (key === "capDate") {
//         formData.append(key, val[key] || "");
//       } else if (val[key] !== null && val[key] !== undefined) {
//         formData.append(key, val[key]);
//       }
//     });
//     setLoading(true);
//     const response = await CreatePoojaAPI(val);
//    console.log(response)
//     setLoading(false);
// console.log("response --> ", response)
//     if (response?.status) {
//       await alert("Puja created sucessfully")
//       // navigate("/pooja");
//     }
//   };

const handleSubmit = async (val) => {
  setLoading(true);
  const response = await CreatePoojaAPI(val);
  if (response?.data?.status) {
    const res = await CreatePoojaFile(response?.data?.data?._id , val, "pooja");
    if(res?.status){
      alert("Puja created successfully");
    }
    navigate("/pooja");
  } else if (response.error) {
    alert(`Error: ${response.error}`); 
  }
  setLoading(false);

};

  return (
    <GlobalCssStyles>
      <Box style={{ width: "90%", margin: "auto", marginTop: "2%" }}>
        <Formik
          initialValues={poojaData}
          // validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
            console.log("Submitted data", values);
          }}
          enableReinitialize={true}
        >
          {({
            values,
            setFieldValue,
            errors,
            touched,
            handleBlur,
            handleChange,
            isValid,
            dirty,
            setFieldTouched,
          }) => (
            <Form>
              <Box style={{ width: "90%", margin: "auto" }}>
                <Typography className="policies-text" sx={{ mb: 2 }}>
                  Add New Pooja
                </Typography>

                <Grid container spacing={2} sx={{ width: "100%" }}>
                  <Box sx={{ width: "80%" }}>
                    {/* Pooja Title */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Pooja Title <span className="required-icon">*</span>
                      </Typography>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="title"
                          name="title"
                          value={values.title}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter Pooja Title (English)"
                          fullWidth
                          size="small"
                          error={touched.title && Boolean(errors.title)}
                          helperText={touched.title && errors.title}
                        />
                        <CustomTextField
                          id="titleHi"
                          name="titleHi"
                          value={values.titleHi}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="पूजा का शीर्षक दर्ज करें (हिंदी)"
                          fullWidth
                          size="small"
                          error={touched.titleHi && Boolean(errors.titleHi)}
                          helperText={touched.titleHi && errors.titleHi}
                        />
                      </Stack>
                    </Grid>

                    {/* Subtitle */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Sub Title <span className="required-icon">*</span>
                      </Typography>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="subtitle"
                          name="subtitle"
                          value={values.subtitle}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Add Sub Title (English)"
                          fullWidth
                          size="small"
                          error={touched.subtitle && Boolean(errors.subtitle)}
                          helperText={touched.subtitle && errors.subtitle}
                        />
                        <CustomTextField
                          id="subtitleHi"
                          name="subtitleHi"
                          value={values.subtitleHi}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="उपशीर्षक दर्ज करें (हिंदी)"
                          fullWidth
                          size="small"
                          error={
                            touched.subtitleHi && Boolean(errors.subtitleHi)
                          }
                          helperText={touched.subtitleHi && errors.subtitleHi}
                        />
                      </Stack>
                    </Grid>

                    {/* Price & Description */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Price <span className="required-icon">*</span>
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Box>
                          <CustomTextField
                            id="price.type[0].single.amaount"
                            name="price.type[0].single.amaount"
                            type="number"
                            value={values?.price?.type[0]?.single?.amaount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Single Plan"
                            fullWidth
                            size="small"
                            // error={
                            //   touched?.price?.type[0]?.single?.amaount &&
                            //   Boolean(errors?.price.type[0]?.single?.amaount)
                            // }
                            // helperText={
                            //   touched?.price?.type[0]?.single?.amaount &&
                            //   errors?.price?.type[0]?.single?.amaount
                            // }
                          />
                          <CustomTextField
                            id="price.type[0].single.description"
                            name="price.type[0].single.description"
                            value={values?.price?.type[0].single?.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Single Price Description"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            // error={
                            //   touched.price?.type[0]?.single?.description &&
                            //   Boolean(errors.price?.type[0].single?.description)
                            // }
                            // helperText={
                            //   touched.price?.type[0].single?.description &&
                            //   errors.price?.type[0].single?.description
                            // }
                            sx={{ mt: 1 }}
                          />
                          <CustomTextField
                            id="price.type[0].single.descriptionHi"
                            name="price.type[0].single.descriptionHi"
                            value={values.price?.type[0].single?.descriptionHi}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="सिंगल डिस्क्रिप्शन"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            error={
                              touched.price?.type[0].single?.descriptionHi &&
                              Boolean(
                                errors.price?.type[0].single?.descriptionHi
                              )
                            }
                            helperText={
                              touched.price?.type[0].single?.descriptionHi &&
                              errors.price?.type[0].single?.descriptionHi
                            }
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Box>
                          <CustomTextField
                            id="price.type[0].couple.amaount"
                            name="price.type[0].couple.amaount"
                            type="number"
                            value={values.price?.type[0]?.couple?.amaount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Couple Plan"
                            fullWidth
                            size="small"
                            error={
                              touched.price?.type[0]?.couple?.amaount &&
                              Boolean(errors.price?.type[0]?.couple?.amaount)
                            }
                            helperText={
                              touched.price?.type[0]?.couple?.amaount &&
                              errors.price?.type[0]?.couple?.amaount
                            }
                          />
                          <CustomTextField
                            id="price.type[0].couple.description"
                            name="price.type[0].couple.description"
                            value={values.price?.type[0]?.couple?.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Couple Price Description"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            error={
                              touched.price?.type[0]?.couple?.description &&
                              Boolean(
                                errors.price?.type[0]?.couple?.description
                              )
                            }
                            helperText={
                              touched.price?.type[0]?.couple?.description &&
                              errors.price?.type[0]?.couple?.description
                            }
                            sx={{ mt: 1 }}
                          />
                          <CustomTextField
                            id="price.type[0].couple.descriptionHi"
                            name="price.type[0].couple.descriptionHi"
                            value={values.price?.type[0]?.couple?.descriptionHi}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="जोड़े का डिस्क्रिप्शन"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            error={
                              touched.price?.type[0]?.couple?.descriptionHi &&
                              Boolean(
                                errors.price?.type[0]?.couple?.descriptionHi
                              )
                            }
                            helperText={
                              touched.price?.type[0]?.couple?.descriptionHi &&
                              errors.price?.type[0]?.couple?.descriptionHi
                            }
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Box>
                          <CustomTextField
                            id="price.type[0].family.amaount"
                            name="price.type[0].family.amaount"
                            type="number"
                            value={values.price?.type[0]?.family?.amaount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Family Plan"
                            fullWidth
                            size="small"
                            error={
                              touched.price?.type[0]?.family?.amaount &&
                              Boolean(errors.price?.type[0]?.family?.amaount)
                            }
                            helperText={
                              touched.price?.type[0]?.family?.amaount &&
                              errors.price?.type[0]?.family?.amaount
                            }
                          />
                          <CustomTextField
                            id="price.type[0].family.description"
                            name="price.type[0].family.description"
                            value={values.price?.type[0]?.family?.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Family Price Description"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            error={
                              touched.price?.type[0]?.family?.description &&
                              Boolean(
                                errors.price?.type[0]?.family?.description
                              )
                            }
                            helperText={
                              touched.price?.type[0]?.family?.description &&
                              errors.price?.type[0]?.family?.description
                            }
                            sx={{ mt: 1 }}
                          />
                          <CustomTextField
                            id="price.type[0].family.descriptionHi"
                            name="price.type[0].family.descriptionHi"
                            value={values.price?.type[0]?.family?.descriptionHi}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="फॅमिली डिस्क्रिप्शन"
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                            error={
                              touched.price?.type[0]?.family?.descriptionHi &&
                              Boolean(
                                errors.price?.type[0]?.family?.descriptionHi
                              )
                            }
                            helperText={
                              touched.price?.type[0]?.family?.descriptionHi &&
                              errors.price?.type[0]?.family?.descriptionHi
                            }
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Location English */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Location (English){" "}
                        <span className="required-icon">*</span>
                      </Typography>
                      <AsyncCreatableSelect
                        id="originator"
                        name="originator"
                        cacheOptions
                        isClearable
                        placeholder="Select Location (English)"
                        value={values.originator}
                        defaultOptions={locationOptions}
                        loadOptions={loadLocationOptions}
                        onChange={(option) => {
                          setFieldValue("originator", option);
                        }}
                        onBlur={() => setFieldTouched("originator", true)}
                      />
                      {touched.originator && errors.originator && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.originator}
                        </Typography>
                      )}
                    </Grid>

                    {/* Location Hindi */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        स्थान (हिंदी) <span className="required-icon">*</span>
                      </Typography>
                      <AsyncCreatableSelect
                        id="originatorHi"
                        name="originatorHi"
                        cacheOptions
                        isClearable
                        placeholder="स्थान चुनें (हिंदी)"
                        value={values.originatorHi}
                        defaultOptions={locationOptionsHi}
                        loadOptions={loadLocationOptionsHi}
                        onChange={(option) => {
                          setFieldValue("originatorHi", option);
                        }}
                        onBlur={() => setFieldTouched("originatorHi", true)}
                      />
                      {touched.originatorHi && errors.originatorHi && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.originatorHi}
                        </Typography>
                      )}
                    </Grid>

                    {/* --- LOGO IMAGES Multiple Upload Section --- */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Add Pooja Images{" "}
                        <span className="required-icon">*</span>
                      </Typography>
                      <input
                        type="file"
                        id="logo-images-upload"
                        style={{ display: "none" }}
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleLogoImagesUpload(e, values, setFieldValue)
                        }
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "0.7rem",
                        }}
                      >
                        {values.logoImages &&
                          values.logoImages.map((file, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                background: "#f3f2f1",
                                padding: "4px 10px",
                                borderRadius: 12,
                                mb: 0.5,
                              }}
                            >
                              <Typography sx={{ fontFamily: "Poppins" }}>
                                {file.name}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeLogoImage(idx, values, setFieldValue)
                                }
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        {values.logoImages.length < MAX_LOGOS && (
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            style={{
                              minHeight: "2.5rem",
                              marginLeft: "10px",
                              borderRadius: 20,
                              background: "#fff",
                            }}
                            onClick={() =>
                              document
                                .getElementById("logo-images-upload")
                                .click()
                            }
                          >
                            <img
                              src={UploadIcon}
                              alt="Upload"
                              style={{ width: 20, marginRight: 8 }}
                            />
                            Upload Images
                          </Button>
                        )}
                      </Box>
                      {touched.logoImages && errors.logoImages && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.logoImages}
                        </Typography>
                      )}
                    </Grid>
                    {/* File upload (English)
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Add Image (English){" "}
                        <span className="required-icon">*</span>
                      </Typography>
                      <input
                        type="file"
                        id="file-upload-english"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, values, setFieldValue)
                        }
                      />
                      {values.file ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <Typography className="evidence-details-text">
                            {values.file.name}
                          </Typography>
                          <CloseIcon
                            style={{ cursor: "pointer" }}
                            fontSize="small"
                            onClick={() => {
                              setFieldValue("file", null);
                            }}
                          />
                        </Box>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById("file-upload-english")
                              .click()
                          }
                          style={{
                            background: "white",
                            marginTop: "10px",
                            borderRadius: "20px",
                            width: "14rem",
                            height: "2.5rem",
                            color: "black",
                            fontWeight: 500,
                            border: "1px solid #DADCE0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                          }}
                        >
                          <img src={UploadIcon} alt="Upload" />
                          <Typography style={{ fontFamily: "Poppins" }}>
                            Upload File (English)
                          </Typography>
                        </button>
                      )}
                      {touched.file && errors.file && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.file}
                        </Typography>
                      )}
                    </Grid> */}

                    {/* File upload (Hindi) */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        चित्र जोड़ें (हिंदी){" "}
                        <span className="required-icon">*</span>
                      </Typography>
                      <input
                        type="file"
                        id="logo-images-upload-hi"
                        style={{ display: "none" }}
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleLogoImagesUploadHi(e, values, setFieldValue)
                        }
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "0.7rem",
                        }}
                      >
                        {values.logoImagesHi &&
                          values.logoImagesHi.map((file, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                background: "#f3f2f1",
                                padding: "4px 10px",
                                borderRadius: 12,
                                mb: 0.5,
                              }}
                            >
                              <Typography sx={{ fontFamily: "Poppins" }}>
                                {file.name}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeLogoImageHi(idx, values, setFieldValue)
                                }
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        {values.logoImagesHi.length < MAX_LOGOS && (
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            style={{
                              minHeight: "2.5rem",
                              marginLeft: "10px",
                              borderRadius: 20,
                              background: "#fff",
                            }}
                            onClick={() =>
                              document
                                .getElementById("logo-images-upload-hi")
                                .click()
                            }
                          >
                            <img
                              src={UploadIcon}
                              alt="Upload"
                              style={{ width: 20, marginRight: 8 }}
                            />
                            चित्र अपलोड करें
                          </Button>
                        )}
                      </Box>
                      {touched.logoImages && errors.logoImages && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.logoImages}
                        </Typography>
                      )}{" "}
                    </Grid>

                    {/* Date */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Date <span className="required-icon">*</span>
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={values.capDate ? dayjs(values.capDate) : null}
                          onChange={(date) => {
                            if (dayjs(date).isValid()) {
                              setFieldValue(
                                "capDate",
                                date ? date.toISOString() : ""
                              );
                            }
                          }}
                          disablePast
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              onBlur: () => setFieldTouched("capDate", true),
                              size: "small",
                            },
                          }}
                        />
                      </LocalizationProvider>
                      {touched.capDate && errors.capDate && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.capDate}
                        </Typography>
                      )}
                    </Grid>

                    {/* Benefit array */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        Benefits <span className="required-icon">*</span>
                      </Typography>
                      <FieldArray name="benefit">
                        {({ push, remove }) => (
                          <Box>
                            {values.benefit.map((item, index) => (
                              <Grid
                                container
                                spacing={2}
                                key={index}
                                alignItems="center"
                                sx={{ mb: 1, position: "relative" }}
                              >
                                <Grid item xs={11} size={11}>
                                  <Stack spacing={2}>
                                    <CustomTextField
                                      name={`benefit.${index}.title`}
                                      placeholder="Add Title (English)"
                                      value={item.title}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      error={
                                        touched.benefit &&
                                        touched.benefit[index]?.title &&
                                        Boolean(errors.benefit?.[index]?.title)
                                      }
                                      helperText={
                                        touched.benefit &&
                                        touched.benefit[index]?.title &&
                                        errors.benefit?.[index]?.title
                                      }
                                    />
                                    <CustomTextField
                                      name={`benefit.${index}.titleHi`}
                                      placeholder="शीर्षक जोड़ें (हिंदी)"
                                      value={item.titleHi}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      error={
                                        touched.benefit &&
                                        touched.benefit[index]?.titleHi &&
                                        Boolean(
                                          errors.benefit?.[index]?.titleHi
                                        )
                                      }
                                      helperText={
                                        touched.benefit &&
                                        touched.benefit[index]?.titleHi &&
                                        errors.benefit?.[index]?.titleHi
                                      }
                                    />
                                    <CustomTextField
                                      as="textarea"
                                      name={`benefit.${index}.description`}
                                      placeholder="Description (English)"
                                      value={item.description}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      rows={3}
                                      error={
                                        touched.benefit &&
                                        touched.benefit[index]?.description &&
                                        Boolean(
                                          errors.benefit?.[index]?.description
                                        )
                                      }
                                      helperText={
                                        touched.benefit &&
                                        touched.benefit[index]?.description &&
                                        errors.benefit?.[index]?.description
                                      }
                                    />
                                    <CustomTextField
                                      as="textarea"
                                      name={`benefit.${index}.descriptionHi`}
                                      placeholder="विवरण (हिंदी)"
                                      value={item.descriptionHi}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      rows={3}
                                      error={
                                        touched.benefit &&
                                        touched.benefit[index]?.descriptionHi &&
                                        Boolean(
                                          errors.benefit?.[index]?.descriptionHi
                                        )
                                      }
                                      helperText={
                                        touched.benefit &&
                                        touched.benefit[index]?.descriptionHi &&
                                        errors.benefit?.[index]?.descriptionHi
                                      }
                                    />
                                  </Stack>
                                </Grid>
                                <Grid
                                  item
                                  xs={1}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                    pt: 1,
                                  }}
                                >
                                  {values.benefit.length > 1 && (
                                    <IconButton
                                      onClick={() => remove(index)}
                                      size="small"
                                      aria-label="delete"
                                      sx={{ m: 0, p: 0 }}
                                    >
                                      <DeleteOutlinedIcon color="error" />
                                    </IconButton>
                                  )}
                                </Grid>
                                {index === values.benefit.length - 1 &&
                                  values.benefit.length < 3 && (
                                    <Grid item xs={12} sx={{ pt: 1 }}>
                                      <Button
                                        onClick={() =>
                                          push({
                                            title: "",
                                            titleHi: "",
                                            description: "",
                                            descriptionHi: "",
                                          })
                                        }
                                        variant="text"
                                      >
                                        Add Benefit
                                      </Button>
                                    </Grid>
                                  )}
                              </Grid>
                            ))}
                          </Box>
                        )}
                      </FieldArray>
                    </Grid>

                    {/* FAQ array */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        FAQ <span className="required-icon">*</span>
                      </Typography>
                      <FieldArray name="faq">
                        {({ push, remove }) => (
                          <Box>
                            {values.faq.map((item, index) => (
                              <Grid
                                container
                                spacing={2}
                                key={index}
                                alignItems="center"
                                sx={{ mb: 1, position: "relative" }}
                              >
                                <Grid item xs={11} size={11}>
                                  <Stack spacing={2}>
                                    <CustomTextField
                                      name={`faq.${index}.question`}
                                      placeholder="Question (English)"
                                      value={item.question}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      error={
                                        touched.faq &&
                                        touched.faq[index] &&
                                        touched.faq[index].question &&
                                        Boolean(errors.faq?.[index]?.question)
                                      }
                                      helperText={
                                        touched.faq &&
                                        touched.faq[index] &&
                                        touched.faq[index].question &&
                                        errors.faq?.[index]?.question
                                      }
                                    />
                                    <CustomTextField
                                      name={`faq.${index}.questionHi`}
                                      placeholder="प्रश्न (हिंदी)"
                                      value={item.questionHi}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      error={
                                        touched.faq &&
                                        touched.faq[index] &&
                                        touched.faq[index].questionHi &&
                                        Boolean(errors.faq?.[index]?.questionHi)
                                      }
                                      helperText={
                                        touched.faq &&
                                        touched.faq[index] &&
                                        touched.faq[index].questionHi &&
                                        errors.faq?.[index]?.questionHi
                                      }
                                    />
                                    <CustomTextField
                                      as="textarea"
                                      name={`faq.${index}.answer`}
                                      placeholder="Answer (English)"
                                      value={item.answer}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      error={
                                        touched.faq &&
                                        touched.faq[index] &&
                                        touched.faq[index].answer &&
                                        Boolean(errors.faq?.[index]?.answer)
                                      }
                                      helperText={
                                        touched.faq &&
                                        touched.faq[index] &&
                                        touched.faq[index].answer &&
                                        errors.faq?.[index]?.answer
                                      }
                                      rows={3}
                                    />
                                    <CustomTextField
                                      as="textarea"
                                      name={`faq.${index}.answerHi`}
                                      placeholder="उत्तर (हिंदी)"
                                      value={item.answerHi}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      fullWidth
                                      size="small"
                                      error={
                                        touched.faq &&
                                        touched.faq[index] &&
                                        touched.faq[index].answerHi &&
                                        Boolean(errors.faq?.[index]?.answerHi)
                                      }
                                      helperText={
                                        touched.faq &&
                                        touched.faq[index] &&
                                        touched.faq[index].answerHi &&
                                        errors.faq?.[index]?.answerHi
                                      }
                                      rows={3}
                                    />
                                  </Stack>
                                </Grid>
                                <Grid
                                  item
                                  xs={1}
                                  size={1}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                    pt: 1,
                                  }}
                                >
                                  {values.faq.length > 1 && (
                                    <IconButton
                                      onClick={() => remove(index)}
                                      size="small"
                                      aria-label="delete"
                                      sx={{ m: 0, p: 0 }}
                                    >
                                      <DeleteOutlinedIcon color="error" />
                                    </IconButton>
                                  )}
                                </Grid>
                                {index === values.faq.length - 1 &&
                                  values.faq.length < 5 && (
                                    <Grid item xs={12} sx={{ pt: 1 }}>
                                      <Button
                                        onClick={() =>
                                          push({
                                            question: "",
                                            questionHi: "",
                                            answer: "",
                                            answerHi: "",
                                          })
                                        }
                                        variant="text"
                                      >
                                        Add FAQ
                                      </Button>
                                    </Grid>
                                  )}
                              </Grid>
                            ))}
                          </Box>
                        )}
                      </FieldArray>
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        Add On Item List
                      </Typography>
                      <FieldArray name="items">
                        {({ push, remove }) => (
                          <Box>
                            {values.items.map((item, index) => (
                              <Box
                                key={index}
                                sx={{
                                  mb: 3,
                                  borderRadius: "8px",
                                }}
                              >
                                <Stack spacing={2}>
                                  <CustomTextField
                                    name={`items.${index}.title`}
                                    placeholder="Title (English)"
                                    value={item.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.items &&
                                      touched.items[index]?.title &&
                                      Boolean(errors.items?.[index]?.title)
                                    }
                                    helperText={
                                      touched.items &&
                                      touched.items[index]?.title &&
                                      errors.items?.[index]?.title
                                    }
                                  />

                                  {/* Title (Hindi) */}
                                  <CustomTextField
                                    name={`items.${index}.titleHi`}
                                    placeholder="शीर्षक (हिंदी)"
                                    value={item.titleHi}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.items &&
                                      touched.items[index]?.titleHi &&
                                      Boolean(errors.items?.[index]?.titleHi)
                                    }
                                    helperText={
                                      touched.items &&
                                      touched.items[index]?.titleHi &&
                                      errors.items?.[index]?.titleHi
                                    }
                                  />

                                  <CustomTextField
                                    name={`items.${index}.description`}
                                    placeholder="Description (English)"
                                    value={item.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.items &&
                                      touched.items[index]?.description &&
                                      Boolean(
                                        errors.items?.[index]?.description
                                      )
                                    }
                                    helperText={
                                      touched.items &&
                                      touched.items[index]?.description &&
                                      errors.items?.[index]?.description
                                    }
                                  />

                                  <CustomTextField
                                    name={`items.${index}.descriptionHi`}
                                    placeholder="विवरण (हिंदी)"
                                    value={item.descriptionHi}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.items &&
                                      touched.items[index]?.descriptionHi &&
                                      Boolean(
                                        errors.items?.[index]?.descriptionHi
                                      )
                                    }
                                    helperText={
                                      touched.items &&
                                      touched.items[index]?.descriptionHi &&
                                      errors.items?.[index]?.descriptionHi
                                    }
                                  />

                                  <CustomTextField
                                    name={`items.${index}.price`}
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.items &&
                                      touched.items[index]?.price &&
                                      Boolean(errors.items?.[index]?.price)
                                    }
                                    helperText={
                                      touched.items &&
                                      touched.items[index]?.price &&
                                      errors.items?.[index]?.price
                                    }
                                  />

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                    }}
                                  >
                                    <input
                                      accept="image/*"
                                      type="file"
                                      style={{ display: "none" }}
                                      id={`items-${index}-image`}
                                      onChange={(e) => {
                                        if (
                                          e.target.files &&
                                          e.target.files[0]
                                        ) {
                                          const file = e.target.files[0];
                                          setFieldValue(
                                            `items.${index}.img`,
                                            file
                                          );
                                          setFieldValue(
                                            `items.${index}.imgName`,
                                            file.name
                                          );
                                        }
                                      }}
                                    />
                                    <label htmlFor={`items-${index}-image`}>
                                      <Button
                                        variant="outlined"
                                        component="span"
                                        size="small"
                                        sx={{ borderRadius: "2rem" }}
                                      >
                                        <img
                                          src={UploadIcon}
                                          alt="Upload"
                                          style={{ width: 20, marginRight: 8 }}
                                        />
                                        Upload Image
                                      </Button>
                                    </label>

                                    {item.img && (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          background: "#f3f2f1",
                                          padding: "4px 10px",
                                          borderRadius: 12,
                                        }}
                                      >
                                        <Typography
                                          sx={{ fontFamily: "Poppins" }}
                                        >
                                          {item.img.name || item.imgName}
                                        </Typography>
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            setFieldValue(
                                              `items.${index}.img`,
                                              ""
                                            );
                                            setFieldValue(
                                              `items.${index}.imgName`,
                                              ""
                                            );
                                          }}
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    )}
                                  </Box>

                                  {values.items.length > 1 && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      <IconButton
                                        onClick={() => remove(index)}
                                        size="small"
                                        aria-label="delete"
                                      >
                                        <DeleteOutlinedIcon color="error" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Stack>

                                {index === values.items.length - 1 &&
                                  values.items.length < 5 && (
                                    <Box sx={{ mt: 2 }}>
                                      <Button
                                        onClick={() =>
                                          push({
                                            title: "",
                                            titleHi: "",
                                            description: "",
                                            descriptionHi: "",
                                            price: "",
                                            img: "",
                                            imgName: "",
                                          })
                                        }
                                      >
                                        Add items
                                      </Button>
                                    </Box>
                                  )}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </FieldArray>
                    </Grid>
                  </Box>

                  {/* Submit Button */}
                  <Grid item xs={12} sm={6} size={12} sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "1rem",
                      }}
                    >
                      <Button
                        className="create-btn"
                        type="submit"
                        disable={loading}
                        loading={loading}
                        // sdisabled={!isValid || !dirty}
                      >
                        Create Pooja
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </GlobalCssStyles>
  );
}
