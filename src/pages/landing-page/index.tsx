import { type JSX, useState, useEffect, useRef } from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../rtk/store";
import CloseIcon from "@mui/icons-material/Close";
import HeroSection from "./components/HeroSection";
import ProblemsSection from "./components/ProblemsSection";
import GridFeatures from "./components/GridFeatures";
import HowItWorks from "./components/HowItWorks";
import ExponentialGrowth from "./components/ExponentialGrowth";
import FAQSection from "./components/FAQSection";
import PricingSection from "./components/PricingSection";
import CTASection from "./components/CTASection";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivacyPolicy from "../../components/client/privacyPolicy";
import TermCondition from "../../components/client/termCondition";

export default function LandingPage(): JSX.Element {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const { isLogin } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (isLogin) {
      navigate("/dashboard");
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    if (location.hash && !hasScrolledRef.current) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure everything is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          hasScrolledRef.current = true;
        }, 300);
      }
    }
  }, [location]);

  return (
    <Box
      sx={{
        background: "#000000",
        minHeight: "100vh",
        scrollBehavior: "smooth",
        overflowX: "hidden", // Prevent horizontal scroll
      }}
    >
      {/* Header Section */}
      < Header onTermsClick={() => setTermsOpen(true)} />

      {/* Hero Section */}
      <HeroSection />

      {/* Problems Section */}
      <ProblemsSection />

      {/* Look Professional Section */}
      <GridFeatures />

      {/* How It Works Section (Figma Design) */}
      <HowItWorks />


      {/* Exponential Growth Section */}
      <ExponentialGrowth />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />



      {/* CTA Section */}
      <CTASection />

      {/* Footer Section */}
      <Footer onTermsClick={() => setTermsOpen(true)} onPrivacyClick={() => setPrivacyOpen(true)} />

      {/* TermsModal */}
      <Dialog
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { sm: "16px" },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: "100vh", sm: "90vh" },
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "18px", sm: "20px" },
              fontWeight: 600,
              color: "#111927",
            }}
          >
            Ravwork Link – Terms & Conditions
          </Typography>
          <IconButton
            onClick={() => setTermsOpen(false)}
            sx={{
              color: "#6C737F",
              p: 0.5,
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 3, sm: 3 },
            pt: 2,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <TermCondition />
        </DialogContent>
      </Dialog>

      {/* PrivacyModal */}
      <Dialog
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { sm: "16px" },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: "100vh", sm: "90vh" },
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "18px", sm: "20px" },
              fontWeight: 600,
              color: "#111927",
            }}
          >
            Ravwork Link – Privacy Policy
          </Typography>
          <IconButton
            onClick={() => setPrivacyOpen(false)}
            sx={{
              color: "#6C737F",
              p: 0.5,
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 3, sm: 3 },
            pt: 2,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <PrivacyPolicy />
        </DialogContent>
      </Dialog>

    </Box >
  );
}



