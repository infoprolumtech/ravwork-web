import { InputAdornment, type TextFieldProps } from "@mui/material";
import { StyledTextField } from "../../utils/helper";
import Icon from "./Icon";

interface FormFieldWithIconProps extends Omit<TextFieldProps, "slotProps"> {
  iconSrc: string;
  iconAlt: string;
  iconSize?: number;
}

/**
 * Reusable form field component with icon
 * Follows DRY principle and ensures consistent styling
 */
export default function FormFieldWithIcon({
  iconSrc,
  iconAlt,
  iconSize = 20,
  ...textFieldProps
}: FormFieldWithIconProps) {
  return (
    <StyledTextField
      {...textFieldProps}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0 }}>
              <Icon src={iconSrc} alt={iconAlt} size={iconSize} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

