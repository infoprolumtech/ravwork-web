import { useState, type JSX } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../rtk/store";
import SignupLayout from "../../layouts/SignupLayout";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";
import type { Step1FormInputs, Step2FormInputs, Step3FormInputs, Step4FormInputs } from "./types";
import { useSignupMutation, useUpdateProfileMutation, useSkipProfileMutation } from "../../rtk/endpoints/authApi";
import { showAlert } from "../../rtk/feature/alertSlice";

export default function SignUpPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [signup] = useSignupMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [skipProfile] = useSkipProfileMutation();
  
  // Store form data for each step to preserve when navigating back
  const [step1Data, setStep1Data] = useState<Step1FormInputs | null>(null);
  const [step2Data, setStep2Data] = useState<Step2FormInputs | null>(null);
  const [step3Data, setStep3Data] = useState<Step3FormInputs | null>(null);
  const [step4Data, setStep4Data] = useState<Step4FormInputs | null>(null);

  const handleStep1Submit = async (data: Step1FormInputs) => {
    try {
      // Extract username without prefix
      const PREFIX = "ravwork.link/";
      const username = data.username.startsWith(PREFIX) 
        ? data.username.replace(PREFIX, "") 
        : data.username;

      // Check if signup was already completed (only skip API if we have previous step1Data)
      // This means we've already successfully submitted Step 1 before
      const signupToken = localStorage.getItem("signupToken");
      if (signupToken && step1Data) {
        // Signup was already successful and we're navigating back, just proceed to next step
        setStep1Data(data);
        setCurrentStep(2);
        return;
      }

      // Store Step 1 data
      setStep1Data(data);
      
      // Call signup API (always call on first submission)
      const response = await signup({
        username,
        email: data.email,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        password: data.password,
      }).unwrap();

      // If signup successful, store token temporarily in localStorage for Step 4 API calls
      // Don't set login state to avoid redirect to dashboard
      if (response?.data?.tokens?.accessToken) {
        // Store token temporarily in localStorage for Step 4 API calls
        // This won't trigger the login state, so user stays on signup page
        localStorage.setItem("signupToken", response.data.tokens.accessToken);
        setCurrentStep(2);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      dispatch(showAlert({ 
        message: error?.data?.message || "Signup failed. Please try again.", 
        severity: "error" 
      }));
    }
  };

  const handleStep2Submit = (data: Step2FormInputs) => {
    console.log("Step 2 data:", data);
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: Step3FormInputs) => {
    console.log("Step 3 data:", data);
    setStep3Data(data);
    // Step 3 is payment method - just proceed to next step
    setCurrentStep(4);
  };

  const handleStep4Submit = async (data: Step4FormInputs) => {
    try {
      // Store Step 4 data
      setStep4Data(data);
      
      // Step 4 is profile completion - call updateProfile API
      // All fields are optional
      // Convert uploaded image file to base64 data URI for API
      let profilePhotoUrl: string | undefined = undefined;
      if (data.profileImage) {
        // Convert File to base64 data URI (valid URI format)
        profilePhotoUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(data.profileImage!);
        });
      }

      await updateProfile({
        displayName: data.businessName || undefined,
        businessDescription: data.businessDescription || undefined,
        profilePhoto: profilePhotoUrl, // Send base64 data URI to API
        instagramUrl: data.instagram || undefined,
        facebookUrl: data.facebook || undefined,
        linkedinUrl: data.linkedin || undefined,
      }).unwrap();
      
      // Clear temporary signup token and form data
      localStorage.removeItem("signupToken");
      setStep1Data(null);
      setStep2Data(null);
      setStep3Data(null);
      setStep4Data(null);
      dispatch(showAlert({ message: "Profile updated successfully. Please sign in to continue.", severity: "success" }));
      // Redirect to sign-in page after signup completion
      navigate("/login");
    } catch (error: any) {
      console.error("Profile update error:", error);
      dispatch(showAlert({ 
        message: error?.data?.message || "Failed to update profile. Please try again.", 
        severity: "error" 
      }));
    }
  };

  const handleSkipProfile = async () => {
    try {
      await skipProfile(undefined).unwrap();
      // Clear temporary signup token and form data
      localStorage.removeItem("signupToken");
      setStep1Data(null);
      setStep2Data(null);
      setStep3Data(null);
      setStep4Data(null);
      dispatch(showAlert({ message: "Signup completed. Please sign in to continue.", severity: "success" }));
      // Redirect to sign-in page after skipping profile
      navigate("/login");
    } catch (error: any) {
      console.error("Skip profile error:", error);
      // Clear temporary signup token and form data even if skip fails
      localStorage.removeItem("signupToken");
      setStep1Data(null);
      setStep2Data(null);
      setStep3Data(null);
      setStep4Data(null);
      // Even if skip fails, redirect to sign-in
      dispatch(showAlert({ message: "Signup completed. Please sign in to continue.", severity: "success" }));
      navigate("/login");
    }
  };

  const handleBackClick = () => {
    // Only allow navigation between steps 1-4, never go back to login
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    // If on step 1, do nothing (back button won't be shown anyway)
  };

  // Check if signup was already successful (to prevent re-submission)
  const isSignupCompleted = !!localStorage.getItem("signupToken");

  return (
    <SignupLayout showBackIcon={currentStep > 1} onBackClick={handleBackClick}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {currentStep === 1 && <Step1 onNext={handleStep1Submit} initialData={step1Data} onBack={handleBackClick} isSignupCompleted={isSignupCompleted} />}
        {currentStep === 2 && <Step2 onNext={handleStep2Submit} initialData={step2Data} onBack={handleBackClick} />}
        {currentStep === 3 && <Step3 onNext={handleStep3Submit} initialData={step3Data} onBack={handleBackClick} />}
        {currentStep === 4 && <Step4 onNext={handleStep4Submit} onSkip={handleSkipProfile} initialData={step4Data} onBack={handleBackClick} />}
      </Box>
    </SignupLayout>
  );
}
