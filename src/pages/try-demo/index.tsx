import { type JSX } from "react";
import { Box, Typography } from "@mui/material";
import Header from "../landing-page/components/Header";

export default function TryDemo(): JSX.Element {

  return (
    <Box
      sx={{
        background: "#000000",
        minHeight: "100vh",
        scrollBehavior: "smooth",
        overflowX: "hidden",
      }}
    >
      <Header onTermsClick={() => {}} />
      
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
          color: 'white',
          px: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Try Demo
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Experience RavworkLink before signing up.
        </Typography>
      </Box>
    </Box>
  );
}
