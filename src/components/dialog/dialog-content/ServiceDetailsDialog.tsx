import React, { type JSX } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import DropdownArrow from "/assets/icons/dropdown-arrow-black.svg";
import { styled } from "@mui/material/styles";

const DropdownArrowIcon = () => (
  <img src={DropdownArrow} alt="open select menu" style={{ marginRight: 8 }} />
);

const DialogTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    backgroundColor: "#FFFFFF",
    color: "#111927",
    borderRadius: "8px",
    fontSize: "16px",
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
  },
  "& .MuiInputLabel-root": {
    display: "block",
    position: "static",
    transform: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#111927",
    marginBottom: "8px",
  },
  "& .MuiOutlinedInput-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #E5E7EB`,
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#9DA4AE",
  },
}));

const DialogSelect = styled(Select)(() => ({
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
  },
  "& .MuiSelect-select": {
    fontSize: "16px",
    fontWeight: 400,
    color: "#111927",
    padding: "12px 16px",
  },
}));

interface ServiceDetailsDialogProps {
  handleClose: () => void;
  onNext: (data: ServiceFormData) => void;
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

export default function ServiceDetailsDialog({
  handleClose,
  onNext,
}: ServiceDetailsDialogProps): JSX.Element {
  const [serviceTitle, setServiceTitle] = React.useState("");
  const [whatsIncluded, setWhatsIncluded] = React.useState("");
  const [servicePrice, setServicePrice] = React.useState("");
  const [responseTime, setResponseTime] = React.useState("");

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
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            color: "#111927",
            padding: "8px",
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          <Close />
        </IconButton>

        
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
          <DialogTextField
            fullWidth
            variant="outlined"
            label="Service title"
            placeholder="e.g. TV Mounting, House Cleaning"
            value={serviceTitle}
            onChange={(e) => setServiceTitle(e.target.value)}
          />
        </Box>

        {/* What's included */}
        <Box>
          <DialogTextField
            fullWidth
            variant="outlined"
            label="What's included?"
            placeholder="Describe Here (optional)"
            value={whatsIncluded}
            onChange={(e) => setWhatsIncluded(e.target.value)}
            multiline
            rows={3}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        {/* Service Price */}
        <Box>
          <DialogTextField
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
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#111927",
              marginBottom: "8px",
            }}
          >
            Response time
          </Typography>
          <FormControl fullWidth>
            <DialogSelect
              value={responseTime}
              onChange={(e) => setResponseTime(e.target.value as string)}
              displayEmpty
              IconComponent={DropdownArrowIcon}
              MenuProps={{
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
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#6C737F" }}>Select</span>;
                }
                const selectedOption = responseTimeOptions.find(
                  (o) => o.value === selected
                );
                return selectedOption ? selectedOption.label : "";
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
            </DialogSelect>
          </FormControl>
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
          onClick={handleClose}
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

