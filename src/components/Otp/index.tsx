import React, { useRef } from "react";
import { Box, OutlinedInput, useTheme } from "@mui/material";

interface OTPInputProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  inputLength: number;
}
const OTPInput = ({ otp, setOtp, inputLength }: OTPInputProps) => {
  const theme = useTheme();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < inputLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current input
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous and clear it
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  return (
    <Box display="flex" gap={2} justifyContent="center">
      {otp.map((digit, index) => (
        <OutlinedInput
          key={index}
          inputRef={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e: any) => handleChange(e, index)}
          onKeyDown={(e: any) => handleKeyDown(e, index)}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: "center",
              padding: "6px",
              fontSize: "1.25rem",
              width: "40px",
              height: "40px",
            },
          }}
          sx={{
            borderRadius: 2,
            backgroundColor: digit
              ? theme.palette.grey[900]
              : theme.palette.grey[100],
            color: digit ? "#fff" : theme.palette.text.primary,
            "& fieldset": {
              borderColor: digit ? theme.palette.grey[900] : "transparent",
            },
          }}
        />
      ))}
    </Box>
  );
};

export default OTPInput;
