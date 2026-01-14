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

  // Watch all form values to check if all fields are filled
  const watchedValues = form.watch();
  
  // Check if ALL fields (required and optional) are filled
  const areAllFieldsFilled = React.useMemo(() => {
    if (formFields.length === 0) {
      return true; // No fields, form is valid
    }

    return formFields.every((field) => {
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
                  helperText={form.formState.errors[field.id]?.message as string}
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
                  helperText={form.formState.errors[field.id]?.message as string}
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
            render={({ field: formField }) => {
              // Get today's date in YYYY-MM-DD format
              const today = new Date().toISOString().split('T')[0];
              
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
                  <StyledTextField
                    {...formField}
                    fullWidth
                    variant="outlined"
                    type="date"
                    placeholder="Select Date"
                    error={Boolean(form.formState.errors[field.id])}
                    helperText={form.formState.errors[field.id]?.message as string}
                    required={field.isRequired}
                    InputLabelProps={{ shrink: false }}
                    inputProps={{
                      min: today, // Prevent selecting past dates
                    }}
                    onChange={(e) => {
                      formField.onChange(e.target.value);
                      setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                      form.trigger(field.id);
                      
                      // Re-validate time fields when date changes
                      formFields.forEach((f) => {
                        if (f.fieldType === "time") {
                          form.trigger(f.id);
                        }
                      });
                    }}
                  />
                </Box>
              );
            }}
          />
        );
      
      case "time":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => {
              // Find related date field (the date field that appears before this time field)
              const currentFieldIndex = formFields.findIndex(f => f.id === field.id);
              const relatedDateField = formFields
                .slice(0, currentFieldIndex)
                .reverse()
                .find(f => f.fieldType === "date");
              
              // Calculate min time based on whether date is today
              let minTime: string | undefined;
              if (relatedDateField) {
                const dateValue = formFieldValues[relatedDateField.id] as string;
                if (dateValue) {
                  const selectedDate = new Date(dateValue);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  selectedDate.setHours(0, 0, 0, 0);
                  
                  // If date is today, set min time to current time + 1 minute
                  if (selectedDate.getTime() === today.getTime()) {
                    const now = new Date();
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes() + 1).padStart(2, '0');
                    minTime = `${hours}:${minutes}`;
                  }
                } else {
                  // If no date selected, set min to current time
                  const now = new Date();
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes() + 1).padStart(2, '0');
                  minTime = `${hours}:${minutes}`;
                }
              } else {
                // If no date field found, set min to current time
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes() + 1).padStart(2, '0');
                minTime = `${hours}:${minutes}`;
              }
              
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
                  <StyledTextField
                    {...formField}
                    fullWidth
                    variant="outlined"
                    type="time"
                    placeholder="Type Here"
                    error={Boolean(form.formState.errors[field.id])}
                    helperText={form.formState.errors[field.id]?.message as string}
                    required={field.isRequired}
                    InputLabelProps={{ shrink: false }}
                    inputProps={{
                      min: minTime, // Prevent selecting past times
                    }}
                    onChange={(e) => {
                      formField.onChange(e.target.value);
                      setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value });
                      form.trigger(field.id);
                    }}
                  />
                </Box>
              );
            }}
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
      {/* Header - Close icon */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-end"
        sx={{ width: "100%" }}
      >
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
        <Button
          variant="secondary"
          onClick={form.handleSubmit(handleFormSubmit)}
          disabled={isSubmitting || !form.formState.isValid || !areAllFieldsFilled}
          sx={{
            cursor: isSubmitting || !form.formState.isValid || !areAllFieldsFilled ? "not-allowed" : "pointer",
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 2, sm: 3 },
          }}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
        </Button>
      </Stack>
    </Stack>
  );
}
