import { styled } from "@mui/material/styles";
import { colors } from "./constants";
import CryptoJS from "crypto-js";
import type { UserProfile } from "../rtk/endpoints/userApi";

import {
  TextField,
  Typography,
  type TypographyProps,
} from "@mui/material";


// Replace with your actual color palette object
export const ROWS_LIMIT = 100;
// ... existing code ...

// Calculate profile completion percentage
export const calculateProfileComplete = (profile: Partial<UserProfile> | null, hasServices: boolean = false): number => {
  if (!profile) return 0;

  // core fields: name (displayName), profile image (profilePhoto), and description (businessDescription)
  const coreFields = [
    profile.displayName,
    profile.profilePhoto,
    profile.businessDescription,
  ];

  // Check if all core fields are filled
  const coreFieldsFilled = coreFields.filter((field) => typeof field === 'string' && field.trim() !== "").length;

  // Calculate core fields percentage (max 50%)
  // 3 fields => each is 16.66%
  let percentage = 0;
  if (coreFieldsFilled === 3) {
    percentage = 50;
  } else {
    percentage = Math.round((coreFieldsFilled / 3) * 50);
  }

  // Creating a service contributes the other 50%
  if (hasServices) {
    percentage += 50;
  }

  return percentage;
};


// Replace with your actual color palette object



export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.primary.light, // light background
    color: colors["Base-Dark"], // text color
    borderRadius: "100px",
    fontSize: "16px",
    overflow: "hidden", // Ensure autofill styling stays within bounds
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
    borderRadius: "100px",
    // Light color text selection
    "&::selection": {
      backgroundColor: "#E3F0F8", // Light blue background
      color: colors["Base-Dark"], // Dark text
    },
    "&::-moz-selection": {
      backgroundColor: "#E3F0F8", // Light blue background
      color: colors["Base-Dark"], // Dark text
    },
    // Override browser autofill styling - only affects the input field itself
    "&:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.primary.light} inset !important`,
      WebkitTextFillColor: `${colors["Base-Dark"]} !important`,
      caretColor: colors["Base-Dark"],
      borderRadius: "100px",
      transition: "background-color 5000s ease-in-out 0s",
    },
    "&:-webkit-autofill:hover": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.primary.light} inset !important`,
      WebkitTextFillColor: `${colors["Base-Dark"]} !important`,
      borderRadius: "100px",
    },
    "&:-webkit-autofill:focus": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.primary.light} inset !important`,
      WebkitTextFillColor: `${colors["Base-Dark"]} !important`,
      borderRadius: "100px",
    },
    "&:-webkit-autofill:active": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.primary.light} inset !important`,
      WebkitTextFillColor: `${colors["Base-Dark"]} !important`,
      borderRadius: "100px",
    },
  },
  "& .MuiInputLabel-root": {
    // display: "none", // Hide labels in auth layout
    fontSize: "14px",
    fontWeight: 500,
    color: "#111927",
    marginBottom: "8px",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    // display: "none", // Hide labels in auth layout
    fontSize: "18px",
    fontWeight: 600,
    color: "#111927",
    marginBottom: "8px",
    backgroundColor: "#ffffff",
    paddingHorizontal: "12px",
  },
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    // display: "none", // Hide labels in auth layout
    fontSize: "14px",
    fontWeight: 500,
    color: "#111927",
    marginBottom: "8px",
  },
  '& .MuiInputBase-input::placeholder': {
    color: colors["Base-Dark"]
  },
  "& .MuiOutlinedInput-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #D1D5DB`,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #D1D5DB`,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: `1px solid #9CA3AF`,
    },
    "& legend": {
      maxWidth: 0,
      transition: "max-width 0.1s ease-in-out",
    },
    "&.Mui-focused legend": {
      width: "50%",
    },
  },

  "& .MuiSvgIcon-root": {
    fill: colors["Gray-400"],
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #DC2626",
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiInputBase-input": {
    color: `${colors["Base-Dark"]} !important`,
    WebkitTextFillColor: `${colors["Base-Dark"]} !important`,
    "&:-webkit-autofill": {
      WebkitTextFillColor: `${colors["Base-Dark"]} !important`,
      color: `${colors["Base-Dark"]} !important`,
    },
    "&:-webkit-autofill:hover": {
      WebkitTextFillColor: `${colors["Base-Dark"]} !important`,
      color: `${colors["Base-Dark"]} !important`,
    },
    "&:-webkit-autofill:focus": {
      WebkitTextFillColor: `${colors["Base-Dark"]} !important`,
      color: `${colors["Base-Dark"]} !important`,
    },
  },

  "& .MuiFormLabel-root.Mui-error": {
    color: "#FF1100",
    fontWeight: 500,
    fontSize: "14px",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "#DC2626 !important",
  },
  "& .MuiFormHelperText-root": {
    fontSize: 12,
    marginLeft: 0,
    backgroundColor: "transparent",
    border: "none",
  },
}));

// styled typography for page heading

export const StyledHeaderTypography = styled((props: TypographyProps) => (
  <Typography {...props} />
))(() => ({
  fontSize: "24px",
  fontWeight: "600",
  color: colors["Gray-900"],
}));

const IV_KEY = import.meta.env.VITE_IV_KEY || "";
const AES_KEY = import.meta.env.VITE_AES_KEY || "";

export function encryptAES(plaintext: string): string {
  if (!AES_KEY || !IV_KEY) {
    return "";
  }

  try {
    const key = CryptoJS.enc.Hex.parse(AES_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV_KEY);

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  } catch {
    return "";
  }
}

/**
 * Converts S3 URL to CloudFront URL
 * @param s3Url - The S3 URL (e.g., https://ravdev-media.s3.us-west-1.amazonaws.com/profile-photos/image.jpg)
 * @returns CloudFront URL or original URL if conversion fails
 */
export function getCloudFrontUrl(s3Url: string | null | undefined): string {
  if (!s3Url) return "";

  const cloudFrontDomain = import.meta.env.VITE_CLOUDFRONT_DOMAIN;

  try {
    // Check if it's already a CloudFront URL
    if (s3Url.includes("cloudfront.net")) {
      return s3Url;
    }

    // Check if it's an S3 URL
    if (s3Url.includes("s3.") || s3Url.includes("amazonaws.com")) {
      const url = new URL(s3Url);
      // Extract the path (everything after the domain)
      const path = url.pathname;
      // Remove leading slash if present
      const cleanPath = path.startsWith("/") ? path.substring(1) : path;
      // Construct CloudFront URL
      const cloudFrontUrl = `${cloudFrontDomain}/${cleanPath}`;
      return cloudFrontUrl;
    }

    // If it's not an S3 URL, return as is (might be a relative path or other URL)
    return s3Url;
  } catch {
    return s3Url;
  }
}

export function decryptAES(cipherHex: string | null | undefined): string {
  if (!cipherHex || !AES_KEY || !IV_KEY) {
    return "";
  }

  try {
    const key = CryptoJS.enc.Hex.parse(AES_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV_KEY);

    const cipherParams = CryptoJS.enc.Hex.parse(cipherHex);
    const encryptedBase64 = CryptoJS.enc.Base64.stringify(cipherParams);

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
}

// Helper function to get profile URL dynamically
export const getProfileUrl = (username: string) => {
  return `${window.location.origin}/${username}`;
};

/**
 * Standardizes error message extraction from API responses
 * @param error - The error object from RTK Query
 * @param defaultMessage - Fallback message
 * @returns string
 */
export const extractErrorMessage = (error: unknown, defaultMessage: string = "Something went wrong. Please try again."): string => {
  const err = error as {
    data?: {
      message?: string;
      error?: string;
    };
    error?: string;
    message?: string;
  };
  return (
    err?.data?.message ||
    err?.data?.error ||
    err?.error ||
    err?.message ||
    defaultMessage
  );
};


