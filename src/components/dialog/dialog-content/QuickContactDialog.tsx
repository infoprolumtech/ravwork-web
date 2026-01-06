import React, { type JSX } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const DialogTextField = styled(TextField)(() => ({
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

interface QuickContactDialogProps {
  handleClose: () => void;
  onSubmit: (data: QuickContactFormData) => void;
}

export interface QuickContactFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export default function QuickContactDialog({
  handleClose,
  onSubmit,
}: QuickContactDialogProps): JSX.Element {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const handleSubmit = () => {
    const formData: QuickContactFormData = {
      fullName,
      email,
      phoneNumber,
    };
    onSubmit(formData);
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
        {/* Title */}
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
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            color: "#111927",
            padding: "8px",
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          <Close />
        </IconButton>
      </Stack>

      {/* Form Fields */}
      <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Full Name */}
        <Box>
          <DialogTextField
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
          <DialogTextField
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
          <DialogTextField
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
          onClick={handleClose}
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
        <Button variant="secondary" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}

