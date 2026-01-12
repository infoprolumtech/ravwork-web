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

  // Watch all form values to check if required fields are filled
  const watchedValues = form.watch();
  
  // Check if all required fields are filled
  const areAllRequiredFieldsFilled = React.useMemo(() => {
    const requiredFields = formFields.filter((field) => field.isRequired);
    
    if (requiredFields.length === 0) {
      return true; // No required fields, form is valid
    }

    return requiredFields.every((field) => {
      const value = watchedValues[field.id];
      
      if (field.fieldType === "checkbox") {
        return Array.isArray(value) && value.length > 0;
      }
      
      if (field.options && field.options.length > 0) {
        return value !== "" && value !== null && value !== undefined;
      }
      
      return value !== "" && value !== null && value !== undefined;
    });
  }, [formFields, watchedValues]);

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
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#111927",
                  }}
                >
                  {field.label}
                </Typography>
              </Stack>
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
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#111927",
                    }}
                  >
                    {field.label}
                  </Typography>
                </Stack>
                <StyledTextField
                  {...formField}
                  fullWidth
                  variant="outlined"
                  placeholder={field.placeholder || "Type Here"}
                  error={Boolean(form.formState.errors[field.id])}
                  required={field.isRequired}
                  InputLabelProps={{ shrink: false }}
                  onChange={(e) => {
                    formField.onChange(e.target.value);
                    setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                    form.trigger(field.id);
                  }}
                />
              </Box>
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
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#111927",
                    }}
                  >
                    {field.label}
                  </Typography>
                </Stack>
                <StyledTextField
                  {...formField}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  placeholder={field.placeholder || "Describe here"}
                  error={Boolean(form.formState.errors[field.id])}
                  required={field.isRequired}
                  InputLabelProps={{ shrink: false }}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "8px !important",
                    },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px !important",
                    },
                    "& .MuiInputBase-input": {
                      borderRadius: "8px !important",
                      border: "none !important",
                      outline: "none !important",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                    },
                    "& .MuiInputBase-input:focus": {
                      border: "none !important",
                      outline: "none !important",
                    },
                  }}
                  onChange={(e) => {
                    formField.onChange(e.target.value);
                    setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                    form.trigger(field.id);
                  }}
                />
              </Box>
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
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#111927",
                    }}
                  >
                    {field.label}
                  </Typography>
                </Stack>
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
                      borderRadius: "100px",
                      "& .MuiInputBase-root": {
                        backgroundColor: "#F7F9FB",
                        borderRadius: "100px !important",
                        fontSize: "16px",
                        padding: "0",
                        overflow: "hidden",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "100px !important",
                      },
                      "& .MuiSelect-select": {
                        padding: "12px 16px",
                        color: "#1C1C1C",
                        borderRadius: "100px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #D1D5DB",
                        borderRadius: "100px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #D1D5DB",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #9CA3AF",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#111927",
                        right: "16px",
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
                fontSize: "20px",
                fontWeight: 600,
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
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#111927",
                      }}
                    >
                      {field.label}
                    </Typography>
                  </Stack>
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
                            fontSize: "18px",
                            fontWeight: 500,
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
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#111927",
                    }}
                  >
                    {field.label}
                  </Typography>
                </Stack>
                <StyledTextField
                  {...formField}
                  fullWidth
                  variant="outlined"
                  type="date"
                  placeholder="Select Date"
                  error={Boolean(form.formState.errors[field.id])}
                  required={field.isRequired}
                  InputLabelProps={{ shrink: false }}
                  onChange={(e) => {
                    formField.onChange(e.target.value);
                    setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                    form.trigger(field.id);
                  }}
                />
              </Box>
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
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#111927",
                    }}
                  >
                    {field.label}
                  </Typography>
                </Stack>
                <StyledTextField
                  {...formField}
                  fullWidth
                  variant="outlined"
                  type="time"
                  placeholder="Type Here"
                  error={Boolean(form.formState.errors[field.id])}
                  required={field.isRequired}
                  InputLabelProps={{ shrink: false }}
                  onChange={(e) => {
                    formField.onChange(e.target.value);
                    setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                    form.trigger(field.id);
                  }}
                />
              </Box>
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
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#111927",
                    }}
                  >
                    {field.label}
                  </Typography>
                </Stack>
                <StyledTextField
                  {...formField}
                  fullWidth
                  variant="outlined"
                  placeholder={field.placeholder || "Type Here"}
                  error={Boolean(form.formState.errors[field.id])}
                  required={field.isRequired}
                  InputLabelProps={{ shrink: false }}
                  onChange={(e) => {
                    formField.onChange(e.target.value);
                    setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                    form.trigger(field.id);
                  }}
                />
              </Box>
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
            fontSize: "28px",
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
          disabled={isSubmitting || !form.formState.isValid || !areAllRequiredFieldsFilled}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
        </Button>
      </Stack>
    </Stack>
  );
}
