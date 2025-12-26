
import type { ReactNode } from 'react';
import { Box, Grid } from '@mui/material';
import { colors } from '../utils/constants';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0E6A37",
      }}
    >
      {/* Left Side - Green Background with Logo (50% width) */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 4,
          backgroundColor: "#0E6A37",
          minHeight: "100vh",
          position: "relative",
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* RavworkLite Logo */}
          <img 
            src="/assets/icons/ravworklite_logo.svg" 
            alt="ravworklite" 
            style={{ 
              width: "auto", 
              height: "auto",
              maxWidth: "300px",
              maxHeight: "200px"
            }} 
          />
        </Box>
      </Grid>

      {/* Right Side - White Background with Form (50% width) */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          backgroundColor: colors["Base-White"],
          minHeight: "100vh",
          px: { xs: 2, sm: 4 },
          overflowY: "auto",
          scrollbarWidth: "none",
          flex: 1,
        }}
      >
        {children}
      </Grid>
    </Grid >
  );
};

export default PublicLayout;
