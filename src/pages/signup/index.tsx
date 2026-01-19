import { useState, useEffect, type JSX } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../rtk/store";
import SignupLayout from "../../layouts/SignupLayout";
import { Step1 } from "../../components/signup/Step1";
import { Step2 } from "../../components/signup/Step2";
import { Step3 } from "../../components/signup/Step3";
import { Step4 } from "../../components/signup/Step4";
import type { Step1FormInputs, Step2FormInputs, Step3FormInputs, Step4FormInputs } from "./types";
import { useSignupMutation, useUpdateProfileMutation, useSkipProfileMutation, useLazyGetCurrentUserQuery } from "../../rtk/endpoints/authApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import { setSignupToken, clearSignupToken, logoutUser, loginUser } from "../../rtk/feature/authSlice";
import { extractErrorMessage } from "../../utils/helper";

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
  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  const signupToken = useAppSelector((state) => state.auth.signupToken);
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isLogin);

  const locationState = location.state as LocationState | null;
  const resumeStep = locationState?.resumeStep || (user?.profileStep ? user.profileStep + 1 : 1);

  const [currentStep, setCurrentStep] = useState(resumeStep > 4 ? 1 : resumeStep);

  useEffect(() => {
    if (isLoggedIn && user?.profileStep && user.profileStep >= 3) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, user?.profileStep, navigate]);

  const [step1Data, setStep1Data] = useState<Step1FormInputs | null>(null);
  const [step2Data, setStep2Data] = useState<Step2FormInputs | null>(null);
  const [step3Data, setStep3Data] = useState<Step3FormInputs | null>(null);
  const [step4Data, setStep4Data] = useState<Step4FormInputs | null>(null);

  const handleStep1Submit = async (data: Step1FormInputs) => {
    try {
      const PREFIX = "ravwork.link/";
      const username = data.username.startsWith(PREFIX)
        ? data.username.replace(PREFIX, "")
        : data.username;

      if (signupToken && step1Data) {
        setStep1Data(data);
        setCurrentStep(2);
        return;
      }

      setStep1Data(data);

      const result = await signup({
        username,
        email: data.email,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        password: data.password,
      }).unwrap();

      const accessToken = result.tokens?.accessToken || result.accessToken || result.user?.accessToken;
      if (accessToken) {
        dispatch(setSignupToken(accessToken));
        setCurrentStep(2);
      }
    } catch (error: unknown) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Signup failed. Please try again."),
        severity: "error"
      }));
    }
  };

  const handleStep2Submit = (data: Step2FormInputs) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: Step3FormInputs) => {
    setStep3Data(data);
    setCurrentStep(4);
  };

  const finalizeSignup = async (userData: import("../../types").User, token: string) => {
    const finalUserData = {
      ...userData,
      accessToken: token,
      profileStep: 3,
    };
    dispatch(clearSignupToken());
    dispatch(loginUser(finalUserData));
    setStep1Data(null);
    setStep2Data(null);
    setStep3Data(null);
    setStep4Data(null);
    navigate("/dashboard", { replace: true });
  };

  const handleStep4Submit = async (data: Step4FormInputs) => {
    try {
      setStep4Data(data);
      await updateProfile({
        displayName: data.businessName || undefined,
        businessDescription: data.businessDescription || undefined,
        profilePhoto: data.profilePhoto || undefined,
        instagramUrl: data.instagram || undefined,
        facebookUrl: data.facebook || undefined,
        linkedinUrl: data.linkedin || undefined,
      }).unwrap();

      const userResult = await getCurrentUser(undefined).unwrap();
      if (userResult && signupToken) {
        await finalizeSignup(userResult, signupToken);
        dispatch(showAlert({ message: "Welcome! Your profile is complete.", severity: "success" }));
      } else {
        dispatch(clearSignupToken());
        navigate("/login", { replace: true });
      }
    } catch (error: unknown) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Failed to update profile. Please try again."),
        severity: "error"
      }));
    }
  };

  const handleSkipProfile = async () => {
    try {
      await skipProfile(undefined).unwrap();
      const userResult = await getCurrentUser(undefined).unwrap();
      if (userResult && signupToken) {
        await finalizeSignup(userResult, signupToken);
        dispatch(showAlert({ message: "Welcome! You can complete your profile later.", severity: "success" }));
      } else {
        dispatch(clearSignupToken());
        navigate("/login", { replace: true });
      }
    } catch {
      dispatch(clearSignupToken());
      navigate("/login", { replace: true });
    }
  };

  const handleBackClick = () => {
    if (currentStep > 1) {
      dispatch(clearSignupToken());
      if (isLoggedIn) {
        dispatch(logoutUser());
      }
      setStep1Data(null);
      setStep2Data(null);
      setStep3Data(null);
      setStep4Data(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (resumeStep > 1 && resumeStep <= 4) {
      setCurrentStep(resumeStep);
    }
  }, [resumeStep]);

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

