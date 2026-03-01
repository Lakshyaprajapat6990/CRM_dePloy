import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Stack,
  Grid,
} from "@mui/material";
import { CustomTextField, GlobalCssStyles } from "../../style/GlobalCSS";
import { Form, Formik } from "formik";
import AsyncCreatableSelect from "react-select/async-creatable";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import { CreateTempleAPI } from "../../services/CreateTempleAPI";
import UploadIcon from "../../assests/upload-icon.svg";
import { CreatePoojaFile } from "../../services/CreatePoojaFile";
import { useNavigate } from "react-router-dom";

const MAX_LOGOS = 5;

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Temple Title is required"),
  titleHi: Yup.string().required("मंदिर का नाम आवश्यक है"),
  subtitle: Yup.string().required("Subtitle is required"),
  subtitleHi: Yup.string().required("उपशीर्षक आवश्यक है"),
  location: Yup.object().nullable().required("Location (English) is required"),
  locationHi: Yup.object().nullable().required("स्थान (हिंदी) आवश्यक है"),
  logoImages: Yup.array()
    .min(1, "At least 1 logo image is required")
    .max(MAX_LOGOS, `Maximum ${MAX_LOGOS} images allowed`)
    .of(
      Yup.mixed()
        .test(
          "fileType",
          "Unsupported Format",
          (file) => !file || SUPPORTED_FORMATS.includes(file.type)
        )
        .test(
          "fileSize",
          "File too large",
          (file) => !file || file.size <= MAX_LOGOS * 1024 * 1024
        )
    ),
  logoImagesHi: Yup.array()
    .min(1, "At least 1 logo image is required")
    .max(MAX_LOGOS, `Maximum ${MAX_LOGOS} images allowed`)
    .of(
      Yup.mixed()
        .test(
          "fileType",
          "Unsupported Format",
          (file) => !file || SUPPORTED_FORMATS.includes(file.type)
        )
        .test(
          "fileSize",
          "File too large",
          (file) => !file || file.size <= MAX_LOGOS * 1024 * 1024
        )
    ),
  description: Yup.string().required("Description is required"),
  descriptionHi: Yup.string().required("वर्णन आवश्यक है"),
});

const initialValues = {
  title: "",
  titleHi: "",
  subtitle: "",
  subtitleHi: "",
  location: null,
  locationHi: null,
  capDate: null,
  logoImages: [],
  logoImagesHi: [],
  removedLogoImageIds: [],
  removedLogoImageIdsHi: [],
  description: "",
  descriptionHi: "",
  longDescription: "",
  longDescriptionHi: "",
};

export default function AddTemple({ open, handleClose }) {
  const [templeList, setTempleList] = useState([]);
  const [templeListHi, setTempleListHi] = useState([]);
  const navigate = useNavigate()

  const loadLocationOptions = (inputValue, callback) => {
    const filtered = templeList.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };

  const loadLocationOptionsHi = (inputValue, callback) => {
    const filtered = templeListHi.filter((opt) =>
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

  return (
    <GlobalCssStyles>
      <Box style={{ width: "90%", margin: "auto", marginTop: "2%" }}>
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("Submitting temple form", values);
            try {
              const response = await CreateTempleAPI(values);
              console.log("API Response:", response);
              if (response?.title === values.title) {
                const res = await CreatePoojaFile(
                  response?._id,
                  values,
                  "temple"
                );
                if (res?.status) {
                  alert("Temple created successfully");
                } 
                navigate("/temple");
              } else if (response.error) {
                alert(`Error: ${response.error}`);
                handleClose();
              }
            } catch (error) {
              console.error("Error submitting temple form", error);
              alert("Error submitting temple data");
            } finally {
              setSubmitting(false);
            }
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
            isSubmitting,
          }) => (
            <Form>
              <Box style={{ width: "90%", margin: "auto" }}>
                <Typography className="policies-text" sx={{ mb: 2 }}>
                  Add New Temple
                </Typography>

                <Grid container spacing={2} sx={{ width: "100%" }}>
                  <Grid size={12} item xs={12} sm={12} sx={{ mb: 1 }}>
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
                        placeholder="Enter Temple Title (English)"
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
                        placeholder="मंदिर का नाम (हिंदी)"
                        fullWidth
                        size="small"
                        error={touched.titleHi && Boolean(errors.titleHi)}
                        helperText={touched.titleHi && errors.titleHi}
                      />
                    </Stack>
                  </Grid>

                  <Grid item size={12} sm={12} sx={{ mb: 1 }}>
                    <Typography className="policy-form-label policy-text-field-label">
                      Bhagwan <span className="required-icon">*</span>
                    </Typography>
                    <Stack spacing={1}>
                      <CustomTextField
                        id="subtitle"
                        name="subtitle"
                        value={values.subtitle}
                        autoComplete="off"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Bhagwan Name (English)"
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
                        placeholder="भगवन का नाम (हिंदी)"
                        fullWidth
                        size="small"
                        error={touched.subtitleHi && Boolean(errors.subtitleHi)}
                        helperText={touched.subtitleHi && errors.subtitleHi}
                      />
                    </Stack>
                  </Grid>

                  <Grid item size={12} sm={12} sx={{ mb: 1 }}>
                    <Typography className="policy-form-label policy-text-field-label">
                      Location (English){" "}
                      <span className="required-icon">*</span>
                    </Typography>
                    <AsyncCreatableSelect
                      id="location"
                      name="location"
                      cacheOptions
                      isClearable
                      placeholder="Select or create location (English)"
                      value={values.location}
                      defaultOptions={templeList}
                      loadOptions={loadLocationOptions}
                      onChange={(option) => setFieldValue("location", option)}
                      onBlur={() => setFieldTouched("location", true)}
                    />
                    {touched.location && errors.location && (
                      <Typography
                        color="error"
                        variant="caption"
                        className="error-msg"
                      >
                        {errors.location}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item size={12} sm={12} sx={{ mb: 1 }}>
                    <Typography className="policy-form-label policy-text-field-label">
                      स्थान (हिंदी) <span className="required-icon">*</span>
                    </Typography>
                    <AsyncCreatableSelect
                      id="locationHi"
                      name="locationHi"
                      cacheOptions
                      isClearable
                      placeholder="स्थान चुनें या बनाएं (हिंदी)"
                      value={values.locationHi}
                      defaultOptions={templeListHi}
                      loadOptions={loadLocationOptionsHi}
                      onChange={(option) => setFieldValue("locationHi", option)}
                      onBlur={() => setFieldTouched("locationHi", true)}
                    />
                    {touched.locationHi && errors.locationHi && (
                      <Typography
                        color="error"
                        variant="caption"
                        className="error-msg"
                      >
                        {errors.locationHi}
                      </Typography>
                    )}
                  </Grid>

                  {/* Add logo images (English) */}
                  <Grid item size={12} sm={12} sx={{ mb: 2 }}>
                    <Typography className="policy-form-label policy-text-field-label">
                      Add Temple Images (English){" "}
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
                      {(values.logoImages || []).map((file, idx) => (
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
                          sx={{
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
                  </Grid>

                  {/* Add logo images (Hindi) */}
                  <Grid item size={12} sm={12} sx={{ mb: 2 }}>
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
                      {(values.logoImagesHi || []).map((file, idx) => (
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
                      {(values.logoImagesHi?.length ?? 0) < MAX_LOGOS && (
                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          sx={{
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
                  </Grid>

                  {/* Temple Description */}
                  <Grid item size={12} sm={12} sx={{ mb: 2 }}>
                    <Typography
                      className="policy-form-label policy-text-field-label"
                      sx={{ mb: 1 }}
                    >
                      Temple Description{" "}
                      <span className="required-icon">*</span>
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
                  {/* Long Description  */}
                  <Grid item size={12} sm={12} sx={{ mb: 2 }}>
                    <Typography
                      className="policy-form-label policy-text-field-label"
                      sx={{ mb: 1 }}
                    >
                      Long Description <span className="required-icon">*</span>
                    </Typography>
                    <CustomTextField
                      as="textarea"
                      name="longDescription"
                      sx={{ minWidth: "100%", minHeight: "15vh" }}
                      placeholder="Long Description"
                      value={values?.longDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      size="small"
                      error={
                        touched.longDescription &&
                        touched.longDescription &&
                        Boolean(errors.longDescription)
                      }
                      helperText={
                        touched.longDescription &&
                        touched.longDescription &&
                        errors.longDescription
                      }
                    />
                    <CustomTextField
                      as="textarea"
                      name="longDescriptionHi"
                      sx={{ minWidth: "100%", minHeight: "15vh" }}
                      placeholder="बड़ा डिस्क्रिप्शन जोड़े (हिंदी)"
                      value={values?.longDescriptionHi}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      size="small"
                      error={
                        touched.longDescriptionHi &&
                        touched.longDescriptionHi &&
                        Boolean(errors.longDescriptionHi)
                      }
                      helperText={
                        touched.longDescriptionHi &&
                        touched.longDescriptionHi &&
                        errors.longDescriptionHi
                      }
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item size={12} sm={6} sx={{ mt: 2 }}>
                    <Button
                      className="create-btn"
                      type="submit"
                      disabled={isSubmitting}
                      fullWidth
                    >
                      Create Temple
                    </Button>
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
