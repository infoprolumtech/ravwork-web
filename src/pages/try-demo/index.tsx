import { type JSX, useState, useCallback, useEffect } from "react";
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

const stepAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: "easeInOut" as const },
};

export default function TryDemo(): JSX.Element {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const goToStep = useCallback((s: number) => setStep(s), []);
  const handleFinish = useCallback(() => navigate("/signup"), [navigate]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

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

      {/* Gradient background effect */}
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
          pt: { xs: 3, md: 12 },
          pb: 8,
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Box key="step1" component={motion.div} {...stepAnimation} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
               <ServiceDetails onNext={() => goToStep(2)} />
            </Box>
          )}
          {step === 2 && (
            <ReachOut key="step2" onBack={() => goToStep(1)} onNext={() => goToStep(3)} onFinish={handleFinish} />
          )}
          {step === 3 && (
            <CustomQuestions key="step3" onBack={() => goToStep(2)} onNext={() => goToStep(4)} />
          )}
          {step === 4 && (
            <ClientPreview key="step4" onBack={() => goToStep(3)} onNext={() => goToStep(5)} onFinish={handleFinish} />
          )}
          {step === 5 && (
            <ReceiveLeads key="step5" onBack={() => goToStep(4)} onNext={() => goToStep(6)} onFinish={handleFinish} />
          )}
          {step === 6 && (
            <DashboardPreview key="step6" onBack={() => goToStep(5)} onNext={() => goToStep(7)} />
          )}
          {step === 7 && (
            <GrowthEngine key="step7" onFinish={handleFinish} />
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
