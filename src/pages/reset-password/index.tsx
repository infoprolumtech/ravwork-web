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
import GlobalDialog from "../../components/dialog";

interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let token = searchParams.get("token");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [resetPassword, { isSuccess }] = useResetPasswordMutation();
  const [showCongratulationPopup, setShowCongratulationPopup] = useState(false);
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
      // console.log("Reset Password Data:", data);
      // dispatch(showAlert({
      //   message: "Password reset successfully.",
      //   severity: "success",
      // }));
      // navigate("/");
      await resetPassword({
        token: token || "",
        newPassword: data.password,
      }).unwrap();
    } catch (error: any) {
      console.error("Reset Password Error:", error);
    }
  };
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, []);
  useEffect(() => {
    if (isSuccess) {
      token = null;
      setShowCongratulationPopup(true);
    }
  }, [isSuccess]);

  // Watch password for confirm validation
  const password = watch("password");

  const handleCloseCongratulationPopup = () => {
    setShowCongratulationPopup(false);
    navigate("/login");
  };

  return (
    <SignupLayout>
      <Box
        width="100%"
        maxWidth={400}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Back arrow - positioned absolutely in top left */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            color: "text.primary",
            p: 1,
          }}
        >
          <img
            src="/assets/icons/back-arrow.svg"
            alt="back-arrow"
            style={{ width: 24, height: 24 }}
          />
        </IconButton>

        {/* Icon above title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            mt: 2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6.864px",
            }}
          >
            <img
              src="/assets/icons/forgot_icon.svg"
              alt="forgot-password-icon"
              style={{ width: "36px", height: "36px" }}
            />
          </Box>
        </Box>

        <Typography variant="h5" textAlign="center" mb={3} fontWeight={600}>
          Change Password
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "#6C737F" }}
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
            position: { xs: "fixed", sm: "static" }, // fixed on mobile
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
          <Box sx={{ p: 3, position: "relative" }}>
            {/* Close button */}
            <IconButton
              onClick={handleCloseCongratulationPopup}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#6C737F",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Success icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#D1FADF",
                  border: "2px solid #12B76A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#12B76A",
                    fontSize: "24px",
                    fontWeight: 600,
                  }}
                >
                  ✓
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              fontWeight={600}
              mb={2}
              sx={{ color: "#111927" }}
            >
              Congratulation!!
            </Typography>

            {/* Message */}
            <Typography variant="body2" mb={3} sx={{ color: "#6C737F" }}>
              Your Password has been Successfully changed
            </Typography>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCloseCongratulationPopup}
                sx={{
                  borderColor: "#D1D5DB",
                  color: "#384250",
                  backgroundColor: "#F9FAFB",
                  textTransform: "none",
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleCloseCongratulationPopup}
                sx={{
                  textTransform: "none",
                  px: 3,
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
