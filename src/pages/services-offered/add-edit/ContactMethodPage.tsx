import React, { type JSX } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

interface ContactMethodPageProps {
  onBack: () => void;
  onCancel: () => void;
  onSelect: (method: "quick_contact" | "contact_info_questions") => void;
  onCreate?: () => void; // For quick_contact direct create
  isEditMode?: boolean;
}

export default function ContactMethodPage({
  onBack: _onBack,
  onCancel,
  onSelect,
  onCreate,
  isEditMode = false,
}: ContactMethodPageProps): JSX.Element {
  const [selectedMethod, setSelectedMethod] = React.useState<
    "quick_contact" | "contact_info_questions" | ""
  >("");

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedMethod === "quick_contact" && onCreate) {
      // For quick_contact, directly create
      onCreate();
    } else if (selectedMethod) {
      // For custom_form, go to next step
      onSelect(selectedMethod as "quick_contact" | "contact_info_questions");
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
      {/* Header Icon */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{ width: "100%" }}
      >
          <Box
          component="img"
          src="/assets/icons/service_offered_icons/reach.svg"
          alt="Reach"
            sx={{
            width: "48px",
            height: "48px",
            objectFit: "contain",
            }}
        />
      </Stack>

      {/* Form Fields */}
      <Stack sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Title */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "20px", sm: "24px", md: "28px" },
              fontWeight: 600,
              color: "#111927",
            }}
          >
            How Should Clients Reach Out?
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "13px", sm: "13.5px", md: "14px" },
              fontWeight: 400,
              color: "#6C737F",
              mt: 1,
            }}
          >
            Choose how much information you want to collect before the job
          </Typography>
        </Box>

        {/* Contact Method Options */}
        <RadioGroup
        value={selectedMethod}
        onChange={(e) =>
          setSelectedMethod(
            e.target.value as "quick_contact" | "contact_info_questions"
          )
        }
        sx={{ width: "100%", gap: { xs: 1.5, sm: 1.75, md: 2 } }}
      >
        {/* Quick Contact Option */}
        <FormControlLabel
          value="quick_contact"
          control={<Box sx={{ display: "none" }} />}
          onClick={() => setSelectedMethod("quick_contact")}
          label={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.75, sm: 0.875, md: 1 },
                width: "100%",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: { xs: 1.5, sm: 1.75, md: 2 },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "16px", sm: "17px", md: "18px" },
                      fontWeight: 600,
                      color: "#111927",
                      mb: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    Quick Contact
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "13px", sm: "13.5px", md: "14px" },
                      fontWeight: 400,
                      color: "#6C737F",
                      wordBreak: "break-word",
                      width: "100%",
                    }}
                  >
                    Collect Basic Information to get booked faster
                  </Typography>
                </Box>
                {/* Quick Contact icon at top right */}
                <Box
                  sx={{
                    width: { xs: 32, sm: 36, md: 40 },
                    height: { xs: 32, sm: 36, md: 40 },
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/icons/service_offered_icons/quick_contact.svg"
                    alt="Quick Contact"
                    sx={{
                      width: { xs: "32px", sm: "36px", md: "40px" },
                      height: { xs: "32px", sm: "36px", md: "40px" },
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography
                  sx={{ fontSize: { xs: "13px", sm: "13.5px", md: "14px" }, fontWeight: 400, color: "#6C737F" }}
                >
                  • Name
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: "13px", sm: "13.5px", md: "14px" }, fontWeight: 400, color: "#6C737F" }}
                >
                  • Phone Number
                </Typography>
              </Box>
            </Box>
          }
          sx={{
            border: selectedMethod === "quick_contact" 
              ? "1px solid #12B76A" 
              : "1px solid #E5E7EB",
            borderRadius: "8px",
            p: { xs: 1.5, sm: 1.75, md: 2 },
            width: "100%",
            margin: 0,
            backgroundColor: selectedMethod === "quick_contact" 
              ? "#F0FDF4" 
              : "#E5ECF6",
            "&:hover": { 
              backgroundColor: selectedMethod === "quick_contact" 
                ? "#F0FDF4" 
                : "#F3F4F6",
              borderColor: selectedMethod === "quick_contact" 
                ? "#12B76A" 
                : "#D1D5DB",
            },
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "& .MuiFormControlLabel-label": {
              marginLeft: 0,
              width: "100%",
            },
          }}
        />

        {/* Contact Info + Job Questions Option */}
        <FormControlLabel
          value="contact_info_questions"
          control={<Box sx={{ display: "none" }} />}
          onClick={() => setSelectedMethod("contact_info_questions")}
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: { xs: 1.5, sm: 1.75, md: 2 },
                width: "100%",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "16px", sm: "17px", md: "18px" },
                    fontWeight: 600,
                    color: "#111927",
                    mb: 1,
                    wordBreak: "break-word",
                  }}
                >
                  Contact info + Job Questions
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", sm: "13.5px", md: "14px" },
                    fontWeight: 400,
                    color: "#6C737F",
                    mb: 0.5,
                    wordBreak: "break-word",
                    width: "100%",
                  }}
                >
                  Collect job details with a custom form
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", sm: "13.5px", md: "14px" },
                    fontWeight: 400,
                    color: "#6C737F",
                    wordBreak: "break-word",
                    width: "100%",
                  }}
                >
                  you can create questions for your client to answer
                </Typography>
              </Box>
              {/* Document icon at top right */}
              <Box
                sx={{
                  width: { xs: 32, sm: 36, md: 40 },
                  height: { xs: 32, sm: 36, md: 40 },
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src="/assets/icons/service_offered_icons/custom_form.svg"
                  alt="Custom Form"
                  sx={{
                    width: { xs: "32px", sm: "36px", md: "40px" },
                    height: { xs: "32px", sm: "36px", md: "40px" },
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          }
          sx={{
            border: selectedMethod === "contact_info_questions" 
              ? "1px solid #12B76A" 
              : "1px solid #E5E7EB",
            borderRadius: "8px",
            p: { xs: 1.5, sm: 1.75, md: 2 },
            width: "100%",
            margin: 0,
            backgroundColor: selectedMethod === "contact_info_questions" 
              ? "#EFF6FF" 
              : "#E5ECF6",
            "&:hover": { 
              backgroundColor: selectedMethod === "contact_info_questions" 
                ? "#EFF6FF" 
                : "#F3F4F6",
              borderColor: selectedMethod === "contact_info_questions" 
                ? "#12B76A" 
                : "#D1D5DB",
            },
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "& .MuiFormControlLabel-label": {
              marginLeft: 0,
              width: "100%",
            },
          }}
        />
      </RadioGroup>

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
          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={!selectedMethod}
          >
            {selectedMethod === "quick_contact" 
              ? (isEditMode ? "Update" : "Create")
              : "Next"}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

