import { useState, type JSX } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SignupLayout from "../../layouts/SignupLayout";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";
import type { Step1FormInputs, Step2FormInputs, Step3FormInputs, Step4FormInputs } from "./types";

export default function SignUpPage(): JSX.Element {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleStep1Submit = (data: Step1FormInputs) => {
    console.log("Step 1 data:", data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2FormInputs) => {
    console.log("Step 2 data:", data);
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: Step3FormInputs) => {
    console.log("Step 3 data:", data);
    setCurrentStep(4);
  };

  const handleStep4Submit = (data: Step4FormInputs) => {
    console.log("Step 4 data:", data);
    // Complete signup and navigate to dashboard
    navigate("/dashboard");
  };

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SignupLayout>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {currentStep === 1 && <Step1 onNext={handleStep1Submit} />}
        {currentStep === 2 && <Step2 onNext={handleStep2Submit} onBack={handleBackClick} />}
        {currentStep === 3 && <Step3 onNext={handleStep3Submit} onBack={handleBackClick} />}
        {currentStep === 4 && <Step4 onNext={handleStep4Submit} onBack={handleBackClick} />}
      </Box>
    </SignupLayout>
  );
}
