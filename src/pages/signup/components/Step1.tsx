import { useEffect } from "react";
import { Box, Button, Typography, MenuItem, Select, FormControl } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { StyledTextField } from "../../../utils/helper";
import { ProgressIndicator } from "./ProgressIndicator";
import { step1Schema } from "../validationSchemas";
import type { Step1FormInputs } from "../types";
import Icon from "../../../components/shared/Icon";
import PasswordField from "../../../components/shared/PasswordField";
import PageIcon from "../../../components/shared/PageIcon";
import {
  pageTitleSx,
  bottomButtonContainerSx,
  inputFieldSx,
  helperTextSx,
} from "./commonStyles";

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

interface Step1Props {
  onNext: (data: Step1FormInputs) => void;
  initialData?: Step1FormInputs | null;
  onBack?: () => void;
  isSignupCompleted?: boolean;
}

export const Step1 = ({ onNext, initialData, onBack, isSignupCompleted = false }: Step1Props) => {
  const navigate = useNavigate();
  const PREFIX = "ravwork.link/";

  const form = useForm<Step1FormInputs>({
    resolver: yupResolver(step1Schema) as any,
    mode: "onChange", // Validate on change (while typing)
    defaultValues: initialData || { username: PREFIX, email: "", countryCode: "+1", phoneNumber: "", password: "" },
  });

  // Update form values when initialData changes (when navigating back)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      // Clear form errors when navigating back (since signup was already successful)
      // This prevents showing "email already exists" error when user goes back
      form.clearErrors();
    }
  }, [initialData, form]);

  // Clear form errors when component mounts if signup was already successful
  useEffect(() => {
    // Check if signup was already successful (signupToken exists)
    const signupToken = localStorage.getItem("signupToken");
    if (signupToken && initialData) {
      // Clear all form errors since account was already created
      form.clearErrors();
    }
  }, [form, initialData]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If field is empty or user is typing, ensure prefix is added
    if (!value.startsWith(PREFIX)) {
      // If user is typing and field doesn't have prefix, add it
      if (value.length > 0) {
        form.setValue("username", PREFIX + value.replace(PREFIX, ""), { shouldValidate: true });
      } else {
        form.setValue("username", "", { shouldValidate: true });
      }
    } else {
      form.setValue("username", value, { shouldValidate: true });
    }
  };

  const handleUsernameFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    
    // If field is empty on focus, set prefix
    if (!value) {
      form.setValue("username", PREFIX);
      setTimeout(() => {
        input.setSelectionRange(PREFIX.length, PREFIX.length);
      }, 0);
    } else if (value.startsWith(PREFIX)) {
      // Ensure cursor is after prefix
      const cursorPosition = input.selectionStart || 0;
      if (cursorPosition < PREFIX.length) {
        setTimeout(() => {
          input.setSelectionRange(PREFIX.length, PREFIX.length);
        }, 0);
      }
    }
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const value = input.value;
    
    // Only prevent deletion if we have the prefix and cursor is at prefix boundary
    if (value.startsWith(PREFIX)) {
      if ((e.key === "Backspace" || e.key === "Delete") && cursorPosition <= PREFIX.length) {
        e.preventDefault();
        setTimeout(() => {
          input.setSelectionRange(PREFIX.length, PREFIX.length);
        }, 0);
      }
      
      if (e.key === "ArrowLeft" && cursorPosition <= PREFIX.length) {
        e.preventDefault();
        input.setSelectionRange(PREFIX.length, PREFIX.length);
      }
    }
  };

  const handleSubmit = (data: Step1FormInputs) => {
    // Always call onNext - parent component will handle whether to call API or not
    onNext(data);
  };

  return (
    <Box 
      width="100%" 
      maxWidth={{ xs: "100%", sm: "493px" }} 
      component="form" 
      onSubmit={form.handleSubmit(handleSubmit)}
      sx={{ mx: "auto" }}
    >
      {/* Progress Indicator - Centered */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
        <ProgressIndicator currentStep={1} />
      </Box>
      
      {/* Icon above title */}
      <PageIcon iconSrc="/assets/icons/sigup_icon.svg" iconAlt="email-icon" />
      
      <Typography variant="h5" textAlign="center" mb={{ xs: 2, sm: 3 }} sx={pageTitleSx}>
        Let's help client book<br />you instantly.
      </Typography>

      <Box sx={{ position: "relative", mb: 0 }}>
        <Box sx={{ position: "relative" }}>
          <Controller
            name="username"
            control={form.control}
            render={({ field }) => (
              <StyledTextField
                fullWidth
                variant="outlined"
                margin="none"
                value={form.watch("username")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleUsernameChange(e);
                  form.trigger("username"); // Trigger validation
                }}
                onKeyDown={handleUsernameKeyDown}
                onFocus={handleUsernameFocus}
                onBlur={() => {
                  field.onBlur();
                  form.trigger("username"); // Trigger validation on blur
                }}
                error={Boolean(form.formState.errors.username)}
                helperText={form.formState.errors.username?.message}
                sx={inputFieldSx(Boolean(form.formState.errors.username), {
                  "& .MuiInputBase-input": {
                    padding: "12px 16px",
                  },
                })}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Box component="span" sx={{ mr: 0, display: "flex", alignItems: "center" }}>
                        <Icon src="/assets/icons/at-sign.svg" alt="username-icon" size={20} />
                      </Box>
                    ),
                  },
                }}
              />
            )}
          />
          {!form.watch("username") && (
            <Typography
              sx={{
                position: "absolute",
                left: { xs: "40px", sm: "48px" },
                top: "24px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#6C737F",
                fontSize: { xs: "12px", sm: "16px" },
                fontFamily: "Inter, sans-serif",
                zIndex: 1,
                maxWidth: { xs: "calc(100% - 45px)", sm: "none" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                pr: { xs: 1, sm: 0 },
              }}
            >
              ravwork.link/username
            </Typography>
          )}
          {form.watch("username") === PREFIX && (
            <Typography
              sx={{
                position: "absolute",
                left: { xs: "calc(40px + 14ch)", sm: "calc(48px + 10ch)" },
                top: "24px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#6C737F",
                fontSize: { xs: "12px", sm: "16px" },
                fontFamily: "Inter, sans-serif",
                zIndex: 1,
                maxWidth: { xs: "calc(100% - 45px)", sm: "calc(100% - 250px)", md: "calc(100% - 280px)", lg: "none" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                pr: { xs: 1, sm: 0 },
              }}
            >
              username
            </Typography>
          )}
        </Box>
      </Box>

      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Email"
        margin="none"
        {...form.register("email")}
        error={Boolean(form.formState.errors.email)}
        helperText={form.formState.errors.email?.message}
        sx={inputFieldSx(Boolean(form.formState.errors.email))}
        slotProps={{
          input: {
            startAdornment: (
              <Box component="span" sx={{ mr: 0, display: "flex", alignItems: "center" }}>
                <Icon src="/assets/icons/mail.svg" alt="email-icon" size={20} />
              </Box>
            ),
          },
        }}
      />

      {/* Country Code and Phone Number in Same Row */}
      <Box sx={{ display: "flex", gap: { xs: 1, sm: 1.5 }, mb: 1.5, flexDirection: "row" }}>
        {/* Country Code Selector */}
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
              padding: 0,
              "& fieldset": {
                border: form.formState.errors.countryCode ? "1px solid #F97066" : "1px solid #D1D5DB",
              },
              "&:hover fieldset": {
                border: form.formState.errors.countryCode ? "1px solid #F97066" : "1px solid #D1D5DB",
              },
              "&.Mui-focused fieldset": {
                border: form.formState.errors.countryCode ? "1px solid #F97066" : "1px solid #9CA3AF",
              },
              "&.Mui-error fieldset": {
                border: "1px solid #F97066",
              },
            },
          }}
        >
          <Controller
            name="countryCode"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: "12px",
                      mt: 1,
                      boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      maxHeight: 300,
                      // Hide scrollbar but keep scrolling functionality
                      scrollbarWidth: "none", // Firefox
                      "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Safari, Edge
                      },
                      msOverflowStyle: "none", // IE and Edge
                      "& .MuiMenuItem-root": {
                        py: 1.5,
                        px: 2,
                        fontSize: "16px",
                        "&:hover": {
                          backgroundColor: "#F9FAFB",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#E5ECF6",
                          "&:hover": {
                            backgroundColor: "#D1E7F0",
                          },
                        },
                      },
                    },
                  },
                }}
                sx={{
                  borderRadius: "100px",
                  fontSize: { xs: "14px", sm: "16px" },
                  color: "#1C1C1C",
                  height: "48px",
                  "& .MuiSelect-select": {
                    py: 0,
                    px: { xs: 1.5, sm: 2 },
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    minHeight: "48px",
                  },
                  "& .MuiSelect-icon": {
                    color: "#6C737F",
                    right: { xs: 8, sm: 12 },
                  },
                }}
                renderValue={(value) => {
                  const selected = COUNTRY_CODES.find((c) => c.code === value);
                  return selected ? `${selected.iso} (${selected.code})` : value || "+1";
                }}
              >
                {COUNTRY_CODES.map((country) => (
                  <MenuItem 
                    key={country.code} 
                    value={country.code}
                    sx={{
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    {country.flag} {country.iso} ({country.code}) - {country.country}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {/* Phone Number Input */}
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Phone Number"
          margin="none"
          {...form.register("phoneNumber", {
            onChange: (e) => {
              // Only allow digits
              const value = e.target.value.replace(/[^0-9]/g, "");
              form.setValue("phoneNumber", value, { shouldValidate: true });
            },
          })}
          error={Boolean(form.formState.errors.phoneNumber)}
          helperText={form.formState.errors.phoneNumber?.message}
          sx={inputFieldSx(Boolean(form.formState.errors.phoneNumber), {
            mb: 0,
            "& .MuiInputBase-root": {
              height: "48px",
              minHeight: "48px",
            },
          })}
          slotProps={{
            input: {
              startAdornment: (
                <Box component="span" sx={{ mr: 0, display: "flex", alignItems: "center" }}>
                  <Icon src="/assets/icons/phone.svg" alt="phone-icon" size={20} />
                </Box>
              ),
            },
          }}
        />
      </Box>
      {form.formState.errors.countryCode && (
        <Typography
          variant="caption"
          sx={{
            color: "#F97066",
            mt: { xs: 0.5, sm: 0.75 },
            mb: 1.5,
            ml: 1.5,
            display: "block",
            ...helperTextSx,
          }}
        >
          {form.formState.errors.countryCode.message}
        </Typography>
      )}

      <PasswordField
        fullWidth
        variant="outlined"
        placeholder="Create Password"
        margin="none"
        lockIconSrc="/assets/icons/lock_signup.svg"
        {...form.register("password")}
        error={Boolean(form.formState.errors.password)}
        helperText={form.formState.errors.password?.message}
        sx={inputFieldSx(Boolean(form.formState.errors.password))}
      />

      <Box sx={bottomButtonContainerSx}>
        <Button 
          fullWidth 
          type="submit" 
          variant="secondary" 
          sx={{ 
            mt: { xs: 0, sm: 2 }, 
            mb: { xs: 1, sm: 1 },
            height: { xs: "44px", sm: "48px" },
          }} 
          disabled={form.formState.isSubmitting}
        >
          Next
        </Button>

        <Box sx={{ mt: { xs: 1, sm: 1 }, width: "100%" }}>
          <Box sx={{ backgroundColor: "#F9FAFB", padding: { xs: "10px 12px", sm: "12px 16px" }, borderRadius: "8px", textAlign: "center" }}>
            <Typography sx={{ color: "#6C737F", fontSize: { xs: "11px", sm: "12px" }, fontWeight: 400, whiteSpace: { xs: "normal", sm: "nowrap" }, display: "inline", fontFamily: "Inter, sans-serif" }}>
              By clicking on Create Account I agree to the{" "}
              <Typography component="span" sx={{ fontWeight: 600, color: "#111927", fontSize: { xs: "11px", sm: "12px" } }}>
                Terms of Services & Privacy Policy
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="body2" 
          textAlign="center" 
          sx={{ 
            fontSize: { xs: "14px", sm: "16px" }, 
            fontWeight: 400, 
            color: "#1C1C1C",
            fontFamily: "Inter, sans-serif",
            mt: { xs: 1.5, sm: 3 },
            mb: { xs: 1, sm: 0 },
          }}
        >
          Already Have an Account?{" "}
          <Typography
            component="span"
            sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 600, color: "#1C1C1C", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            onClick={() => navigate("/login")}
          >
            Log In
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

