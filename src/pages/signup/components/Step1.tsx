import { useState } from "react";
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
}

export const Step1 = ({ onNext }: Step1Props) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const PREFIX = "ravwork.link/";

  const form = useForm<Step1FormInputs>({
    resolver: yupResolver(step1Schema) as any,
    defaultValues: { username: PREFIX, email: "", countryCode: "+1", phoneNumber: "", password: "" },
  });

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
    <Box width={439} maxWidth={493} component="form" onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Progress Indicator - Centered */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ProgressIndicator currentStep={1} />
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
            src="/assets/icons/sigup_icon.svg"
            alt="email-icon"
            style={{ width: "36px", height: "36px" }}
          />
        </Box>
      </Box>
      
      <Typography variant="h5" textAlign="center" mb={3} sx={{ fontSize: "34px", color: "#1C1C1C", fontWeight: 600, textAlign: "center" }}>
        Let's help client book<br />you instantly.
      </Typography>

      <Box sx={{ position: "relative", mb: 1.5 }}>
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
            "& .MuiInputBase-input": {
              color: "#1C1C1C",
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
              left: "48px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#6C737F",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            ravwork.link/username
          </Typography>
        )}
        {form.watch("username") === PREFIX && (
          <Typography
            sx={{
              position: "absolute",
              left: "149px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#6C737F",
              fontSize: "16px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            username
          </Typography>
        )}
      </Box>

      <StyledTextField
        fullWidth
        variant="outlined"
        placeholder="Email"
        margin="none"
        {...form.register("email")}
        error={Boolean(form.formState.errors.email)}
        helperText={form.formState.errors.email?.message}
        sx={{
          mb: 1.5,
          "& .MuiInputBase-input": {
            color: "#1C1C1C",
            "&::placeholder": {
              color: "#1C1C1C",
              opacity: 1,
            },
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

      {/* Country Code and Phone Number in Same Row */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
        {/* Country Code Selector */}
        <FormControl
          error={Boolean(form.formState.errors.countryCode)}
          sx={{
            minWidth: 150,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#F9FAFB",
              borderRadius: "100px",
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
                  fontSize: "16px",
                  "& .MuiSelect-select": {
                    py: 1.5,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                  },
                  "& .MuiSelect-icon": {
                    color: "#12B76A",
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
            "& .MuiInputBase-input": {
              color: "#1C1C1C",
              "&::placeholder": {
                color: "#1C1C1C",
                opacity: 1,
              },
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
            fontSize: "12px",
            mt: -1.5,
            mb: 1.5,
            ml: 1.5,
            display: "block",
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
          mb: 1.5,
          "& .MuiInputBase-input": {
            color: "#1C1C1C",
            "&::placeholder": {
              color: "#1C1C1C",
              opacity: 1,
            },
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

      <Button fullWidth type="submit" variant="secondary" sx={{ mt: 2, mb: 1 }} disabled={form.formState.isSubmitting}>
        Next
      </Button>

      <Box sx={{ mt: 1, width: "100%" }}>
        <Box sx={{ backgroundColor: "#F9FAFB", padding: "12px 16px", borderRadius: "8px", textAlign: "center" }}>
          <Typography sx={{ color: "#6C737F", fontSize: "12px", fontWeight: 400, whiteSpace: "nowrap", display: "inline", fontFamily: "Inter, sans-serif" }}>
            By clicking on Create Account I agree to the{" "}
            <Typography component="span" sx={{ fontWeight: 600, color: "#111927", fontSize: "12px" }}>
              Terms of Services & Privacy Policy
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Typography 
        textAlign="center" 
        sx={{ 
          fontSize: "16px", 
          fontWeight: 400, 
          color: "#1C1C1C",
          fontFamily: "Inter, sans-serif",
          mt: 3
        }}
      >
        Already Have an Account?{" "}
        <Typography
          component="span"
          sx={{ fontSize: "16px", fontWeight: 600, color: "#1C1C1C", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          onClick={() => navigate("/login")}
        >
          Log In
        </Typography>
      </Typography>
    </Box>
  );
};

