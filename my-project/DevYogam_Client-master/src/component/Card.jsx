import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { capitalize } from "@mui/material";

export default function ImgCard({ item }) {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 3, boxShadow: 3, padding:2 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={item?.images?.[0]}
      />
      <CardContent>
        <Typography
          gutterBottom
          sx={{
            fontFamily: "Poppins",
            fontSize: "1.2rem",
            fontWeight: 500,
            marginTop: "2%",
          }}
        >
          {item?.title}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {capitalize(item?.bhagwan)}
        </Typography>

        <Typography
          variant="body1"
          mt={1}
          sx={{
            fontFamily: "Poppins",
            fontSize: "1rem",
            fontWeight: 500,
            marginTop: "2%",
            display: "flex",
            gap: "0.1rem",
            alignItems: "center",
          }}
        >
          <LocationOnOutlinedIcon fontSize="small" /> { capitalize(item?.location)}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "0.8rem",
            fontWeight: 400,
            marginTop: "2%",
          }}
        >
          {capitalize(item?.templeDescription)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          sx={{
            height: "33px",
            width: "100%",
            borderRadius: "1rem",
            border: "2px solid #9a67e6",
            color: " #9a67e6",
            minWidth: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          Visit Temple
        </Button>
      </CardActions>
    </Card>
  );
}
