import { type JSX, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Switch,
  styled,
} from "@mui/material";
import { motion } from "framer-motion";
import { spacing } from "../styles";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CheckIcon from "@mui/icons-material/Check";

// Custom Styled Switch matching the provided design (Neon Blue, Black Track)
const AntSwitch = styled(Switch)(() => ({
  width: 50,
  height: 28,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 22,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(20px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 3,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#000000",
        borderColor: "#1C0EE8",
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: "#1C0EE8",
      },
    },
    // Unchecked state (Monthly)
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 22,
      height: 22,
      backgroundColor: "#1C0EE8", // Keep consistent blue thumb
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 28 / 2,
    opacity: 1,
    backgroundColor: "#000000",
    border: `2px solid #1C0EE8`,
    boxSizing: "border-box",
  },
}));

const features = [
  "Personalized booking link",
  "Full access to features",
  "Unlimited leads",
  "Unlimited custom questions",
  "Lead management dashboard",
];

export default function PricingSection(): JSX.Element {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <Box
      id="pricing"
      sx={{
        background: "#000000",
        padding: spacing.sectionPadding,
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Title */}
        <Typography
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{
            fontSize: { xs: "32px", md: "48px" },
            lineHeight: { xs: "1.3", md: "1.2" },
            fontWeight: 700,
            color: "#FFFFFF",
            mb: 4,
            textAlign: "center",
          }}
        >
          Simple Pricing. No Hidden Fees.
        </Typography>

        {/* Toggle Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: { xs: 6, md: 8 },
          }}
        >
          <Typography
            onClick={() => setIsAnnual(false)}
            sx={{
              color: !isAnnual ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
              fontSize: "16px",
              fontWeight: !isAnnual ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.3s ease",
              width: "70px",
              textAlign: "right",
            }}
          >
            Monthly
          </Typography>

          <AntSwitch
            checked={isAnnual}
            onChange={(e) => setIsAnnual(e.target.checked)}
            inputProps={{ "aria-label": "toggle pricing" }}
          />

          <Typography
            component="div"
            onClick={() => setIsAnnual(true)}
            sx={{
              color: isAnnual ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
              fontSize: "16px",
              fontWeight: isAnnual ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.3s ease",
              width: "70px",
              textAlign: "left",
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            Annual
            <Box
              sx={{
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                marginLeft: "6px",
                background: "rgba(34, 197, 94, 0.2)",
                color: "#22C55E",
                padding: "2px 8px",
                borderRadius: "100px",
                fontSize: "10px",
                fontWeight: 700,
                opacity: isAnnual ? 1 : 0,
                visibility: isAnnual ? "visible" : "hidden",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              Save 31%
            </Box>
          </Typography>
        </Box>

        {/* Pricing Card Section */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "757px",
            mx: "auto",
          }}
        >
          {/* Bottom Glow Effect (Matching SVG filter layers) */}
          <Box
            sx={{
              position: "absolute",
              bottom: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: "100px",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            {/* Ellipse 1: Core Blue Glow */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                height: "40px",
                borderRadius: "50%",
                bgcolor: "#1C23E7",
                filter: "blur(40px)",
                opacity: 0.6,
              }}
            />
            {/* Ellipse 2: Cyan Middle Glow */}
            <Box
              sx={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60%",
                height: "30px",
                borderRadius: "50%",
                bgcolor: "#96FFFF",
                filter: "blur(30px)",
                opacity: 0.4,
              }}
            />
            {/* Ellipse 3: Aqua Top Glow */}
            <Box
              sx={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40%",
                height: "20px",
                borderRadius: "50%",
                bgcolor: "#45FFD7",
                filter: "blur(20px)",
                opacity: 0.5,
              }}
            />
          </Box>

          {/* Main Card */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            key={isAnnual ? "annual" : "monthly"}
            sx={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              minHeight: "519px",
              borderRadius: "18.5px",
              overflow: "hidden",
              // Background Gradient from paint2
              background:
                "linear-gradient(180deg, rgba(0, 47, 232, 0.25) 0%, #020219 100%)",
              // Border from paint3 (approximation using radial border or box shadow)
              border: "3px solid rgba(28, 14, 232, 0.4)",
              boxShadow: "0 0 40px rgba(28, 14, 232, 0.15)",
              backdropFilter: "blur(20px)",
              padding: { xs: "40px 24px", md: "60px 80px" },
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Price Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "48px", md: "64px" },
                    fontWeight: 700,
                    color: "#FFFFFF",
                  }}
                >
                  ${isAnnual ? "20" : "29"}
                </Typography>
                <Typography
                  sx={{ fontSize: "20px", color: "rgba(255, 255, 255, 0.6)" }}
                >
                  /month
                </Typography>
              </Box>
              {isAnnual && (
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.6)",
                    mt: -0.5,
                  }}
                >
                  ($240 Billed Annually)
                </Typography>
              )}
            </Box>

            {/* Divider from paint4 */}
            <Box
              sx={{
                width: "100%",
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)",
                mb: 6,
              }}
            />

            {/* Features Section */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  mb: 3,
                }}
              >
                What's included
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        bgcolor: "#1C0EE8",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckIcon
                        sx={{
                          color: "#FFFFFF",
                          fontSize: "14px",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "rgba(255, 255, 255, 0.85)",
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* CTA Section */}
            <Box sx={{ mt: 6 }}>
              <Button
                href="/signup"
                fullWidth
                sx={{
                  background: "#FFFFFF",
                  color: "#000000",
                  textTransform: "none",
                  fontSize: "18px",
                  fontWeight: 700,
                  borderRadius: "12px",
                  padding: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  "&:hover": {
                    background: "#F0F0F0",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {isAnnual ? "Claim Your Link" : "Start Free Trial"}
                <CallMadeIcon sx={{ fontSize: 24 }} />
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
