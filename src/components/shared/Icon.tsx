import { Box, type BoxProps } from "@mui/material";

interface IconProps extends Omit<BoxProps, "component"> {
  src: string;
  alt: string;
  size?: number | string;
}

/**
 * Reusable Icon component using MUI Box with sx prop instead of inline styles
 * @param src - Image source path
 * @param alt - Alt text for accessibility
 * @param size - Icon size (number for px or string for other units, defaults to 20)
 */
export default function Icon({ src, alt, size = 20, sx, ...props }: IconProps) {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: size,
        height: size,
        display: "block",
        ...sx,
      }}
      {...props}
    />
  );
}


