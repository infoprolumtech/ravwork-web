import { Box, type BoxProps } from "@mui/material";
import Icon from "./Icon";

interface PageIconProps extends Omit<BoxProps, "children"> {
  iconSrc: string;
  iconAlt: string;
  size?: number | { xs?: number; sm?: number; md?: number };
}

/**
 * Reusable page icon component with consistent styling
 * Used above page titles in forms/auth pages
 */
export default function PageIcon({
  iconSrc,
  iconAlt,
  size = { xs: 32, sm: 46 },
  borderRadius = "50%",
  sx,
  ...props
}: PageIconProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: { xs: 2, sm: 3 },
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "5px", sm: "6.864px" },
        }}
      >
        <Icon
          src={iconSrc}
          alt={iconAlt}
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>
    </Box>
  );
}

