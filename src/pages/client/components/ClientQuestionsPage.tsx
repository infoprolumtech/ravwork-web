import React, { type JSX, useMemo } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type FormField } from "../../../rtk/endpoints/publicApi";
import { StyledTextField } from "../../../utils/helper";
import { createCustomFormSchema } from "../validationSchemas";

interface FormFieldValues {
  [key: string]: string | string[];
}

interface ClientQuestionsPageProps {
  onClose: () => void;
  onSubmit: () => void;
  formFields: FormField[];
  formFieldValues: FormFieldValues;
  setFormFieldValues: React.Dispatch<React.SetStateAction<FormFieldValues>>;
  isSubmitting: boolean;
}

export default function ClientQuestionsPage({
  onClose,
  onSubmit,
  formFields,
  formFieldValues,
  setFormFieldValues,
  isSubmitting,
}: ClientQuestionsPageProps): JSX.Element {
  // Create dynamic schema based on formFields
  const schema = useMemo(() => createCustomFormSchema(formFields), [formFields]);

  const form = useForm({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: formFieldValues,
  });

  // Sync form with parent state
  React.useEffect(() => {
    form.reset(formFieldValues);
  }, [formFieldValues, form]);

  const handleFormSubmit = (data: FormFieldValues) => {
    setFormFieldValues(data);
    onSubmit();
  };

  // Render form field based on type
  const renderFormField = (field: FormField) => {
    const value = formFieldValues[field.id] || "";
    const hasOptions = field.options && field.options.length > 0;
    
    // If field has options, render as radio buttons regardless of fieldType
    if (hasOptions && (field.fieldType === "text" || field.fieldType === "radio")) {
      return (
        <Controller
          key={field.id}
          name={field.id}
          control={form.control}
          render={({ field: formField }) => (
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#111927",
                  mb: 1,
                }}
              >
                {field.label}
              </Typography>
              <FormControl error={Boolean(form.formState.errors[field.id])}>
                <RadioGroup
                  value={formField.value || ""}
                  onChange={(e) => {
                    formField.onChange(e.target.value);
                    setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                    form.trigger(field.id);
                  }}
                >
                  {field.options?.map((option, idx) => (
                    <FormControlLabel 
                      key={idx} 
                      value={option} 
                      control={
                        <Radio 
                          size="small" 
                          sx={{
                            color: "#D1D5DB",
                            "&.Mui-checked": {
                              color: "#111927",
                            },
                          }}
                        />
                      } 
                      label={option}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "14px",
                          color: "#384250",
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          )}
        />
      );
    }
    
    switch (field.fieldType) {
      case "text":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => (
              <StyledTextField
                {...formField}
                fullWidth
                variant="outlined"
                label={field.label}
                placeholder={field.placeholder || "Type Here"}
                error={Boolean(form.formState.errors[field.id])}
                required={field.isRequired}
                InputLabelProps={{ required: false }}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                  setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                  form.trigger(field.id);
                }}
              />
            )}
          />
        );
      
      case "textarea":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => (
              <StyledTextField
                {...formField}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                label={field.label}
                placeholder={field.placeholder || "Describe here"}
                error={Boolean(form.formState.errors[field.id])}
                required={field.isRequired}
                InputLabelProps={{ required: false }}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                  setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                  form.trigger(field.id);
                }}
              />
            )}
          />
        );
      
      case "select":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => (
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#111927",
                    mb: 1,
                  }}
                >
                  {field.label}
                </Typography>
                <FormControl fullWidth error={Boolean(form.formState.errors[field.id])}>
                  <Select
                    {...formField}
                    displayEmpty
                    onChange={(e) => {
                      formField.onChange(e.target.value);
                      setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                      form.trigger(field.id);
                    }}
                    required={field.isRequired}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#E5E7EB",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB",
                      },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {field.options?.map((option, idx) => (
                      <MenuItem key={idx} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          />
        );
      
      case "radio":
        return (
          <Box key={field.id}>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#111927",
                mb: 1,
              }}
            >
              {field.label}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value })}
            >
              {field.options?.map((option, idx) => (
                <FormControlLabel 
                  key={idx} 
                  value={option} 
                  control={
                    <Radio 
                      size="small" 
                      sx={{
                        color: "#D1D5DB",
                        "&.Mui-checked": {
                          color: "#111927",
                        },
                      }}
                    />
                  } 
                  label={option}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "14px",
                      color: "#384250",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </Box>
        );
      
      case "checkbox":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => {
              const checkboxValues = Array.isArray(formField.value) 
                ? formField.value as string[] 
                : [];
              return (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#111927",
                      mb: 1,
                    }}
                  >
                    {field.label}
                  </Typography>
                  <FormGroup>
                    {field.options?.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        control={
                          <Checkbox
                            size="small"
                            checked={checkboxValues.includes(option)}
                            onChange={(e) => {
                              const newValues = e.target.checked
                                ? [...checkboxValues, option]
                                : checkboxValues.filter((v) => v !== option);
                              formField.onChange(newValues);
                              setFormFieldValues({ ...formFieldValues, [field.id]: newValues });
                              form.trigger(field.id);
                            }}
                            sx={{
                              color: "#D1D5DB",
                              "&.Mui-checked": {
                                color: "#111927",
                              },
                            }}
                          />
                        }
                        label={option}
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "14px",
                            color: "#384250",
                          },
                        }}
                      />
                    ))}
                  </FormGroup>
                </Box>
              );
            }}
          />
        );
      
      case "date":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => (
              <StyledTextField
                {...formField}
                fullWidth
                variant="outlined"
                type="date"
                label={field.label}
                placeholder="Select Date"
                error={Boolean(form.formState.errors[field.id])}
                required={field.isRequired}
                InputLabelProps={{ shrink: true, required: false }}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                  setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                  form.trigger(field.id);
                }}
              />
            )}
          />
        );
      
      case "time":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => (
              <StyledTextField
                {...formField}
                fullWidth
                variant="outlined"
                type="time"
                label={field.label}
                placeholder="Type Here"
                error={Boolean(form.formState.errors[field.id])}
                required={field.isRequired}
                InputLabelProps={{ shrink: true, required: false }}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                  setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                  form.trigger(field.id);
                }}
              />
            )}
          />
        );
      
      default:
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => (
              <StyledTextField
                {...formField}
                fullWidth
                variant="outlined"
                label={field.label}
                placeholder={field.placeholder || "Type Here"}
                error={Boolean(form.formState.errors[field.id])}
                required={field.isRequired}
                InputLabelProps={{ required: false }}
                onChange={(e) => {
                  formField.onChange(e.target.value);
                  setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                  form.trigger(field.id);
                }}
              />
            )}
          />
        );
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
            fontSize: "18px",
            fontWeight: 600,
            color: "#111927",
            flex: 1,
            pr: 2,
          }}
        >
          Answer some additional questions to understand your requirement
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
      <form onSubmit={form.handleSubmit(handleFormSubmit)} style={{ width: "100%" }}>
        {formFields && formFields.length > 0 ? (
          <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[...formFields]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((field) => {
                const fieldError = form.formState.errors[field.id];
                const fieldComponent = renderFormField(field);
                
                // Wrap field with error display for fields that don't show errors inline
                return (
                  <Box key={field.id}>
                    {fieldComponent}
                    {fieldError && (field.fieldType === "radio" || field.fieldType === "checkbox" || (field.fieldType === "text" && field.options && field.options.length > 0)) && (
                      <FormHelperText error sx={{ mt: 0.5, ml: 1.75 }}>
                        {fieldError.message as string}
                      </FormHelperText>
                    )}
                  </Box>
                );
              })}
          </Stack>
        ) : (
          <Typography sx={{ color: "#6C737F", textAlign: "center", py: 4, width: "100%" }}>
            No additional questions for this service.
          </Typography>
        )}
      </form>

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
        <Button
          variant="secondary"
          onClick={form.handleSubmit(handleFormSubmit)}
          disabled={isSubmitting || !form.formState.isValid}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
        </Button>
      </Stack>
    </Stack>
  );
}
