import React, { useEffect, useState, type JSX } from "react";
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
import GlobalDialog from "../../components/dialog";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";

interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get token from URL - handle encoding properly
  const rawToken = searchParams.get("token");
  let token: string | null = null;
  
  if (rawToken) {
    // searchParams.get() already decodes URL encoding, but ensure we have the full token
    token = rawToken.trim();
    
    // Try to get token from window.location as fallback if searchParams doesn't work
    if (!token || token.length === 0) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const fallbackToken = urlParams.get("token");
        if (fallbackToken) {
          token = fallbackToken.trim();
          console.warn("Token retrieved from window.location fallback");
        }
      } catch (e) {
        console.error("Error getting token from window.location:", e);
      }
    }
    
    // Log token info for debugging
    if (token) {
      console.log("=== Token Debug ===");
      console.log("Raw token from URL:", rawToken?.substring(0, 50) + "...");
      console.log("Processed token (first 50 chars):", token.substring(0, 50) + "...");
      console.log("Token length:", token.length);
      console.log("Full URL:", window.location.href);
      console.log("Token starts with:", token.substring(0, 20));
      console.log("Token ends with:", token.substring(Math.max(0, token.length - 20)));
      console.log("Token contains spaces:", token.includes(" "));
      console.log("Token contains newlines:", token.includes("\n"));
    }
  } else {
    console.warn("No token found in URL");
    console.log("Full URL:", window.location.href);
    console.log("All search params:", Object.fromEntries(searchParams.entries()));
  }
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showCongratulationPopup, setShowCongratulationPopup] = useState(false);
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
    if (!token) {
      dispatch(showAlert({
        message: "Invalid or missing reset token. Please request a new password reset link.",
        severity: "error",
      }));
      navigate("/forgot-password");
      return;
    }

    // Log the payload being sent
    const payload = {
      token: token,
      newPassword: data.password,
    };
    
    console.log("=== Sending Reset Password Request ===");
    console.log("Token (first 50 chars):", token.substring(0, 50) + "...");
    console.log("Token length:", token.length);
    console.log("Token (last 20 chars):", token.substring(Math.max(0, token.length - 20)));
    console.log("Has password:", !!data.password);
    console.log("Full payload:", { token: token.substring(0, 30) + "...", newPassword: "***" });

    try {
      const response = await resetPassword(payload).unwrap();
      console.log("Reset password successful:", response);
    } catch (error: any) {
      console.error("=== Reset Password Error Details ===");
      console.error("Error object:", error);
      console.error("Error status:", error?.status);
      console.error("Error data:", error?.data);
      console.error("Error message:", error?.data?.message);
      console.error("Full error:", JSON.stringify(error, null, 2));
      
      const errorMessage = error?.data?.message || 
                          error?.data?.error ||
                          error?.error ||
                          "Failed to reset password. Please try again.";
      
      dispatch(showAlert({
        message: errorMessage,
        severity: "error",
      }));
    }
  };
  
  useEffect(() => {
    if (!token) {
      dispatch(showAlert({
        message: "Invalid or missing reset token. Please request a new password reset link.",
        severity: "error",
      }));
      navigate("/forgot-password");
    }
  }, [token, navigate, dispatch]);
  
  useEffect(() => {
    if (isSuccess) {
      setShowCongratulationPopup(true);
    }
  }, [isSuccess]);

  const handleCloseCongratulationPopup = () => {
    setShowCongratulationPopup(false);
    navigate("/login");
  };

  const handleSignIn = () => {
    setShowCongratulationPopup(false);
    navigate("/login");
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
          {...register("confirmPassword")}
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

      {/* Congratulation Popup */}
      <GlobalDialog
        open={showCongratulationPopup}
        handleClose={handleCloseCongratulationPopup}
        component={
          <Box sx={{ 
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            minHeight: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-start" },
            alignItems: { xs: "center", sm: "flex-start" },
            textAlign: { xs: "center", sm: "left" },
            pt: { xs: 0, sm: 2 },
            pb: { xs: 2, sm: 2 },
          }}>
            {/* Header with back icon and logo - Only on small screens */}
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                py: 1.5,
                px: 2,
                position: "relative",
                mb: 2,
              }}
            >
              {/* Back Icon */}
              <IconButton
                onClick={handleCloseCongratulationPopup}
                sx={{
                  color: "text.primary",
                  p: 0.75,
                  minWidth: "auto",
                }}
              >
                <img
                  src="/assets/icons/back-arrow.svg"
                  alt="back-arrow"
                  style={{ width: "24px", height: "24px" }}
                />
              </IconButton>
              
              {/* Logo Section */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  marginLeft: "auto",
                }}
              >
                <img 
                  src="/assets/icons/ravwork_logo_icon.svg" 
                  alt="Ravwork Icon" 
                  style={{ 
                    width: "auto", 
                    height: "auto",
                    maxWidth: "32px",
                    maxHeight: "32px"
                  }} 
                />
                <Box
                  component="img"
                  src="/assets/icons/ravwork_logo_text.svg" 
                  alt="Ravwork"
                  sx={{
                    width: "auto", 
                    height: "auto",
                    maxWidth: "100px",
                    maxHeight: "24px"
                  }}
                />
              </Box>
            </Box>

            {/* Close button - Only on large screens */}
            <IconButton
              onClick={handleCloseCongratulationPopup}
              sx={{
                display: { xs: "none", sm: "block" },
                position: "absolute",
                top: 16,
                right: 16,
                color: "#1C1C1C",
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>


            {/* Success icon - Different for small and large screens */}
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-start" },
                mb: { xs: 2, sm: 2 },
                mt: { xs: 2, sm: 0 },
                ml: { xs: 0, sm: 2 },
              }}
            >
              {/* Small screen: Centered icon */}
              <Box
                component="img"
                src="/assets/icons/congratulation.svg"
                alt="congratulation-icon"
                sx={{
                  display: { xs: "block", sm: "none" },
                  width: { xs: "64px", sm: "80px" },
                  height: { xs: "64px", sm: "80px" },
                }}
              />
              {/* Large screen: Icon on the left */}
              <Box
                component="img"
                src="/assets/icons/congratulation.svg"
                alt="congratulation-icon"
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: "80px",
                  height: "80px",
                }}
              />
            </Box>

            <Typography
              variant="h5"
              fontWeight={600}
              mb={1.5}
              sx={{ 
                color: "#111927",
                fontSize: { xs: "20px", sm: "24px" },
                textAlign: { xs: "center", sm: "left" },
                ml: { xs: 0, sm: 2 },
              }}
            >
              Congratulation!!
            </Typography>

            <Typography 
              variant="body2" 
              mb={{ xs: 4, sm: 3 }} 
              sx={{ 
                color: "#6C737F",
                fontSize: { xs: "14px", sm: "16px" },
                textAlign: { xs: "center", sm: "left" },
                ml: { xs: 0, sm: 2 },
              }}
            >
              Your Password has been Successfully changed
            </Typography>

            {/* Buttons - Different for small and large screens */}
            {/* Small screen: Centered buttons */}
            <Stack 
              direction="row" 
              spacing={{ xs: 1.5, sm: 2 }} 
              justifyContent="center"
              sx={{
                display: { xs: "flex", sm: "none" },
                mt: "auto",
                pt: 2,
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseCongratulationPopup}
                sx={{
                  color: "#384250",
                  borderColor: "#D1D5DB",
                  borderRadius: "50px",
                  px: 2,
                  py: 1,
                  fontSize: "14px",
                  textTransform: "none",
                  flex: 1,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleSignIn}
                sx={{
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  fontSize: "14px",
                  borderRadius: "50px",
                  flex: 1,
                }}
              >
                Sign In
              </Button>
            </Stack>
            {/* Large screen: Buttons at bottom-right */}
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="flex-end"
              sx={{
                display: { xs: "none", sm: "flex" },
                mt: 0,
                pt: 0,
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseCongratulationPopup}
                sx={{
                  color: "#384250",
                  borderColor: "#D1D5DB",
                  borderRadius: "50px",
                  px: 3,
                  py: 1.5,
                  fontSize: "16px",
                  textTransform: "none",
                  backgroundColor: "transparent",
                  "&:hover": {
                    borderColor: "#9CA3AF",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleSignIn}
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  fontSize: "16px",
                  borderRadius: "50px",
                  backgroundColor: "#111927",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#1F2937",
                  },
                }}
              >
                SignIn
              </Button>
            </Stack>
          </Box>
        }
      />
    </SignupLayout>
  );
}
