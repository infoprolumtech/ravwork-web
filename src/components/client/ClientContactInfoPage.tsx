import React, { type JSX, useEffect } from "react";
import {
  Button,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField } from "../../utils/helper";
import { contactInfoSchema, inquirySchema } from "../../pages/client/validationSchemas";

interface ContactFormInputs {
  fullName: string;
  email: string;
  phoneNumber: string;
  description?: string;
}

interface ClientContactInfoPageProps {
  onClose: () => void;
  onBack?: () => void;
  onNext: (data: ContactFormInputs) => void;
  onSubmit: (data: ContactFormInputs) => void;
  contactDetails: ContactFormInputs;
  setContactDetails: React.Dispatch<React.SetStateAction<ContactFormInputs>>;
  isQuickContact: boolean;
  isInquiry?: boolean;
  isSubmitting: boolean;
  isFromCustomQuestions?: boolean;
}

export default function ClientContactInfoPage({
  onClose,
  onNext,
  onSubmit,
  contactDetails,
  setContactDetails,
  isQuickContact,
  isInquiry = false,
  isSubmitting,
  isFromCustomQuestions = false,
}: ClientContactInfoPageProps): JSX.Element {
  const schema = isInquiry ? inquirySchema : contactInfoSchema;

  const form = useForm<ContactFormInputs>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: contactDetails,
  });

  // Sync form with parent state when contactDetails changes
  useEffect(() => {
    form.reset(contactDetails);
  }, [contactDetails, form]);

  // Update parent state when form values change
  const handleFormChange = (data: ContactFormInputs) => {
    setContactDetails(data);
  };

  const handleFormSubmit = (data: ContactFormInputs) => {
    if (isQuickContact || isInquiry || isFromCustomQuestions) {
      onSubmit(data);
    } else {
      onNext(data);
    }
  };

  return (
    <Stack
      sx={{
        padding: { xs: "20px", sm: "32px", md: "40px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: { xs: "16px", sm: "20px", md: "24px" },
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
            fontSize: { xs: "20px", sm: "22px", md: "24px" },
            fontWeight: 600,
            color: "#111927",
            flex: 1,
            pr: 2,
          }}
        >
          {isInquiry ? "Have a question? Provide your contact info." : "Enter your details to request this service."}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close"
          sx={{
            p: 0.5,
            "&:hover": { backgroundColor: "transparent" }
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      {/* Form Fields */}
      <form onSubmit={form.handleSubmit(handleFormSubmit)} style={{ width: "100%" }}>
        <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Name */}
          <Controller
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <StyledTextField
                {...field}
                fullWidth
                variant="outlined"
                label="Name"
                placeholder="Enter your name"
                error={Boolean(form.formState.errors.fullName)}
                helperText={form.formState.errors.fullName?.message}
                onChange={(e) => {
                  field.onChange(e);
                  handleFormChange({ ...form.getValues(), fullName: e.target.value });
                  form.trigger("fullName");
                }}
              />
            )}
          />

          {/* Phone Number */}
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
                  field.onChange(e);
                  handleFormChange({ ...form.getValues(), phoneNumber: e.target.value });
                  form.trigger("phoneNumber");
                }}
              />
            )}
          />

          {/* Email */}
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
                InputLabelProps={{ required: false }}
                onChange={(e) => {
                  field.onChange(e);
                  handleFormChange({ ...form.getValues(), email: e.target.value });
                  form.trigger("email");
                }}
              />
            )}
          />

          {/* Description (for inquiry) */}
          {isInquiry && (
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label="Description"
                  placeholder="Describe your question or inquiry"
                  error={Boolean(form.formState.errors.description)}
                  helperText={form.formState.errors.description?.message}
                  InputLabelProps={{ required: false }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFormChange({ ...form.getValues(), description: e.target.value });
                    form.trigger("description");
                  }}
                />
              )}
            />
          )}
        </Stack>
      </form>

      {/* Action Buttons */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{
          width: "100%",
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Button
          variant="primary"
          onClick={onClose}
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#111927",
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 2, sm: 3 },
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          Cancel
        </Button>
        {isQuickContact || isInquiry || isFromCustomQuestions ? (
          <Button
            variant="secondary"
            onClick={form.handleSubmit(handleFormSubmit)}
            disabled={isSubmitting || !form.formState.isValid}
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
              px: { xs: 2, sm: 3 },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={form.handleSubmit(handleFormSubmit)}
            disabled={!form.formState.isValid}
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
              px: { xs: 2, sm: 3 },
            }}
          >
            Next
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
