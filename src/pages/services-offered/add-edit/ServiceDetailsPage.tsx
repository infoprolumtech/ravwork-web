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

// Validation constants
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

interface FormErrors {
  serviceTitle: string;
  whatsIncluded: string;
  servicePrice: string;
  responseTime: string;
}

interface TouchedFields {
  serviceTitle: boolean;
  whatsIncluded: boolean;
  servicePrice: boolean;
  responseTime: boolean;
}

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

  // Validation state
  const [errors, setErrors] = React.useState<FormErrors>({
    serviceTitle: "",
    whatsIncluded: "",
    servicePrice: "",
    responseTime: "",
  });

  const [touched, setTouched] = React.useState<TouchedFields>({
    serviceTitle: false,
    whatsIncluded: false,
    servicePrice: false,
    responseTime: false,
  });

  // Validation functions
  const validateServiceTitle = (value: string): string => {
    if (!value.trim()) {
      return "Service title is required";
    }
    if (value.length > TITLE_MAX_LENGTH) {
      return `Service title must be ${TITLE_MAX_LENGTH} characters or less`;
    }
    return "";
  };

  const validateWhatsIncluded = (value: string): string => {
    if (!value.trim()) {
      return "Description is required";
    }
    if (value.length > DESCRIPTION_MAX_LENGTH) {
      return `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`;
    }
    return "";
  };

  const validateServicePrice = (value: string): string => {
    if (!value.trim()) {
      return "Service price is required";
    }
    // Allow numbers with optional decimal and optional $ symbol at start
    const priceRegex = /^\$?\d+(\.\d{0,2})?$/;
    if (!priceRegex.test(value.trim())) {
      return "Price must be a valid number (e.g., 120 or $99.99)";
    }
    return "";
  };

  const validateResponseTime = (value: string): string => {
    if (!value) {
      return "Response time is required";
    }
    return "";
  };

  // Validate all fields
  const validateForm = (): FormErrors => {
    return {
      serviceTitle: validateServiceTitle(serviceTitle),
      whatsIncluded: validateWhatsIncluded(whatsIncluded),
      servicePrice: validateServicePrice(servicePrice),
      responseTime: validateResponseTime(responseTime),
    };
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const formErrors = validateForm();
    return Object.values(formErrors).every((error) => error === "");
  };

  // Handle field blur (mark as touched)
  const handleBlur = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validate the field on blur
    let error = "";
    switch (field) {
      case "serviceTitle":
        error = validateServiceTitle(serviceTitle);
        break;
      case "whatsIncluded":
        error = validateWhatsIncluded(whatsIncluded);
        break;
      case "servicePrice":
        error = validateServicePrice(servicePrice);
        break;
      case "responseTime":
        error = validateResponseTime(responseTime);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Handle field change with validation
  const handleServiceTitleChange = (value: string) => {
    setServiceTitle(value);
    if (touched.serviceTitle) {
      setErrors((prev) => ({ ...prev, serviceTitle: validateServiceTitle(value) }));
    }
  };

  const handleWhatsIncludedChange = (value: string) => {
    setWhatsIncluded(value);
    if (touched.whatsIncluded) {
      setErrors((prev) => ({ ...prev, whatsIncluded: validateWhatsIncluded(value) }));
    }
  };

  const handleServicePriceChange = (value: string) => {
    setServicePrice(value);
    if (touched.servicePrice) {
      setErrors((prev) => ({ ...prev, servicePrice: validateServicePrice(value) }));
    }
  };

  const handleResponseTimeChange = (value: string) => {
    setResponseTime(value);
    if (touched.responseTime) {
      setErrors((prev) => ({ ...prev, responseTime: validateResponseTime(value) }));
    }
  };

  // Update state when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setServiceTitle(initialData.serviceTitle);
      setWhatsIncluded(initialData.whatsIncluded);
      setServicePrice(initialData.servicePrice);
      setResponseTime(initialData.responseTime);
      // Reset touched and errors when initialData changes
      setTouched({
        serviceTitle: false,
        whatsIncluded: false,
        servicePrice: false,
        responseTime: false,
      });
      setErrors({
        serviceTitle: "",
        whatsIncluded: "",
        servicePrice: "",
        responseTime: "",
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    // Mark all fields as touched
    setTouched({
      serviceTitle: true,
      whatsIncluded: true,
      servicePrice: true,
      responseTime: true,
    });

    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);

    // If no errors, submit
    if (Object.values(formErrors).every((error) => error === "")) {
    const formData: ServiceFormData = {
      serviceTitle,
      whatsIncluded,
      servicePrice,
      responseTime,
    };
    onNext(formData);
    }
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/assets/icons/service_offered_icons/quick_contact.svg"
              alt="Service"
              sx={{
                width: "56px",
                height: "56px",
                
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
            onChange={(e) => handleServiceTitleChange(e.target.value)}
            onBlur={() => handleBlur("serviceTitle")}
            error={touched.serviceTitle && !!errors.serviceTitle}
            helperText={touched.serviceTitle && errors.serviceTitle}
            inputProps={{ maxLength: TITLE_MAX_LENGTH }}
            sx={{ mt: 2 }}
          />
        </Box>

        {/* What's included */}
        <Box>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="What's included?"
            placeholder="Describe what's included in this service"
            value={whatsIncluded}
            onChange={(e) => handleWhatsIncludedChange(e.target.value)}
            onBlur={() => handleBlur("whatsIncluded")}
            error={touched.whatsIncluded && !!errors.whatsIncluded}
            helperText={touched.whatsIncluded && errors.whatsIncluded}
            inputProps={{ maxLength: DESCRIPTION_MAX_LENGTH }}
          />
        </Box>

        {/* Service Price */}
        <Box>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Service price"
            placeholder="e.g. 120 or $99.99"
            value={servicePrice}
            onChange={(e) => handleServicePriceChange(e.target.value)}
            onBlur={() => handleBlur("servicePrice")}
            error={touched.servicePrice && !!errors.servicePrice}
            helperText={touched.servicePrice && errors.servicePrice}
          />
        </Box>

        {/* Response Time */}
        <Box>
          <StyledTextField
            fullWidth
            variant="outlined"
            label="Response time"
            value={responseTime}
            onChange={(e) => handleResponseTimeChange(e.target.value as string)}
            onBlur={() => handleBlur("responseTime")}
            error={touched.responseTime && !!errors.responseTime}
            helperText={touched.responseTime && errors.responseTime}
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
        <Button 
          variant="secondary" 
          onClick={handleSubmit}
          disabled={!isFormValid()}
          sx={{
            "&.Mui-disabled": {
              backgroundColor: "#D1D5DB",
              color: "#9CA3AF",
            },
          }}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}


