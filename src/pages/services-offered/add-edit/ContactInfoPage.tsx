import { type JSX, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField } from "../../../utils/helper";
import { contactInfoSchema } from "../validationSchemas";

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
  const form = useForm<ContactInfoFormData>({
    resolver: yupResolver(contactInfoSchema) as any,
    mode: "onChange",
    defaultValues: initialData || {
      fullName: "",
      email: "",
      phoneNumber: "",
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleNext = (data: ContactInfoFormData) => {
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
            Enter your details to request this service. (Optional)
          </Typography>
        </Box>

        {/* Full Name */}
        <Box>
          <Controller
            name="fullName"
            control={form.control}
            render={({ field }) => (
          <StyledTextField
                {...field}
            fullWidth
            variant="outlined"
            label="Full name"
            placeholder="Enter your full name"
                error={Boolean(form.formState.errors.fullName)}
                helperText={form.formState.errors.fullName?.message}
            sx={{ mt: 2 }}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger("fullName");
                }}
              />
            )}
          />
        </Box>

        {/* Email */}
        <Box>
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
          <StyledTextField
                {...field}
            fullWidth
            variant="outlined"
            label="Email (optional)"
            placeholder="Enter your email"
                error={Boolean(form.formState.errors.email)}
                helperText={form.formState.errors.email?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger("email");
                }}
              />
            )}
          />
        </Box>


        {/* Phone Number */}
        <Box>
          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
          <StyledTextField
                {...field}
            fullWidth
            variant="outlined"
            label="Phone Number"
            placeholder="Enter your phone number"
                error={Boolean(form.formState.errors.phoneNumber)}
                helperText={form.formState.errors.phoneNumber?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  form.trigger("phoneNumber");
                }}
              />
            )}
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
        <Button variant="secondary" onClick={form.handleSubmit(handleNext)}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}


