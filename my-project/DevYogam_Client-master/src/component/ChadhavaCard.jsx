import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ChadhavaCard({ item }) {
  return (
    <Card
      sx={{ maxWidth: 345, boxShadow: "0 2px 8px 2px rgba(237,106,18,0.09)" }}
    >
      <CardMedia
        component="img"
        alt={item?.title}
        height="140"
        image={item?.mandir?.images?.[0]}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {item?.title}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {item?.subtitle}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item?.desc}
        </Typography>
        <Typography>Rs. {item.chadhava}</Typography>
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
          Participate Now 
        </Button>
      </CardActions>
    </Card>
  );
}
