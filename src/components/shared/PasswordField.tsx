import { useState } from "react";
import { InputAdornment, IconButton, type TextFieldProps } from "@mui/material";
import { StyledTextField } from "../../utils/helper";
import Icon from "./Icon";

interface PasswordFieldProps extends Omit<TextFieldProps, "type" | "slotProps"> {
  iconSize?: number;
  lockIconSrc?: string;
}

/**
 * Reusable password field component with show/hide toggle
 * Follows DRY principle and ensures consistent password field behavior
 */
export default function PasswordField({ iconSize = 20, lockIconSrc = "/assets/icons/lock.svg", ...textFieldProps }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <StyledTextField
      {...textFieldProps}
      type={showPassword ? "text" : "password"}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0 }}>
              <Icon src={lockIconSrc} alt="lock-icon" size={iconSize} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                <Icon
                  src={showPassword ? "/assets/icons/eye-slash.svg" : "/assets/icons/eye.svg"}
                  alt={showPassword ? "hide-password" : "show-password"}
                  size={iconSize}
                />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

