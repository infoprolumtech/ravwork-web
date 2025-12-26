import { createTheme } from "@mui/material/styles";
// @ts-ignore
import '@fontsource/inter';


const theme = createTheme({
  palette: {
    mode: "light", // switch to 'dark' for dark mode
    primary: {
      main: "#e3f0f8",
      50: "#9ED5F9",
      100: "#bad8ef",
      200: "#90c0e5",
      300: "#69a8d9",
      400: "#4e97d3",
      500: "#3786cc",
      600: "#307abf",
      700: "#2869ad",
      800: "#21599b",
      900: "#153c7c",
      A100: "#4693DD",
      A200: "#0C0227",
      A400: "#005DFF",
      light: "#FFFFFF",
      dark: "#000000",
    },
    secondary: {
      main: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D2D6DB",
      400: "#9DA4AE",
      500: "#6C737F",
      600: "#4D5761",
      700: "#384250",
      800: "#1F2A37",
      900: "#111927",
    },
    error: {
      main: "#FEF3F2",
      100: "#FEE4E2",
      200: "#FECDCA",
      300: "#FDA29B",
      400: "#F97066",
      500: "#F04438",
      600: "#D92D20",
      700: "#B42318",
      800: "#912018",
      900: "#7A271A",
    },
    warning: {
      main: "#FFFAEB",
      100: "#FEF0C7",
      200: "#FEDF89",
      300: "#FEC84B",
      400: "#FDB022",
      500: "#F79009",
      600: "#DC6803",
      700: "#B54708",
      800: "#93370D",
      900: "#7A2E0E",
    },
    success: {
      main: "#ECFDF3",
      100: "#D1FADF",
      200: "#A6F4C5",
      300: "#6CE9A6",
      400: "#32D583",
      500: "#12B76A",
      600: "#039855",
      700: "#027A48",
      800: "#05603A",
      900: "#054F31",
      A100: "#308D80",
    },
    background: {
      default: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: "4.5rem",
      lineHeight: "5.625rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "3.75rem",
      lineHeight: "4.625rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "18px",
      lineHeight: "32px",
      fontWeight: 600,
      color: "#111927",
    },
    h4: {
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: 600,
      letterSpacing: "0",
    },
    h5: {
      fontSize: "30px",
      lineHeight: "2.375rem",
      fontWeight: 500,
      color: "#111927",
    },
    h6: {
      fontSize: "16px",
      lineHeight: "2rem",
      fontWeight: 500,
      color: "#111927",
    },
    timer: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 500,
      color: "#093A8F",
    },
    body1: {
      fontSize: "1.25rem",
      lineHeight: "1.875rem",
    },
    body2: {
      fontSize: "16px",
      lineHeight: "24px",
    },
    subtitle1: {
      fontSize: "24px",
      fontWeight: 500,
      lineHeight: "32px",
      letterSpacing: "0",
      paragraphSpacing: "24px",
      color: "#6C737F",
      fontFamily: "Inter, sans-serif",
    },
    subtitle2: {
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: "1.25rem",
      color: "#153C7C",
    },
    title: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 500,
      color: "#6C737F",
    },
    caption: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "28px",
      color: "#111927",
    },
    button: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
    },
    headerTitle: {
      fontSize: "16px",
      lineHeight: "20px",
      fontWeight: 500,
      color: "#111927",
    },
    headerSubtitle: {
      fontSize: "16px",
      lineHeight: "20px",
      fontWeight: 400,
      color: "#6C737F",

    },
    menuSubtitle: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 500,
      color: "#384250",
    }
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "8px 16px",
        },
      },
      variants: [
        {
          props: { variant: "primary" },
          style: {
            backgroundColor: "#F3FAFE",
            color: "#031C5F",
            fontSize: "16px",
            fontWeight: 500,
            borderRadius: "100px",
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: "#D2D6DB",
            },
          },
        },
        {
          props: { variant: "primary2" },
          style: {
            backgroundColor: "#153C7C",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "100px",
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: "#D2D6DB",
              color: "#000000",
            },
          },
        },
        {
          props: { variant: "primarySquare" },
          style: {
            backgroundColor: "#0D4FAB",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "8px",
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: "#D2D6DB",
              color: "#000000",
            },
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            backgroundColor: "#111927",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 500,
            borderRadius: "100px",
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: "#D2D6DB",
              color: "#000000",
            },
            "&:disabled": {
              backgroundColor: "#D2D6DB",
              color: "#000000",
            },
          },
        },
        {
          props: { variant: "secondary2" },
          style: {
            backgroundColor: "#0D4FAB",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 500,
            borderRadius: "8px",
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: "#D2D6DB",
              color: "#000000",
            },
          },
        },
        {
          props: { variant: "danger" },
          style: {
            backgroundColor: "#B42318",
            fontSize: "16px",
            fontWeight: 500,
            color: "#ffffff",
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: "#ffffff",
              color: "#F04438",
              border: "1px solid #B42318",
            },
          },
        },
        {
          props: { variant: "danger2" },
          style: {
            backgroundColor: "#ffffff",
            fontSize: "16px",
            fontWeight: 500,
            color: "#B42318",
            padding: "12px 16px",
            border: "1px solid #B42318",
            "&:hover": {
              backgroundColor: "#B42318",
              color: "#ffffff",
            },
          },
        },
        {
          props: { variant: "success" },
          style: {
            backgroundColor: "#12B76A",
            color: "#ffffff",
            padding: "12px 16px",
            "&:hover": {
              backgroundColor: "#039855",
            },
          },
        },
      ],
    },
  },
});

export default theme;
