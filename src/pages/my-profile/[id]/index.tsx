import { type JSX, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Typography,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ServiceProviderLayout from "../../../layouts/ServiceProviderLayout";
import { StyledTextField, getCloudFrontUrl } from "../../../utils/helper";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../../../rtk/endpoints/userApi";
import { useGeneratePresignedUrlMutation } from "../../../rtk/endpoints/authApi";
import { showAlert } from "../../../rtk/feature/alertSlice";
import { useAppDispatch } from "../../../rtk/store";
import { profileEditSchema, type ProfileEditFormInputs } from "../validationSchemas";
import Icon from "../../../components/shared/Icon";

// Common country codes with ISO codes
const COUNTRY_CODES = [
  { code: "+1", country: "USA/Canada", iso: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", iso: "GBR", flag: "🇬🇧" },
  { code: "+61", country: "Australia", iso: "AUS", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", iso: "NZL", flag: "🇳🇿" },
  { code: "+91", country: "India", iso: "IND", flag: "🇮🇳" },
  { code: "+86", country: "China", iso: "CHN", flag: "🇨🇳" },
  { code: "+81", country: "Japan", iso: "JPN", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", iso: "KOR", flag: "🇰🇷" },
  { code: "+33", country: "France", iso: "FRA", flag: "🇫🇷" },
  { code: "+49", country: "Germany", iso: "DEU", flag: "🇩🇪" },
  { code: "+39", country: "Italy", iso: "ITA", flag: "🇮🇹" },
  { code: "+34", country: "Spain", iso: "ESP", flag: "🇪🇸" },
  { code: "+7", country: "Russia", iso: "RUS", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", iso: "BRA", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", iso: "MEX", flag: "🇲🇽" },
  { code: "+971", country: "UAE", iso: "ARE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", iso: "SGP", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", iso: "MYS", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", iso: "THA", flag: "🇹🇭" },
  { code: "+62", country: "Indonesia", iso: "IDN", flag: "🇮🇩" },
];

const placeholderSx = {
  "& input::placeholder, & textarea::placeholder": {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
    opacity: 1,
  },
};

export default function EditProfile(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [generatePresignedUrl] = useGeneratePresignedUrlMutation();

  const form = useForm<ProfileEditFormInputs>({
    resolver: yupResolver(profileEditSchema) as any,
    mode: "onChange",
    defaultValues: {
      email: "",
      countryCode: "+1",
      phoneNumber: "",
      displayName: "",
      businessDescription: "",
      profilePhoto: undefined,
      instagramUrl: "",
      facebookUrl: "",
      linkedinUrl: "",
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        email: profile.email || "",
        countryCode: profile.countryCode || "+1",
        phoneNumber: profile.phoneNumber || "",
        displayName: profile.displayName || "",
        businessDescription: profile.businessDescription || "",
        profilePhoto: profile.profilePhoto || undefined,
        instagramUrl: profile.instagramUrl || "",
        facebookUrl: profile.facebookUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
      });
      if (profile.profilePhoto) {
        // Convert S3 URL to CloudFront URL for display
        setProfileImagePreview(getCloudFrontUrl(profile.profilePhoto));
      }
    }
  }, [profile, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

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
      const profilePhotoUrl = `${s3Url.origin}${s3Url.pathname}`;

      // Step 4: Store full S3 URL in form
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
    } catch (error: any) {
      dispatch(showAlert({ 
        message: error?.data?.message || "Failed to upload image. Please try again.", 
        severity: "error" 
      }));
      event.target.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    form.setValue("phoneNumber", value, { shouldValidate: true });
  };

  const handleSubmit = async (data: ProfileEditFormInputs) => {
    try {
      const updateData: any = {
        email: data.email,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        displayName: data.displayName,
        businessDescription: data.businessDescription || undefined,
        instagramUrl: data.instagramUrl || undefined,
        facebookUrl: data.facebookUrl || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
      };

      // Only include profilePhoto if it was updated
      if (data.profilePhoto) {
        updateData.profilePhoto = data.profilePhoto;
      }

      await updateProfile(updateData).unwrap();
      dispatch(showAlert({ 
        message: "Profile updated successfully", 
        severity: "success" 
      }));
      navigate("/my-profile");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update profile";
      dispatch(showAlert({ 
        message: errorMessage, 
        severity: "error" 
      }));
    }
  };

  if (isLoadingProfile) {
    return (
      <ServiceProviderLayout>
        <Box
          sx={{
            p: { xs: 2, md: 0 },
            maxWidth: 900,
            mx: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </ServiceProviderLayout>
    );
  }

  if (profileError) {
    return (
      <ServiceProviderLayout>
        <Box sx={{ p: { xs: 2, md: 0 }, maxWidth: 900, mx: "auto" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load profile. Please try again.
          </Alert>
          <Button onClick={() => navigate("/my-profile")}>Go Back</Button>
        </Box>
      </ServiceProviderLayout>
    );
  }

  return (
    <ServiceProviderLayout>
      <Box sx={{ p: { xs: 2, md: 0 }, maxWidth: 900, mx: "auto" }}>
        <Box
          component="form"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Header */}
          <Box mb={3}>
            <CardContent sx={{ py: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography fontWeight={600} fontSize={14} color="#111927">
                  Profile
                </Typography>
                <Button
                  type="submit"
                  variant="secondary"
                  sx={{ height: "28px", fontWeight: "500", fontSize: "9px" }}
                  disabled={isUpdating}
                >
                  {isUpdating ? <CircularProgress size={16} /> : "Save"}
                </Button>
              </Box>

              <Box display={"flex"} alignItems={"center"} gap={2}>
                <Avatar
                  src={
                    profileImagePreview 
                      ? profileImagePreview // This is either a base64 data URL (new upload) or CloudFront URL (existing photo)
                      : profile?.profilePhoto 
                        ? getCloudFrontUrl(profile.profilePhoto) 
                        : "./assets/images/avatar.png"
                  }
                  sx={{ width: 74, height: 74 }}
                  imgProps={{
                    onError: (e) => {
                      // Fallback to default avatar if image fails to load
                      const target = e.target as HTMLImageElement;
                      if (target.src !== "./assets/images/avatar.png" && !target.src.includes("avatar.png")) {
                        target.src = "./assets/images/avatar.png";
                      }
                    },
                  }}
                />
                <Box>
                  <input
                    accept="image/png,image/jpeg,image/jpg"
                    style={{ display: "none" }}
                    id="profile-photo-upload"
                    type="file"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <label htmlFor="profile-photo-upload">
                    <Button
                      variant="secondary"
                      component="span"
                      sx={{ 
                        height: "28px", 
                        fontWeight: "500", 
                        fontSize: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <CircularProgress 
                          size={14} 
                          sx={{ color: "#fff" }} 
                        />
                      ) : (
                        "Change Photo"
                      )}
                    </Button>
                  </label>
                </Box>
              </Box>
            </CardContent>
          </Box>

          {/* Email */}
          <Box
            mb={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box width={"281px"} mb={{ xs: 1, sm: 0 }}>
              <Typography fontSize={16} fontWeight={500} mb={0.5}>
                Email
              </Typography>
            </Box>
            <StyledTextField
              fullWidth
              size="small"
              placeholder="Enter your email"
              {...form.register("email", {
                onChange: () => form.trigger("email"),
              })}
              error={Boolean(form.formState.errors.email)}
              helperText={form.formState.errors.email?.message}
              sx={{
                width: { xs: "100%", sm: "493px" },
                ...placeholderSx,
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon src="/assets/icons/mail.svg" alt="email-icon" size={20} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Country Code and Phone Number */}
          <Box
            mb={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box width={"281px"} mb={{ xs: 1, sm: 0 }}>
              <Typography fontSize={16} fontWeight={500} mb={0.5}>
                Phone Number
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: { xs: 1, sm: 1.5 }, width: { xs: "100%", sm: "493px" } }}>
              <FormControl
                error={Boolean(form.formState.errors.countryCode)}
                sx={{
                  minWidth: { xs: 120, sm: 150 },
                  flexShrink: 0,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F9FAFB",
                    borderRadius: "100px",
                    height: "48px",
                    minHeight: "48px",
                  },
                }}
              >
                <Controller
                  name="countryCode"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("countryCode");
                      }}
                      displayEmpty
                      sx={{
                        borderRadius: "100px",
                        fontSize: { xs: "14px", sm: "16px" },
                        height: "48px",
                        "& .MuiSelect-select": {
                          py: 0,
                          px: { xs: 1.5, sm: 2 },
                          height: "48px",
                          display: "flex",
                          alignItems: "center",
                        },
                      }}
                      renderValue={(value) => {
                        const selected = COUNTRY_CODES.find((c) => c.code === value);
                        return selected ? `${selected.iso} (${selected.code})` : value || "+1";
                      }}
                    >
                      {COUNTRY_CODES.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.flag} {country.iso} ({country.code}) - {country.country}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <StyledTextField
                fullWidth
                size="small"
                placeholder="Phone Number"
                {...form.register("phoneNumber", {
                  onChange: handlePhoneNumberChange,
                })}
                error={Boolean(form.formState.errors.phoneNumber)}
                helperText={form.formState.errors.phoneNumber?.message}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "48px",
                    minHeight: "48px",
                  },
                  ...placeholderSx,
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon src="/assets/icons/phone.svg" alt="phone-icon" size={20} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Box>
          {form.formState.errors.countryCode && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#F97066",
                  fontSize: "12px",
                  width: { xs: "100%", sm: "493px" },
                  ml: { xs: 0, sm: "281px" },
                }}
              >
                {form.formState.errors.countryCode.message}
              </Typography>
            </Box>
          )}

          {/* Name / Business */}
          <Box
            mb={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box width={"281px"} mb={{ xs: 1, sm: 0 }}>
              <Typography fontSize={16} fontWeight={500} mb={0.5}>
                Name or Business Name
              </Typography>
            </Box>
            <StyledTextField
              fullWidth
              size="small"
              placeholder="Enter Your Company Name"
              {...form.register("displayName", {
                onChange: () => form.trigger("displayName"),
              })}
              error={Boolean(form.formState.errors.displayName)}
              helperText={form.formState.errors.displayName?.message}
              sx={{
                width: { xs: "100%", sm: "493px" },
                ...placeholderSx,
              }}
            />
          </Box>

          {/* About Business */}
          <Box
            mb={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box width={"281px"} mb={{ xs: 1, sm: 0 }}>
              <Typography fontSize={16} fontWeight={500} mb={0.5}>
                About the business
              </Typography>
            </Box>
            <StyledTextField
              multiline
              rows={4}
              size="small"
              placeholder="About the business"
              inputProps={{ maxLength: 250 }}
              {...form.register("businessDescription", {
                onChange: () => form.trigger("businessDescription"),
              })}
              error={Boolean(form.formState.errors.businessDescription)}
              helperText={form.formState.errors.businessDescription?.message}
              sx={{
                width: { xs: "100%", sm: "493px" },
                "& .MuiInputBase-root": {
                  borderRadius: "12px !important",
                  padding: 0,
                },
                "& .MuiInputBase-input": {
                  padding: "12px 16px",
                  borderRadius: "12px !important",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  msOverflowStyle: "none",
                },
                ...placeholderSx,
              }}
            />
          </Box>

          {/* Social URLs */}
          <Box
            mb={3}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box width={"281px"} mb={{ xs: 1, sm: 0 }}>
              <Typography fontSize={16} fontWeight={500} mb={0.5}>
                Your Public URL
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                width: { xs: "100%", sm: "493px" },
              }}
            >
              <StyledTextField
                fullWidth
                size="small"
                placeholder="Instagram URL"
                {...form.register("instagramUrl", {
                  onChange: () => form.trigger("instagramUrl"),
                })}
                error={Boolean(form.formState.errors.instagramUrl)}
                helperText={form.formState.errors.instagramUrl?.message}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "100px" },
                  ...placeholderSx,
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src="/assets/icons/instagram.svg" alt="" width={18} height={18} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <StyledTextField
                fullWidth
                size="small"
                placeholder="Facebook URL"
                {...form.register("facebookUrl", {
                  onChange: () => form.trigger("facebookUrl"),
                })}
                error={Boolean(form.formState.errors.facebookUrl)}
                helperText={form.formState.errors.facebookUrl?.message}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "100px" },
                  ...placeholderSx,
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src="/assets/icons/Facebook.svg" alt="" width={18} height={18} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <StyledTextField
                fullWidth
                size="small"
                placeholder="LinkedIn URL"
                {...form.register("linkedinUrl", {
                  onChange: () => form.trigger("linkedinUrl"),
                })}
                error={Boolean(form.formState.errors.linkedinUrl)}
                helperText={form.formState.errors.linkedinUrl?.message}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "100px" },
                  ...placeholderSx,
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src="/assets/icons/linkedin.svg" alt="" width={18} height={18} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ServiceProviderLayout>
  );
}
