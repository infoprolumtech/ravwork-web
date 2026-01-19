import { useEffect, type ReactNode } from 'react';
import { Box, IconButton } from '@mui/material';

import { useNavigate } from 'react-router-dom';

interface SignupLayoutProps {
  children: ReactNode;
  showBackIcon?: boolean;
  onBackClick?: () => void;
}

const SignupLayout = ({ children, showBackIcon = false, onBackClick }: SignupLayoutProps) => {
  const navigate = useNavigate();

  // Hide scrollbar on body/html when this layout is mounted (but keep scrolling enabled)
  useEffect(() => {
    // Add CSS to hide scrollbar while keeping scroll functionality
    const style = document.createElement('style');
    style.id = 'hide-scrollbar-signup';
    style.textContent = `
      body::-webkit-scrollbar,
      html::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
      body {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      html {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      const styleElement = document.getElementById('hide-scrollbar-signup');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

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
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowX: "hidden",
        // Hide scrollbar on root container
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Edge
        },
        msOverflowStyle: "none", // IE and Edge
      }}
    >
      {/* Header Section - Mobile Responsive */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          py: { xs: 1.5, sm: 2, md: 3 },
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
        }}
      >
        {/* Back Icon - Left side (only for small screens, if showBackIcon) */}
        {showBackIcon ? (
          <IconButton
            onClick={handleBackClick}
            sx={{
              color: "text.primary",
              p: { xs: 0.75, sm: 1 },
              minWidth: "auto",
              display: { xs: "flex", md: "none" }, // Show only on small screens
            }}
          >
            <img
              src="/assets/icons/back-arrow.svg"
              alt="back-arrow"
              style={{ width: "24px", height: "24px", marginRight: "px" }}
            />
          </IconButton>
        ) : (
          <Box sx={{ width: { xs: "40px", sm: "48px" } }} /> // Spacer to keep logo aligned when no back icon
        )}

        {/* Logo Section - Always on the right, same row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1 },
            marginLeft: "auto",
            marginRight: { xs: "0px", sm: "100px" },
          }}
        >
          <img
            src="/assets/icons/ravwork_logo_icon.svg"
            alt="Ravwork Icon"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "32px",
              maxHeight: "32px"
            }}
          />
          <Box
            component="img"
            src="/assets/icons/ravwork_logo_text.svg"
            alt="Ravwork"
            sx={{
              width: "auto",
              height: "auto",
              maxWidth: { xs: "100px", sm: "120px" },
              maxHeight: { xs: "24px", sm: "30px" }
            }}
          />
        </Box>
      </Box>

      {/* Main Content Section - Mobile Responsive */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: { xs: "flex-start", sm: "center" },
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 2, sm: 4 },
          pt: { xs: 0, sm: 0 },
          width: "100%",
          overflowY: "auto",
          // Hide scrollbar but keep scrolling functionality
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Edge
          },
          msOverflowStyle: "none", // IE and Edge
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "527px", md: "730px" },
            position: "relative",
            py: { xs: 1, sm: 2 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default SignupLayout;

