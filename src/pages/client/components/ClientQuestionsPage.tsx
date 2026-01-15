import React, { type JSX, useMemo, useState } from "react";
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
import { StyledTextField, getCloudFrontUrl } from "../../../utils/helper";
import { createCustomFormSchema } from "../validationSchemas";
import { useGeneratePresignedUrlMutation } from "../../../rtk/endpoints/authApi";
import { useAppDispatch } from "../../../rtk/store";
import { showAlert } from "../../../rtk/feature/alertSlice";
import Icon from "../../../components/shared/Icon";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


export interface FormFieldValues {
  [key: string]: string | string[] | { date?: string; time?: string };
}

interface ClientQuestionsPageProps {
  onClose: () => void;
  onSubmit: () => void;
  onNext?: () => void;
  formFields: FormField[];
  formFieldValues: FormFieldValues;
  setFormFieldValues: React.Dispatch<React.SetStateAction<FormFieldValues>>;
  isSubmitting: boolean;
}

const pickerTextFieldStyles = {
  
  "& .MuiPickersOutlinedInput-root": {
    borderRadius: "100px", // rounded field
    height: 44, // consistent height
    fontSize: "14px",
    backgroundColor: "#FFFFFF",
    px:2,

    "& fieldset": {
      borderColor: "#E5E7EB",
    },

    "&:hover fieldset": {
      borderColor: "#CBD5E1",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#2563EB",
      borderWidth: "1px",
    },

    "&.Mui-error fieldset": {
      borderColor: "#DC2626",
      borderWidth: "1px",
    },

    "&.Mui-error:hover fieldset": {
      borderColor: "#DC2626",
    },

    "&.Mui-error.Mui-focused fieldset": {
      borderColor: "#DC2626",
      borderWidth: "1px",
    },
  },

  "& .MuiInputBase-input": {
    padding: "10px 14px",
    fontSize: "14px", // smaller font
  },

  "& .MuiInputAdornment-root svg": {
    fontSize: "18px", // smaller icon
    // color: "#6B7280",
  },

  "& .MuiFormHelperText-root": {
    fontSize: "12px",
  },
};



export default function ClientQuestionsPage({
  onClose,
  onSubmit,
  onNext,
  formFields,
  formFieldValues,
  setFormFieldValues,
  isSubmitting,
}: ClientQuestionsPageProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [generatePresignedUrl] = useGeneratePresignedUrlMutation();
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string[]>>({});

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
    // Initialize image previews from existing values
    const fileFields = formFields.filter(f => f.fieldType === "file" || f.fieldType === "images");
    const newPreviews: Record<string, string[]> = {};
    fileFields.forEach(field => {
      const value = formFieldValues[field.id];
      if (Array.isArray(value) && value.length > 0) {
        // If it's an array of URLs, use them as previews
        newPreviews[field.id] = value.filter((url: any) => url && url !== "");
      } else if (value && typeof value === "string" && value.startsWith("http")) {
        // Backward compatibility: single URL string
        newPreviews[field.id] = [value];
      } else {
        newPreviews[field.id] = [];
      }
    });
    setImagePreviews(newPreviews);
  }, [formFieldValues, form, formFields]);

  const handleFormSubmit = (data: FormFieldValues) => {
    setFormFieldValues(data);
    if (onNext) {
      onNext();
    } else {
      onSubmit();
    }
  };

  // Watch all form values to check if required fields are filled
  const watchedValues = form.watch();
  
  // Check if all REQUIRED fields are filled (optional fields can be empty)
  const areRequiredFieldsFilled = React.useMemo(() => {
    if (formFields.length === 0) {
      return true; // No fields, form is valid
    }

    // Only check required fields
    const requiredFields = formFields.filter(field => field.isRequired);
    if (requiredFields.length === 0) {
      return true; // No required fields, form is valid
    }

    return requiredFields.every((field) => {
      const value = watchedValues[field.id];
      
      if (field.fieldType === "checkbox") {
        return Array.isArray(value) && value.length > 0;
      }
      
      // For date fields, check if both date and time are present
      if (field.fieldType === "date" || field.fieldType === "date_time") {
        if (typeof value === "object" && !Array.isArray(value)) {
          const dateTimeValue = value as { date?: string; time?: string };
          return dateTimeValue.date && dateTimeValue.time && dateTimeValue.date !== "" && dateTimeValue.time !== "";
        }
        return false;
      }
      
      // For image upload fields, check if array has at least 1 image
      if (field.fieldType === "file" || field.fieldType === "images") {
        if (Array.isArray(value)) {
          return value.length > 0 && value.every((url: any) => url && url !== "");
        }
        // Backward compatibility: single string URL
        if (typeof value === "string") {
          return value !== "" && value !== null && value !== undefined;
        }
        return false;
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
                  {field.isRequired && (
                    <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                  )}
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
                {form.formState.errors[field.id] && (
                  <FormHelperText error sx={{ mt: 0.5, ml: 1.75, fontSize: "12px", color: "#DC2626 !important" }}>
                    {form.formState.errors[field.id]?.message as string}
                  </FormHelperText>
                )}
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
                    {field.isRequired && (
                      <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                    )}
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
                  sx={{
                    "& .MuiFormHelperText-root": {
                      color: "#6C737F",
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
                    {field.isRequired && (
                      <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                    )}
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
                    {field.isRequired && (
                      <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                    )}
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
                  {form.formState.errors[field.id] && (
                    <FormHelperText error sx={{ mt: 0.5, ml: 1.75, fontSize: "12px", color: "#DC2626 !important" }}>
                      {form.formState.errors[field.id]?.message as string}
                    </FormHelperText>
                  )}
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
                      {field.isRequired && (
                        <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                      )}
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
                  {form.formState.errors[field.id] && (
                    <FormHelperText error sx={{ mt: 0.5, ml: 1.75, fontSize: "12px", color: "#DC2626 !important" }}>
                      {form.formState.errors[field.id]?.message as string}
                    </FormHelperText>
                  )}
                </Box>
              );
            }}
          />
        );

        case "date":
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        key={field.id}
        name={field.id}
        control={form.control}
        render={({ field: formField }) => {
          const today = dayjs();

          const currentValue = formFieldValues[field.id] as
            | { date?: string; time?: string }
            | string
            | undefined;

          const dateValue = currentValue && typeof currentValue === "object"
            ? currentValue.date
            : typeof currentValue === "string"
            ? currentValue
            : "";

          const timeValue =
            currentValue && typeof currentValue === "object"
              ? currentValue.time
              : "";

          const selectedDate = dateValue ? dayjs(dateValue) : null;
          const selectedTime = timeValue ? dayjs(timeValue, "HH:mm") : null;

          // Min time logic (same as before)
          const isToday =
            selectedDate && selectedDate.isSame(today, "day");

          const minTime = isToday
            ? dayjs().add(1, "minute")
            : undefined;

          return (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "20px", fontWeight: 600, color: "#111927" }}
                >
                  {field.label}
                  {field.isRequired && (
                    <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>
                      *
                    </Box>
                  )}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                {/* Date Picker */}
                
                <DatePicker
                  value={selectedDate}
                  minDate={today}
                  onChange={(newDate: Dayjs | null) => {
                    const newValue = {
                      date: newDate ? newDate.format("YYYY-MM-DD") : "",
                      time: timeValue,
                    };
                    formField.onChange(newValue);
                    setFormFieldValues({ ...formFieldValues, [field.id]: newValue });
                    form.trigger(field.id);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: field.isRequired,
                      error: Boolean(form.formState.errors[field.id]),
                      sx: pickerTextFieldStyles,
                    },
                    popper: {
                      sx: {
                        "& .MuiPaper-root": {
                          borderRadius: "12px",
                          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                          "& .MuiPickersCalendarHeader-root": {
                            padding: "16px",
                          },
                          "& .MuiDayCalendar-weekContainer": {
                            margin: "8px 0",
                          },
                          "& .MuiPickersDay-root": {
                            fontSize: "16px",
                            width: "40px",
                            height: "40px",
                            borderRadius: "8px",
                            "&.Mui-selected": {
                              backgroundColor: "#111927",
                              color: "#FFFFFF",
                              "&:hover": {
                                backgroundColor: "#384250",
                                color: "#FFFFFF",
                              },
                              "&:focus": {
                                backgroundColor: "#111927",
                                color: "#FFFFFF",
                              },
                            },
                            "&:hover": {
                              backgroundColor: "#F3F4F6",
                            },
                          },
                        },
                      },
                    },
                  }}
                />

                {/* Time Picker */}
                <TimePicker
                  value={selectedTime}
                  minTime={minTime}
                  onChange={(newTime: Dayjs | null) => {
                    const newValue = {
                      date: dateValue,
                      time: newTime ? newTime.format("HH:mm") : "",
                    };
                    formField.onChange(newValue);
                    setFormFieldValues({ ...formFieldValues, [field.id]: newValue });
                    form.trigger(field.id);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: field.isRequired,
                      error: Boolean(form.formState.errors[field.id]),
                      sx: pickerTextFieldStyles,
                    },
                  }}
                />
              </Stack>

              {form.formState.errors[field.id] && (
                <FormHelperText error sx={{ mt: 0.5, ml: 1.75, fontSize: "12px", color: "#DC2626 !important" }}>
                  {form.formState.errors[field.id]?.message as string}
                  
                </FormHelperText>
              )}
            </Box>
          );
        }}
      />
    </LocalizationProvider>
  );

      
      // case "date":
      //   return (
      //     <Controller
      //       key={field.id}
      //       name={field.id}
      //       control={form.control}
      //       render={({ field: formField }) => {
      //         // Get today's date in YYYY-MM-DD format
      //         const today = new Date().toISOString().split('T')[0];
              
      //         // Get current value (should be an object with date and time)
      //         const currentValue = formFieldValues[field.id] as { date?: string; time?: string } | string | undefined;
      //         let dateValue = "";
      //         let timeValue = "";
              
      //         if (currentValue && typeof currentValue === "object" && !Array.isArray(currentValue)) {
      //           dateValue = currentValue.date || "";
      //           timeValue = currentValue.time || "";
      //         } else if (typeof currentValue === "string" && currentValue) {
      //           // Handle legacy format where it might be just a date string
      //           dateValue = currentValue;
      //         }
              
      //         // Calculate min time based on whether date is today
      //         let minTime: string | undefined;
      //         if (dateValue) {
      //           const selectedDate = new Date(dateValue);
      //           const todayDate = new Date();
      //           todayDate.setHours(0, 0, 0, 0);
      //           selectedDate.setHours(0, 0, 0, 0);
                
      //           // If date is today, set min time to current time + 1 minute
      //           if (selectedDate.getTime() === todayDate.getTime()) {
      //             const now = new Date();
      //             const hours = String(now.getHours()).padStart(2, '0');
      //             const minutes = String(now.getMinutes() + 1).padStart(2, '0');
      //             minTime = `${hours}:${minutes}`;
      //           }
      //         } else {
      //           // If no date selected, set min to current time
      //           const now = new Date();
      //           const hours = String(now.getHours()).padStart(2, '0');
      //           const minutes = String(now.getMinutes() + 1).padStart(2, '0');
      //           minTime = `${hours}:${minutes}`;
      //         }
              
      //         return (
      //           <Box>
      //             <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      //               <Typography
      //                 variant="body2"
      //                 sx={{
      //                   fontSize: "20px",
      //                   fontWeight: 600,
      //                   color: "#111927",
      //                 }}
      //               >
      //                 {field.label}
      //                 {field.isRequired && (
      //                   <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
      //                 )}
      //               </Typography>
      //             </Stack>
      //             <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
      //               {/* Date Field */}
      //               <StyledTextField
      //                 fullWidth
      //                 variant="outlined"
      //                 type="date"
      //                 placeholder="Select Date"
      //                 value={dateValue}
      //                 error={Boolean(form.formState.errors[field.id])}
      //                 required={field.isRequired}
      //                 InputLabelProps={{ shrink: false }}
      //                 inputProps={{
      //                   min: today, // Prevent selecting past dates
      //                 }}
      //                 sx={{
      //                   "& .MuiFormHelperText-root.Mui-error": {
      //                     color: "#DC2626 !important",
      //                   },
      //                 }}
      //                 onChange={(e) => {
      //                   const newDate = e.target.value;
      //                   const newValue = { date: newDate, time: timeValue };
      //                   formField.onChange(newValue);
      //                   setFormFieldValues({ ...formFieldValues, [field.id]: newValue });
      //                   form.trigger(field.id);
      //                 }}
      //               />
      //               {/* Time Field */}
      //               <StyledTextField
      //                 fullWidth
      //                 variant="outlined"
      //                 type="time"
      //                 placeholder="Select Time"
      //                 value={timeValue}
      //                 error={Boolean(form.formState.errors[field.id])}
      //                 required={field.isRequired}
      //                 InputLabelProps={{ shrink: false }}
      //                 inputProps={{
      //                   min: minTime, // Prevent selecting past times
      //                 }}
      //                 sx={{
      //                   "& .MuiFormHelperText-root.Mui-error": {
      //                     color: "#DC2626 !important",
      //                   },
      //                 }}
      //                 onChange={(e) => {
      //                   const newTime = e.target.value;
      //                   const newValue = { date: dateValue, time: newTime };
      //                   formField.onChange(newValue);
      //                   setFormFieldValues({ ...formFieldValues, [field.id]: newValue });
      //                   form.trigger(field.id);
      //                 }}
      //               />
      //             </Stack>
      //             {form.formState.errors[field.id] && (
      //               <FormHelperText error sx={{ mt: 0.5, ml: 1.75, fontSize: "12px", color: "#DC2626 !important" }}>
      //                 {form.formState.errors[field.id]?.message as string}
      //               </FormHelperText>
      //             )}
      //           </Box>
      //         );
      //       }}
      //     />
      //   );
      
      case "date_time":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => {
              // Get today's date in YYYY-MM-DD format
              const today = new Date().toISOString().split('T')[0];
              
              // Get current value (should be an object with date and time)
              const currentValue = formFieldValues[field.id] as { date?: string; time?: string } | string | undefined;
              let dateValue = "";
              let timeValue = "";
              
              if (currentValue && typeof currentValue === "object" && !Array.isArray(currentValue)) {
                dateValue = currentValue.date || "";
                timeValue = currentValue.time || "";
              }
              
              // Calculate min time based on whether date is today
              let minTime: string | undefined;
              if (dateValue) {
                const selectedDate = new Date(dateValue);
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                selectedDate.setHours(0, 0, 0, 0);
                
                // If date is today, set min time to current time + 1 minute
                if (selectedDate.getTime() === todayDate.getTime()) {
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
                      {field.isRequired && (
                        <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                      )}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                    {/* Date Field */}
                    <StyledTextField
                      fullWidth
                      variant="outlined"
                      type="date"
                      placeholder="Select Date"
                      value={dateValue}
                      error={Boolean(form.formState.errors[field.id])}
                      required={field.isRequired}
                      InputLabelProps={{ shrink: false }}
                      inputProps={{
                        min: today, // Prevent selecting past dates
                      }}
                      sx={{
                        "& .MuiFormHelperText-root.Mui-error": {
                          color: "#DC2626 !important",
                        },
                      }}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        const newValue = { date: newDate, time: timeValue };
                        formField.onChange(newValue);
                        setFormFieldValues({ ...formFieldValues, [field.id]: newValue });
                        form.trigger(field.id);
                      }}
                    />
                    {/* Time Field */}
                    <StyledTextField
                      fullWidth
                      variant="outlined"
                      type="time"
                      placeholder="Select Time"
                      value={timeValue}
                      error={Boolean(form.formState.errors[field.id])}
                      required={field.isRequired}
                      InputLabelProps={{ shrink: false }}
                      inputProps={{
                        min: minTime, // Prevent selecting past times
                      }}
                      sx={{
                        "& .MuiFormHelperText-root.Mui-error": {
                          color: "#DC2626 !important",
                        },
                      }}
                      onChange={(e) => {
                        const newTime = e.target.value;
                        const newValue = { date: dateValue, time: newTime };
                        formField.onChange(newValue);
                        setFormFieldValues({ ...formFieldValues, [field.id]: newValue });
                        form.trigger(field.id);
                      }}
                    />
                  </Stack>
                  {form.formState.errors[field.id] && (
                    <FormHelperText error sx={{ mt: 0.5, ml: 1.75, fontSize: "12px", color: "#DC2626 !important" }}>
                      {form.formState.errors[field.id]?.message as string}
                    </FormHelperText>
                  )}
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
                      {field.isRequired && (
                        <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                      )}
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
      
      case "file":
      case "images":
        return (
          <Controller
            key={field.id}
            name={field.id}
            control={form.control}
            render={({ field: formField }) => {
              const currentImages = Array.isArray(formFieldValues[field.id]) 
                ? (formFieldValues[field.id] as string[]).filter((url: string) => url && url !== "")
                : (formFieldValues[field.id] && typeof formFieldValues[field.id] === "string" && formFieldValues[field.id] !== "")
                  ? [formFieldValues[field.id] as string]
                  : [];
              
              const previewUrls = imagePreviews[field.id] || [];
              const isUploading = uploadingFields[field.id] || false;
              const maxImages = 10;
              const canAddMore = currentImages.length < maxImages;

              const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
                const files = event.target.files;
                if (!files || files.length === 0) return;

                // Check if adding these files would exceed the limit
                const filesToAdd = Array.from(files);
                if (currentImages.length + filesToAdd.length > maxImages) {
                  dispatch(showAlert({ 
                    message: `Maximum ${maxImages} images allowed. You can add ${maxImages - currentImages.length} more.`, 
                    severity: "error" 
                  }));
                  event.target.value = "";
                  return;
                }

                // Validate file types
                const invalidFiles = filesToAdd.filter(file => !file.type.match(/^image\/(png|jpeg|jpg)$/));
                if (invalidFiles.length > 0) {
                  dispatch(showAlert({ 
                    message: "Invalid file type. Please upload PNG or JPG images only.", 
                    severity: "error" 
                  }));
                  event.target.value = "";
                  return;
                }

                setUploadingFields({ ...uploadingFields, [field.id]: true });
                
                try {
                  const uploadedUrls: string[] = [];
                  const previewPromises: Promise<string>[] = [];

                  // Upload each file
                  for (const file of filesToAdd) {
                    // Generate unique filename
                    const timestamp = Date.now();
                    const randomString = Math.random().toString(36).substring(2, 15);
                    const fileExtension = file.name.split('.').pop() || 'jpg';
                    const fileName = `service-upload-${timestamp}-${randomString}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

                    // Step 1: Generate presigned URL
                    const presignedResponse = await generatePresignedUrl({
                      type: "PUT",
                      files: [
                        {
                          folderName: "service-uploads",
                          fileName: fileName,
                        },
                      ],
                    }).unwrap();

                    if (!presignedResponse?.data?.[0]?.signedUrl) {
                      throw new Error("Failed to generate presigned URL");
                    }

                    const signedUrl = presignedResponse.data[0].signedUrl;

                    // Step 2: Upload file to S3 using presigned URL
                    const uploadResponse = await fetch(signedUrl, {
                      method: "PUT",
                      body: file,
                    });

                    if (!uploadResponse.ok) {
                      throw new Error("Failed to upload image to S3");
                    }

                    // Step 3: Extract the full S3 URL from the presigned URL
                    const s3Url = new URL(signedUrl);
                    const imageUrl = `${s3Url.origin}${s3Url.pathname}`;
                    uploadedUrls.push(imageUrl);

                    // Create preview promise
                    const previewPromise = new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        resolve(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    });
                    previewPromises.push(previewPromise);
                  }

                  // Wait for all previews to be ready
                  const newPreviews = await Promise.all(previewPromises);

                  // Update form values with all uploaded URLs
                  const updatedImages = [...currentImages, ...uploadedUrls];
                  formField.onChange(updatedImages);
                  setFormFieldValues({ ...formFieldValues, [field.id]: updatedImages });
                  
                  // Update previews
                  const updatedPreviews = [...previewUrls, ...newPreviews];
                  setImagePreviews({ ...imagePreviews, [field.id]: updatedPreviews });

                  dispatch(showAlert({ 
                    message: `${filesToAdd.length} image(s) uploaded successfully!`, 
                    severity: "success" 
                  }));
                } catch (error: any) {
                  console.error("Upload error:", error);
                  dispatch(showAlert({
                    message: error?.message || "Failed to upload image(s). Please try again.",
                    severity: "error"
                  }));
                } finally {
                  setUploadingFields({ ...uploadingFields, [field.id]: false });
                  event.target.value = "";
                }
              };

              const handleRemoveImage = (indexToRemove: number) => {
                const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
                const updatedPreviews = previewUrls.filter((_, index) => index !== indexToRemove);
                
                formField.onChange(updatedImages);
                setFormFieldValues({ ...formFieldValues, [field.id]: updatedImages });
                setImagePreviews({ ...imagePreviews, [field.id]: updatedPreviews });
                form.trigger(field.id);
              };

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
                      {field.isRequired && (
                        <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                      )}
                    </Typography>
                  </Stack>
                  
                  {/* Upload Button */}
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <Box
                        sx={{
                          width: { xs: 120, sm: 150 },
                          height: { xs: 120, sm: 150 },
                          borderRadius: 2,
                          border: "1px solid #D1D5DB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isUploading ? "#F3F4F6" : "transparent",
                        }}
                      />
                      <input
                        accept="image/png,image/jpeg,image/jpg"
                        style={{ display: "none" }}
                        id={`file-upload-${field.id}`}
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        disabled={isUploading || isSubmitting || !canAddMore}
                      />
                      {isUploading ? (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress size={40} sx={{ color: "#1C1C1C" }} />
                        </Box>
                      ) : canAddMore ? (
                        <label htmlFor={`file-upload-${field.id}`}>
                          <Button
                            component="span"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              minWidth: "auto",
                              p: 1,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              borderRadius: "50%",
                              width: 40,
                              height: 40,
                              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                            }}
                          >
                            <Icon src="/assets/icons/upload.svg" alt="upload" size={20} sx={{ filter: "invert(1)" }} />
                          </Button>
                        </label>
                      ) : (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            px: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#6C737F",
                              fontSize: "12px",
                              fontWeight: 400,
                            }}
                          >
                            Max {maxImages} images
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    {canAddMore && (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#6C737F",
                          fontSize: "12px",
                          fontWeight: 400,
                        }}
                      >
                        {currentImages.length === 0 
                          ? (field.isRequired ? "Upload at least 1 image (max 10)" : "Upload up to 10 images")
                          : `${currentImages.length}/${maxImages} images. You can add ${maxImages - currentImages.length} more.`
                        }
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Image Grid - Show after upload box */}
                  {currentImages.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                            md: "repeat(4, 1fr)",
                          },
                          gap: { xs: 1.5, sm: 2 },
                        }}
                      >
                        {currentImages.map((imageUrl, index) => {
                          const previewUrl = previewUrls[index] 
                            ? (previewUrls[index].startsWith("http") ? getCloudFrontUrl(previewUrls[index]) : previewUrls[index])
                            : (imageUrl.startsWith("http") ? getCloudFrontUrl(imageUrl) : imageUrl);
                          
                          return (
                            <Box
                              key={index}
                              sx={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: "1",
                                borderRadius: 2,
                                overflow: "hidden",
                                border: "1px solid #D1D5DB",
                              }}
                            >
                              <Box
                                component="img"
                                src={previewUrl}
                                alt={`Preview ${index + 1}`}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  backgroundColor: "rgba(0,0,0,0.6)",
                                  color: "white",
                                  width: 28,
                                  height: 28,
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.8)",
                                  },
                                }}
                              >
                                <Close sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                  
                  {form.formState.errors[field.id] && (
                    <FormHelperText error sx={{ mt: 0.5, ml: 1.75, fontSize: "12px", color: "#DC2626 !important" }}>
                      {form.formState.errors[field.id]?.message as string}
                    </FormHelperText>
                  )}
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
                      {field.isRequired && (
                        <Box component="span" sx={{ color: "#F04438", ml: 0.5 }}>*</Box>
                      )}
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
                const fieldComponent = renderFormField(field);
                
                return (
                  <Box key={field.id}>
                    {fieldComponent}
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
          disabled={isSubmitting || !form.formState.isValid || !areRequiredFieldsFilled}
          sx={{
            cursor: isSubmitting || !form.formState.isValid || !areRequiredFieldsFilled ? "not-allowed" : "pointer",
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 2, sm: 3 },
          }}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : (onNext ? "Next" : "Submit")}
        </Button>
      </Stack>
    </Stack>
  );
}
