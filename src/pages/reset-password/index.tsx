import React, { useEffect, useState, type JSX } from "react";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
            alignItems: "center",
            textAlign: "center",
          }}>
            {/* Close button */}
            <IconButton
              onClick={handleCloseCongratulationPopup}
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 16 },
                right: { xs: 8, sm: 16 },
                color: "#1C1C1C",
                zIndex: 1,
                backgroundColor: { xs: "#F9FAFB", sm: "transparent" },
                "&:hover": {
                  backgroundColor: { xs: "#F3F4F6", sm: "rgba(0,0,0,0.04)" },
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Success Icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 2, sm: 3 },
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 64, sm: 80 },
                  height: { xs: 64, sm: 80 },
                  borderRadius: "50%",
                  backgroundColor: "#D1FAE5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #10B981",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "20px", sm: "24px" },
                      fontWeight: 600,
                    }}
                  >
                    ✓
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              fontWeight={600}
              mb={1.5}
              sx={{ 
                color: "#111927",
                fontSize: { xs: "20px", sm: "24px" },
              }}
            >
              Congratulation!!
            </Typography>

            {/* Message */}
            <Typography 
              variant="body2" 
              mb={{ xs: 4, sm: 3 }} 
              sx={{ 
                color: "#6C737F",
                fontSize: { xs: "14px", sm: "16px" },
              }}
            >
              Your Password has been Successfully changed
            </Typography>

            {/* Buttons */}
            <Stack 
              direction="row" 
              spacing={{ xs: 1.5, sm: 2 }} 
              justifyContent="center"
              sx={{
                mt: { xs: "auto", sm: 0 },
                pt: { xs: 2, sm: 0 },
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
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "14px", sm: "16px" },
                  textTransform: "none",
                  flex: { xs: 1, sm: "none" },
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
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "14px", sm: "16px" },
                  borderRadius: "50px",
                  flex: { xs: 1, sm: "none" },
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        }
      />
    </SignupLayout>
  );
}
