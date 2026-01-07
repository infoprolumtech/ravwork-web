import React, { type JSX } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  MenuItem,
} from "@mui/material";
import { StyledTextField } from "../../../utils/helper";

interface ServiceDetailsPageProps {
  onBack: () => void;
  onCancel: () => void;
  onNext: (data: ServiceFormData) => void;
  initialData?: ServiceFormData | null;
}

export interface ServiceFormData {
  serviceTitle: string;
  whatsIncluded: string;
  servicePrice: string;
  responseTime: string;
}

const responseTimeOptions = [
  { value: "within_1_hour", label: "Within 1 hour" },
  { value: "within_few_hours", label: "Within a few hours" },
  { value: "same_day", label: "Same day" },
  { value: "within_24_hours", label: "Within 24 hours" },
  { value: "no_response_time", label: "No response time" },
];

export default function ServiceDetailsPage({
  onBack: _onBack,
  onCancel,
  onNext,
  initialData,
}: ServiceDetailsPageProps): JSX.Element {
  const [serviceTitle, setServiceTitle] = React.useState(initialData?.serviceTitle || "");
  const [whatsIncluded, setWhatsIncluded] = React.useState(initialData?.whatsIncluded || "");
  const [servicePrice, setServicePrice] = React.useState(initialData?.servicePrice || "");
  const [responseTime, setResponseTime] = React.useState(initialData?.responseTime || "");

  // Update state when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setServiceTitle(initialData.serviceTitle);
      setWhatsIncluded(initialData.whatsIncluded);
      setServicePrice(initialData.servicePrice);
      setResponseTime(initialData.responseTime);
    }
  }, [initialData]);

  const handleSubmit = () => {
    const formData: ServiceFormData = {
      serviceTitle,
      whatsIncluded,
      servicePrice,
      responseTime,
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
        {/* Service Title */}
        <Box>
          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#111927",
            }}
          >
            Service details
          </Typography>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Service title"
            placeholder="e.g. TV Mounting, House Cleaning"
            value={serviceTitle}
            onChange={(e) => setServiceTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>

        {/* What's included */}
        <Box>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="What's included?"
            placeholder="Describe Here (optional)"
            value={whatsIncluded}
            onChange={(e) => setWhatsIncluded(e.target.value)}
          />
        </Box>

        {/* Service Price */}
        <Box>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Service price"
            placeholder="e.g. 120 or starting at $99 (optional)"
            value={servicePrice}
            onChange={(e) => setServicePrice(e.target.value)}
          />
        </Box>

        {/* Response Time */}
        <Box>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Response time"
            value={responseTime}
            onChange={(e) => setResponseTime(e.target.value as string)}
            select
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => {
                if (!selected) {
                  return "";
                }
                const selectedOption = responseTimeOptions.find(
                  (o) => o.value === selected
                );
                return selectedOption ? selectedOption.label : "";
              },
              MenuProps: {
                disablePortal: false,
                PaperProps: {
                  style: {
                    maxHeight: 250,
                    overflowY: "auto",
                    borderRadius: "8px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  },
                  sx: {
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  },
                },
                sx: {
                  zIndex: 3000,
                  "& .MuiPaper-root": {
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  },
                },
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: "16px", color: "#6C737F" }}>
              Select
            </MenuItem>
            {responseTimeOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ fontSize: "16px", color: "#111927" }}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledTextField>
        </Box>
      </Stack>

      {/* Action Buttons */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
      >
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
        <Button variant="secondary" onClick={handleSubmit}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}


