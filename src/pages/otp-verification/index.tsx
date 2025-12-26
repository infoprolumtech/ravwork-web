import { type JSX } from "react";
import { Box, Typography } from "@mui/material";
import SignupLayout from "../../layouts/SignupLayout";

export default function OTPVerificationPage(): JSX.Element {
  return (
    <SignupLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          OTP Verification
        </Typography>
      </Box>
    </SignupLayout>
  );
}

