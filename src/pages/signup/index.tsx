import { useState, useEffect, useRef, useCallback, type JSX } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../rtk/store";
import SignupLayout from "../../layouts/SignupLayout";
import { Step1 } from "../../components/signup/Step1";
import { Step2 } from "../../components/signup/Step2";
import type { Step1FormInputs, Step2FormInputs } from "./types";
import {
  useSignupMutation,
  useLazyGetCurrentUserQuery,
} from "../../rtk/endpoints/authApi";
import {
  useCreateSubscriptionCheckoutMutation,
  useGetSubscriptionPlansQuery,
  useLazyGetSubscriptionStatusQuery,
} from "../../rtk/endpoints/subscriptionApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import {
  setSignupToken,
  clearSignupToken,
  logoutUser,
  setSubscriptionStatus,
} from "../../rtk/feature/authSlice";
import { extractErrorMessage } from "../../utils/helper";

interface LocationState {
  resumeStep?: number;
}

export default function SignUpPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const [createSubscriptionCheckout, { isLoading: isCreatingCheckout }] =
    useCreateSubscriptionCheckoutMutation();
  const [getSubscriptionStatus] = useLazyGetSubscriptionStatusQuery();

  const signupToken = useAppSelector((state) => state.auth.signupToken);
  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = useAppSelector((state) => state.auth.isLogin);
  const storedSubscriptionStatus = useAppSelector(
    (state) => state.auth.subscriptionStatus,
  );

  const hasAuthToken = Boolean(signupToken || user?.accessToken);

  const locationState = location.state as LocationState | null;
  const searchParams = new URLSearchParams(location.search);
  const resumeStepFromQuery = Number(searchParams.get("resumeStep") || "");

  const computedResumeStepFromProfile = user?.profileStep
    ? user.profileStep + 1
    : 1;

  const resumeStep =
    locationState?.resumeStep ||
    (Number.isFinite(resumeStepFromQuery) && resumeStepFromQuery >= 1
      ? resumeStepFromQuery
      : undefined) ||
    computedResumeStepFromProfile;

  // If user is already logged in, do not show Step 1 again.
  const resumeStepWithLoginGuard = isLoggedIn
    ? Math.max(2, resumeStep)
    : resumeStep;

  // Step 3 is removed from the flow (payment happens via Stripe hosted checkout from Step 2).
  // Step 4 is now at /setup route.
  // If resumeStep resolves to 3 or 4, redirect immediately to /setup.
  const normalizedResumeStep =
    resumeStepWithLoginGuard >= 3 ? null : resumeStepWithLoginGuard;

  const [currentStep, setCurrentStep] = useState<1 | 2>(
    normalizedResumeStep === 2 ? 2 : 1,
  );

  const hasCheckedSubscriptionOnStep2Ref = useRef(false);

  const isActiveOrTrialing = useCallback(
    (status: typeof storedSubscriptionStatus) => {
      return (
        Boolean(status?.hasSubscription) &&
        (status?.subscription?.status === "active" ||
          status?.subscription?.status === "trialing")
      );
    },
    [],
  );

  const fetchAndStoreSubscriptionStatus = useCallback(async () => {
    const status = await getSubscriptionStatus(undefined).unwrap();
    dispatch(setSubscriptionStatus(status));
    return status;
  }, [dispatch, getSubscriptionStatus]);

  // Only load plans when we actually reach Step 2.
  const { data: subscriptionPlans = [], isLoading: isPlansLoading } =
    useGetSubscriptionPlansQuery(undefined, { skip: currentStep !== 2 });

  // If resumeStep resolves to 3 or 4 on mount, go directly to /setup.
  useEffect(() => {
    if (normalizedResumeStep === null) {
      navigate("/setup", { replace: true });
    }
  }, []); // intentionally run once on mount only

  // Check subscription status on mount — if already active, skip to /setup.
  useEffect(() => {
    if (isActiveOrTrialing(storedSubscriptionStatus)) {
      navigate("/setup", { replace: true });
      return;
    }

    if (!hasAuthToken || !isLoggedIn) return;

    (async () => {
      try {
        const freshStatus = await fetchAndStoreSubscriptionStatus();
        if (isActiveOrTrialing(freshStatus)) {
          navigate("/setup", { replace: true });
        }
      } catch {
        // If status can't be fetched, keep user on current step
      }
    })();
  }, [isLoggedIn, hasAuthToken]); // intentionally limited deps — one-time mount check

  // If user lands on Step 2, re-check subscription to skip if already active.
  useEffect(() => {
    if (currentStep !== 2) return;

    if (isActiveOrTrialing(storedSubscriptionStatus)) {
      navigate("/setup", { replace: true });
      return;
    }

    if (hasCheckedSubscriptionOnStep2Ref.current) return;
    hasCheckedSubscriptionOnStep2Ref.current = true;

    if (!hasAuthToken) return;

    (async () => {
      try {
        const freshStatus = await fetchAndStoreSubscriptionStatus();
        if (isActiveOrTrialing(freshStatus)) {
          navigate("/setup", { replace: true });
        }
      } catch {
        // If status can't be fetched, keep user on Step 2
      }
    })();
  }, [currentStep, storedSubscriptionStatus, hasAuthToken]);

  // Reset step-2 one-time check when leaving step 2.
  useEffect(() => {
    if (currentStep !== 2) {
      hasCheckedSubscriptionOnStep2Ref.current = false;
    }
  }, [currentStep]);

  // If signup is fully complete (profileStep >= 3), redirect out of signup.
  useEffect(() => {
    if (isLoggedIn && (user?.profileStep ?? 0) >= 3) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, user?.profileStep]);

  const [step1Data, setStep1Data] = useState<Step1FormInputs | null>(null);
  const [step2Data, setStep2Data] = useState<Step2FormInputs | null>(null);

  // Handle Stripe return (subscription=success or subscription=cancel)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subscriptionStatus = params.get("subscription");
    if (!subscriptionStatus) return;

    if (subscriptionStatus === "success") {
      (async () => {
        try {
          let status = null;
          let retries = 0;
          const MAX_RETRIES = 5;

          dispatch(
            showAlert({
              message: "Verifying your subscription, please wait...",
              severity: "info",
            }),
          );

          while (retries < MAX_RETRIES) {
            status = await fetchAndStoreSubscriptionStatus();
            if (isActiveOrTrialing(status)) break;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            retries++;
          }

          if (!isActiveOrTrialing(status)) {
            dispatch(
              showAlert({
                message:
                  "Payment received, but we're still waiting for activation. You can refresh or contact support if it takes too long.",
                severity: "warning",
              }),
            );
            setCurrentStep(2);
            navigate("/signup", { replace: true, state: { resumeStep: 2 } });
            return;
          }

          // Track Purchase event (Critical for Deduplication)
          if (typeof (window as any).fbq === "function") {
            (async () => {
              try {
                let userId = user?.id;
                if (!userId) {
                  const userResult = await getCurrentUser(undefined).unwrap();
                  userId = userResult?.id;
                }
                if (userId) {
                  (window as any).fbq(
                    "track",
                    "Purchase",
                    { value: 29.0, currency: "USD" },
                    { eventID: "sub_" + userId },
                  );
                }
              } catch (e) {
                console.error("Failed to track Purchase event", e);
              }
            })();
          }

          dispatch(
            showAlert({
              message:
                "Subscription activated. Let's finish setting up your profile.",
              severity: "success",
            }),
          );
          navigate("/setup", { replace: true });
        } catch (error: unknown) {
          dispatch(
            showAlert({
              message: extractErrorMessage(
                error,
                "Payment succeeded, but we couldn't verify subscription status. Please try again.",
              ),
              severity: "warning",
            }),
          );
          setCurrentStep(2);
          navigate("/signup", { replace: true, state: { resumeStep: 2 } });
        }
      })();
      return;
    }

    if (subscriptionStatus === "cancel") {
      dispatch(
        showAlert({
          message: "Subscription checkout was cancelled. Please try again.",
          severity: "error",
        }),
      );
      setCurrentStep(2);
      navigate("/signup", { replace: true, state: { resumeStep: 2 } });
    }
  }, [location.search]);

  const handleStep1Submit = async (data: Step1FormInputs) => {
    try {
      const PREFIX = "ravwork.link/";
      const username = data.username.startsWith(PREFIX)
        ? data.username.replace(PREFIX, "")
        : data.username;

      // If signup token already exists (user already registered), just advance
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

      const accessToken =
        result.tokens?.accessToken ||
        result.accessToken ||
        result.user?.accessToken;

      if (accessToken) {
        dispatch(setSignupToken(accessToken));
        setCurrentStep(2);
      }
    } catch (error: unknown) {
      dispatch(
        showAlert({
          message: extractErrorMessage(
            error,
            "Signup failed. Please try again.",
          ),
          severity: "error",
        }),
      );
    }
  };

  const handleStep2Submit = async (data: Step2FormInputs) => {
    try {
      setStep2Data(data);

      if (!hasAuthToken) {
        navigate("/login", { replace: true });
        return;
      }

      if (!data?.plan) {
        dispatch(
          showAlert({ message: "Please select a plan.", severity: "error" }),
        );
        return;
      }

      const origin = window.location.origin;
      const successUrl = `${origin}/signup?subscription=success`;
      const cancelUrl = `${origin}/signup?subscription=cancel`;

      const checkout = await createSubscriptionCheckout({
        planId: data.plan,
        successUrl,
        cancelUrl,
      }).unwrap();

      if (checkout?.checkoutUrl) {
        // Track InitiateCheckout before redirecting to Stripe
        if (typeof (window as any).fbq === "function") {
          (window as any).fbq("track", "InitiateCheckout", {
            value: 29.0,
            currency: "USD",
          });
        }
        window.location.href = checkout.checkoutUrl;
      } else {
        dispatch(
          showAlert({
            message: "Failed to start checkout. Please try again.",
            severity: "error",
          }),
        );
      }
    } catch (error: unknown) {
      // Handle "already subscribed" — skip straight to /setup
      const message = extractErrorMessage(
        error,
        "Failed to start checkout. Please try again.",
      );
      if (
        typeof message === "string" &&
        message.toLowerCase().includes("active subscription")
      ) {
        dispatch(
          showAlert({
            message:
              "You already have an active subscription. Let's finish setting up your profile.",
            severity: "success",
          }),
        );
        navigate("/setup", { replace: true });
        return;
      }
      dispatch(showAlert({ message, severity: "error" }));
    }
  };

  const handleBackClick = () => {
    dispatch(clearSignupToken());
    if (isLoggedIn) {
      dispatch(logoutUser());
    }
    setStep1Data(null);
    setStep2Data(null);
    navigate("/login");
  };

  const isSignupCompleted =
    !!signupToken || (isLoggedIn && (user?.profileStep || 0) >= 1);

  return (
    <SignupLayout showBackIcon={currentStep > 1} onBackClick={handleBackClick}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {currentStep === 1 && (
          <Step1
            onNext={handleStep1Submit}
            initialData={step1Data}
            onBack={handleBackClick}
            isSignupCompleted={isSignupCompleted}
            isLoading={isSigningUp}
          />
        )}
        {currentStep === 2 && (
          <Step2
            onNext={handleStep2Submit}
            initialData={step2Data}
            onBack={handleBackClick}
            isLoading={isCreatingCheckout || isPlansLoading}
            plans={subscriptionPlans}
          />
        )}
      </Box>
    </SignupLayout>
  );
}
