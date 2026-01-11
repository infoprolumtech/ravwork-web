import { useState, useEffect, type JSX } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../rtk/store";
import SignupLayout from "../../layouts/SignupLayout";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Step4 } from "./components/Step4";
import type { Step1FormInputs, Step2FormInputs, Step3FormInputs, Step4FormInputs } from "./types";
import { useSignupMutation, useUpdateProfileMutation, useSkipProfileMutation } from "../../rtk/endpoints/authApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import { setSignupToken, clearSignupToken, logoutUser } from "../../rtk/feature/authSlice";

// Location state type for resume step from login
interface LocationState {
  resumeStep?: number;
}

export default function SignUpPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [skipProfile, { isLoading: isSkippingProfile }] = useSkipProfileMutation();
  
  // Get signup token and user from Redux state
  const signupToken = useAppSelector((state) => state.auth.signupToken);
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isLogin);
  
  // Determine initial step from location state (from login redirect) or user's profileStep
  const locationState = location.state as LocationState | null;
  const resumeStep = locationState?.resumeStep || (user?.profileStep ? user.profileStep + 1 : 1);
  
  // Initialize current step based on resume step
  const [currentStep, setCurrentStep] = useState(resumeStep > 3 ? 1 : resumeStep);
  
  // Redirect to dashboard if user is logged in and signup is complete
  // profileStep 3 = signup complete
  useEffect(() => {
    if (isLoggedIn && user?.profileStep && user.profileStep >= 3) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, user?.profileStep, navigate]);
  
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

      // Check if signup was already completed (only skip API if we have signupToken in Redux)
      // This means we've already successfully submitted Step 1 before
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

      // If signup successful, store token in Redux state for Step 4 API calls
      // Don't set login state to avoid redirect to dashboard
      if (response?.data?.tokens?.accessToken) {
        // Store token in Redux state (not localStorage)
        dispatch(setSignupToken(response.data.tokens.accessToken));
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
      // profilePhoto is the full S3 URL extracted from the presigned URL after upload
      // Format: https://bucket.s3.region.amazonaws.com/profile-photos/file.jpg
      await updateProfile({
        displayName: data.businessName || undefined,
        businessDescription: data.businessDescription || undefined,
        profilePhoto: data.profilePhoto || undefined, // Full S3 URL from presigned URL upload
        instagramUrl: data.instagram || undefined,
        facebookUrl: data.facebook || undefined,
        linkedinUrl: data.linkedin || undefined,
      }).unwrap();
      
      // Clear signup token from Redux and form data
      dispatch(clearSignupToken());
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
      // Clear signup token from Redux and form data
      dispatch(clearSignupToken());
      setStep1Data(null);
      setStep2Data(null);
      setStep3Data(null);
      setStep4Data(null);
      dispatch(showAlert({ message: "Signup completed. Please sign in to continue.", severity: "success" }));
      // Redirect to sign-in page after skipping profile
      navigate("/login");
    } catch (error: any) {
      console.error("Skip profile error:", error);
      // Clear signup token from Redux and form data even if skip fails
      dispatch(clearSignupToken());
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
    // When user clicks back on any step after Step 1, log them out and redirect to login
    // This allows them to login again and resume from where they left off
    if (currentStep > 1) {
      // Clear signup token
      dispatch(clearSignupToken());
      
      // If user is logged in (resuming signup), log them out
      if (isLoggedIn) {
        dispatch(logoutUser());
      }
      
      // Clear form data
      setStep1Data(null);
      setStep2Data(null);
      setStep3Data(null);
      setStep4Data(null);
      
      // Redirect to login page
      navigate("/login");
    }
    // If on step 1, do nothing (back button won't be shown anyway)
  };

  // Update current step when resumeStep changes (e.g., when navigating from login)
  useEffect(() => {
    if (resumeStep > 1 && resumeStep <= 4) {
      setCurrentStep(resumeStep);
    }
  }, [resumeStep]);

  // Check if signup was already successful (to prevent re-submission)
  // This is true if we have a signup token OR if user is logged in with incomplete profile
  const isSignupCompleted = !!signupToken || (isLoggedIn && (user?.profileStep || 0) >= 1);

  return (
    <SignupLayout showBackIcon={currentStep > 1} onBackClick={handleBackClick}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {currentStep === 1 && <Step1 onNext={handleStep1Submit} initialData={step1Data} onBack={handleBackClick} isSignupCompleted={isSignupCompleted} isLoading={isSigningUp} />}
        {currentStep === 2 && <Step2 onNext={handleStep2Submit} initialData={step2Data} onBack={handleBackClick} />}
        {currentStep === 3 && <Step3 onNext={handleStep3Submit} initialData={step3Data} onBack={handleBackClick} />}
        {currentStep === 4 && <Step4 onNext={handleStep4Submit} onSkip={handleSkipProfile} initialData={step4Data} onBack={handleBackClick} isSubmitting={isUpdatingProfile} isSkipping={isSkippingProfile} />}
      </Box>
    </SignupLayout>
  );
}
