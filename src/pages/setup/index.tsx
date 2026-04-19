import { useState, type JSX } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../rtk/store";
import SignupLayout from "../../layouts/SignupLayout";
import { Step4 } from "../../components/signup/Step4";

import {
  useUpdateProfileMutation,
  useSkipProfileMutation,
  useLazyGetCurrentUserQuery,
} from "../../rtk/endpoints/authApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import { clearSignupToken, loginUser } from "../../rtk/feature/authSlice";
import {
  extractErrorMessage,
  calculateProfileComplete,
} from "../../utils/helper";
import serviceApi from "../../rtk/endpoints/serviceApi";
import type { Step4FormInputs } from "../signup/types";

export default function SetupPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [skipProfile, { isLoading: isSkippingProfile }] =
    useSkipProfileMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  const signupToken = useAppSelector((state) => state.auth.signupToken);
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isLogin);

  const [step4Data, setStep4Data] = useState<Step4FormInputs | null>(null);

  const navigateAfterSignup = async (userData: import("../../types").User) => {
    let hasServices = false;
    try {
      const servicesResult = await dispatch(
        serviceApi.endpoints.getServices.initiate(
          { page: 1, limit: 1 },
          { forceRefetch: true },
        ),
      ).unwrap();
      hasServices = Array.isArray(servicesResult)
        ? servicesResult.length > 0
        : Array.isArray((servicesResult as any)?.data)
          ? (servicesResult as any).data.length > 0
          : (servicesResult as any)?.items
            ? (servicesResult as any).items.length > 0
            : false;
    } catch {
      // fall back to profile-fields-only completion
    }

    const completion = calculateProfileComplete(
      {
        displayName: userData.displayName ?? "",
        profilePhoto: userData.profilePhoto ?? "",
        businessDescription: userData.businessDescription ?? "",
      },
      hasServices,
    );

    if (completion === 100) {
      navigate("/dashboard", { replace: true });
    } else if (completion >= 50) {
      navigate("/services-offered", { replace: true });
    } else {
      navigate("/my-profile", { replace: true });
    }
  };

  const finalizeSignup = async (
    userData: import("../../types").User,
    token: string,
  ) => {
    const finalUserData = {
      ...userData,
      accessToken: token,
      profileStep: 3,
    };
    dispatch(clearSignupToken());
    dispatch(loginUser(finalUserData));
    setStep4Data(null);
    navigateAfterSignup(finalUserData);
  };

  const handleStep4Submit = async (data: Step4FormInputs) => {
    try {
      setStep4Data(data);
      const updatedProfile = await updateProfile({
        displayName: data.businessName || undefined,
        businessDescription: data.businessDescription || undefined,
        profilePhoto: data.profilePhoto || undefined,
        instagramUrl: data.instagram || undefined,
        facebookUrl: data.facebook || undefined,
        linkedinUrl: data.linkedin || undefined,
      }).unwrap();

      if (isLoggedIn) {
        dispatch(clearSignupToken());
        dispatch(
          showAlert({
            message: "Profile updated successfully.",
            severity: "success",
          }),
        );
        const updatedUser = { ...user, ...updatedProfile };
        navigateAfterSignup(updatedUser);
        return;
      }

      const userResult = await getCurrentUser(undefined).unwrap();
      const tokenToUse = signupToken || user?.accessToken;
      if (userResult && tokenToUse) {
        await finalizeSignup(userResult, tokenToUse);
        dispatch(
          showAlert({
            message: "Welcome! Your profile is complete.",
            severity: "success",
          }),
        );
      } else {
        dispatch(clearSignupToken());
        navigate("/login", { replace: true });
      }
    } catch (error: unknown) {
      dispatch(
        showAlert({
          message: extractErrorMessage(
            error,
            "Failed to update profile. Please try again.",
          ),
          severity: "error",
        }),
      );
    }
  };

  const handleSkipProfile = async () => {
    try {
      await skipProfile(undefined).unwrap();

      if (isLoggedIn) {
        dispatch(clearSignupToken());
        dispatch(
          showAlert({
            message: "You can complete your profile later.",
            severity: "success",
          }),
        );
        navigateAfterSignup(user || {});
        return;
      }

      const userResult = await getCurrentUser(undefined).unwrap();
      const tokenToUse = signupToken || user?.accessToken;
      if (userResult && tokenToUse) {
        await finalizeSignup(userResult, tokenToUse);
        dispatch(
          showAlert({
            message: "Welcome! You can complete your profile later.",
            severity: "success",
          }),
        );
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
    // Back from setup goes to signup step 2 (plan selection)
    navigate("/signup", { replace: true, state: { resumeStep: 2 } });
  };

  return (
    <SignupLayout showBackIcon onBackClick={handleBackClick}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Step4
          onNext={handleStep4Submit}
          onSkip={handleSkipProfile}
          initialData={step4Data}
          onBack={handleBackClick}
          isSubmitting={isUpdatingProfile}
          isSkipping={isSkippingProfile}
        />
      </Box>
    </SignupLayout>
  );
}
