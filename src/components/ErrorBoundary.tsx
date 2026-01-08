import React from "react";
import { Box, Typography, Button, Stack, Container } from "@mui/material";
import { Refresh } from "@mui/icons-material";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service (e.g., Sentry, LogRocket)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // In production, you would send this to your error tracking service
    if (import.meta.env.VITE_PUBLIC_ENV === "PROD") {
      // Example: trackError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              textAlign: "center",
              p: 3,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: "#111927" }}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "#6C737F" }}>
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </Typography>
            {import.meta.env.VITE_PUBLIC_ENV === "DEV" && this.state.error && (
              <Box
                sx={{
                  mb: 4,
                  p: 2,
                  bgcolor: "#FEF3F2",
                  borderRadius: 2,
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <Typography variant="caption" sx={{ color: "#B42318", fontWeight: 600 }}>
                  Error Details (Dev Only):
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    mt: 1,
                    color: "#912018",
                    fontSize: "12px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.error.stack && `\n${this.state.error.stack}`}
                </Typography>
              </Box>
            )}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReset}
                sx={{
                  backgroundColor: "#111927",
                  "&:hover": {
                    backgroundColor: "#384250",
                  },
                }}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                sx={{
                  borderColor: "#D1D6DB",
                  color: "#384250",
                  "&:hover": {
                    borderColor: "#9CA3AF",
                    backgroundColor: "#F9FAFB",
                  },
                }}
              >
                Refresh Page
              </Button>
            </Stack>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 