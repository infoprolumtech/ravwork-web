import { useState, useEffect } from "react";
import { Box, Button, Typography, InputAdornment, Stack, Grid, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField } from "../../../utils/helper";
import { ProgressIndicator } from "./ProgressIndicator";
import { step4Schema } from "../validationSchemas";
import type { Step4FormInputs } from "../types";
import PageIcon from "../../../components/shared/PageIcon";
import Icon from "../../../components/shared/Icon";
import { pageTitleSx, bottomButtonContainerSx, backIconButtonSx, iconButtonSx } from "./commonStyles";

interface Step4Props {
  onNext: (data: Step4FormInputs) => void;
  onSkip: () => void;
  initialData?: Step4FormInputs | null;
  onBack?: () => void;
}

export const Step4 = ({ onNext, onSkip, initialData, onBack }: Step4Props) => {
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");

  const form = useForm<Step4FormInputs>({
    resolver: yupResolver(step4Schema) as any,
    mode: "onChange", // Validate on change (while typing)
    defaultValues: initialData || { businessName: "", businessDescription: "", instagram: "", facebook: "", linkedin: "" },
  });

  // Update form values when initialData changes (when navigating back)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      // Restore profile image preview if it exists
      if (initialData.profileImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(initialData.profileImage);
      } else {
        setProfileImagePreview("");
      }
    }
  }, [initialData, form]);

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

  const handleSubmit = async (data: Step4FormInputs) => {
    // Validate form before submitting (only when clicking Next)
    const isValid = await form.trigger();
    if (!isValid) {
      return; // Don't submit if validation fails
    }
    onNext(data);
  };

  const handleBackClick = () => {
    // Use parent's navigation handler to stay within signup flow
    if (onBack) {
      onBack();
    }
  };

  return (
    <Box 
      width="100%" 
      maxWidth={{ xs: "100%", sm: "730px" }} 
      sx={{ 
        minHeight: { xs: "auto", sm: "846px" },
        pb: { xs: 10, sm: 0 },
        mx: "auto",
        position: "relative",
      }} 
      component="form" 
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      {/* Back Icon - Above progress bar for large screens */}
      <Box sx={backIconButtonSx}>
        <IconButton onClick={handleBackClick} sx={iconButtonSx}>
          <Icon src="/assets/icons/back-arrow.svg" alt="back-arrow" size={24} />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
        <ProgressIndicator currentStep={4} />
      </Box>
      
      {/* Icon above title */}
      <PageIcon iconSrc="/assets/icons/profile_icon.svg" iconAlt="icon" />
      
      {/* Title - Centered */}
      <Typography variant="h5" textAlign="center" mb={{ xs: 1.5, sm: 2 }} sx={pageTitleSx}>
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
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 }, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500, color: "#1C1C1C", mb: { xs: 0.5, sm: 0 } }}>
            Name or Business Name
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Enter Name or Business Name"
            margin="normal"
            {...form.register("businessName", {
              onChange: () => form.trigger("businessName"),
            })}
            error={Boolean(form.formState.errors.businessName)}
            helperText={form.formState.errors.businessName?.message}
            sx={{ 
              mt: 0,
              "& .MuiInputBase-input": {
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 400,
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Business Description Field - Two Column Layout */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 }, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500, color: "#1C1C1C", mb: { xs: 0.5, sm: 0 } }}>
            Business Description
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="About your Business"
            margin="normal"
            multiline
            rows={1}
            {...form.register("businessDescription", {
              onChange: () => form.trigger("businessDescription"),
            })}
            error={Boolean(form.formState.errors.businessDescription)}
            helperText={form.formState.errors.businessDescription?.message}
            sx={{ 
              mt: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: { xs: "12px", sm: "18px" },
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 400,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Photo Section - Two Column Layout: Label on left, Image on right */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 }, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" sx={{ mb: { xs: 0.5, sm: 1 }, fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500, color: "#1C1C1C" }}>
            Photo
          </Typography>
          <Typography variant="caption" sx={{ color: "#6C737F", display: "block", fontSize: { xs: "12px", sm: "14px" } }}>
            Image must be .png & .jpg format
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
                    width: { xs: 120, sm: 150 },
                    height: { xs: 120, sm: 150 },
                    borderRadius: 2,
                    objectFit: "cover",
                    border: "1px solid #D1D5DB",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: { xs: 120, sm: 150 },
                    height: { xs: 120, sm: 150 },
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
                  <Icon src="/assets/icons/upload.svg" alt="upload" size={20} sx={{ filter: "invert(1)" }} />
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
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: -4, sm: -6 }, alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500, color: "#1C1C1C", mb: { xs: 0.5, sm: 0 } }}>
            Your Public URL
          </Typography>
          <Typography variant="caption" sx={{ color: "#6C737F", display: "block", fontSize: { xs: "12px", sm: "14px" } }}>
            Optional
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}></Grid>
      </Grid>

      {/* Social Media URLs - No labels, just input fields aligned to right column */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 1.5, sm: 2 } }}>
        <Grid size={{ xs: 12, sm: 4 }}></Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Paste Url"
            margin="normal"
            {...form.register("instagram", {
              onChange: () => form.trigger("instagram"),
            })}
            error={Boolean(form.formState.errors.instagram)}
            helperText={form.formState.errors.instagram?.message}
            sx={{ 
              mt: 0,
              "& .MuiInputBase-input": {
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 400,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <Icon src="/assets/icons/instagram.svg" alt="instagram" size={24} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 1.5, sm: 2 } }}>
        <Grid size={{ xs: 12, sm: 4 }}></Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Paste Url"
            margin="normal"
            {...form.register("facebook", {
              onChange: () => form.trigger("facebook"),
            })}
            error={Boolean(form.formState.errors.facebook)}
            helperText={form.formState.errors.facebook?.message}
            sx={{ 
              mt: 0,
              "& .MuiInputBase-input": {
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 400,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <Icon src="/assets/icons/Facebook.svg" alt="facebook" size={24} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid size={{ xs: 12, sm: 4 }}></Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            placeholder="Paste Url"
            margin="normal"
            {...form.register("linkedin", {
              onChange: () => form.trigger("linkedin"),
            })}
            error={Boolean(form.formState.errors.linkedin)}
            helperText={form.formState.errors.linkedin?.message}
            sx={{ 
              mt: 0,
              "& .MuiInputBase-input": {
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 400,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <Icon src="/assets/icons/linkedin.svg" alt="linkedin" size={24} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>

      <Box sx={bottomButtonContainerSx}>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} sx={{ mt: { xs: 0, sm: 2 } }}>
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
              fontSize: { xs: "16px", sm: "18px" },
              height: { xs: "44px", sm: "48px" },
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
            sx={{ 
              textTransform: "none",
              height: { xs: "44px", sm: "48px" },
            }}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

