import { useEffect, useState, type JSX } from "react";
import {
  Box,
  Button,
  Typography,
  InputAdornment,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import SignupLayout from "../../layouts/SignupLayout";
import { StyledTextField } from "../../utils/helper";
import { useDispatch } from "react-redux";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useNavigate } from "react-router-dom";
import { forgotPassSchema } from "../../utils/yup-config";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPasswordMutation } from "../../rtk/endpoints/authApi";
import GlobalDialog from "../../components/dialog";

type FormData = {
  email: string;
};

export default function ForgotPassword(): JSX.Element {
  const [forgotPassword, { isSuccess }] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showCheckMailPopup, setShowCheckMailPopup] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(forgotPassSchema),
  });

  const watchedFields = watch();
  const isFormValid = watchedFields.email && !errors.email;

  // inside your component

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setUserEmail(data.email);
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
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
          {...register("email", { required: "Email is required" })}
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
            boxShadow: {
              xs: "0 -2px 10px rgba(0,0,0,0.05)",
              sm: "none",
            },
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
            Send Verification Link
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
          }}>
            {/* Close button */}
            <IconButton
              onClick={handleCloseCheckMailPopup}
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

            {/* Email icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: { xs: 2, sm: 2 },
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  borderRadius: "50%",
                  backgroundColor: "#F9FAFB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                }}
              >
                <img
                  src="/assets/icons/mail.svg"
                  alt="email-icon"
                  style={{ width: "24px", height: "24px" }}
                />
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              fontWeight={600}
              mb={2}
              sx={{ 
                color: "#111927",
                fontSize: { xs: "20px", sm: "24px" },
              }}
            >
              Please check your mail
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
              A reset password link has been sent to{" "}
              <Typography
                component="span"
                sx={{ color: "#2563EB", fontWeight: 600 }}
              >
                {userEmail || "XYZ@gmail.com"}
              </Typography>
            </Typography>

            {/* Buttons */}
            <Stack 
              direction="row" 
              spacing={{ xs: 1.5, sm: 2 }} 
              justifyContent="flex-end"
              sx={{
                mt: { xs: "auto", sm: 0 },
                pt: { xs: 2, sm: 0 },
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseCheckMailPopup}
                sx={{
                  color: "#384250",
                  borderColor: "#D1D5DB",
                  borderRadius: "50px",
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "14px", sm: "16px" },
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
                sx={{
                  textTransform: "none",
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "14px", sm: "16px" },
                  borderRadius: "50px",
                }}
              >
                Resend Verification Link
              </Button>
            </Stack>
          </Box>
        }
      />
    </SignupLayout>
  );
}
