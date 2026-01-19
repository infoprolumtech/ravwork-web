import { type SxProps, type Theme } from "@mui/material";
import { colors } from "../../utils/constants";

/**
 * Common style objects used across signup steps to avoid duplication
 */

export const pageTitleSx: SxProps<Theme> = {
  fontSize: { xs: "24px", sm: "28px", md: "34px" },
  color: colors["Base-Dark"],
  fontWeight: 600,
  textAlign: "center",
  lineHeight: { xs: 1.3, sm: 1.2 },
};

export const bottomButtonContainerSx: SxProps<Theme> = {
  width: "100%",
  position: { xs: "fixed", sm: "static" },
  bottom: { xs: 0, sm: "auto" },
  left: { xs: 0, sm: "auto" },
  p: { xs: 2, sm: 0 },
  backgroundColor: { xs: "#fff", sm: "transparent" },
  zIndex: { xs: 10, sm: "auto" },
};

export const backIconButtonSx: SxProps<Theme> = {
  display: { xs: "none", md: "block" },
  mb: 2,
};

export const iconButtonSx: SxProps<Theme> = {
  color: "text.primary",
  p: 1,
  minWidth: "auto",
  alignItems: "center",
  justifyContent: "center",
};

export const helperTextSx: SxProps<Theme> = {
  marginTop: { xs: "4px", sm: "6px" },
  marginLeft: 0,
  fontSize: { xs: "11px", sm: "12px" },
  lineHeight: { xs: 1.4, sm: 1.5 },
};

export const inputBaseSx: SxProps<Theme> = {
  height: "48px",
  minHeight: "48px",
  overflow: "hidden",
};

export const inputTextSx: SxProps<Theme> = {
  color: colors["Base-Dark"],
  height: "48px",
  borderRadius: "100px",
  "&::placeholder": {
    color: "#6C737F !important",
    opacity: 1,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#6C737F !important",
    opacity: 1,
  },
};

// Input field sx - minimal override since StyledTextField already has autofill styles
export const inputFieldSx = (
  _hasError: boolean,
  additionalSx?: SxProps<Theme>
): SxProps<Theme> => ({
  mb: 1.5, // Consistent spacing between fields
  "& .MuiInputBase-root": inputBaseSx,
  "& .MuiInputBase-input": inputTextSx,
  "& .MuiFormHelperText-root": helperTextSx,
  ...additionalSx,
});

