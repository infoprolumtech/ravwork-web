import { useEffect, useState, type JSX } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import SignupLayout from "../../layouts/SignupLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
// OTP verification is not part of the current API flow - this page may need to be updated
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import OTPInput from "../../components/Otp";

export default function OTPVerificationPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  // TODO: OTP verification endpoints removed - need to implement based on new API
  const isVerifySuccess = false;
  const isResendSuccess = false;

  // Get token from URL params or localStorage
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const loginToken = localStorage.getItem("loginToken");

    if (!urlToken && !loginToken) {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  const handleVerifyOtp = async () => {
    if (otp.join("").length !== 6) {
      dispatch(showAlert({ message: "Please enter a valid 6-digit OTP", severity: "error" }));
      return;
    }

    // TODO: Implement OTP verification with new API
    dispatch(showAlert({ message: "OTP verification not implemented yet", severity: "info" }));
  };

  const handleResendOtp = async () => {
    // TODO: Implement resend OTP with new API
    dispatch(showAlert({ message: "Resend OTP not implemented yet", severity: "info" }));
  };

  useEffect(() => {
    if (isVerifySuccess) {
      // TODO: Handle OTP verification success when API is implemented
      dispatch(showAlert({ message: "OTP verified successfully", severity: "success" }));
      localStorage.removeItem("loginToken");
      localStorage.removeItem("userEmail");
      navigate("/my-profile");
    }
  }, [isVerifySuccess, dispatch, navigate]);

  useEffect(() => {
    if (isResendSuccess) {
      dispatch(showAlert({ message: "OTP has been resent successfully", severity: "success" }));
    }
  }, [isResendSuccess, dispatch]);

  const isOtpComplete = otp.join("").length === 6;

  return (
    <SignupLayout>
      <Box
        width="100%"
        maxWidth={400}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Back arrow */}
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
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6.864px",
            mb: 2,
            mt: 2,
          }}
        >
          <img
            src="/assets/icons/sigup_icon.svg"
            alt="otp-icon"
            style={{ width: "36px", height: "36px" }}
          />
        </Box>

        <Typography variant="h5" textAlign="center" mb={1} fontWeight={600}>
          OTP Verification
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          mb={3}
          sx={{ color: "#6C737F" }}
        >
          Enter the 6-digit code sent to your email
        </Typography>

        {/* OTP Input */}
        <Box sx={{ mb: 3, width: "100%" }}>
          <OTPInput otp={otp} setOtp={setOtp} inputLength={6} />
        </Box>

        {/* Verify Button */}
        <Button
          fullWidth
          variant="secondary"
          disabled={!isOtpComplete}
          onClick={handleVerifyOtp}
          sx={{ height: 48, mb: 2 }}
        >
          Verify
        </Button>

        {/* Resend OTP */}
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ color: "#6C737F" }}
        >
          Didn&apos;t receive code?{" "}
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
              color: "#111927",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={handleResendOtp}
          >
            Resend
          </Typography>
        </Typography>
      </Box>
    </SignupLayout>
  );
}


