import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoginAPI } from "../services/LoginAPI"; 

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const LoginModal = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const togglePasswordVisibility = () => setShowPassword((show) => !show);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .matches(/[a-z]/, "Must contain at least 1 lowercase letter")
      .matches(/[0-9]/, "Must contain at least 1 number")
      .matches(/[!@#$%^&*(),.?\":{}|<>]/, "Must contain at least 1 special character"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setApiError("");
      console.log('==>values',values)
      const res = await LoginAPI(values); 

      if (res?.error) {
        setApiError(res.error);
      } else {

        // Store user with token in localStorage for persistence
        const userWithToken = { ...res.user, token: res.token };
        localStorage.setItem("user", JSON.stringify(userWithToken));
        
        // Also store token in sessionStorage for axios config
        if (res.token) {
          sessionStorage.setItem("token", res.token);
        }

        onClose(); 
        // window.location.reload(); 
      }

      setLoading(false);
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box sx={style} component="form" onSubmit={formik.handleSubmit} noValidate>
        <Typography
          id="login-modal-title"
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Login
        </Typography>

        {apiError && (
          <Typography color="error" sx={{ mb: 1, fontSize: "0.875rem" }}>
            {apiError}
          </Typography>
        )}

        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          variant="outlined"
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          autoComplete="email"
        />

        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          variant="outlined"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!(formik.touched.password && formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 3 }}
          disabled={!formik.isValid || !formik.dirty || loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Box>
    </Modal>
  );
};

export default LoginModal;
