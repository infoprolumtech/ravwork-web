// src/mui.d.ts or src/theme/mui.d.ts
import "@mui/material/Button";

import { PaletteColor, PaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    550?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    A100?: string;
    A200?: string;
    A400?: string;
    light?: string;
  }

  interface PaletteColorOptions {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    550?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    A100?: string;
    A200?: string;
    A400?: string;
    light?: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    primary2: true;
    primary: true;
    primarySquare: true;
    secondary: true;
    secondary2: true;
    danger: true;
    danger2: true;
    success: true;
  }
}
declare module "@mui/material/styles" {
  interface TypographyVariants {
    subtitle3: React.CSSProperties;
    caption: React.CSSProperties;
    heading: React.CSSProperties;
    title: React.CSSProperties;
    timer: React.CSSProperties;
    headerTitle: React.CSSProperties;
    headerSubtitle: React.CSSProperties;
    menuSubtitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    subtitle3?: React.CSSProperties;
    caption?: React.CSSProperties;
    heading?: React.CSSProperties;
    title?: React.CSSProperties;
    timer?: React.CSSProperties;
    headerTitle?: React.CSSProperties;
    headerSubtitle?: React.CSSProperties;
    menuSubtitle?: React.CSSProperties;
  }
}
import "@mui/material/Typography";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    title: true;
    subtitle3: true;
    subtitle4: true;
    heading: true;
    timer: true;
    headerTitle: true;
    headerSubtitle: true;
    menuSubtitle: true;
  }
}