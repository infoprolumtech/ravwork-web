import { type JSX, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField } from "../../../utils/helper";
import { serviceDetailsSchema } from "../validationSchemas";

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
  const form = useForm<ServiceFormData>({
    resolver: yupResolver(serviceDetailsSchema) as any,
    mode: "onChange",
    defaultValues: initialData || {
      serviceTitle: "",
      whatsIncluded: "",
      servicePrice: "",
      responseTime: "",
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: ServiceFormData) => {
    onNext(data);
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
          <Controller
            name="serviceTitle"
            control={form.control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                variant="outlined"
                label="Service title"
                placeholder="e.g. TV Mounting, House Cleaning"
                error={Boolean(form.formState.errors.serviceTitle)}
                helperText={form.formState.errors.serviceTitle?.message}
                sx={{ mt: 2 }}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger("serviceTitle");
                }}
              />
            )}
          />
        </Box>

        {/* What's included */}
        <Box>
          <Controller
            name="whatsIncluded"
            control={form.control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                variant="outlined"
                label="What's included?"
                placeholder="Describe what's included in this service"
                error={Boolean(form.formState.errors.whatsIncluded)}
                helperText={form.formState.errors.whatsIncluded?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger("whatsIncluded");
                }}
              />
            )}
          />
        </Box>

        {/* Service Price */}
        <Box>
          <Controller
            name="servicePrice"
            control={form.control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                variant="outlined"
                label="Service price"
                placeholder="e.g. 120 or $99.99"
                error={Boolean(form.formState.errors.servicePrice)}
                helperText={form.formState.errors.servicePrice?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger("servicePrice");
                }}
              />
            )}
          />
        </Box>

        {/* Response Time */}
        <Box>
          <Controller
            name="responseTime"
            control={form.control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                variant="outlined"
                label="Response time"
                error={Boolean(form.formState.errors.responseTime)}
                helperText={form.formState.errors.responseTime?.message}
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
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger("responseTime");
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
            )}
          />
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
          onClick={form.handleSubmit(handleSubmit)}
          disabled={!form.formState.isValid}
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


