import { styled, type Theme } from "@mui/material/styles";
import { colors } from "./constants";
import CryptoJS from "crypto-js";

import {
  TextField,
  Typography,
  type TypographyProps,
} from "@mui/material";


// Replace with your actual color palette object

export const ROWS_LIMIT = 100;

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.primary.light, // light background
    color: "#1C1C1C", // text color
    borderRadius: "100px",
    fontSize: "16px",
    overflow: "hidden", // Ensure autofill styling stays within bounds
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
    borderRadius: "100px",
    // Override browser autofill styling - only affects the input field itself
    "&:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.primary.light} inset !important`,
      WebkitTextFillColor: "#1C1C1C !important",
      caretColor: "#1C1C1C",
      borderRadius: "100px",
      transition: "background-color 5000s ease-in-out 0s",
    },
    "&:-webkit-autofill:hover": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.primary.light} inset !important`,
      WebkitTextFillColor: "#1C1C1C !important",
      borderRadius: "100px",
    },
    "&:-webkit-autofill:focus": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.primary.light} inset !important`,
      WebkitTextFillColor: "#1C1C1C !important",
      borderRadius: "100px",
    },
    "&:-webkit-autofill:active": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.primary.light} inset !important`,
      WebkitTextFillColor: "#1C1C1C !important",
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
    color: "#1C1C1C"
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
      width:"50%",
    },
  },

  "& .MuiSvgIcon-root": {
    fill: colors["Gray-400"],
  },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #F97066",
    color: "#FF1100"
  },

  "& .MuiFormLabel-root.Mui-error": {
    color: "#FF1100",
    fontWeight: 500,
    fontSize: "14px",
    "&.Mui-focused ~ .MuiOutlinedInput-root .MuiInputBase-input, &.Mui-error ~ .MuiOutlinedInput-root .MuiInputBase-input": {
      color: "#F97066",
    },
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "#FF1100",
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
))(({ theme: _theme }: { theme: Theme }) => ({
  fontSize: "24px",
  fontWeight: "600",
  color: colors["Gray-900"],
}));

const IV_KEY = import.meta.env.VITE_IV_KEY || "";
const AES_KEY = import.meta.env.VITE_AES_KEY || "";

export function encryptAES(plaintext: string): string {
  if (!AES_KEY || !IV_KEY) {
    console.error("AES encryption keys are not configured");
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
  } catch (error) {
    console.error("Encryption error:", error);
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
  
  const cloudFrontDomain = import.meta.env.VITE_CLOUDFRONT_DOMAIN || "https://dea8d2sq2agcg.cloudfront.net";
  
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
  } catch (error) {
    console.error("Error converting S3 URL to CloudFront URL:", error);
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
  } catch (error) {
    console.error("Decryption error:", error);
    return "";
  }
}


