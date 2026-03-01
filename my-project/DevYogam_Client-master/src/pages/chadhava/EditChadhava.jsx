import { Box, Button, Typography, IconButton, Stack } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CustomTextField, GlobalCssStyles } from "../../style/GlobalCSS";
import { FieldArray, Form, Formik } from "formik";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AsyncSelect from "react-select/async";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import * as Yup from "yup";
import { CreatePoojaAPI } from "../../services/CreatePoojaAPI";
import UploadIcon from "../../assests/upload-icon.svg";
import CloseIcon from "@mui/icons-material/Close";
import { CreateTempleAPI } from "../../services/CreateTempleAPI";
import { CreateChadhavaAPI } from "../../services/CreateChadhavaAPI";
import { GetAllTempleAPI } from "../../services/GetAllTempleAPI";
import AsyncCreatableSelect from "react-select/async-creatable";
import { UploadItemImg } from "../../services/UploadItemImg";
import { CreatePoojaFile } from "../../services/CreatePoojaFile";
import { useNavigate, useParams } from "react-router-dom";
import { GetChadavaByID } from "../../services/GetChadavaByID";
import { LanguageContext } from "../../context/LanguageContext";

const MAX_LOGOS = 5;

const initialValues = {
  title: "",
  titleHi: "",
  subtitle: "",
  subtitleHi: "",
  desc: null,
  descHi: null,
  chadhava: null,
  startDate: null,
  file: null,
  fileHi: null,
  logoImages: Array(MAX_LOGOS).fill(null),
  logoImagesHi: Array(MAX_LOGOS).fill(null),
  newLogoImages: [],
  newLogoImagesHi: [],
  removedLogoImageIds: [],
  removedLogoImageIdsHi: [],
  cItem: [
    {
      title: "",
      titleHi: "",
      description: "",
      descriptionHi: "",
      price: "",
      img: "",
    },
  ],
  benefit: [
    {
      title: "",
      titleHi: "",
      description: "",
      descriptionHi: "",
    },
  ],
  faq: [{ question: "", questionHi: "", answer: "", answerHi: "" }],
};
export default function EditChadhava({ open, handleClose }) {
  const [poojaData, setPoojaData] = useState(initialValues);
  const { language } = useContext(LanguageContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [templeData, setTempleData] = useState([]);
  const [mandirOptions, setMandirOptions] = useState([]);
  const [templeList, setTempleList] = useState([]);
  const [templeListHi, setTempleListHi] = useState([]);

  useEffect(() => {
    const getPooja = async () => {
      const response = await GetChadavaByID(id);
      // const language = language === "hi" ? "Hi" : "";

      const pickLang = (obj, base) =>
        obj?.[`${base}${language}`] ?? obj?.[base];

      setPoojaData({
        title: response?.title || "",
        titleHi: response?.titleHi || "",
        subtitle: response?.subtitle || "",
        subtitleHi: response?.subtitleHi || "",
        desc: response?.desc || "",
        descHi: response?.desc_hi || "",
        chadhava: response?.chadhava || null,

        // English images
        logoImages:
          response?.images?.map((img) => ({
            url: img.url,
            delete_url: img.delete_url,
            _id: img._id,
          })) || Array(MAX_LOGOS).fill(null),

        // Hindi images
        logoImagesHi:
          response?.images_hi?.map((img) => ({
            url: img.url,
            delete_url: img.delete_url,
            _id: img._id,
          })) || Array(MAX_LOGOS).fill(null),

        newLogoImages: [],
        newLogoImagesHi: [],
        removedLogoImageIds: [],
        removedLogoImageIdsHi: [],

        // Items
        cItem: response?.items?.map((item) => ({
          title: item.title || "",
          titleHi: item.titleHi || "",
          description: item.description || "",
          descriptionHi: item.descriptionHi || "",
          price: item.price || "",
          img: item.image?.url || "",
        })) || [
          {
            title: "",
            titleHi: "",
            description: "",
            descriptionHi: "",
            price: "",
            img: "",
          },
        ],

        // Benefits
        benefit: response?.benefit?.map((b) => ({
          title: b.title || "",
          titleHi: b.titleHi || "",
          description: b.description || "",
          descriptionHi: b.descriptionHi || "",
        })) || [
          {
            title: "",
            titleHi: "",
            description: "",
            descriptionHi: "",
          },
        ],

        // FAQ
        faq: response?.faq?.map((f) => ({
          question: f.question || "",
          questionHi: f.questionHi || "",
          answer: f.answer || "",
          answerHi: f.answerHi || "",
        })) || [
          {
            question: "",
            questionHi: "",
            answer: "",
            answerHi: "",
          },
        ],
      });

      //   const filtered = {
      //     ...res,
      //     title: pickLang(res, "title"),
      //     subtitle: pickLang(res, "subtitle"),
      //     location: pickLang(res, "location"),
      //     images:
      //       language === "Hi" &&
      //       Array.isArray(res.images_hi) &&
      //       res.images_hi.length > 0
      //         ? res.images_hi
      //         : res.images || [],
      //     price: Array.isArray(res.price)
      //       ? res.price.map((p) => ({
      //           ...p,
      //           single: {
      //             ...p.single,
      //             description: pickLang(p.single, "description"),
      //           },
      //           couple: {
      //             ...p.couple,
      //             description: pickLang(p.couple, "description"),
      //           },
      //           family: {
      //             ...p.family,
      //             description: pickLang(p.family, "description"),
      //           },
      //         }))
      //       : [],
      //     benefit: Array.isArray(res.benefit)
      //       ? res.benefit.map((b) => ({
      //           ...b,
      //           title: pickLang(b, "title"),
      //           description: pickLang(b, "description"),
      //         }))
      //       : [],
      //     faq: Array.isArray(res.faq)
      //       ? res.faq.map((f) => ({
      //           ...f,
      //           question: pickLang(f, "question"),
      //           answer: pickLang(f, "answer"),
      //         }))
      //       : [],
      //   };

      //   setPoojaData(filtered);
    };
    getPooja();
  }, [id, language]);

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

  // const handleLogoImagesUpload = (event, values, setFieldValue) => {
  //   const files = Array.from(event.target.files);
  //   const combined = [...(values.logoImages || []), ...files].slice(
  //     0,
  //     MAX_LOGOS
  //   );
  //   setFieldValue("logoImages", combined);
  //   setFieldValue(
  //     "newLogoImages",
  //     [...(values.newLogoImages || []), ...files].slice(0, MAX_LOGOS)
  //   );
  // };
  // const removeLogoImage = (index, values, setFieldValue) => {
  //   const updated = [...values.logoImages];
  //   const removedFile = updated[index];
  //   if (removedFile && removedFile._id) {
  //     setFieldValue("removedLogoImageIds", [
  //       ...(values.removedLogoImageIds || []),
  //       removedFile._id,
  //     ]);
  //   } else {
  //     setFieldValue(
  //       "newLogoImages",
  //       (values.newLogoImages || []).filter((file) => file !== removedFile)
  //     );
  //   }

  //   updated.splice(index, 1);
  //   setFieldValue("logoImages", updated);
  // };
  // const handleLogoImagesUploadHi = (event, values, setFieldValue) => {
  //   const files = Array.from(event.target.files);
  //   const combined = [...(values.b || []), ...files].slice(0, MAX_LOGOS);
  //   setFieldValue("logoImagesHi", combined);
  //   setFieldValue(
  //     "newLogoImagesHi",
  //     [...(values.newLogoImagesHi || []), ...files].slice(0, MAX_LOGOS)
  //   );
  // };
  // const removeLogoImageHi = (index, values, setFieldValue) => {
  //   const updated = [...values.logoImagesHi];
  //   const removedFile = updated[index];
  //   if (removedFile && removedFile._id) {
  //     setFieldValue("removedLogoImageIdsHi", [
  //       ...(values.removedLogoImageIdsHi || []),
  //       removedFile._id,
  //     ]);
  //   } else {
  //     setFieldValue(
  //       "newLogoImagesHi",
  //       (values.newLogoImagesHi || []).filter((file) => file !== removedFile)
  //     );
  //   }

  //   updated.splice(index, 1);
  //   setFieldValue("logoImagesHi", updated);
  // };
  // Utility function to handle upload per index
  const handleLogoImageUploadAtIndex = (
    event,
    values,
    setFieldValue,
    index,
    fieldName,
    newFieldName
  ) => {
    const file = event.target.files[0] || null;
    const updated = [...values[fieldName]];
    updated[index] = file;

    setFieldValue(fieldName, updated);

    if (file) {
      setFieldValue(newFieldName, [...(values[newFieldName] || []), file]);
    }
  };

  const removeLogoImageAtIndex = (
    index,
    values,
    setFieldValue,
    fieldName,
    newFieldName,
    removedIdsField
  ) => {
    const updated = [...values[fieldName]];
    const removedFile = updated[index];

    if (removedFile && removedFile._id) {
      setFieldValue(removedIdsField, [
        ...(values[removedIdsField] || []),
        removedFile._id,
      ]);
    } else {
      setFieldValue(
        newFieldName,
        (values[newFieldName] || []).filter((file) => file !== removedFile)
      );
    }
  };
  const handleSubmit = async (val) => {
    let itemImg;
    // if (val?.cItem?.length > 0) {
    //   const images = val.cItem.map((i) => i.img);
    //   itemImg = await UploadItemImg(images);
    // }

    const itemImageData = {
      data: {
        images: val.cItem.map((item) => item.imageUrl || ""),
      },
    };
    const response = await CreateChadhavaAPI(val, itemImageData);
    if (response?._id) {
      const res = await CreatePoojaFile(response?._id, val, "chadhava");
      alert("Chadhava created successfully");
      if (res?.data?.status) {
        navigate("/chadhava");
      }
    } else if (response?.error) {
      alert(`Error: ${response?.error}`);
    }
    console.log("Uploaded Image URLs:", itemImg?.data?.images);
  };
  return (
    <GlobalCssStyles>
      <Box style={{ width: "90%", margin: "auto", marginTop: "2%   " }}>
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
            <Form
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
            >
              <Box style={{ width: "90%", margin: "auto" }}>
                <Typography className="policies-text" sx={{ mb: 2 }}>
                  Edit Chadhava
                </Typography>

                <Grid container spacing={2} sx={{ width: "100%" }}>
                  <Box sx={{ width: "80%" }}>
                    {/*  Title */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Title <span className="required-icon">*</span>
                      </Typography>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="title"
                          name="title"
                          value={values.title}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter Chadhava (English)"
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
                          placeholder="चढावा का नाम (हिंदी)"
                          fullWidth
                          size="small"
                          error={touched.titleHi && Boolean(errors.titleHi)}
                          helperText={touched.titleHi && errors.titleHi}
                        />
                      </Stack>
                    </Grid>
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
                          placeholder="Enter sub-Title (English)"
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
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Chadhava <span className="required-icon">*</span>
                      </Typography>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="chadhava"
                          name="chadhava"
                          value={values.chadhava}
                          autoComplete="off"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter chadhava "
                          fullWidth
                          size="small"
                          error={touched.chadhava && Boolean(errors.chadhava)}
                          helperText={touched.chadhava && errors.chadhava}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Mandir <span className="required-icon">*</span>
                      </Typography>
                      <AsyncCreatableSelect
                        id="originator"
                        name="originator"
                        cacheOptions
                        defaultOptions={mandirOptions}
                        options={mandirOptions}
                        value={values.mandir}
                        onChange={(option) => setFieldValue("mandir", option)}
                        isClearable
                        placeholder="Select Mandir"
                        getOptionLabel={(e) => e.label}
                        getOptionValue={(e) => e.value}
                        onBlur={() => setFieldTouched("mandir", true)}
                      />
                      {touched.mandir && errors.mandir && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.mandir}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        मंदिर चुने <span className="required-icon">*</span>
                      </Typography>
                      <AsyncCreatableSelect
                        id="originator"
                        name="originator"
                        cacheOptions
                        defaultOptions={mandirOptions}
                        options={mandirOptions}
                        value={values.mandirHi}
                        onChange={(option) => setFieldValue("mandirHi", option)}
                        isClearable
                        placeholder="Select Mandir"
                        getOptionLabel={(e) => e.label}
                        getOptionValue={(e) => e.value}
                        onBlur={() => setFieldTouched("mandirHi", true)}
                      />
                      {touched.mandirHi && errors.mandirHi && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.mandirHi}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Add Image (English){" "}
                        <span className="required-icon">*</span>
                      </Typography>
                      {[...Array(MAX_LOGOS)].map((_, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            gap: "0.7rem",
                          }}
                        >
                          <input
                            type="file"
                            id={`logo-images-upload-${idx}`}
                            style={{ display: "none" }}
                            accept="image/*"
                            // onChange={(e) =>
                            //  handleLogoImageUploadAtIndex(
                            //                       e,
                            //                       values,
                            //                       setFieldValue,
                            //                       idx,
                            //                       "logoImages",
                            //                       "newLogoImages"
                            //                     )
                            // }
                            // onChange={async (e) => {
                            //   const file = e.currentTarget.files[0];
                            //   if (file) {
                            //     // Upload image immediately
                            //     const uploadedUrl = await UploadItemImg(file);
                            //     if (uploadedUrl) {
                            //       setFieldValue(
                            //         `logoImages.${idx}.imageUrl`,
                            //         uploadedUrl?.data?.images
                            //       );
                            //     }
                            //   }
                            // }}
                          />
                          {values.logoImages[idx] ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                background: "#f3f2f1",
                                padding: "4px 10px",
                                borderRadius: 12,
                                gap: 1,
                              }}
                            >
                              {/* Show image preview */}
                              {values.logoImages[idx]?.url ? (
                                <img
                                  src={values.logoImages[idx].url}
                                  alt={`logo-${idx}`}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                />
                              ) : (
                                <img
                                  src={URL.createObjectURL(
                                    values.logoImages[idx]
                                  )}
                                  alt={`logo-${idx}`}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                />
                              )}

                              <Typography sx={{ fontFamily: "Poppins" }}>
                                {values.logoImages[idx]?.name ||
                                  "Uploaded Image"}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeLogoImageAtIndex(
                                    idx,
                                    values,
                                    setFieldValue,
                                    "logoImages",
                                    "newLogoImages",
                                    "removedLogoImageIds"
                                  )
                                }
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ) : (
                            <Button
                              type="button"
                              variant="outlined"
                              size="small"
                              style={{
                                minHeight: "2.5rem",
                                borderRadius: 20,
                                background: "#fff",
                              }}
                              onClick={() =>
                                document
                                  .getElementById(`logo-images-upload-${idx}`)
                                  .click()
                              }
                            >
                              <img
                                src={UploadIcon}
                                alt="Upload"
                                style={{ width: 20, marginRight: 8 }}
                              />
                              Upload Image {idx + 1}
                            </Button>
                          )}
                        </Box>
                      ))}
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

                    {/* Hindi */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        चित्र जोड़ें (हिंदी){" "}
                        <span className="required-icon">*</span>
                      </Typography>
                      {[...Array(MAX_LOGOS)].map((_, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            gap: "0.7rem",
                          }}
                        >
                          <input
                            type="file"
                            id={`logo-images-upload-hi-${idx}`}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={(e) =>
                              handleLogoImageUploadAtIndex(
                                e,
                                values,
                                setFieldValue,
                                idx,
                                "logoImagesHi",
                                "newLogoImagesHi"
                              )
                            }
                          />
                          {values.logoImagesHi[idx] && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                background: "#f3f2f1",
                                padding: "4px 10px",
                                borderRadius: 12,
                                gap: 1,
                              }}
                            >
                              {values.logoImagesHi[idx]?.url ? (
                                // 📌 Existing image (string URL)
                                <img
                                  src={values.logoImagesHi[idx].url}
                                  alt={`logo-hi-${idx}`}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                />
                              ) : (
                                // 📌 Newly uploaded image (File object)
                                <img
                                  src={URL.createObjectURL(
                                    values.logoImagesHi[idx]
                                  )}
                                  alt={`logo-hi-${idx}`}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                  }}
                                />
                              )}

                              <Typography sx={{ fontFamily: "Poppins" }}>
                                {values.logoImagesHi[idx]?.name ||
                                  "Uploaded Image"}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeLogoImageAtIndex(
                                    idx,
                                    values,
                                    setFieldValue,
                                    "logoImagesHi",
                                    "newLogoImagesHi",
                                    "removedLogoImageIdsHi"
                                  )
                                }
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      ))}
                      {touched.logoImagesHi && errors.logoImagesHi && (
                        <Typography
                          color="error"
                          variant="caption"
                          className="error-msg"
                        >
                          {errors.logoImagesHi}
                        </Typography>
                      )}
                    </Grid>

                    {/* File upload (English) */}
                    {/* <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        Add Image (English){" "}
                        <span className="required-icon">*</span>
                      </Typography>
                      <input
                        type="file"
                        id="logo-images-upload"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={(e) => {
                          handleLogoImagesUpload(e, values, setFieldValue);
                        }}
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
                        {values?.logoImages &&
                          values?.logoImages?.map((file, idx) => (
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
                        {(values.logoImages?.length ?? 0) < MAX_LOGOS && (
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
                    </Grid> */}

                    {/* File upload (Hindi) */}
                    {/* <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography className="policy-form-label policy-text-field-label">
                        चित्र जोड़ें (हिंदी){" "}
                        <span className="required-icon">*</span>
                      </Typography>
                      <input
                        type="file"
                        id="logo-images-upload-hi"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={(e) => {
                          handleLogoImagesUploadHi(e, values, setFieldValue);
                        }}
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
                    </Grid> */}

                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        Description <span className="required-icon">*</span>
                      </Typography>
                      <CustomTextField
                        as="textarea"
                        name="description"
                        sx={{ minWidth: "100%", minHeight: "10vh" }}
                        placeholder="Description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        size="small"
                        error={
                          touched.description &&
                          touched.description &&
                          Boolean(errors.description)
                        }
                        helperText={
                          touched.description &&
                          touched.description &&
                          errors.description
                        }
                      />
                      <CustomTextField
                        as="textarea"
                        name="descriptionHi"
                        sx={{ minWidth: "100%", minHeight: "10vh" }}
                        placeholder="डिस्क्रिप्शन जोड़े (हिंदी)"
                        value={values.descriptionHi}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        size="small"
                        error={
                          touched.descriptionHi &&
                          touched.descriptionHi &&
                          Boolean(errors.descriptionHi)
                        }
                        helperText={
                          touched.descriptionHi &&
                          touched.descriptionHi &&
                          errors.descriptionHi
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Typography
                        className="policy-form-label policy-text-field-label"
                        sx={{ mb: 1 }}
                      >
                        Items <span className="required-icon">*</span>
                      </Typography>
                      <FieldArray name="cItem">
                        {({ push, remove }) => (
                          <Box>
                            {values.cItem.map((item, index) => (
                              <Box
                                key={index}
                                sx={{
                                  mb: 3,
                                  borderRadius: "8px",
                                }}
                              >
                                <Stack spacing={2}>
                                  <CustomTextField
                                    name={`cItem.${index}.title`}
                                    placeholder="Title (English)"
                                    value={item.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.cItem &&
                                      touched.cItem[index]?.title &&
                                      Boolean(errors.cItem?.[index]?.title)
                                    }
                                    helperText={
                                      touched.cItem &&
                                      touched.cItem[index]?.title &&
                                      errors.cItem?.[index]?.title
                                    }
                                  />

                                  {/* Title (Hindi) */}
                                  <CustomTextField
                                    name={`cItem.${index}.titleHi`}
                                    placeholder="शीर्षक (हिंदी)"
                                    value={item.titleHi}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.cItem &&
                                      touched.cItem[index]?.titleHi &&
                                      Boolean(errors.cItem?.[index]?.titleHi)
                                    }
                                    helperText={
                                      touched.cItem &&
                                      touched.cItem[index]?.titleHi &&
                                      errors.cItem?.[index]?.titleHi
                                    }
                                  />

                                  <CustomTextField
                                    name={`cItem.${index}.description`}
                                    placeholder="Description (English)"
                                    value={item.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.cItem &&
                                      touched.cItem[index]?.description &&
                                      Boolean(
                                        errors.cItem?.[index]?.description
                                      )
                                    }
                                    helperText={
                                      touched.cItem &&
                                      touched.cItem[index]?.description &&
                                      errors.cItem?.[index]?.description
                                    }
                                  />

                                  <CustomTextField
                                    name={`cItem.${index}.descriptionHi`}
                                    placeholder="विवरण (हिंदी)"
                                    value={item.descriptionHi}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.cItem &&
                                      touched.cItem[index]?.descriptionHi &&
                                      Boolean(
                                        errors.cItem?.[index]?.descriptionHi
                                      )
                                    }
                                    helperText={
                                      touched.cItem &&
                                      touched.cItem[index]?.descriptionHi &&
                                      errors.cItem?.[index]?.descriptionHi
                                    }
                                  />

                                  <CustomTextField
                                    name={`cItem.${index}.price`}
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    fullWidth
                                    size="small"
                                    error={
                                      touched.cItem &&
                                      touched.cItem[index]?.price &&
                                      Boolean(errors.cItem?.[index]?.price)
                                    }
                                    helperText={
                                      touched.cItem &&
                                      touched.cItem[index]?.price &&
                                      errors.cItem?.[index]?.price
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
                                      type="file"
                                      accept="image/*"
                                      id={`cItem-image-${index}`}
                                      style={{ display: "none" }}
                                      onChange={async (e) => {
                                        const file = e.currentTarget.files[0];
                                        if (file) {
                                          // Upload image immediately
                                          const uploadedUrl =
                                            await UploadItemImg(file);
                                          if (uploadedUrl) {
                                            setFieldValue(
                                              `cItem.${index}.imageUrl`,
                                              uploadedUrl?.data?.images
                                            );
                                          }
                                        }
                                      }}
                                    />
                                    <label htmlFor={`cItem-image-${index}`}>
                                      <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={
                                          <img
                                            src={UploadIcon}
                                            alt="Upload"
                                            style={{ width: 20 }}
                                          />
                                        }
                                      >
                                        Upload Image
                                      </Button>
                                    </label>

                                    {item.imageUrl && (
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        mt={1}
                                      >
                                        <img
                                          src={item.imageUrl?.url}
                                          alt={`Image Upload`}
                                          style={{
                                            height: 50,
                                            borderRadius: 4,
                                          }}
                                        />
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            setFieldValue(
                                              `cItem.${index}.imageUrl`,
                                              ""
                                            )
                                          }
                                          aria-label="remove image"
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </Stack>
                                    )}

                                    {/* <input
                                      accept="image/*"
                                      type="file"
                                      style={{ display: "none" }}
                                      id={`cItem-${index}-image`}
                                      onChange={(e) => {
                                        if (
                                          e.target.files &&
                                          e.target.files[0]
                                        ) {
                                          const file = e.target.files[0];
                                          setFieldValue(
                                            `cItem.${index}.img`,
                                            file
                                          );
                                          setFieldValue(
                                            `cItem.${index}.imgName`,
                                            file.name
                                          );
                                        }
                                      }}
                                    />
                                    <label htmlFor={`cItem-${index}-image`}>
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
                                              `cItem.${index}.img`,
                                              ""
                                            );
                                            setFieldValue(
                                              `cItem.${index}.imgName`,
                                              ""
                                            );
                                          }}
                                        >
                                          <CloseIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    )} */}
                                  </Box>

                                  {values.cItem.length > 1 && (
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

                                {index === values.cItem.length - 1 &&
                                  values.cItem.length < 5 && (
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
                                        variant="outlined"
                                      >
                                        Add Items
                                      </Button>
                                    </Box>
                                  )}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </FieldArray>
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
                            {values?.benefit?.map((item, index) => (
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
                            {values?.faq?.map((item, index) => (
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
                  </Box>

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
                        disabled={!isValid || !dirty}
                      >
                        Create Chadhava
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
