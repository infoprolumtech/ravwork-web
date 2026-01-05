import { useState, type JSX } from "react";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SignupLayout from "../../layouts/SignupLayout";
import { StyledTextField } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/yup-config";
import { useLoginMutation } from "../../rtk/endpoints/authApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useDispatch } from "react-redux";
import { loginUser } from "../../rtk/feature/authSlice";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginPage(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const watchedFields = watch();
  const isFormValid = watchedFields.email && watchedFields.password;

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      
      // Handle successful login response
      if (response?.data?.tokens?.accessToken) {
        const userData = {
          ...response.data.user,
          accessToken: response.data.tokens.accessToken,
          refreshToken: response.data.tokens.refreshToken,
        };
        dispatch(loginUser(userData));
        dispatch(showAlert({ message: "Login successful", severity: "success" }));
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };


  return (
    <SignupLayout showBackIcon={false} onBackClick={() => navigate(-1)}>
      <Box
        width="100%"
        maxWidth={{ xs: "100%", sm: "400px" }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          mx: "auto",
        }}
      >
        {/* Icon above title */}
        <Box
          sx={{
            width: { xs: 32, sm: 36 },
            height: { xs: 32, sm: 36 },
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: "5px", sm: "6.864px" },
            mb: { xs: 2, sm: 2 },
            mt: { xs: 0, sm: 2 },
          }}
        >
          <img
            src="/assets/icons/sigup_icon.svg"
            alt="email-icon"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>

        <Typography 
          variant="h5" 
          textAlign="center" 
          mb={{ xs: 2, sm: 3 }} 
          fontWeight={600}
          sx={{ fontSize: { xs: "24px", sm: "28px", md: "34px" } }}
        >
          Sign In
        </Typography>
        <StyledTextField
          fullWidth
          variant="outlined"
          type="text"
          placeholder="Email"
          margin="normal"
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          sx={{ mb: 1.5 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <img
                    src="/assets/icons/mail.svg"
                    alt="email-icon"
                    style={{ width: "20px", height: "20px" }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <StyledTextField
          fullWidth
          variant="outlined"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          margin="normal"
          {...register("password")}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          sx={{ mb: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <img
                    src="/assets/icons/lock.svg"
                    alt="lock-icon"
                    style={{ width: "20px", height: "20px" }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img
                      src={showPassword ? "/assets/icons/eye-slash.svg" : "/assets/icons/eye.svg"}
                      alt={showPassword ? "hide-password" : "show-password"}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Typography
          variant="subtitle2"
          textAlign="right"
          mt={1}
          mb={{ xs: 2, sm: 2.5 }}
          sx={{
            width: "100%",
            cursor: "pointer",
            color: "#1C1C1C",
            fontSize: { xs: "14px", sm: "16px" },
            "&:hover": {
              textDecoration: "underline",
            }
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </Typography>

        <Box
          sx={{
            width: "100%",
            position: { xs: "fixed", sm: "static" },
            bottom: { xs: 0, sm: "auto" },
            left: { xs: 0, sm: "auto" },
            p: { xs: 2, sm: 0 },
            backgroundColor: { xs: "#fff", sm: "transparent" },
            zIndex: { xs: 10, sm: "auto" },
            boxShadow: {
              xs: "0 -2px 10px rgba(0,0,0,0.05)",
              sm: "none",
            },
          }}
        >
          <Button
            fullWidth
            type="submit"
            variant="secondary"
            disabled={isSubmitting || !isFormValid}
            sx={{
              height: { xs: "44px", sm: "48px" },
            }}
          >
            Sign In
          </Button>
          <Typography 
            variant="body2" 
            textAlign="center" 
            sx={{ 
              mt: { xs: 1.5, sm: 2 },
              fontSize: { xs: "14px", sm: "16px" },
              display: { xs: "none", sm: "block" },
            }}
          >
            Don't Have an Account?{" "}
            <Typography
              component="span"
              sx={{ 
                fontWeight: 600, 
                color: "#111927", 
                cursor: "pointer", 
                "&:hover": { textDecoration: "underline" } 
              }}
              onClick={() => navigate("/")}
            >
              Sign Up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </SignupLayout>
  );
}
