import { type JSX } from "react";
import { Box } from "@mui/material";
import HeroSection from "./components/HeroSection";
import ProblemsSection from "./components/ProblemsSection";
import GridFeatures from "./components/GridFeatures";
import HowItWorks from "./components/HowItWorks";
import ExponentialGrowth from "./components/ExponentialGrowth";
import FAQSection from "./components/FAQSection";
import PricingSection from "./components/PricingSection";
import CTASection from "./components/CTASection";

export default function LandingPage(): JSX.Element {
  return (
    <Box
      sx={{
        background: "#000000",
        minHeight: "100vh",
        scrollBehavior: "smooth",
      }}
    >
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


    </Box>
  );
}



