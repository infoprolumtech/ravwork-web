import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { spacing } from "../styles";
import { useNavigate } from "react-router-dom";
/* ─── Animation ──────────────────────────────────────────────────────────────── */
const glowPulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.75; }
`;

/* ─── Root wrapper ───────────────────────────────────────────────────────────── */
const SectionRoot = styled(Box)(() => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: 18,
  width: "100%",
  minHeight: 220,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "#080f1e",

  // exact values from user
  border: "3px solid rgba(28, 14, 232, 0.4)",
  boxShadow: "0 0 40px rgba(28, 14, 232, 0.15)",
}));

/* ─── Dot grid ───────────────────────────────────────────────────────────────── */
const GridOverlay = styled(Box)(() => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `radial-gradient(circle, rgba(120,160,220,0.20) 1px, transparent 1px)`,
  backgroundSize: "32px 32px",
  pointerEvents: "none",
  zIndex: 1,
}));

/*
  ─── GLOW SHAPE ──────────────────────────────────────────────────────────────
  The glow is an ellipse that is:
    - height: 100% of the container  (top:0, bottom:0)
    - width:  100px (diameter), shifted -50px off the edge
      so only the inner 50px half is visible = perfect semicircle
 
  Using an ellipse (width 100px, height = container height) + border-radius:50%
  gives a tall oval clipped into a half-oval by overflow:hidden.
  The radial-gradient is stretched to match via "ellipse at center".
  ─────────────────────────────────────────────────────────────────────────── */

const GlowBase = {
  position: "absolute" as const,
  top: 0,
  bottom: 0,
  // width is the full diameter; half hangs outside → 50px semicircle visible
  width: 100,
  borderRadius: "50%",
  background: `radial-gradient(
    ellipse at center,
    rgba(0, 212, 255, 0.95)   0%,
    rgba(0, 160, 240, 0.75)  20%,
    rgba(28,  14, 232, 0.50) 45%,
    rgba(28,  14, 232, 0.15) 65%,
    transparent              80%
  )`,
  filter: "blur(4px)",
  pointerEvents: "none" as const,
  zIndex: 2,
};

const LeftGlow = styled(Box)(() => ({
  ...GlowBase,
  left: -50,
  animation: `${glowPulse} 5s ease-in-out infinite`,
}));

const RightGlow = styled(Box)(() => ({
  ...GlowBase,
  right: -50,
  animation: `${glowPulse} 5s ease-in-out infinite 1.5s`,
}));

/* ─── Content stack ──────────────────────────────────────────────────────────── */
const ContentStack = styled(Box)(() => ({
  position: "relative",
  zIndex: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 22,
  padding: "56px 32px",
  textAlign: "center",
}));

/* ─── CTA Button ─────────────────────────────────────────────────────────────── */
const CtaButton = styled(Button)(() => ({
  backgroundColor: "#ffffff",
  color: "#0a0f1c",
  fontWeight: 700,
  fontSize: "1rem",
  letterSpacing: "0.005em",
  borderRadius: 12,
  paddingInline: 30,
  paddingBlock: 13,
  textTransform: "none",
  boxShadow: "0 2px 18px rgba(0,0,0,0.40)",
  transition: "background-color 0.2s, box-shadow 0.2s, transform 0.15s",

  "&:hover": {
    backgroundColor: "#eaf3ff",
    boxShadow: "0 6px 28px rgba(28, 14, 232, 0.28)",
    transform: "translateY(-1px)",
  },

  "&:active": {
    transform: "translateY(0)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.30)",
  },
}));

/* ══════════════════════════════════════════════════════════════════════════════
   FooterCTA Component
══════════════════════════════════════════════════════════════════════════════ */
const FooterCTA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      id="cta-section"
      sx={{
        background: "#000000",
        padding: spacing.sectionPadding,
        color: "#FFFFFF",
      }}
    >
      <Container maxWidth="lg">
        <SectionRoot>
          <GridOverlay />
          <LeftGlow />
          <RightGlow />

          <ContentStack>
            <Typography
              component="h2"
              sx={{
                color: "#ffffff",
                fontWeight: 800,
                fontSize: { xs: "26px", sm: "42px", md: "52px" },
                lineHeight: 1.13,
                letterSpacing: "-0.025em",
              }}
            >
              Let the Link Do the Rest.
            </Typography>

            <CtaButton
              onClick={() => navigate("/signup")}
              variant="contained"
              disableElevation
              endIcon={
                <NorthEastIcon
                  sx={{ fontSize: "1rem !important", mb: "1px" }}
                />
              }
            >
              Start Free Trial
            </CtaButton>

            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.42)",
                fontSize: "0.875rem",
                letterSpacing: "0.01em",
                mt: -0.75,
              }}
            >
              Quick to set up. Simple to us
            </Typography>
          </ContentStack>
        </SectionRoot>
      </Container>
    </Box>
  );
};

export default FooterCTA;
