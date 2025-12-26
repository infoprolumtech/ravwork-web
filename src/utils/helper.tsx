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
    color: theme.palette.primary[900], // text color
    borderRadius: "100px",
    fontSize: "16px"
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
  },
  "& .MuiInputLabel-root": {
    display: "none", // Hide labels in auth layout
  },

  "& .MuiInputLabel-root.Mui-focused": {
    display: "none", // Hide labels in auth layout
  },
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    display: "none", // Hide labels in auth layout
  },
  '& .MuiInputBase-input::placeholder': {
    color: theme.palette.primary[400],
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
    // "&.Mui-focused legend": {
    //   width:"50%",

    // },
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
const AES_KEY = import.meta.env.VITE_AES_KEY || ""; // 16 bytes for IV

// export function encryptAES(plaintext: string): string {
//   try {
//     const key = CryptoJS.enc.Utf8.parse(AES_KEY);
//     const iv = CryptoJS.enc.Utf8.parse(IV_KEY);

//     const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });

//     return encrypted.ciphertext.toString(CryptoJS.enc.Hex); // return hex
//   } catch (error) {
//     console.error("Encryption error:", error);
//     return "";
//   }
// }

// export function decryptAES(cipherHex: string): string {
//   try {
//     const key = CryptoJS.enc.Utf8.parse(AES_KEY);
//     const iv = CryptoJS.enc.Utf8.parse(IV_KEY);

//     const cipherParams = CryptoJS.enc.Hex.parse(cipherHex);
//     const encryptedBase64 = CryptoJS.enc.Base64.stringify(cipherParams);

//     const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
//       iv: iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });

//     return decrypted.toString(CryptoJS.enc.Utf8);
//   } catch (error) {
//     console.error("Decryption error:", error);
//     return cipherHex;
//   }
// }



export function encryptAES(plaintext: string): string {
  try {
    const key = CryptoJS.enc.Hex.parse(AES_KEY); // Hex decoding
    const iv = CryptoJS.enc.Hex.parse(IV_KEY);   // Hex decoding

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Hex); // Return raw hex like backend
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
}

export function decryptAES(cipherHex: string|null|undefined): string {
  try {
    if (!cipherHex) return "";
    const key = CryptoJS.enc.Hex.parse(AES_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV_KEY);

    // Convert hex to Base64 for CryptoJS decryption
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


