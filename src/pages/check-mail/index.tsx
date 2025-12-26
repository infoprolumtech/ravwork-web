import { type JSX } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SignupLayout from "../../layouts/SignupLayout";

export default function CheckMailPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <SignupLayout>
      <Box
        width="100%"
        maxWidth={400}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Email icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            mt: 2,
          }}
        >
          <img
            src="/assets/icons/sms.svg"
            alt="email-icon"
            style={{ width: "40px", height: "40px" }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h5" fontWeight={600} mb={2} textAlign="center" sx={{ color: "#111927" }}>
          Please check your mail
        </Typography>

        {/* Message */}
        <Typography variant="body2" mb={3} textAlign="center" sx={{ color: "#6C737F" }}>
          A reset password link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.
        </Typography>

        {/* Button */}
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate("/login")}
          sx={{
            textTransform: "none",
          }}
        >
          Back to Login
        </Button>
      </Box>
    </SignupLayout>
  );
}

