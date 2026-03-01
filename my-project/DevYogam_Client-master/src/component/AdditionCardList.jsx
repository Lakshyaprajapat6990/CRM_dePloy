import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { LanguageContext } from "../context/LanguageContext";

export const MultiLingualItemList = ({ itemsData, onCartChange }) => {
  const { language } = useContext(LanguageContext);
  const [cart, setCart] = useState({});

  const handleAdd = (id) => {
    const newCart = { ...cart, [id]: (cart[id] || 0) + 1 };
    setCart(newCart);
    onCartChange?.(newCart);
  };

  const handleRemove = (id) => {
    const val = (cart[id] || 0) - 1;
    const newCart = { ...cart };
    if (val > 0) newCart[id] = val;
    else delete newCart[id];
    setCart(newCart);
    onCartChange?.(newCart);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontFamily: "Poppins" }}>
        {language === "hi"
          ? "मंदिर में सभी उपलब्ध चढ़ावे"
          : "List of all available offerings in this temple"}
      </Typography>
      <Grid container spacing={2}>
        {itemsData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
              <CardMedia
                component="img"
                image={item.image}
                alt={item.title[language]}
                sx={{
                  width: 70,
                  height: 70,
                  objectFit: "contain",
                  mr: 2,
                  borderRadius: 2,
                  background: "#fafafa",
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {item.title[language]}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {item.desc[language]}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    ₹{item.price}
                  </Typography>
                </CardContent>
              </Box>
              {cart[item.id] ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ ml: 2 }}
                >
                  <IconButton
                    onClick={() => handleRemove(item.id)}
                    size="small"
                    color="secondary"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{cart[item.id]}</Typography>
                  <IconButton
                    onClick={() => handleAdd(item.id)}
                    size="small"
                    color="secondary"
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              ) : (
                <Button
                  onClick={() => handleAdd(item.id)}
                  variant="contained"
                  sx={{ ml: 2, minWidth: 80, background: "#8e5ff3" }}
                >
                  {language === "hi" ? "+ जोड़ें" : "+ Add"}
                </Button>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Optional Cart Summary */}
      <Box sx={{ mt: 4, ml: 1 }}>
        <Typography variant="subtitle1">
          {language === "hi"
            ? `${Object.keys(cart).length} चढ़ावे`
            : `${Object.keys(cart).length} Offerings`}
        </Typography>
        <Typography variant="h6" sx={{ color: "#8e5ff3", mt: 1 }}>
          ₹
          {Object.entries(cart).reduce(
            (sum, [id, count]) =>
              sum + (itemsData.find((i) => i.id == id)?.price || 0) * count,
            0
          )}
        </Typography>
        <Box sx={{ color: "#666", fontSize: 14 }}>
          {Object.entries(cart).map(([id, count]) => {
            const itm = itemsData.find((i) => i.id == id);
            return (
              <span key={id}>
                {itm?.title[language]} x {count}{" "}
              </span>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
