import { useState, useEffect, useRef, useCallback, type JSX } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../rtk/store";
import SignupLayout from "../../layouts/SignupLayout";
import { Step1 } from "../../components/signup/Step1";
import { Step2 } from "../../components/signup/Step2";
import { Step4 } from "../../components/signup/Step4";
import type { Step1FormInputs, Step2FormInputs, Step4FormInputs } from "./types";
import { useSignupMutation, useUpdateProfileMutation, useSkipProfileMutation, useLazyGetCurrentUserQuery } from "../../rtk/endpoints/authApi";
import { useCreateSubscriptionCheckoutMutation, useGetSubscriptionPlansQuery, useLazyGetSubscriptionStatusQuery } from "../../rtk/endpoints/subscriptionApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import { setSignupToken, clearSignupToken, logoutUser, loginUser, setSubscriptionStatus } from "../../rtk/feature/authSlice";
import { extractErrorMessage } from "../../utils/helper";
import { calculateProfileComplete } from "../../utils/helper";
import serviceApi from "../../rtk/endpoints/serviceApi";

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
  const [createSubscriptionCheckout, { isLoading: isCreatingCheckout }] = useCreateSubscriptionCheckoutMutation();
  const [getSubscriptionStatus] = useLazyGetSubscriptionStatusQuery();

  const signupToken = useAppSelector((state) => state.auth.signupToken);
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isLogin);
  const storedSubscriptionStatus = useAppSelector((state) => state.auth.subscriptionStatus);
  const hasAuthToken = Boolean(signupToken || user?.accessToken);

  const locationState = location.state as LocationState | null;
  const searchParams = new URLSearchParams(location.search);
  const resumeStepFromQuery = Number(searchParams.get("resumeStep") || "");
  const computedResumeStepFromProfile = user?.profileStep ? user.profileStep + 1 : 1;
  const resumeStep =
    locationState?.resumeStep ||
    (Number.isFinite(resumeStepFromQuery) && resumeStepFromQuery >= 1 ? resumeStepFromQuery : undefined) ||
    computedResumeStepFromProfile;

  // If user is already logged in, do not show Step 1 again.
  // Logged-in but incomplete signup should start from Step 2 at minimum.
  const resumeStepWithLoginGuard = isLoggedIn ? Math.max(2, resumeStep) : resumeStep;

  // Step 3 is removed from the flow (payment happens via Stripe hosted checkout from Step 2).
  // If we land on resumeStep=3 (e.g., backend says profileStep=2 → next would be step 3),
  // we should advance to Step 4 (profile setup).
  const normalizedResumeStep = resumeStepWithLoginGuard === 3 ? 4 : resumeStepWithLoginGuard;
  const [currentStep, setCurrentStep] = useState(normalizedResumeStep > 4 ? 1 : normalizedResumeStep);
  const hasCheckedSubscriptionOnStep2Ref = useRef(false);

  const isActiveOrTrialing = useCallback((status: typeof storedSubscriptionStatus) => {
    return (
      Boolean(status?.hasSubscription) &&
      (status?.subscription?.status === "active" || status?.subscription?.status === "trialing")
    );
  }, []);

  const fetchAndStoreSubscriptionStatus = useCallback(async () => {
    const status = await getSubscriptionStatus(undefined).unwrap();
    dispatch(setSubscriptionStatus(status));
    return status;
  }, [dispatch, getSubscriptionStatus]);

  const navigateAfterSignup = useCallback(
    async (userData: import("../../types").User) => {
      // Profile completion = up to 50 from profile fields + 50 if services exist
      let hasServices = false;
      try {
        const servicesResult = await dispatch(
          serviceApi.endpoints.getServices.initiate({ page: 1, limit: 1 }, { forceRefetch: true })
        ).unwrap();
        hasServices = Array.isArray(servicesResult)
          ? servicesResult.length > 0
          : Array.isArray((servicesResult as any)?.data)
            ? (servicesResult as any).data.length > 0 // Ensure data array has items
            : (servicesResult as any)?.items // Check for 'items' if 'data' is missing (some APIs use items)
              ? (servicesResult as any).items.length > 0
              : false;
      } catch {
        // If service fetch fails, fall back to profile-fields-only completion
      }

      const completion = calculateProfileComplete(
        {
          displayName: userData.displayName ?? "",
          profilePhoto: userData.profilePhoto ?? "",
          businessDescription: userData.businessDescription ?? "",
        },
        hasServices
      );

      if (completion === 100) {
        navigate("/dashboard", { replace: true });
      } else if (completion >= 50) {
        navigate("/services-offered", { replace: true });
      } else {
        navigate("/my-profile", { replace: true });
      }
    },
    [dispatch, navigate]
  );

  // Only load plans when we actually reach Step 2 (after Step 1 completes).
  const {
    data: subscriptionPlans = [],
    isLoading: isPlansLoading,
  } = useGetSubscriptionPlansQuery(undefined, { skip: currentStep !== 2 });

  // Check subscription status on mount/after login to skip to Step 4 if subscription is active
  useEffect(() => {
    // If we already have an active subscription in redux, skip to Step 4
    if (isActiveOrTrialing(storedSubscriptionStatus)) {
      if (currentStep === 2) {
        setCurrentStep(4);
      }
      return;
    }

    // Only check if user is logged in and has auth token
    if (!hasAuthToken || !isLoggedIn) return;

    // Check subscription status when component mounts or user logs in
    (async () => {
      try {
        const freshStatus = await fetchAndStoreSubscriptionStatus();
        if (isActiveOrTrialing(freshStatus)) {
          // If subscription is active and we're on step 2, go to step 4
          if (currentStep === 2) {
            setCurrentStep(4);
          }
        }
      } catch {
        // If status can't be fetched, keep user on current step
      }
    })();
  }, [isLoggedIn, hasAuthToken, currentStep, fetchAndStoreSubscriptionStatus, isActiveOrTrialing, storedSubscriptionStatus]);

  // If the user already has an active subscription, skip Step 2 (plan selection) and go straight to Step 4.
  // We check both persisted redux state and the backend status endpoint (using signupToken/accessToken).
  useEffect(() => {
    if (currentStep !== 2) return;

    // If we already have an active subscription in redux, don't show plan selection again.
    if (isActiveOrTrialing(storedSubscriptionStatus)) {
      setCurrentStep(4);
      return;
    }

    // Prevent repeated calls while user stays on step 2
    if (hasCheckedSubscriptionOnStep2Ref.current) return;
    hasCheckedSubscriptionOnStep2Ref.current = true;

    if (!hasAuthToken) return;

    (async () => {
      try {
        const freshStatus = await fetchAndStoreSubscriptionStatus();
        if (isActiveOrTrialing(freshStatus)) {
          setCurrentStep(4);
        }
      } catch {
        // If status can't be fetched, keep user on Step 2 (they can proceed with checkout).
      }
    })();
  }, [currentStep, fetchAndStoreSubscriptionStatus, hasAuthToken, isActiveOrTrialing, storedSubscriptionStatus]);

  // Reset step-2 one-time check when leaving step 2, so coming back re-checks status.
  useEffect(() => {
    if (currentStep !== 2) {
      hasCheckedSubscriptionOnStep2Ref.current = false;
    }
  }, [currentStep]);

  useEffect(() => {
    if (isLoggedIn && user?.profileStep && user.profileStep >= 3) {
      // Signup complete; route based on profile completion rule (not dashboard)
      navigateAfterSignup(user);
    }
  }, [isLoggedIn, user, navigateAfterSignup]);

  const [step1Data, setStep1Data] = useState<Step1FormInputs | null>(null);
  const [step2Data, setStep2Data] = useState<Step2FormInputs | null>(null);
  const [step4Data, setStep4Data] = useState<Step4FormInputs | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subscriptionStatus = params.get("subscription");
    if (!subscriptionStatus) return;

    if (subscriptionStatus === "success") {
      (async () => {
        try {
          const status = await fetchAndStoreSubscriptionStatus();
          if (!isActiveOrTrialing(status)) {
            dispatch(showAlert({ message: "Payment received, but subscription is not active yet. Please try again.", severity: "warning" }));
            setCurrentStep(2);
            navigate("/signup", { replace: true, state: { resumeStep: 2 } });
            return;
          }


          // Track Subscribe event after payment confirmation
          if (typeof (window as any).fbq === 'function' && status?.subscription) {
            const subscription = status.subscription;
            const value = subscription.plan?.price || (subscription.plan?.interval === 'month' ? 29.99 : 240);
            const currency = subscription.plan?.currency?.toUpperCase() || 'USD';
            const eventId = `sub_${subscription.id || user?.id || Date.now()}`;

            (window as any).fbq('track', 'Subscribe', {
              value: value,
              currency: currency,
              event_id: eventId,
            });
          }
          dispatch(showAlert({ message: "Subscription activated. Let’s finish setting up your profile.", severity: "success" }));
          setCurrentStep(4);
          navigate("/signup", { replace: true, state: { resumeStep: 4 } });
        } catch (error: unknown) {
          // If we can't verify subscription, send user back to Step 2.
          dispatch(showAlert({ message: extractErrorMessage(error, "Payment succeeded, but we couldn't verify subscription status. Please try again."), severity: "warning" }));
          setCurrentStep(2);
          navigate("/signup", { replace: true, state: { resumeStep: 2 } });
          return;
        }
      })();
      return;
    }

    if (subscriptionStatus === "cancel") {
      dispatch(showAlert({ message: "Subscription checkout was cancelled. Please try again.", severity: "error" }));
      setCurrentStep(2);
      navigate("/signup", { replace: true, state: { resumeStep: 2 } });
    }
  }, [dispatch, fetchAndStoreSubscriptionStatus, isActiveOrTrialing, location.search, navigate]);

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
        // Track InitiateCheckout - Step 1 Complete
        if (typeof (window as any).fbq === 'function') {
          (window as any).fbq('track', 'InitiateCheckout');
        }

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

  const handleStep2Submit = async (data: Step2FormInputs) => {
    // Step 2: Create Stripe checkout session and redirect to Stripe
    try {
      setStep2Data(data);

      if (!hasAuthToken) {
        dispatch(showAlert({ message: "Please login to continue.", severity: "error" }));
        setCurrentStep(2);
        navigate("/login", { replace: true });
        return;
      }

      if (!data?.plan) {
        dispatch(showAlert({ message: "Please select a plan.", severity: "error" }));
        return;
      }

      const origin = window.location.origin;
      const successUrl = `${origin}/signup?subscription=success&resumeStep=4`;
      const cancelUrl = `${origin}/signup?subscription=cancel&resumeStep=2`;

      const checkout = await createSubscriptionCheckout({
        planId: data.plan, // Step2 stores backend plan UUID in `plan`
        successUrl,
        cancelUrl,
      }).unwrap();

      if (checkout?.checkoutUrl) {
        // Track AddToCart - Step 2 Plan Selection
        // Assuming subscriptionPlans is available in scope or we search for the selected plan
        const selectedPlan = subscriptionPlans.find((p: any) => p.id === data.plan);
        if (typeof (window as any).fbq === 'function' && selectedPlan) {
          const value = selectedPlan.price;
          const currency = selectedPlan.currency.toUpperCase();
          (window as any).fbq('track', 'AddToCart', {
            content_ids: [selectedPlan.id],
            content_type: 'product',
            value: value,
            currency: currency,
          });
        }

        window.location.href = checkout.checkoutUrl;
      } else {
        dispatch(showAlert({ message: "Failed to start checkout. Please try again.", severity: "error" }));
      }
    } catch (error: unknown) {
      // Handle "already subscribed" as a non-blocking case: continue to Step 4
      const message = extractErrorMessage(error, "Failed to start checkout. Please try again.");
      if (typeof message === "string" && message.toLowerCase().includes("active subscription")) {
        dispatch(showAlert({ message: "You already have an active subscription. Let’s finish setting up your profile.", severity: "success" }));
        setCurrentStep(4);
        navigate("/signup", { replace: true, state: { resumeStep: 4 } });
        return;
      }
      dispatch(showAlert({ message, severity: "error" }));
    }
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

      // If already logged in, just continue to dashboard
      if (isLoggedIn) {
        dispatch(clearSignupToken());
        dispatch(showAlert({ message: "Profile updated successfully.", severity: "success" }));
        // Merge existing user state with updated profile data to ensure navigation logic uses fresh data
        const updatedUser = { ...user, ...updatedProfile };
        navigateAfterSignup(updatedUser);
        return;
      }

      const userResult = await getCurrentUser(undefined).unwrap();
      const tokenToUse = signupToken || user?.accessToken;
      if (userResult && tokenToUse) {
        await finalizeSignup(userResult, tokenToUse);
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
      // If already logged in, just continue to dashboard
      if (isLoggedIn) {
        dispatch(clearSignupToken());
        dispatch(showAlert({ message: "You can complete your profile later.", severity: "success" }));
        navigateAfterSignup(user || {});
        return;
      }

      const userResult = await getCurrentUser(undefined).unwrap();
      const tokenToUse = signupToken || user?.accessToken;
      if (userResult && tokenToUse) {
        await finalizeSignup(userResult, tokenToUse);
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
      setStep4Data(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (normalizedResumeStep > 1 && normalizedResumeStep <= 4) {
      // Before setting step, check if user has active subscription
      // If they do, skip to step 4 regardless of resumeStep
      if (isActiveOrTrialing(storedSubscriptionStatus)) {
        setCurrentStep(4);
      } else {
        setCurrentStep(normalizedResumeStep);
      }
    }
  }, [normalizedResumeStep, isActiveOrTrialing, storedSubscriptionStatus]);

  const isSignupCompleted = !!signupToken || (isLoggedIn && (user?.profileStep || 0) >= 1);

  return (
    <SignupLayout showBackIcon={currentStep > 1} onBackClick={handleBackClick}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {currentStep === 1 && <Step1 onNext={handleStep1Submit} initialData={step1Data} onBack={handleBackClick} isSignupCompleted={isSignupCompleted} isLoading={isSigningUp} />}
        {currentStep === 2 && (
          <Step2
            onNext={handleStep2Submit}
            initialData={step2Data}
            onBack={handleBackClick}
            isLoading={isCreatingCheckout || isPlansLoading}
            plans={subscriptionPlans}
          />
        )}
        {currentStep === 4 && <Step4 onNext={handleStep4Submit} onSkip={handleSkipProfile} initialData={step4Data} onBack={handleBackClick} isSubmitting={isUpdatingProfile} isSkipping={isSkippingProfile} />}
      </Box>
    </SignupLayout>
  );
}

