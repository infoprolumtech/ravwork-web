import { useEffect } from "react";
import { Box, Button, Typography, FormControl, FormControlLabel, RadioGroup, Chip, IconButton, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { colors } from "../../utils/constants";
import { ProgressIndicator } from "./ProgressIndicator";
import { step2Schema } from "../../pages/signup/validationSchemas";
import type { Step2FormInputs } from "../../pages/signup/types";
import type { SubscriptionPlan } from "../../types/subscription";
import CheckboxIcon from "../shared/CheckboxIcon";
import PageIcon from "../shared/PageIcon";
import Icon from "../shared/Icon";
import { pageTitleSx, bottomButtonContainerSx, backIconButtonSx, iconButtonSx } from "./commonStyles";

interface Step2Props {
  onNext: (data: Step2FormInputs) => void;
  initialData?: Step2FormInputs | null;
  onBack?: () => void;
  isLoading?: boolean;
  plans?: SubscriptionPlan[];
  // For Manage Subscription flow
  title?: string;
  hideBackIcon?: boolean;
  hideProgressIndicator?: boolean;
  hideTopIcon?: boolean;
  hideTitle?: boolean; // Hide title when rendered in modal (title shown in modal header instead)
  currentPlanId?: string; // ID of the current plan to disable
  currentPlanInterval?: "month" | "year"; // Current plan interval to prevent downgrades
  buttonText?: string;
}

const formatPrice = (price: number, currency: string) => {
  try {
    // Plans API returns price in major currency units (e.g., 29 USD)
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
};

export const Step2 = ({
  onNext,
  initialData,
  onBack,
  isLoading = false,
  plans = [],
  title,
  hideBackIcon = false,
  hideProgressIndicator = false,
  hideTopIcon = false,
  hideTitle = false,
  currentPlanId,
  currentPlanInterval,
  buttonText = "Next",
}: Step2Props) => {
  const form = useForm<Step2FormInputs>({
    resolver: yupResolver(step2Schema),
    defaultValues: initialData || { plan: "" },
  });

  // Update form values when initialData changes (when navigating back)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  // Backward compatibility: older persisted state used "monthly"/"yearly".
  // Once plans are loaded, map those to backend plan UUIDs.
  // Also, if we previously stored a Stripe price id ("price_..."), map it to the corresponding plan UUID.
  useEffect(() => {
    const current = form.getValues("plan");
    if (!current) return;

    const monthlyPlan = plans.find((p) => p.interval === "month");
    const yearlyPlan = plans.find((p) => p.interval === "year");

    // slug values
    if (current === "monthly" && monthlyPlan?.id) {
      form.setValue("plan", monthlyPlan.id, { shouldValidate: true });
      return;
    }
    if (current === "yearly" && yearlyPlan?.id) {
      form.setValue("plan", yearlyPlan.id, { shouldValidate: true });
      return;
    }

    // stripe price id values
    if (current.startsWith("price_")) {
      const matched = plans.find((p) => p.stripePriceId === current);
      if (matched?.id) {
        form.setValue("plan", matched.id, { shouldValidate: true });
      }
    }
  }, [plans, form]);

  const handleSubmit = (data: Step2FormInputs) => {
    onNext(data);
  };

  const handleBackClick = () => {
    // Use parent's navigation handler to stay within signup flow
    if (onBack) {
      onBack();
    }
  };

  const monthlyPlan = plans.find((p) => p.interval === "month");
  const yearlyPlan = plans.find((p) => p.interval === "year");
  const monthlyPlanId = monthlyPlan?.id;
  const yearlyPlanId = yearlyPlan?.id;

  const isCurrentPlan = (planId: string | undefined) => Boolean(currentPlanId && planId === currentPlanId);

  // Prevent downgrades: if current plan is yearly, disable monthly (downgrade)
  const isDowngrade = (planInterval: "month" | "year" | undefined) => {
    if (!currentPlanInterval) return false;
    // If current is yearly and trying to select monthly, that's a downgrade
    return currentPlanInterval === "year" && planInterval === "month";
  };

  const isMonthlyDisabled = Boolean(isCurrentPlan(monthlyPlanId) || isDowngrade("month"));
  const isYearlyDisabled = Boolean(isCurrentPlan(yearlyPlanId));

  // Check if selected plan is a downgrade or current plan
  const selectedPlanId = form.watch("plan");
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const isSelectedPlanDowngrade = selectedPlan ? isDowngrade(selectedPlan.interval) : false;
  const isSelectedPlanCurrent = Boolean(selectedPlanId && isCurrentPlan(selectedPlanId));
  const isButtonDisabled = form.formState.isSubmitting || isLoading || !selectedPlanId || isSelectedPlanDowngrade || isSelectedPlanCurrent;

  return (
    <Box width="100%" maxWidth={{ xs: "100%", sm: "527px" }} component="form" onSubmit={form.handleSubmit(handleSubmit)} sx={{ mx: "auto", position: "relative" }}>
      {/* Back Icon - Above progress bar for large screens */}
      {!hideBackIcon && (
        <Box sx={backIconButtonSx}>
          <IconButton onClick={handleBackClick} sx={iconButtonSx}>
            <Icon src="/assets/icons/back-arrow.svg" alt="back-arrow" size={24} />
          </IconButton>
        </Box>
      )}
      {!hideProgressIndicator && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 3 } }}>
          <ProgressIndicator currentStep={2} />
        </Box>
      )}

      {/* Icon above title */}
      {!hideTopIcon && <PageIcon iconSrc="/assets/icons/plan_icon.svg" iconAlt="icon" />}

      {!hideTitle && (
        <Typography variant="h5" textAlign="center" mb={{ xs: 5, sm: 5 }} sx={pageTitleSx}>
          {title ? (
            <span dangerouslySetInnerHTML={{ __html: title }} />
          ) : (
            <>
              Select plan to activate<br />your booking link.
            </>
          )}
        </Typography>
      )}

      {/* <Stack spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
          <Icon src="/assets/icons/Check icon.svg" alt="check" size={20} />
          <Typography variant="body2" sx={{ color: "#384250", fontSize: { xs: "14px", sm: "16px" } }}>
            Create a clean Professional Booking Page
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1 } }}>
          <Icon src="/assets/icons/Check icon.svg" alt="check" size={20} />
          <Typography variant="body2" sx={{ color: "#384250", fontSize: { xs: "14px", sm: "16px" } }}>
            Streamline client requests & info
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", mt: -1.5, mb: { xs: 2, sm: 3 } }}>
        <Icon src="/assets/icons/line2.svg" alt="divider" sx={{ width: "23px" }} />
      </Box> */}

      <Controller
        name="plan"
        control={form.control}
        render={({ field }) => (
          <FormControl fullWidth error={Boolean(form.formState.errors.plan)}>
            <RadioGroup {...field} sx={{ gap: 2 }}>
              <FormControlLabel
                value={monthlyPlanId || "monthly"}
                control={<Box sx={{ display: "none" }} />}
                onClick={() => monthlyPlanId && !isMonthlyDisabled && field.onChange(monthlyPlanId)}
                disabled={isMonthlyDisabled}
                label={
                  <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", gap: 2, opacity: isMonthlyDisabled ? 0.6 : 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600 }}>
                          {monthlyPlan?.name || "Monthly"}
                        </Typography>
                        {isCurrentPlan(monthlyPlanId) && (
                          <Chip
                            label="Current Plan"
                            size="small"
                            sx={{
                              backgroundColor: colors["Gray-900"],
                              borderRadius: "68px",
                              color: colors["Base-White"],
                              fontWeight: 600,
                              fontSize: { xs: "9px", sm: "10px" },
                              height: { xs: "18px", sm: "20px" },
                            }}
                          />
                        )}
                        {!isCurrentPlan(monthlyPlanId) && isDowngrade("month") && (
                          <Chip
                            label="Downgrade not allowed"
                            size="small"
                            sx={{
                              backgroundColor: colors["Gray-700"],
                              borderRadius: "68px",
                              color: colors["Base-White"],
                              fontWeight: 600,
                              fontSize: { xs: "9px", sm: "10px" },
                              height: { xs: "18px", sm: "20px" },
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: "flex", mt: -1 }}>
                        <Icon src="/assets/icons/line2.svg" alt="divider" sx={{ width: "23px" }} />
                      </Box>
                      <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 600, color: "#6C737F" }}>
                        {monthlyPlan ? `${formatPrice(monthlyPlan.price, monthlyPlan.currency)}/Month` : "Loading..."}
                      </Typography>
                    </Box>
                    <CheckboxIcon checked={Boolean(monthlyPlanId) && field.value === monthlyPlanId && !isMonthlyDisabled} />
                  </Box>
                }
                sx={{
                  border: isMonthlyDisabled ? "1px solid #9CA3AF" : "1px solid #D1D5DB",
                  borderRadius: { xs: "12px", sm: "17px" },
                  p: { xs: 1.5, sm: 2 },
                  width: "100%",
                  minHeight: { xs: "80px", sm: "91px" },
                  height: "auto",
                  margin: 0,
                  backgroundColor: isMonthlyDisabled ? "#F3F4F6" : "#E5ECF6",
                  "&:hover": { backgroundColor: isMonthlyDisabled ? "#F3F4F6" : "#E5ECF6" },
                  cursor: isMonthlyDisabled ? "not-allowed" : "pointer",
                  "& .MuiFormControlLabel-label": {
                    marginLeft: 0,
                    width: "100%",
                  },
                }}
              />

              <FormControlLabel
                value={yearlyPlanId || "yearly"}
                control={<Box sx={{ display: "none" }} />}
                onClick={() => yearlyPlanId && !isYearlyDisabled && field.onChange(yearlyPlanId)}
                disabled={isYearlyDisabled}
                label={
                  <Box sx={{ position: "relative", width: "100%", opacity: isYearlyDisabled ? 0.6 : 1 }}>
                    {!isYearlyDisabled && (
                      <Chip
                        label="Save 31%"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: { xs: -25, sm: -30 },
                          right: 0,
                          backgroundColor: "#BAEDBD",
                          borderRadius: "68px",
                          color: colors["Base-Dark"],
                          fontWeight: 600,
                          fontSize: { xs: "9px", sm: "10px" },
                          height: { xs: "18px", sm: "20px" },
                          zIndex: 1,
                        }}
                      />
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", mt: 1, gap: 2 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, fontWeight: 600 }}>
                            {yearlyPlan?.name || "Yearly"}
                          </Typography>
                          {isCurrentPlan(yearlyPlanId) && (
                            <Chip
                              label="Current Plan"
                              size="small"
                              sx={{
                                backgroundColor: colors["Gray-900"],
                                borderRadius: "68px",
                                color: colors["Base-White"],
                                fontWeight: 600,
                                fontSize: { xs: "9px", sm: "10px" },
                                height: { xs: "18px", sm: "20px" },
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: "flex", mt: -1 }}>
                          <Icon src="/assets/icons/line2.svg" alt="divider" sx={{ width: "23px" }} />
                        </Box>
                        <Typography sx={{ fontSize: { xs: "14px", sm: "16px" }, fontWeight: 600, color: "#6C737F" }}>
                          {yearlyPlan
                            ? `${formatPrice(yearlyPlan.price / 12, yearlyPlan.currency)}/month `
                            : "Loading... "}
                          <Typography component="span" sx={{ fontSize: { xs: "12px", sm: "14px" }, fontWeight: 400, color: "#6C737F" }}>
                            {yearlyPlan
                              ? `(${formatPrice(yearlyPlan.price, yearlyPlan.currency)} Billed Annually.)`
                              : ""}
                          </Typography>
                        </Typography>
                      </Box>
                      <CheckboxIcon checked={Boolean(yearlyPlanId) && field.value === yearlyPlanId && !isYearlyDisabled} />
                    </Box>
                  </Box>
                }
                sx={{
                  border: isYearlyDisabled ? "1px solid #9CA3AF" : "1px solid #D1D5DB",
                  borderRadius: { xs: "12px", sm: "17px" },
                  p: { xs: 1.5, sm: 2 },
                  width: "100%",
                  minHeight: { xs: "80px", sm: "91px" },
                  height: "auto",
                  margin: 0,
                  backgroundColor: isYearlyDisabled ? "#F3F4F6" : "#E3F5FF",
                  "&:hover": { backgroundColor: isYearlyDisabled ? "#F3F4F6" : "#E3F5FF" },
                  cursor: isYearlyDisabled ? "not-allowed" : "pointer",
                  "& .MuiFormControlLabel-label": {
                    marginLeft: 0,
                    width: "100%",
                  },
                }}
              />
            </RadioGroup>
            {form.formState.errors.plan && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {form.formState.errors.plan.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Box sx={bottomButtonContainerSx}>
        <Button
          fullWidth
          type="submit"
          variant="secondary"
          sx={{
            mt: { xs: 0, sm: 3 },
            height: { xs: "44px", sm: "48px" },
          }}
          disabled={isButtonDisabled}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : buttonText}
        </Button>
      </Box>
    </Box>
  );
};

