import { type JSX, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IosShareIcon from "@mui/icons-material/IosShare";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { motion } from "framer-motion";
import GlowingCard from "./shared/GlowingCard";
import StepHeader from "./shared/StepHeader";
import GoBackButton from "./shared/GoBackButton";
import HandHint from "./shared/HandHint";

interface ClientPreviewProps {
  onBack: () => void;
  onNext: () => void;
}

export default function ClientPreview({
  onBack,
  onNext,
}: ClientPreviewProps): JSX.Element {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      sx={{
        width: "100%",
        maxWidth: "900px",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <StepHeader
        title="What Your Clients See"
        subtitle="A Clean, professional booking page. No Dms, no confusion."
      />

      <GlowingCard overflow="hidden" paperSx={{ gap: 3 }}>
        {/* Header: Logo and Search */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              backgroundColor: "#F3F4F6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/assets/icons/ravwork_logo_icon.svg"
              alt="Logo"
              sx={{ width: "60px", height: "60px" }}
            />
          </Box>
          <TextField
            placeholder="Search"
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "140px", sm: "250px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#F9FAFB",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>

        {/* Blue Banner Section */}

        <Box
          sx={{
            backgroundColor: "#DBEAFE",
            borderRadius: "24px",
            p: { xs: 3, sm: 4 },
          }}
        >
          {/* Top Row (Avatar + Share) */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: { xs: 70, sm: 90 },
                height: { xs: 70, sm: 90 },
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#BFDBFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "4px solid #FFFFFF",
              }}
            >
              {/* <DirectionsCarIcon sx={{ fontSize: 36, color: "#1E3A8A" }} /> */}
              <Box
                component="img"
                src="/assets/icons/Avatar.svg"
                sx={{
                  width: { xs: 70, sm: 80 },
                  height: "auto",
                }}
              />
            </Box>

            {/* Share Button */}
            <Button
              variant="contained"
              startIcon={<IosShareIcon fontSize="small" />}
              sx={{
                backgroundColor: "#111827",
                color: "#FFFFFF",
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 600,
                px: 2,
                py: 0.5,
                "&:hover": { backgroundColor: "#111827" },
              }}
            >
              Share
            </Button>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontWeight: 700,
              color: "#111827",
              fontSize: { xs: "20px", sm: "24px" },
              mb: 1,
              textAlign: { xs: "left", sm: "left" },
            }}
          >
            Minas Cleaning Services
          </Typography>

          {/* Small Divider */}
          <Box
            sx={{
              width: "40px",
              height: "4px",
              background: "#E5E7EB",
              borderRadius: "4px",
              mb: 2,
            }}
          />

          {/* Social Icons */}
          {/* <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
            }}
          >
            <FacebookIcon sx={{ color: "#3B82F6" }} />
            <LinkedInIcon sx={{ color: "#2563EB" }} />
            <InstagramIcon sx={{ color: "#E1306C" }} />
          </Box> */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              component="img"
              src="/assets/icons/Facebook-icon.svg"
              sx={{ width: 24 }}
            />
            <Box
              component="img"
              src="/assets/icons/linkedin.svg"
              sx={{ width: 28 }}
            />
            <Box
              component="img"
              src="/assets/icons/instagram.svg"
              sx={{ width: 24 }}
            />
          </Box>

          {/* Description */}
          <Typography
            sx={{
              color: "#4B5563",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Professional cleaning services offering everything from routine
            maintenance to intensive deep cleans to keep your home or office
            spotless.
          </Typography>
        </Box>

        {/* Services Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          {/* Exterior Wash Card */}
          <Box
            sx={{
              backgroundColor: "#F9FAFB",
              borderRadius: "16px",
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#D1FAE5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#059669",
                mb: 2,
              }}
            >
              <ElectricBoltIcon sx={{ fontSize: "16px" }} />
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
              Basic Clean
            </Typography>
            <Typography
              sx={{ color: "#6B7280", fontSize: "13px", mb: 3, flex: 1 }}
            >
              A routine maintenance cleaning focusing on essential surfaces,
              floors, and high-traffic areas to keep your home fresh and tidy.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontWeight: 700, fontSize: "24px", color: "#111827" }}
              >
                $55
              </Typography>
              <Box sx={{ position: "relative" }}>
                <HandHint
                  show={showHint}
                  direction="down"
                  sx={{ right: "-10px", top: "10px" }}
                />
                <Button
                  onClick={onNext}
                  variant="contained"
                  sx={{
                    backgroundColor: "#000000",
                    color: "#FFFFFF",
                    borderRadius: "20px",
                    textTransform: "none",
                    px: 3,
                    boxShadow: showHint
                      ? "0 0 0 4px rgba(59, 130, 246, 0.4)"
                      : "none",
                    transition: "background-color 0.3s ease",
                    animation: showHint ? "pulseBtn 2s infinite" : "none",
                    "@keyframes pulseBtn": {
                      "0%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)" },
                      "70%": { boxShadow: "0 0 0 10px rgba(59, 130, 246, 0)" },
                      "100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
                    },
                    "&:hover": { backgroundColor: "#1F2937" },
                  }}
                >
                  Book Now
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Interior Clean Card */}
          <Box
            sx={{
              backgroundColor: "#F9FAFB",
              borderRadius: "16px",
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#DBEAFE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563EB",
                mb: 2,
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: "16px" }} />
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
              Deep Clean
            </Typography>
            <Typography
              sx={{ color: "#6B7280", fontSize: "13px", mb: 3, flex: 1 }}
            >
              An intensive top-to-bottom scrub targeting hidden dirt, grime, and
              hard-to-reach areas to restore your home to its cleanest possible
              state.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontWeight: 700, fontSize: "24px", color: "#111827" }}
              >
                $110
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#000000",
                  color: "#FFFFFF",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 3,
                  pointerEvents: "none",
                  cursor: "default",
                  "&:hover": { backgroundColor: "#000000" },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Question Card */}
        <Box
          sx={{
            backgroundColor: "#F9FAFB",
            borderRadius: "16px",
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#FEF08A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#A16207",
                mb: 2,
              }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: "16px" }} />
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#111827", mb: 0.5 }}>
              Have a question?
            </Typography>
            <Typography sx={{ color: "#6B7280", fontSize: "13px" }}>
              Provide your contact info.
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000000",
              color: "#FFFFFF",
              borderRadius: "20px",
              textTransform: "none",
              px: 4,
              pointerEvents: "none",
              cursor: "default",
              "&:hover": { backgroundColor: "#000000" },
            }}
          >
            Request
          </Button>
        </Box>
      </GlowingCard>

      <GoBackButton onClick={onBack} />
    </Box>
  );
}
