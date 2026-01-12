import React, { type JSX } from "react";
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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { type FormField } from "../../../rtk/endpoints/publicApi";
import { StyledTextField } from "../../../utils/helper";

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

  // Render form field based on type
  const renderFormField = (field: FormField) => {
    const value = formFieldValues[field.id] || "";
    const hasOptions = field.options && field.options.length > 0;
    
    // If field has options, render as radio buttons regardless of fieldType
    if (hasOptions && (field.fieldType === "text" || field.fieldType === "radio")) {
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
    }
    
    switch (field.fieldType) {
      case "text":
        return (
          <Box key={field.id}>
            <StyledTextField
              fullWidth
              variant="outlined"
              label={field.label}
              placeholder={field.placeholder || "Type Here"}
              value={value}
              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value })}
              required={field.isRequired}
            />
          </Box>
        );
      
      case "textarea":
        return (
          <Box key={field.id}>
            <StyledTextField
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              label={field.label}
              placeholder={field.placeholder || "Describe here"}
              value={value}
              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value })}
              required={field.isRequired}
            />
          </Box>
        );
      
      case "select":
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
            <FormControl fullWidth>
              <Select
                value={value}
                displayEmpty
                onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value })}
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
        const checkboxValues = Array.isArray(formFieldValues[field.id]) 
          ? formFieldValues[field.id] as string[] 
          : [];
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
                        setFormFieldValues({ ...formFieldValues, [field.id]: newValues });
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
      
      case "date":
        return (
          <Box key={field.id}>
            <StyledTextField
              fullWidth
              variant="outlined"
              type="date"
              label={field.label}
              placeholder="Select Date"
              value={value}
              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value })}
              required={field.isRequired}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        );
      
      case "time":
        return (
          <Box key={field.id}>
            <StyledTextField
              fullWidth
              variant="outlined"
              type="time"
              label={field.label}
              placeholder="Type Here"
              value={value}
              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value })}
              required={field.isRequired}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        );
      
      default:
        return (
          <Box key={field.id}>
            <StyledTextField
              fullWidth
              variant="outlined"
              label={field.label}
              placeholder={field.placeholder || "Type Here"}
              value={value}
              onChange={(e) => setFormFieldValues({ ...formFieldValues, [field.id]: e.target.value })}
              required={field.isRequired}
            />
          </Box>
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
      {formFields && formFields.length > 0 ? (
        <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          {[...formFields]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((field) => renderFormField(field))}
        </Stack>
      ) : (
        <Typography sx={{ color: "#6C737F", textAlign: "center", py: 4, width: "100%" }}>
          No additional questions for this service.
        </Typography>
      )}

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
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Submit"}
        </Button>
      </Stack>
    </Stack>
  );
}
