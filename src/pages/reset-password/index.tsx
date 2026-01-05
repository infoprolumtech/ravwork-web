import React, { useEffect, type JSX } from "react";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SignupLayout from "../../layouts/SignupLayout";
import { StyledTextField } from "../../utils/helper";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassSchema } from "../../utils/yup-config";
import { useResetPasswordMutation } from "../../rtk/endpoints/authApi";
import { useDispatch } from "react-redux";
import { showAlert } from "../../rtk/feature/alertSlice";

interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let token = searchParams.get("token");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [resetPassword, { isSuccess }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInputs>({
    resolver: yupResolver(resetPassSchema),
  });

  const watchedFields = watch();
  const isFormValid =
    watchedFields.password &&
    watchedFields.confirmPassword &&
    !errors.password &&
    !errors.confirmPassword;

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    try {
      await resetPassword({
        token: token || "",
        newPassword: data.password,
      }).unwrap();
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      dispatch(showAlert({
        message: error?.data?.message || "Failed to reset password. Please try again.",
        severity: "error",
      }));
    }
  };
  
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);
  
  useEffect(() => {
    if (isSuccess) {
      dispatch(showAlert({
        message: "Password reset successfully. Please sign in with your new password.",
        severity: "success",
      }));
      navigate("/login");
    }
  }, [isSuccess, dispatch, navigate]);

  // Watch password for confirm validation
  const password = watch("password");

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
            display: "flex",
            justifyContent: "center",
            mb: { xs: 2, sm: 3 },
            mt: { xs: 0, sm: 2 },
          }}
        >
          <Box
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: { xs: "5px", sm: "6.864px" },
            }}
          >
            <img
              src="/assets/icons/forgot_icon.svg"
              alt="forgot-password-icon"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Box>

        <Typography 
          variant="h5" 
          textAlign="center" 
          mb={{ xs: 2, sm: 3 }} 
          fontWeight={600}
          sx={{ fontSize: { xs: "24px", sm: "28px", md: "34px" } }}
        >
          Change Password
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={{ xs: 2, sm: 3 }}
          sx={{ 
            color: "#6C737F",
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 1, sm: 0 },
          }}
        >
          Phone number verification is only for job updates. You will not
          receive messages for anything else.
        </Typography>

        {/* Password Field */}
        <StyledTextField
          fullWidth
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          margin="normal"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <img
                    src="/assets/icons/lock.svg"
                    alt="lock-icon"
                    loading="lazy"
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <img
                      src={
                        showPassword
                          ? "/assets/icons/eye-slash.svg"
                          : "/assets/icons/eye.svg"
                      }
                      alt={showPassword ? "hide-password" : "show-password"}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Confirm Password Field */}
        <StyledTextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm new password"
          margin="normal"
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) => value === password || "Passwords must match",
          })}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <img
                    src="/assets/icons/lock.svg"
                    alt="lock-icon"
                    loading="lazy"
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <img
                      src={
                        showConfirmPassword
                          ? "/assets/icons/eye-slash.svg"
                          : "/assets/icons/eye.svg"
                      }
                      alt={
                        showConfirmPassword ? "hide-password" : "show-password"
                      }
                      style={{ width: "20px", height: "20px" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 2,
          }}
        />

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
            Change Password
          </Button>
        </Box>
      </Box>
    </SignupLayout>
  );
}
