import { useState } from "react";
import { Box, Button, Typography, InputAdornment, Stack, Grid, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField } from "../../../utils/helper";
import { ProgressIndicator } from "./ProgressIndicator";
import { step4Schema } from "../validationSchemas";
import type { Step4FormInputs } from "../types";

interface Step4Props {
  onNext: (data: Step4FormInputs) => void;
  onBack: () => void;
  onSkip: () => void;
}

export const Step4 = ({ onNext, onBack, onSkip }: Step4Props) => {
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");

  const form = useForm<Step4FormInputs>({
    resolver: yupResolver(step4Schema) as any,
    defaultValues: { businessName: "", businessDescription: "", instagram: "", facebook: "", linkedin: "" },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (data: Step4FormInputs) => {
    onNext(data);
  };

  return (
    <Box width="100%" maxWidth={730} sx={{ height: 846  }} component="form" onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Back Icon - Before Progress Bar */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            color: "text.primary",
            p: 1,
          }}
        >
          <img
            src="/assets/icons/back-arrow.svg"
            alt="back-arrow"
            style={{ width: 24, height: 24 }}
          />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ProgressIndicator currentStep={4} />
      </Box>
      
      {/* Icon above title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6.864px",
          }}
        >
          <img
            src="/assets/icons/profile_icon.svg"
            alt="icon"
            style={{ width: "36px", height: "36px" }}
          />
        </Box>
      </Box>
      
      {/* Title - Centered */}
      <Typography variant="h5" textAlign="center" mb={2} sx={{ fontSize: "34px", color: "#1C1C1C", fontWeight: 600, textAlign: "center" }}>
        Profile Set Up
      </Typography>

      {/* Profile Icon - Centered below title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        
      </Box>

      {/* Name or Business Name Field - Two Column Layout */}
      <Grid container spacing={3} sx={{ mb: 3, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" sx={{ fontSize: "16px", fontWeight: 500, color: "#1C1C1C" }}>
            Name or Business Name
          </Typography>
          <Typography variant="caption" sx={{ color: "#6C737F", display: "block" }}>
            Optional
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Enter Name or Business Name"
            margin="normal"
            {...form.register("businessName")}
            error={Boolean(form.formState.errors.businessName)}
            helperText={form.formState.errors.businessName?.message}
            sx={{ 
              mt: 0,
              "& .MuiInputBase-input": {
                fontSize: "16px",
                fontWeight: 400,
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Business Description Field - Two Column Layout */}
      <Grid container spacing={3} sx={{ mb: 3, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" sx={{ fontSize: "16px", fontWeight: 500, color: "#1C1C1C" }}>
            Business Description
          </Typography>
          <Typography variant="caption" sx={{ color: "#6C737F", display: "block" }}>
            Optional
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            variant="outlined"
            placeholder="About your Business"
            margin="normal"
            multiline
            rows={1}
            {...form.register("businessDescription")}
            error={Boolean(form.formState.errors.businessDescription)}
            helperText={form.formState.errors.businessDescription?.message}
            sx={{ 
              mt: 0,
              width: "449px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "18px",
              },
              "& .MuiInputBase-input": {
                fontSize: "16px",
                fontWeight: 400,
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Photo Section - Two Column Layout: Label on left, Image on right */}
      <Grid container spacing={3} sx={{ mb: 3, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" sx={{ mb: 1, fontSize: "16px", fontWeight: 500, color: "#1C1C1C" }}>
            Photo
          </Typography>
          <Typography variant="caption" sx={{ color: "#6C737F", display: "block" }}>
            Optional - Image must be .png & .jpg format
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              {profileImagePreview ? (
                <Box
                  component="img"
                  src={profileImagePreview}
                  alt="Profile"
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    objectFit: "cover",
                    border: "1px solid #D1D5DB",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    border: "1px solid #D1D5DB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              )}
              <input
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: "none" }}
                id="profile-image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="profile-image-upload">
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
                  <img src="/assets/icons/upload.svg" alt="upload" style={{ width: "20px", height: "20px", filter: "invert(1)" }} />
                </Button>
              </label>
              {profileImagePreview && (
                <Typography
                  sx={{
                    position: "absolute",
                    top: "calc(50% + 30px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: 400,
                    cursor: "pointer",
                    textShadow: "0px 1px 2px rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => {
                    setProfileImagePreview("");
                    form.setValue("profileImage", undefined);
                  }}
                >
                  Remove Profile Picture
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Your Public URL Section - Label only */}
      <Grid container spacing={3} sx={{ mb: -6, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" sx={{ fontSize: "16px", fontWeight: 500, color: "#1C1C1C" }}>
            Your Public URL
          </Typography>
          <Typography variant="caption" sx={{ color: "#6C737F", display: "block" }}>
            Optional
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}></Grid>
      </Grid>

      {/* Social Media URLs - No labels, just input fields aligned to right column */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}></Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Paste Url"
            margin="normal"
            {...form.register("instagram")}
            sx={{ 
              mt: 0,
              "& .MuiInputBase-input": {
                fontSize: "16px",
                fontWeight: 400,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <img src="/assets/icons/instagram.svg" alt="instagram" style={{ width: "24px", height: "24px" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 4 }}></Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Paste Url"
            margin="normal"
            {...form.register("facebook")}
            sx={{ 
              mt: 0,
              "& .MuiInputBase-input": {
                fontSize: "16px",
                fontWeight: 400,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <img src="/assets/icons/Facebook.svg" alt="facebook" style={{ width: "24px", height: "24px" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}></Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Paste Url"
            margin="normal"
            {...form.register("linkedin")}
            sx={{ 
              mt: 0,
              "& .MuiInputBase-input": {
                fontSize: "16px",
                fontWeight: 400,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <img src="/assets/icons/linkedin.svg" alt="linkedin" style={{ width: "24px", height: "24px" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onSkip}
          sx={{ 
            borderColor: "#D1D5DB", 
            color: "#1C1C1C", 
            backgroundColor: "#E5ECF6",
            borderRadius: "100px",
            textTransform: "none",
            fontSize: "18px",
            "&:hover": {
              backgroundColor: "#D1E7F0",
              borderColor: "#D1D5DB",
            }
          }}
        >
          Skip
        </Button>
        <Button 
          fullWidth 
          type="submit" 
          variant="secondary" 
          disabled={form.formState.isSubmitting}
          sx={{ textTransform: "none" }}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

