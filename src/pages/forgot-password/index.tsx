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
import { encryptAES, StyledTextField } from "../../utils/helper";
import { useDispatch } from "react-redux";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useNavigate } from "react-router-dom";
import { forgotPassSchema } from "../../utils/yup-config";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useForgotPasswordMutation,
  useResendMutation,
} from "../../rtk/endpoints/authApi";
import GlobalDialog from "../../components/dialog";

type FormData = {
  email: string;
};

export default function ForgotPassword(): JSX.Element {
  const [forgotPassword, { isSuccess, data }] = useForgotPasswordMutation();
  const [resend, { isSuccess: isResendSuccess }] = useResendMutation();
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
      const encryptEmail = encryptAES(data.email);
      await forgotPassword({ email: encryptEmail }).unwrap();
      setUserEmail(data.email);
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
    }
  };

  const handleResendVerificationLink = async () => {
    try {
      if (userEmail) {
        const encryptEmail = encryptAES(userEmail);
        await resend({
          email: encryptEmail,
          deviceType: "web",
          actionType: "forgot-password",
        }).unwrap();
      }
    } catch (error: any) {
      console.error("Resend Error:", error);
    }
  };

  const handleCloseCheckMailPopup = () => {
    setShowCheckMailPopup(false);
    // Navigate to change password screen after closing popup
    const token = data?.data?.token || "";
    navigate(`/reset-password?token=${token}`);
  };

  useEffect(() => {
    if (isSuccess) {
      setShowCheckMailPopup(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isResendSuccess) {
      dispatch(
        showAlert({
          message: "Reset password link has been resent successfully.",
          severity: "success",
        })
      );
    }
  }, [isResendSuccess]);

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
          Forgot Password
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "#6C737F" }}
        >
          Enter your registered email address we'll send you a link to reset
          your password
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
          <StyledTextField
            fullWidth
            type="email"
            placeholder="Enter Registered Email Address"
            margin="normal"
            {...register("email", { required: "Email is required" })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <img
                      src="/assets/icons/sms.svg"
                      alt="mail-icon"
                      loading="lazy"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              marginBottom: 2,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="secondary"
            disabled={isSubmitting || !isFormValid}
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
          <Box sx={{ p: 3, position: "relative" }}>
            {/* Close button */}
            <IconButton
              onClick={handleCloseCheckMailPopup}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#6C737F",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Email icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: 2,
              }}
            >
              <img
                src="/assets/icons/sms.svg"
                alt="email-icon"
                style={{ width: "40px", height: "40px" }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              fontWeight={600}
              mb={2}
              sx={{ color: "#111927" }}
            >
              Please check your mail
            </Typography>

            {/* Message */}
            <Typography variant="body2" mb={3} sx={{ color: "#6C737F" }}>
              A reset password link has been sent to{" "}
              <Typography
                component="span"
                sx={{ color: "#0E6A37", fontWeight: 600 }}
              >
                {userEmail || "XYZ@gmail.com"}
              </Typography>
            </Typography>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleCloseCheckMailPopup}
                sx={{
                  color: "#384250",
                  borderRadius: "50px",
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleResendVerificationLink}
                sx={{
                  textTransform: "none",

                  px: 3,
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
