import { useState, useEffect } from "react";
import { Box, Button, Typography, InputAdornment, Stack, Grid, IconButton, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledTextField, extractErrorMessage } from "../../utils/helper";
import { colors } from "../../utils/constants";
import { ProgressIndicator } from "./ProgressIndicator";
import { step4Schema } from "../../pages/signup/validationSchemas";
import type { Step4FormInputs } from "../../pages/signup/types";
import PageIcon from "../shared/PageIcon";
import Icon from "../shared/Icon";
import { pageTitleSx, bottomButtonContainerSx, backIconButtonSx, iconButtonSx } from "./commonStyles";
import { useGeneratePresignedUrlMutation } from "../../rtk/endpoints/authApi";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";

interface Step4Props {
  onNext: (data: Step4FormInputs) => void;
  onSkip: () => void;
  initialData?: Step4FormInputs | null;
  onBack?: () => void;
  isSubmitting?: boolean;
  isSkipping?: boolean;
}

export const Step4 = ({ onNext, onSkip, initialData, onBack, isSubmitting = false, isSkipping = false }: Step4Props) => {
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeAction, setActiveAction] = useState<"skip" | "next" | null>(null);
  const dispatch = useAppDispatch();
  const [generatePresignedUrl] = useGeneratePresignedUrlMutation();

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

  // Reset which button shows loader when network calls finish.
  useEffect(() => {
    if (!isSubmitting && !isSkipping) {
      setActiveAction(null);
    }
  }, [isSubmitting, isSkipping]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      dispatch(showAlert({
        message: "Invalid file type. Please upload a PNG or JPG image.",
        severity: "error"
      }));
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `user-${timestamp}-${randomString}.${fileExtension}`;

      // Step 1: Generate presigned URL
      const presignedResponse = await generatePresignedUrl({
        type: "PUT",
        files: [
          {
            folderName: "profile-photos",
            fileName: fileName,
          },
        ],
      }).unwrap();

      if (!presignedResponse?.[0]?.signedUrl) {
        throw new Error("Failed to generate presigned URL");
      }

      const signedUrl = presignedResponse[0].signedUrl;

      // Step 2: Upload file to S3 using presigned URL
      // Note: Do not set Content-Type header as it's already included in the presigned URL signature
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image to S3");
      }

      // Step 3: Extract the full S3 URL from the presigned URL (remove query parameters)
      // The signedUrl format: https://bucket.s3.region.amazonaws.com/path/file.jpg?X-Amz-Signature=...
      // We need the clean URL: https://bucket.s3.region.amazonaws.com/path/file.jpg
      // This URL will be sent to the backend API when user clicks Next
      const s3Url = new URL(signedUrl);
      const profilePhotoUrl = `${s3Url.origin}${s3Url.pathname}`;

      // Step 4: Store file (for preview) and full S3 URL (for API submission) in form
      form.setValue("profileImage", file);
      form.setValue("profilePhoto", profilePhotoUrl);

      // Update preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      dispatch(showAlert({
        message: "Profile picture uploaded successfully",
        severity: "success"
      }));
    } catch (error: unknown) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Failed to upload image. Please try again."),
        severity: "error"
      }));
      // Clear file input
      event.target.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (data: Step4FormInputs) => {
    setActiveAction("next");
    // Validate form before submitting (only when clicking Next)
    const isValid = await form.trigger();
    if (!isValid) {
      return; // Don't submit if validation fails
    }
    onNext(data);
  };

  const handleSkip = () => {
    setActiveAction("skip");
    onSkip();
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
        Profile Setup
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
          <Typography variant="body2" sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500, color: colors["Base-Dark"], mb: { xs: 0.5, sm: 0 } }}>
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
          <Typography variant="body2" sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500, color: colors["Base-Dark"], mb: { xs: 0.5, sm: 0 } }}>
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
            inputProps={{ maxLength: 250 }}
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
          <Typography variant="body2" sx={{ mb: { xs: 0.5, sm: 1 }, fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500, color: colors["Base-Dark"] }}>
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
                    opacity: isUploading ? 0.5 : 1,
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
                    backgroundColor: isUploading ? "#F3F4F6" : "transparent",
                  }}
                />
              )}
              <input
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: "none" }}
                id="profile-image-upload"
                type="file"
                onChange={handleImageUpload}
                disabled={isUploading}
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
                  <CircularProgress size={40} sx={{ color: colors["Base-Dark"] }} />
                </Box>
              ) : (
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
              )}
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
                    form.setValue("profilePhoto", undefined);
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
          <Typography variant="body2" sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 500, color: colors["Base-Dark"], mb: { xs: 0.5, sm: 0 } }}>
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
            onClick={handleSkip}
            disabled={isSkipping || isSubmitting}
            sx={{
              borderColor: "#D1D5DB",
              color: colors["Base-Dark"],
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
            {isSkipping && activeAction === "skip" ? (
              <CircularProgress size={24} sx={{ color: colors["Base-Dark"] }} />
            ) : (
              "Skip"
            )}
          </Button>
          <Button
            fullWidth
            type="submit"
            variant="secondary"
            disabled={isSubmitting || isSkipping}
            sx={{
              textTransform: "none",
              height: { xs: "44px", sm: "48px" },
            }}
          >
            {isSubmitting && activeAction === "next" ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Next"
            )}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

