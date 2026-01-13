import { useEffect, useState, type JSX } from "react";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import SignupLayout from "../../layouts/SignupLayout";
import { StyledTextField } from "../../utils/helper";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useNavigate } from "react-router-dom";
import { forgotPassSchema } from "../../utils/yup-config";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPasswordMutation } from "../../rtk/endpoints/authApi";
import GlobalDialog from "../../components/dialog";
import PageIcon from "../../components/shared/PageIcon";

type FormData = {
  email: string;
};

export default function ForgotPassword(): JSX.Element {
  const [forgotPassword, { isSuccess, isLoading: isResending }] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showCheckMailPopup, setShowCheckMailPopup] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(forgotPassSchema),
    mode: "onChange", // Validate on change (while typing)
  });

  const watchedFields = watch();
  const isFormValid = watchedFields.email && !errors.email;

  // inside your component

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setUserEmail(data.email);
      dispatch(showAlert({
        message: "Password reset link has been sent to your email.",
        severity: "success",
      }));
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      const errorMessage = error?.data?.message || "Failed to send reset link. Please try again.";
      dispatch(showAlert({
        message: errorMessage,
        severity: "error",
      }));
    }
  };

  const handleResendVerificationLink = async () => {
    try {
      if (userEmail) {
        await forgotPassword({ email: userEmail }).unwrap();
        dispatch(
          showAlert({
            message: "Reset password link has been resent successfully.",
            severity: "success",
          })
        );
      }
    } catch (error: any) {
      console.error("Resend Error:", error);
      const errorMessage = error?.data?.message || "Failed to resend reset link. Please try again.";
      dispatch(showAlert({
        message: errorMessage,
        severity: "error",
      }));
    }
  };

  const handleCloseCheckMailPopup = () => {
    setShowCheckMailPopup(false);
    // User will receive email with reset link containing token
    navigate("/login");
  };

  useEffect(() => {
    if (isSuccess) {
      setShowCheckMailPopup(true);
    }
  }, [isSuccess]);


  return (
    <SignupLayout showBackIcon={true} onBackClick={() => navigate(-1)}>
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
          position: "relative",
        }}
      >
        {/* Back Icon - Above content for large screens */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            mb: 2,
            alignSelf: "flex-start",
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: "text.primary",
              p: 1,
              minWidth: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/assets/icons/back-arrow.svg"
              alt="back-arrow"
              style={{ width: "24px", height: "24px" }}
            />
          </IconButton>
        </Box>
        {/* Icon above title */}
        <PageIcon iconSrc="/assets/icons/forgot_icon.svg" iconAlt="forgot-password-icon" />

        <Typography 
          variant="h5" 
          textAlign="center" 
          mb={{ xs: 2, sm: 3 }} 
          fontWeight={600}
          sx={{ fontSize: { xs: "24px", sm: "28px", md: "34px" } }}
        >
          Forgot Password
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
          Enter your registered email address we'll send you a link to reset
          your password
        </Typography>
        <StyledTextField
          fullWidth
          type="email"
          placeholder="Email"
          margin="normal"
          {...register("email", {
            onChange: () => trigger("email"),
          })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <img
                    src="/assets/icons/mail.svg"
                    alt="mail-icon"
                    loading="lazy"
                    style={{ width: "20px", height: "20px" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: { xs: 2, sm: 2 },
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
            type="submit"
            fullWidth
            variant="secondary"
            disabled={isSubmitting || !isFormValid}
            sx={{
              height: { xs: "44px", sm: "48px" },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Send Verification Link"
            )}
          </Button>
        </Box>
      </Box>

      {/* Check Mail Popup */}
      <GlobalDialog
        open={showCheckMailPopup}
        handleClose={handleCloseCheckMailPopup}
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
                onClick={handleCloseCheckMailPopup}
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
              onClick={handleCloseCheckMailPopup}
              sx={{
                display: { xs: "none", sm: "block" },
                position: "absolute",
                top: 16,
                right: 16,
                color: "#6C737F",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Email icon - Different for small and large screens */}
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-start" },
                mb: { xs: 3, sm: 2 },
                mt: { xs: 2, sm: 0 },
              }}
            >
              {/* Small screen: mail.svg icon */}
              <Box
                component="img"
                src="/assets/icons/mail.svg"
                alt="email-icon"
                sx={{
                  display: { xs: "block", sm: "none" },
                  width: "48px",
                  height: "48px",
                }}
              />
              {/* Large screen: Outlined envelope icon (no circular background) */}
              <Box
                component="img"
                src="/assets/icons/mail.svg"
                alt="email-icon"
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: "40px",
                  height: "40px",
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              fontWeight={600}
              mb={2}
              sx={{ 
                color: "#111927",
                fontSize: { xs: "20px", sm: "24px" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Please check your mail
            </Typography>

            {/* Message - Different layout for small and large screens */}
            {/* Small screen: Centered, email below text */}
            <Box sx={{ 
              mb: { xs: 4, sm: 3 },
              display: { xs: "block", sm: "none" },
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#6C737F",
                  fontSize: "14px",
                  mb: 1,
                }}
              >
                A verification link has been sent to
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  color: "#111927",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                {userEmail || "XYZ@gmail.com"}
              </Typography>
            </Box>
            {/* Large screen: Inline text with email */}
            <Typography 
              variant="body2" 
              mb={3}
              sx={{ 
                display: { xs: "none", sm: "block" },
                color: "#6C737F",
                fontSize: "16px",
              }}
            >
              A reset password link has been sent to{" "}
              <Typography
                component="span"
                sx={{ color: "#2563EB", fontWeight: 600 }}
              >
                {userEmail || "XYZ@gmail.com"}
              </Typography>
            </Typography>

            {/* Buttons - Different for small and large screens */}
            {/* Small screen: Single full-width button */}
            <Box
              sx={{
                width: "100%",
                mt: { xs: "auto", sm: 0 },
                pt: { xs: 2, sm: 0 },
                display: { xs: "block", sm: "none" },
              }}
            >
              <Button
                variant="secondary"
                onClick={handleResendVerificationLink}
                disabled={isResending}
                fullWidth
                sx={{
                  textTransform: "none",
                  py: 1.5,
                  fontSize: "16px",
                  borderRadius: "50px",
                  backgroundColor: "#384250",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#1F2937",
                  },
                  "&:disabled": {
                    backgroundColor: "#384250",
                    opacity: 0.7,
                  },
                }}
              >
                {isResending ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Resend Verification Link"
                )}
              </Button>
            </Box>
            {/* Large screen: Cancel and Resend buttons */}
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="flex-end"
              sx={{
                display: { xs: "none", sm: "flex" },
                mt: 0,
                pt: 0,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseCheckMailPopup}
                sx={{
                  color: "#384250",
                  borderColor: "#D1D5DB",
                  borderRadius: "50px",
                  px: 3,
                  py: 1.5,
                  fontSize: "16px",
                  textTransform: "none",
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
                onClick={handleResendVerificationLink}
                disabled={isResending}
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  fontSize: "16px",
                  borderRadius: "50px",
                  "&:disabled": {
                    opacity: 0.7,
                  },
                }}
              >
                {isResending ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Resend Verification Link"
                )}
              </Button>
            </Stack>
          </Box>
        }
      />
    </SignupLayout>
  );
}
