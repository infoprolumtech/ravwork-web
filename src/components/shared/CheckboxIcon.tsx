import { Box, type BoxProps } from "@mui/material";
import Icon from "./Icon";

interface CheckboxIconProps extends Omit<BoxProps, "children"> {
  checked?: boolean;
  size?: number;
  checkIconSize?: number;
}

/**
 * Reusable checkbox icon component with checkmark overlay
 * Used for visual checkbox indicators in lists
 */
export default function CheckboxIcon({
  checked = false,
  size = 24,
  checkIconSize = 24,
  sx,
  ...props
}: CheckboxIconProps) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
     {checked && <Icon
        src="/assets/icons/check_icon_box.svg"
        alt="check-box"
        size={size}
      />}
    </Box>
  );
}

