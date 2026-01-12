import React, { type JSX } from "react";
import {
  Button,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { StyledTextField } from "../../../utils/helper";

interface ClientContactInfoPageProps {
  onClose: () => void;
  onNext: () => void;
  onSubmit: () => void;
  contactDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  setContactDetails: React.Dispatch<React.SetStateAction<{
    fullName: string;
    email: string;
    phoneNumber: string;
  }>>;
  isQuickContact: boolean;
  isSubmitting: boolean;
}

export default function ClientContactInfoPage({
  onClose,
  onNext,
  onSubmit,
  contactDetails,
  setContactDetails,
  isQuickContact,
  isSubmitting,
}: ClientContactInfoPageProps): JSX.Element {
  const isFormValid = contactDetails.fullName && contactDetails.phoneNumber;

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
      {/* Header - Title and Close icon on same row */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#111927",
            flex: 1,
            pr: 2,
          }}
        >
          Enter your details to request this service.
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ 
            p: 0.5,
            "&:hover": { backgroundColor: "transparent" }
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      {/* Form Fields */}
      <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Full Name */}
        <StyledTextField
          fullWidth
          variant="outlined"
          label="Full name"
          placeholder="Enter your full name"
          value={contactDetails.fullName}
          onChange={(e) => setContactDetails({ ...contactDetails, fullName: e.target.value })}
        />

        {/* Email */}
        <StyledTextField
          fullWidth
          variant="outlined"
          label="Email (optional)"
          placeholder="Enter your email"
          value={contactDetails.email}
          onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
        />

        {/* Phone Number */}
        <StyledTextField
          fullWidth
          variant="outlined"
          label="Phone Number"
          placeholder="Enter your phone number"
          value={contactDetails.phoneNumber}
          onChange={(e) => setContactDetails({ ...contactDetails, phoneNumber: e.target.value })}
        />
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button
          variant="primary"
          onClick={onClose}
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
        {isQuickContact ? (
          <Button
            variant="secondary"
            onClick={onSubmit}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={onNext}
            disabled={!isFormValid}
          >
            Next
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
