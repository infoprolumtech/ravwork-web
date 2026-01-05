import { useState, type JSX } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [signup] = useSignupMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [skipProfile] = useSkipProfileMutation();

  const handleStep1Submit = async (data: Step1FormInputs) => {
    try {
      // Extract username without prefix
      const PREFIX = "ravwork.link/";
      const username = data.username.startsWith(PREFIX) 
        ? data.username.replace(PREFIX, "") 
        : data.username;

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
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: Step3FormInputs) => {
    console.log("Step 3 data:", data);
    // Step 3 is payment method - just proceed to next step
    setCurrentStep(4);
  };

  const handleStep4Submit = async (data: Step4FormInputs) => {
    try {
      // Step 4 is profile completion - call updateProfile API
      // All fields are optional
      // Convert uploaded image file to URL string for API
      let profilePhotoUrl: string | undefined = undefined;
      if (data.profileImage) {
        profilePhotoUrl = URL.createObjectURL(data.profileImage);
      }

      await updateProfile({
        displayName: data.businessName || undefined,
        businessDescription: data.businessDescription || undefined,
        profilePhoto: profilePhotoUrl, // Send URL string to API
        instagramUrl: data.instagram || undefined,
        facebookUrl: data.facebook || undefined,
        linkedinUrl: data.linkedin || undefined,
      }).unwrap();
      
      // Clear temporary signup token
      localStorage.removeItem("signupToken");
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
      // Clear temporary signup token
      localStorage.removeItem("signupToken");
      dispatch(showAlert({ message: "Signup completed. Please sign in to continue.", severity: "success" }));
      // Redirect to sign-in page after skipping profile
      navigate("/login");
    } catch (error: any) {
      console.error("Skip profile error:", error);
      // Clear temporary signup token even if skip fails
      localStorage.removeItem("signupToken");
      // Even if skip fails, redirect to sign-in
      dispatch(showAlert({ message: "Signup completed. Please sign in to continue.", severity: "success" }));
      navigate("/login");
    }
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
        {currentStep === 4 && <Step4 onNext={handleStep4Submit} onBack={handleBackClick} onSkip={handleSkipProfile} />}
      </Box>
    </SignupLayout>
  );
}
