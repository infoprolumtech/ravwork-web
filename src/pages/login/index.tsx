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
    <SignupLayout>
      <Box
        width="100%"
        maxWidth={400}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Icon above title */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6.864px",
            mb: 2,
          }}
        >
          <img
            src="/assets/icons/sigup_icon.svg"
            alt="email-icon"
            style={{ width: "36px", height: "36px" }}
          />
        </Box>

        <Typography variant="h5" textAlign="center" mb={3} fontWeight={600}>
          Sign In
        </Typography>
        <StyledTextField
          fullWidth
          variant="outlined"
          type="text"
          // label="Email Address"
          placeholder="Email"
          margin="normal"
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <img
                    src="/assets/icons/sms.svg"
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
          // label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          margin="normal"
          {...register("password")}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
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
          mb={2.5}
          sx={{
            width: "100%",
            cursor: "pointer",
            color: "#1C1C1C",
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
            position: { xs: "fixed", sm: "static" }, // mobile only
            bottom: { xs: 0, sm: "auto" },
            left: { xs: 0, sm: "auto" },
            p: { xs: 2, sm: 0 },
            backgroundColor: { xs: "#fff", sm: "transparent" },
            zIndex: { xs: 10, sm: "auto" },
          }}
        >
          <Button
            fullWidth
            type="submit"
            variant="secondary"
            disabled={isSubmitting || !isFormValid}
          >
            Sign In
          </Button>
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Don't Have an Account?{" "}
            <Typography
              component="span"
              sx={{ fontWeight: 600, color: "#111927", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              onClick={() => navigate("/")}
            >
              Sign Up
            </Typography>
          </Typography></Box>
      </Box>
    </SignupLayout>
  );
}
