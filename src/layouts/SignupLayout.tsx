import type { ReactNode } from 'react';
import { Box, Container, IconButton } from '@mui/material';
import { colors } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

interface SignupLayoutProps {
  children: ReactNode;
  showBackIcon?: boolean;
  onBackClick?: () => void;
}

const SignupLayout = ({ children, showBackIcon = false, onBackClick }: SignupLayoutProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors["Base-White"],
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo Section - Top Right */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          py: { xs: 2, md: 3 },
          px: { xs: 2, sm: 24 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <img 
            src="/assets/icons/ravwork_logo_icon.svg" 
            alt="Ravwork Icon" 
            style={{ 
              width: "auto", 
              height: "auto",
              maxWidth: "40px",
              maxHeight: "40px"
            }} 
          />
          <img 
            src="/assets/icons/ravwork_logo_text.svg" 
            alt="Ravwork" 
            style={{ 
              width: "auto", 
              height: "auto",
              maxWidth: "120px",
              maxHeight: "30px"
            }} 
          />
        </Box>
      </Box>

      {/* Main Content Section - Center Aligned */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
          pb: 4,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            position: "relative",
            maxWidth: {
              xs: "100%",
              sm: "730px",
            },
          }}
        >
          {/* Back Icon - Top Left */}
          {showBackIcon && (
            <IconButton
              onClick={handleBackClick}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "text.primary",
                p: 1,
                zIndex: 1,
              }}
            >
              <img
                src="/assets/icons/back-arrow.svg"
                alt="back-arrow"
                style={{ width: 24, height: 24 }}
              />
            </IconButton>
          )}
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default SignupLayout;

