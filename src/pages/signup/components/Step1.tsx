import { useState, useEffect } from "react";
import { Box, Button, Typography, InputAdornment, IconButton, MenuItem, Select, FormControl } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { StyledTextField } from "../../../utils/helper";
import { ProgressIndicator } from "./ProgressIndicator";
import { step1Schema } from "../validationSchemas";
import type { Step1FormInputs } from "../types";

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
}

export const Step1 = ({ onNext, initialData }: Step1Props) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const PREFIX = "ravwork.link/";

  const form = useForm<Step1FormInputs>({
    resolver: yupResolver(step1Schema) as any,
    defaultValues: initialData || { username: PREFIX, email: "", countryCode: "+1", phoneNumber: "", password: "" },
  });

  // Update form values when initialData changes (when navigating back)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If field is empty or user is typing, ensure prefix is added
    if (!value.startsWith(PREFIX)) {
      // If user is typing and field doesn't have prefix, add it
      if (value.length > 0) {
        form.setValue("username", PREFIX + value.replace(PREFIX, ""));
      } else {
        form.setValue("username", "");
      }
    } else {
      form.setValue("username", value);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: { xs: 32, sm: 36 },
            height: { xs: 32, sm: 36 },
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: "5px", sm: "6.864px" },
          }}
        >
          <img
            src="/assets/icons/sigup_icon.svg"
            alt="email-icon"
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>
      
      <Typography 
        variant="h5" 
        textAlign="center" 
        mb={{ xs: 2, sm: 3 }} 
        sx={{ 
          fontSize: { xs: "24px", sm: "28px", md: "34px" }, 
          color: "#1C1C1C", 
          fontWeight: 600, 
          textAlign: "center",
          lineHeight: { xs: 1.3, sm: 1.2 },
        }}
      >
        Let's help client book<br />you instantly.
      </Typography>

      <Box sx={{ position: "relative", mb: form.formState.errors.username ? 0 : 1.5 }}>
        <Box sx={{ position: "relative" }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            margin="none"
            value={form.watch("username")}
            onChange={handleUsernameChange}
            onKeyDown={handleUsernameKeyDown}
            onFocus={handleUsernameFocus}
            error={Boolean(form.formState.errors.username)}
            helperText={form.formState.errors.username?.message}
            sx={{
              "& .MuiInputBase-root": {
                height: "48px",
                minHeight: "48px",
                overflow: "hidden", // Ensure autofill styling stays within input box
              },
              "& .MuiInputBase-input": {
                color: "#1C1C1C",
                height: "48px",
                padding: "12px 16px",
                borderRadius: "100px",
                // Override browser autofill styling - only affects the input field box
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
                  WebkitTextFillColor: "#1C1C1C !important",
                  caretColor: "#1C1C1C",
                  borderRadius: "100px",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "&:-webkit-autofill:hover": {
                  WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
                  WebkitTextFillColor: "#1C1C1C !important",
                  borderRadius: "100px",
                },
                "&:-webkit-autofill:focus": {
                  WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
                  WebkitTextFillColor: "#1C1C1C !important",
                  borderRadius: "100px",
                },
                "&:-webkit-autofill:active": {
                  WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
                  WebkitTextFillColor: "#1C1C1C !important",
                  borderRadius: "100px",
                },
              },
              "& .MuiFormHelperText-root": {
                marginTop: { xs: "4px", sm: "6px" },
                marginLeft: 0,
                fontSize: { xs: "11px", sm: "12px" },
                lineHeight: { xs: 1.4, sm: 1.5 },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <img src="/assets/icons/at-sign.svg" alt="username-icon" style={{ width: "20px", height: "20px" }} />
                  </InputAdornment>
                ),
              },
            }}
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
                left: { 
                  xs: "calc(40px + 14ch)", 
                  sm: "calc(48px + 10ch)",
                  md: "calc(48px + 10ch)",
                  lg: "calc(48px + 10ch)"
                },
                top: "24px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#6C737F",
                fontSize: { xs: "12px", sm: "16px", md: "16px", lg: "16px" },
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
      {form.formState.errors.username && (
        <Box sx={{ mb: 1.5, mt: 0.5 }} />
      )}

      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Email"
        margin="none"
        {...form.register("email")}
        error={Boolean(form.formState.errors.email)}
        helperText={form.formState.errors.email?.message}
        sx={{
          mb: form.formState.errors.email ? 0 : 1.5,
          "& .MuiInputBase-root": {
            height: "48px",
            minHeight: "48px",
            overflow: "hidden", // Ensure autofill styling stays within input box
          },
          "& .MuiInputBase-input": {
            color: "#1C1C1C",
            height: "48px",
            borderRadius: "100px",
            "&::placeholder": {
              color: "#1C1C1C",
              opacity: 1,
            },
            // Override browser autofill styling - only affects the input field box
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
              WebkitTextFillColor: "#1C1C1C !important",
              caretColor: "#1C1C1C",
              borderRadius: "100px",
              transition: "background-color 5000s ease-in-out 0s",
            },
            "&:-webkit-autofill:hover": {
              WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
              WebkitTextFillColor: "#1C1C1C !important",
              borderRadius: "100px",
            },
            "&:-webkit-autofill:focus": {
              WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
              WebkitTextFillColor: "#1C1C1C !important",
              borderRadius: "100px",
            },
            "&:-webkit-autofill:active": {
              WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
              WebkitTextFillColor: "#1C1C1C !important",
              borderRadius: "100px",
            },
          },
          "& .MuiFormHelperText-root": {
            marginTop: { xs: "4px", sm: "6px" },
            marginLeft: 0,
            fontSize: { xs: "11px", sm: "12px" },
            lineHeight: { xs: 1.4, sm: 1.5 },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                <img src="/assets/icons/mail.svg" alt="email-icon" style={{ width: "20px", height: "20px" }} />
              </InputAdornment>
            ),
          },
        }}
      />
      {form.formState.errors.email && (
        <Box sx={{ mb: 1.5, mt: 0.5 }} />
      )}

      {/* Country Code and Phone Number in Same Row */}
      <Box sx={{ display: "flex", gap: { xs: 1, sm: 1.5 }, mb: (form.formState.errors.countryCode || form.formState.errors.phoneNumber) ? 0 : 1.5, flexDirection: "row" }}>
        {/* Country Code Selector */}
        <FormControl
          error={Boolean(form.formState.errors.countryCode)}
          sx={{
            minWidth: { xs: 120, sm: 150 },
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#F9FAFB",
              borderRadius: "100px",
              height: { xs: "44px", sm: "48px" },
              "& fieldset": {
                border: "1px solid #D1D5DB",
              },
              "&:hover fieldset": {
                border: "1px solid #D1D5DB",
              },
              "&.Mui-focused fieldset": {
                border: "1px solid #9CA3AF",
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
                sx={{
                  borderRadius: "100px",
                  fontSize: { xs: "14px", sm: "16px" },
                  "& .MuiSelect-select": {
                    py: { xs: 1.25, sm: 1.5 },
                    px: { xs: 1.5, sm: 2 },
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiSelect-icon": {
                    color: "#6C737F",
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
              form.setValue("phoneNumber", value);
            },
          })}
          error={Boolean(form.formState.errors.phoneNumber)}
          helperText={form.formState.errors.phoneNumber?.message}
          sx={{
            "& .MuiInputBase-root": {
              height: "48px",
              minHeight: "48px",
            },
            "& .MuiInputBase-input": {
              color: "#1C1C1C",
              height: "48px",
              "&::placeholder": {
                color: "#1C1C1C",
                opacity: 1,
              },
            },
            "& .MuiFormHelperText-root": {
              marginTop: { xs: "4px", sm: "6px" },
              marginLeft: 0,
              fontSize: { xs: "11px", sm: "12px" },
              lineHeight: { xs: 1.4, sm: 1.5 },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <img src="/assets/icons/phone.svg" alt="phone-icon" style={{ width: "20px", height: "20px" }} />
                </InputAdornment>
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
            fontSize: { xs: "11px", sm: "12px" },
            mt: { xs: 0.5, sm: 0.75 },
            mb: 1.5,
            ml: 1.5,
            display: "block",
            lineHeight: { xs: 1.4, sm: 1.5 },
          }}
        >
          {form.formState.errors.countryCode.message}
        </Typography>
      )}

      <StyledTextField
        fullWidth
        variant="outlined"
        type={showPassword ? "text" : "password"}
        placeholder="Create Password"
        margin="none"
        {...form.register("password")}
        error={Boolean(form.formState.errors.password)}
        helperText={form.formState.errors.password?.message}
        sx={{
          mb: form.formState.errors.password ? 0 : 1.5,
          "& .MuiInputBase-root": {
            height: "48px",
            minHeight: "48px",
            overflow: "hidden", // Ensure autofill styling stays within input box
          },
          "& .MuiInputBase-input": {
            color: "#1C1C1C",
            height: "48px",
            borderRadius: "100px",
            "&::placeholder": {
              color: "#1C1C1C",
              opacity: 1,
            },
            // Override browser autofill styling - only affects the input field box
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
              WebkitTextFillColor: "#1C1C1C !important",
              caretColor: "#1C1C1C",
              borderRadius: "100px",
              transition: "background-color 5000s ease-in-out 0s",
            },
            "&:-webkit-autofill:hover": {
              WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
              WebkitTextFillColor: "#1C1C1C !important",
              borderRadius: "100px",
            },
            "&:-webkit-autofill:focus": {
              WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
              WebkitTextFillColor: "#1C1C1C !important",
              borderRadius: "100px",
            },
            "&:-webkit-autofill:active": {
              WebkitBoxShadow: "0 0 0 1000px #F9FAFB inset !important",
              WebkitTextFillColor: "#1C1C1C !important",
              borderRadius: "100px",
            },
          },
          "& .MuiFormHelperText-root": {
            marginTop: { xs: "4px", sm: "6px" },
            marginLeft: 0,
            fontSize: { xs: "11px", sm: "12px" },
            lineHeight: { xs: 1.4, sm: 1.5 },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                <img src="/assets/icons/lock_signup.svg" alt="lock-icon" style={{ width: "20px", height: "20px" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  <img
                    src={showPassword ? "/assets/icons/eye-slash.svg" : "/assets/icons/eye.svg"}
                    alt={showPassword ? "hide-password" : "show-password"}
                    style={{ width: "20px", height: "20px" }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      {form.formState.errors.password && (
        <Box sx={{ mb: 1.5, mt: 0.5 }} />
      )}

      <Box
        sx={{
          width: "100%",
          position: { xs: "fixed", sm: "static" },
          bottom: { xs: 0, sm: "auto" },
          left: { xs: 0, sm: "auto" },
          p: { xs: 2, sm: 0 },
          backgroundColor: { xs: "#fff", sm: "transparent" },
          zIndex: { xs: 10, sm: "auto" },
          
        }}
      >
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

