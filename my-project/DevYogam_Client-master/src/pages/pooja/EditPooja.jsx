import { Box, Button, Typography, IconButton, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import { CustomTextField, GlobalCssStyles } from "../../style/GlobalCSS";
import { FieldArray, Form, Formik } from "formik";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AsyncCreatableSelect from "react-select/async-creatable";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import * as Yup from "yup";
import UploadIcon from "../../assests/upload-icon.svg";
import CloseIcon from "@mui/icons-material/Close";
import { GetAllTempleAPI } from "../../services/GetAllTempleAPI";
import { useNavigate, useParams } from "react-router-dom";
import { GetPoojaByID } from "../../services/GetPoojaByID";
import { EditPoojaAPI } from "../../services/EditPoojaAPI";

const MAX_LOGOS = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Pooja Title is required"),
  titleHi: Yup.string().required("पूजा का शीर्षक आवश्यक है"),
  subtitle: Yup.string().required("Subtitle is required"),
  subtitleHi: Yup.string().required("उपशीर्षक आवश्यक है"),
  location: Yup.object().nullable().required("Location (English) is required"),
  locationHi: Yup.object().nullable().required("स्थान (हिंदी) आवश्यक है"),
  capDate: Yup.date().nullable().required("Date is required"),
  logoImages: Yup.array().min(1, "At least 1 logo image is required"),
  logoImagesHi: Yup.array().min(1, "At least 1 logo image is required"),
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
    .max(3, "Maximum 3 benefits allowed"),
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
    .max(5, "Maximum 5 FAQs allowed"),
  // Price array for single/couple/family
  price: Yup.array()
    .of(
      Yup.object().shape({
        single: Yup.object().shape({
          amaount: Yup.number()
            .typeError("Single Price must be a number")
            .required("Single required"),
          description: Yup.string().required("Desc required"),
          descriptionHi: Yup.string().required("Desc required"),
        }),
        couple: Yup.object().shape({
          amaount: Yup.number()
            .typeError("Couple Price must be a number")
            .required("Couple required"),
          description: Yup.string().required("Desc required"),
          descriptionHi: Yup.string().required("Desc required"),
        }),
        family: Yup.object().shape({
          amaount: Yup.number()
            .typeError("Family Price must be a number")
            .required("Family required"),
          description: Yup.string().required("Desc required"),
          descriptionHi: Yup.string().required("Desc required"),
        }),
      })
    )
    .required("Price details are required"),
});

function mapResponseToFormikInitialValues(pooja) {
  return {
    title: pooja.title || "",
    titleHi: pooja.titleHi || "",
    subtitle: pooja.subtitle || "",
    subtitleHi: pooja.subtitleHi || "",
    location: pooja.location
      ? { value: pooja.location, label: pooja.location }
      : null,
    locationHi: pooja.locationHi
      ? { value: pooja.locationHi, label: pooja.locationHi }
      : null,
    capDate: pooja.capDate ? dayjs(pooja.capDate).toISOString() : null,
    logoImages: (pooja.images || []).map((img) => ({
      url: img.url,
      _id: img._id,
    })),
    logoImagesHi: (pooja.images_hi || []).map((img) => ({
      url: img.url,
      _id: img._id,
    })),
    price: pooja.price?.length
      ? pooja.price
      : [
          {
            single: { amaount: "", description: "", descriptionHi: "" },
            couple: { amaount: "", description: "", descriptionHi: "" },
            family: { amaount: "", description: "", descriptionHi: "" },
          },
        ],
    benefit: pooja.benefit?.length
      ? pooja.benefit
      : [{ title: "", titleHi: "", description: "", descriptionHi: "" }],
    faq: pooja.faq?.length
      ? pooja.faq
      : [{ question: "", questionHi: "", answer: "", answerHi: "" }],
    items: pooja.items?.length
      ? pooja.items
      : [
          {
            title: "",
            titleHi: "",
            description: "",
            descriptionHi: "",
            price: "",
            img: null,
            imgName: "",
          },
        ],
  };
}

export default function EditPooja() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [templeList, setTempleList] = useState([]);
  const [templeListHi, setTempleListHi] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTemplesAndPooja() {
      const temples = await GetAllTempleAPI();
      setTempleList(
        (temples || []).map((t) => ({ value: t.title, label: t.title }))
      );
      setTempleListHi(
        (temples || []).map((t) => ({
          value: t.titleHi || t.title,
          label: t.titleHi || t.title,
        }))
      );
      if (id) {
        const pooja = await GetPoojaByID(id);
        setInitialValues(mapResponseToFormikInitialValues(pooja));
      }
    }
    fetchTemplesAndPooja();
  }, [id]);

  const locationOptions = [...templeList];
  const locationOptionsHi = [...templeListHi];

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

  if (!initialValues) return <div>Loading...</div>;

  return (
    <GlobalCssStyles>
      <Box style={{ width: "90%", margin: "auto", marginTop: "2%" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values) => {
            setLoading(true);
            const res = await EditPoojaAPI(id, values);
            setLoading(false);
            if (res.status === 200) {
              // Refresh UI
              // const updatedPooja = await GetPoojaByID(id);
              // setInitialValues(mapResponseToFormikInitialValues(updatedPooja));
              alert("Pooja updated!");
              navigate(`/pooja`);
              // Optionally, redirect or reset form
            } else {
              alert(res.error || "Update failed");
            }
          }}
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
                  Edit Pooja
                </Typography>
                <Grid container spacing={2} sx={{ width: "100%" }}>
                  <Box sx={{ width: "80%" }}>
                    {/* Title fields */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="title"
                          name="title"
                          value={values.title}
                          label="Title (English)"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                        />
                        <CustomTextField
                          id="titleHi"
                          name="titleHi"
                          value={values.titleHi}
                          label="Title (Hindi)"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                        />
                      </Stack>
                    </Grid>
                    {/* Subtitle fields */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <Stack spacing={1}>
                        <CustomTextField
                          id="subtitle"
                          name="subtitle"
                          value={values.subtitle}
                          label="Subtitle (English)"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                        />
                        <CustomTextField
                          id="subtitleHi"
                          name="subtitleHi"
                          value={values.subtitleHi}
                          label="Subtitle (Hindi)"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          fullWidth
                        />
                      </Stack>
                    </Grid>
                    {/* Location Selectors */}
                    <Grid item xs={12} sm={12} sx={{ mb: 1 }}>
                      <AsyncCreatableSelect
                        id="location"
                        name="location"
                        value={values.location}
                        defaultOptions={locationOptions}
                        loadOptions={loadLocationOptions}
                        onChange={(option) => {
                          setFieldValue("location", option);
                        }}
                        onBlur={() => setFieldTouched("location", true)}
                        placeholder="Select Location (English)"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <AsyncCreatableSelect
                        id="locationHi"
                        name="locationHi"
                        value={values.locationHi}
                        defaultOptions={locationOptionsHi}
                        loadOptions={loadLocationOptionsHi}
                        onChange={(option) =>
                          setFieldValue("locationHi", option)
                        }
                        onBlur={() => setFieldTouched("locationHi", true)}
                        placeholder="स्थान चुनें (हिंदी)"
                      />
                    </Grid>
                    {/* Date selector */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
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
                    </Grid>
                    {/* Images English & Hindi */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography>Add Pooja Images</Typography>
                      {values.logoImages.map((img, idx) => (
                        <Box key={idx}>
                          <img
                            src={img.url}
                            alt=""
                            width="100"
                            style={{ marginRight: "10px" }}
                          />
                          <IconButton>
                            <DeleteOutlinedIcon />
                          </IconButton>
                          {/* Handle removal logic here */}
                        </Box>
                      ))}
                      {/* Add upload new images code here as needed */}
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography>चित्र जोड़ें (हिंदी)</Typography>
                      {values.logoImagesHi.map((img, idx) => (
                        <Box key={idx}>
                          <img
                            src={img.url}
                            alt=""
                            width="60"
                            style={{ marginRight: "10px" }}
                          />
                          {/* Handle removal logic here */}
                        </Box>
                      ))}
                      {/* Add upload for Hindi images */}
                    </Grid>
                    {/* PRICE FIELDS */}
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                      <Typography>Price</Typography>
                      {values.price.map((p, idx) => (
                        <Box key={idx} sx={{ mb: 2, mt: 2 }}>
                          <Typography>Single</Typography>
                          <CustomTextField
                            name={`price[${idx}].single.amaount`}
                            label="Single Amount"
                            value={p.single.amaount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <CustomTextField
                            name={`price[${idx}].single.description`}
                            label="Single Desc (Eng)"
                            value={p.single.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <CustomTextField
                            name={`price[${idx}].single.descriptionHi`}
                            label="Single Desc (Hindi)"
                            value={p.single.descriptionHi}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <Typography>Couple</Typography>
                          <CustomTextField
                            name={`price[${idx}].couple.amaount`}
                            label="Couple Amount"
                            value={p.couple.amaount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                            fullWidth
                            sx={{ mb: 2, mt: 2 }}
                          />
                          <CustomTextField
                            name={`price[${idx}].couple.description`}
                            label="Couple Desc (Eng)"
                            value={p.couple.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <CustomTextField
                            name={`price[${idx}].couple.descriptionHi`}
                            label="Couple Desc (Hindi)"
                            value={p.couple.descriptionHi}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                          />
                          <Typography>Family</Typography>
                          <CustomTextField
                            name={`price[${idx}].family.amaount`}
                            label="Family Amount"
                            value={p.family.amaount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                            fullWidth
                            sx={{ mb: 2, mt: 2 }}
                          />
                          <CustomTextField
                            name={`price[${idx}].family.description`}
                            label="Family Desc (Eng)"
                            value={p.family.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <CustomTextField
                            name={`price[${idx}].family.descriptionHi`}
                            label="Family Desc (Hindi)"
                            value={p.family.descriptionHi}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            sx={{ mb: 2 }}
                            fullWidth
                          />
                        </Box>
                      ))}
                    </Grid>
                    {/* BENEFIT ARRAY */}
                    <FieldArray name="benefit">
                      {({ push, remove }) => (
                        <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                          <Typography>Benefits</Typography>
                          {values.benefit.map((benefit, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                              <CustomTextField
                                name={`benefit[${idx}].title`}
                                label="Benefit Title (Eng)"
                                value={benefit.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                sx={{ mb: 2, mt: 2 }}
                              />
                              <CustomTextField
                                name={`benefit[${idx}].titleHi`}
                                label="Benefit Title (Hindi)"
                                value={benefit.titleHi}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                sx={{ mb: 2 }}
                              />
                              <CustomTextField
                                name={`benefit[${idx}].description`}
                                label="Benefit Desc (Eng)"
                                value={benefit.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                multiline
                                sx={{ mb: 2 }}
                              />
                              <CustomTextField
                                name={`benefit[${idx}].descriptionHi`}
                                label="Benefit Desc (Hindi)"
                                value={benefit.descriptionHi}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                multiline
                                sx={{ mb: 2 }}
                              />
                              <IconButton onClick={() => remove(idx)}>
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            onClick={() =>
                              push({
                                title: "",
                                titleHi: "",
                                description: "",
                                descriptionHi: "",
                              })
                            }
                          >
                            Add Benefit
                          </Button>
                        </Grid>
                      )}
                    </FieldArray>
                    {/* FAQ ARRAY */}
                    <FieldArray name="faq">
                      {({ push, remove }) => (
                        <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                          <Typography sx={{ mb: 2 }}>FAQ</Typography>
                          {values.faq.map((faq, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                              <CustomTextField
                                sx={{ mb: 2 }}
                                name={`faq[${idx}].question`}
                                label="FAQ Question (Eng)"
                                value={faq.question}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                              />
                              <CustomTextField
                                sx={{ mb: 2 }}
                                name={`faq[${idx}].questionHi`}
                                label="FAQ Question (Hindi)"
                                value={faq.questionHi}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                              />
                              <CustomTextField
                                sx={{ mb: 2 }}
                                name={`faq[${idx}].answer`}
                                label="FAQ Answer (Eng)"
                                value={faq.answer}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                multiline
                              />
                              <CustomTextField
                                sx={{ mb: 2 }}
                                name={`faq[${idx}].answerHi`}
                                label="FAQ Answer (Hindi)"
                                value={faq.answerHi}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                multiline
                              />
                              <IconButton onClick={() => remove(idx)}>
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            onClick={() =>
                              push({
                                question: "",
                                questionHi: "",
                                answer: "",
                                answerHi: "",
                              })
                            }
                          >
                            Add FAQ
                          </Button>
                        </Grid>
                      )}
                    </FieldArray>
                    {/* ADDON ITEMS ARRAY */}
                    <FieldArray name="items">
                      {({ push, remove }) => (
                        <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                          <Typography sx={{ mb: 2 }}>Add-On Items</Typography>
                          {values.items.map((item, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                              <CustomTextField
                                name={`items[${idx}].title`}
                                label="Item Title (Eng)"
                                value={item.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                sx={{ mb: 2 }}
                              />
                              <CustomTextField
                                name={`items[${idx}].titleHi`}
                                label="Item Title (Hindi)"
                                value={item.titleHi}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                sx={{ mb: 2 }}
                              />
                              <CustomTextField
                                name={`items[${idx}].description`}
                                label="Item Desc (Eng)"
                                value={item.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                multiline
                                sx={{ mb: 2 }}
                              />
                              <CustomTextField
                                name={`items[${idx}].descriptionHi`}
                                label="Item Desc (Hindi)"
                                value={item.descriptionHi}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                fullWidth
                                multiline
                                sx={{ mb: 2 }}
                              />
                              <CustomTextField
                                name={`items[${idx}].price`}
                                label="Item Price"
                                value={item.price}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="number"
                                fullWidth
                                sx={{ mb: 2 }}
                              />
                              {/* Handle image upload */}
                              <IconButton onClick={() => remove(idx)}>
                                <DeleteOutlinedIcon />
                              </IconButton>
                            </Box>
                          ))}
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
                            Add Item
                          </Button>
                        </Grid>
                      )}
                    </FieldArray>
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
                        disabled={loading}
                      >
                        Update Pooja
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
