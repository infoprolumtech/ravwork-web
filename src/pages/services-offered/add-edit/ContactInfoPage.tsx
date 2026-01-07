import React, { type JSX } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const PageTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    backgroundColor: "#FFFFFF",
    color: "#111927",
    borderRadius: "8px",
    fontSize: "16px",
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
  },
  "& .MuiInputLabel-root": {
    display: "block",
    position: "static",
    transform: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#111927",
    marginBottom: "8px",
  },
  "& .MuiOutlinedInput-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#9DA4AE",
  },
}));

interface ContactInfoPageProps {
  onBack: () => void;
  onCancel: () => void;
  onNext: (data: ContactInfoFormData) => void;
  initialData?: ContactInfoFormData | null;
}

export interface ContactInfoFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export default function ContactInfoPage({
  onBack: _onBack,
  onCancel,
  onNext,
  initialData,
}: ContactInfoPageProps): JSX.Element {
  const [fullName, setFullName] = React.useState(initialData?.fullName || "");
  const [email, setEmail] = React.useState(initialData?.email || "");
  const [phoneNumber, setPhoneNumber] = React.useState(initialData?.phoneNumber || "");

  // Update state when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setEmail(initialData.email);
      setPhoneNumber(initialData.phoneNumber);
    }
  }, [initialData]);

  const handleNext = () => {
    const formData: ContactInfoFormData = {
      fullName,
      email,
      phoneNumber,
    };
    onNext(formData);
  };

  return (
    <Stack
      sx={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "24px",
        width: "100%",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ width: "100%" }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "8px",
              backgroundColor: "#12B76A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/assets/icons/sidebar_menu_icon/flash.svg"
              alt="Service"
              sx={{
                width: "24px",
                height: "24px",
                filter: "brightness(0) invert(1)",
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Form Fields */}
      <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Title */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#111927",
            }}
          >
            Enter your details to request this service.
          </Typography>
        </Box>

        {/* Full Name */}
        <Box>
          <PageTextField
            fullWidth
            variant="outlined"
            label="Full name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Box>

        {/* Email */}
        <Box>
          <PageTextField
            fullWidth
            variant="outlined"
            label="Email (optional)"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>

        {/* Phone Number */}
        <Box>
          <PageTextField
            fullWidth
            variant="outlined"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Box>
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button
          variant="primary"
          onClick={onCancel}
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#111927",
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleNext}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}

