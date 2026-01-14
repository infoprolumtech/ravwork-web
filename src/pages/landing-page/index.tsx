import { type JSX } from "react";
import { Box, Typography, Container } from "@mui/material";

export default function LandingPage(): JSX.Element {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "#111927",
            fontSize: { xs: "32px", sm: "38px", md: "38px" },
            mb: 2,
          }}
        >
          Coming soon
        </Typography>
      </Box>
    </Container>
  );
}

