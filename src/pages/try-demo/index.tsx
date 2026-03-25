import { type JSX, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../landing-page/components/Header";
import ServiceDetails from "./components/ServiceDetails";
import ReachOut from "./components/ReachOut";
import CustomQuestions from "./components/CustomQuestions";
import ClientPreview from "./components/ClientPreview";
import ReceiveLeads from "./components/ReceiveLeads";
import DashboardPreview from "./components/DashboardPreview";
import GrowthEngine from "./components/GrowthEngine";

export default function TryDemo(): JSX.Element {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNextToReachOut = () => setStep(2);
  const handleNextToCustom = () => setStep(3);
  const handleNextToPreview = () => setStep(4);
  const handleNextToLeads = () => setStep(5);
  const handleNextToDashboard = () => setStep(6);
  const handleNextToGrowth = () => setStep(7);
  const handleBackToService = () => setStep(1);
  const handleBackToReachOut = () => setStep(2);
  const handleBackToCustom = () => setStep(3);
  const handleBackToPreview = () => setStep(4);
  const handleBackToLeads = () => setStep(5);
  const handleFinish = () => navigate("/signup");

  return (
    <Box
      sx={{
        background: "#000000",
        minHeight: "100vh",
        scrollBehavior: "smooth",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Header onTermsClick={() => {}} />

      {/* Optional nice gradient background effect */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 60%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      
      <Box 
        sx={{
          position: "relative",
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 8, md: 12 },
          pb: 8,
          px: 3,
        }}
      >
        {/* Step Indicators Removed for Design Fidelity */}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <Box 
               key="step1" 
               component={motion.div}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.4, ease: "easeInOut" }}
               sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
               <ServiceDetails onNext={handleNextToReachOut} />
            </Box>
          )}
          {step === 2 && (
            <ReachOut key="step2" onBack={handleBackToService} onNext={handleNextToCustom} onFinish={handleFinish} />
          )}
          {step === 3 && (
            <CustomQuestions key="step3" onBack={handleBackToReachOut} onNext={handleNextToPreview} />
          )}
          {step === 4 && (
            <ClientPreview key="step4" onBack={handleBackToCustom} onNext={handleNextToLeads} onFinish={handleFinish} />
          )}
          {step === 5 && (
            <ReceiveLeads key="step5" onBack={handleBackToPreview} onNext={handleNextToDashboard} onFinish={handleFinish} />
          )}
          {step === 6 && (
            <DashboardPreview key="step6" onBack={handleBackToLeads} onNext={handleNextToGrowth} />
          )}
          {step === 7 && (
            <GrowthEngine key="step7" onFinish={handleFinish} />
          )}
        </AnimatePresence>

        {/* Success / Final state handles in Finish redirecting to signup */}
      </Box>
    </Box>
  );
}
