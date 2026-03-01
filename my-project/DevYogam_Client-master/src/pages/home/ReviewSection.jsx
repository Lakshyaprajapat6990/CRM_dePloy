import React, { useState, useContext, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Modal,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Grid,
  Rating,
} from "@mui/material";
import { LanguageContext } from "../../context/LanguageContext";
import { GetAllReviewsAPI } from "../../services/GetAllReviewsAPI";
import { AddReviewAPI } from "../../services/AddReviewAPI";
import { reviewsData } from "../../utils/constant/Constant";

export default function ReviewCard() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role || "user";

  const [selectedItem, setSelectedItem] = useState(0);
  const { language } = useContext(LanguageContext);
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    quote: "",
    review: "",
    nameHi: "",
    designationHi: "",
    quoteHi: "",
    reviewHi: "",
    rating: "",
  });

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log("review data === > ", reviewData);
  const handleSubmit = async () => {
    try {
      const res = await AddReviewAPI(formData);
      if (res.status === 200 && res.data.status) {
        alert("✅ Review added successfully!");
        handleClose();
        getAllReviews();
      } else {
        alert("❌ Failed to add review: " + (res.data.msg || "Unknown error"));
      }
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Error submitting review");
    }
  };

  const onChange = (index) => {
    setSelectedItem(index);
  };

  const getAllReviews = async () => {
    setLoading(true);
    try {
      const res = await GetAllReviewsAPI();
      // Acceptable: if res.status is falsy OR data is undefined/empty
      if (res.status && Array.isArray(res.data) && res.data.length > 0) {
        setReviewData(res.data);
      } else {
        setReviewData(reviewsData); // fallback to static
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviewData(reviewsData); // fallback to static if API error
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  const getCenterSlidePercentage = () => {
    if (window.innerWidth < 600) return 100;
    if (window.innerWidth < 960) return 50;
    return 33.33;
  };

  const localizedReviews = reviewData.map((item) => ({
    ...item,
    mainQuote: language === "hi" ? item.quoteHi || item.quote : item.quote,
    review: language === "hi" ? item.reviewHi || item.review : item.review,
    name: language === "hi" ? item.nameHi || item.name : item.name,
    designation:
      language === "hi"
        ? item.designationHi || item.designation
        : item.designation,
    rating: item.rating || 0,
  }));

  if (loading) return <div>Loading reviews...</div>;

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={1}
        mb={2}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "2rem",
            fontWeight: 600,
            color: "#cd5200",
            cursor: "default",
          }}
        >
          {language === "hi" ? "उपयोगकर्ताओं की राय" : "User's Reviews"}
        </Typography>
        {userRole === "admin" && (
          <IconButton onClick={handleOpen}>
            <EditIcon sx={{ color: "#cd5200" }} />
          </IconButton>
        )}
      </Box>

      {/* Add Review Modal */}
      <Modal
        open={openModal}
        onClose={handleClose}
        sx={{ overflowY: "scroll" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <Grid container spacing={2}>
              <Grid
                item
                size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, fontFamily: "Poppins" }}
                >
                  Add Review
                </Typography>
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  name="designation"
                  label="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  name="quote"
                  label="Quote"
                  value={formData.quote}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  name="review"
                  label="Review"
                  value={formData.review}
                  onChange={handleChange}
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  name="nameHi"
                  label="Name (Hindi)"
                  value={formData.nameHi}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  name="designationHi"
                  label="Designation (Hindi)"
                  value={formData.designationHi}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  name="quoteHi"
                  label="Quote (Hindi)"
                  value={formData.quoteHi}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  name="reviewHi"
                  label="Review (Hindi)"
                  value={formData.reviewHi}
                  onChange={handleChange}
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
                xs={12}
                sm={6}
                md={6}
                lg={6}
              >
                <TextField
                  select
                  name="rating"
                  label="Rating"
                  value={formData.rating}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={4.5}>4.5</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#cd5200" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ marginTop: 4, maxWidth: 1200, marginX: "auto" }}>
        {localizedReviews.length > 0 ? (
          <Carousel
            centerMode
            centerSlidePercentage={getCenterSlidePercentage()}
            showArrows
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={3000}
            stopOnHover
            swipeable
            emulateTouch
            onChange={onChange}
            selectedItem={selectedItem}
            transitionTime={500}
          >
            {localizedReviews.map((item, i) => {
              const isCenter = i === selectedItem;
              const slideStyle = {
                transition: "transform 0.5s, opacity 0.5s",
                transform: isCenter ? "scale(1)" : "scale(0.9)",
                opacity: isCenter ? 1 : 0.5,
                filter: isCenter ? "none" : "grayscale(50%)",
                margin: "0 10px",
                cursor: "default",
              };

              return (
                <Box key={item._id} sx={slideStyle}>
                  <Card
                    sx={{
                      maxWidth: 340,
                      minHeight: 390,
                      backgroundColor: "#DBDBDB",
                      padding: "2%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      boxShadow: 2,
                      borderRadius: 3,
                      marginX: "auto",
                    }}
                  >
                    <Box sx={{ paddingTop: 2 }}>
                      <Rating
                        name="read-only"
                        value={item.rating}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          fontFamily: "Poppins",
                          color: "#89255b",
                        }}
                      >
                        {item.mainQuote}
                      </Typography>

                      <Box
                        sx={{
                          position: "relative",
                          minHeight: 120,
                          marginY: 3,
                          paddingX: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FormatQuoteIcon
                          sx={{
                            fontSize: 38,
                            color: "grey.400",
                            opacity: 0.5,
                            position: "absolute",
                            top: 0,
                            left: -9,
                            zIndex: 1,
                            transform: "rotate(180deg)",
                            pointerEvents: "none",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontStyle: "italic",
                            zIndex: 2,
                            width: "100%",
                            fontFamily: "Poppins",
                          }}
                        >
                          {item.review}
                        </Typography>
                        <FormatQuoteIcon
                          sx={{
                            fontSize: 38,
                            color: "grey.400",
                            opacity: 0.5,
                            position: "absolute",
                            bottom: 4,
                            right: 10,
                            zIndex: 1,
                            pointerEvents: "none",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          marginTop: 2,
                          fontFamily: "Poppins",
                          color: "#79255a",
                        }}
                      >
                        - {item.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: "Poppins", color: "#79255a" }}
                      >
                        {item.designation}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Carousel>
        ) : (
          <Typography align="center">No reviews available</Typography>
        )}
      </Box>
    </>
  );
}
