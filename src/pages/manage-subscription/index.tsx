import { type JSX, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import {
  useGetSubscriptionStatusQuery,
  useCancelSubscriptionMutation,
  useResumeSubscriptionMutation,
  useGetSubscriptionPlansQuery,
  useChangePlanMutation,
} from "../../rtk/endpoints/subscriptionApi";
import GlobalDialog from "../../components/dialog";
import CommonDialog from "../../components/dialog/dialog-content/CommonDialog";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import { extractErrorMessage } from "../../utils/helper";
import { Step2 } from "../../components/signup/Step2";
import type { Step2FormInputs } from "../../pages/signup/types";

const formatPrice = (price: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
};

export default function ManageSubscriptionPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [changePlanDialogOpen, setChangePlanDialogOpen] = useState(false);
  const [selectedPlanData, setSelectedPlanData] = useState<Step2FormInputs | null>(null);

  const { data: subscriptionStatus, isLoading, isError, refetch } = useGetSubscriptionStatusQuery();
  const { data: availablePlans = [] } = useGetSubscriptionPlansQuery();
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const [resumeSubscription, { isLoading: isResuming }] = useResumeSubscriptionMutation();
  const [changePlan, { isLoading: isChangingPlan }] = useChangePlanMutation();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const subscription = subscriptionStatus?.subscription;
  const plan = subscription?.plan;
  const hasSubscription = subscriptionStatus?.hasSubscription && subscription;
  const canCancel = hasSubscription && !subscription.cancelAtPeriodEnd && (subscription.status === "active" || subscription.status === "past_due");
  const canResume = hasSubscription && subscription.cancelAtPeriodEnd;
  const canChangePlan = hasSubscription && subscription.status === "active" && !subscription.cancelAtPeriodEnd;

  // Handle Stripe redirect after payment
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subscriptionStatus = searchParams.get("subscription");
    const upgradePriceId = searchParams.get("upgradePriceId");

    if (subscriptionStatus === "success") {
      // After Stripe success, apply/schedule plan change
      if (upgradePriceId) {
        changePlan({ priceId: upgradePriceId })
          .unwrap()
          .then(() => {
            dispatch(showAlert({ message: "Plan upgrade scheduled successfully!", severity: "success" }));
            refetch();
          })
          .catch((error: unknown) => {
            dispatch(showAlert({ message: extractErrorMessage(error, "Failed to apply plan change. Please try again."), severity: "error" }));
          })
          .finally(() => {
            // Clean up URL
            navigate("/manage-subscription", { replace: true });
          });
      } else {
        // If for some reason we don't have upgradePriceId, just refetch
        dispatch(showAlert({ message: "Payment completed. Refreshing subscription status...", severity: "success" }));
        refetch();
        navigate("/manage-subscription", { replace: true });
      }
    } else if (subscriptionStatus === "cancel") {
      dispatch(showAlert({ message: "Plan change was cancelled.", severity: "info" }));
      // Clean up URL
      navigate("/manage-subscription", { replace: true });
    }
  }, [location.search, dispatch, navigate, refetch, changePlan]);

  const handleCancelClick = () => {
    handleClose();
    setCancelDialogOpen(true);
  };

  const handleResumeClick = () => {
    handleClose();
    setResumeDialogOpen(true);
  };

  const handleChangePlanClick = () => {
    handleClose();
    setChangePlanDialogOpen(true);
    // Don't pre-select current plan - it will be disabled
    setSelectedPlanData(null);
  };

  const handleCancelConfirm = async () => {
    try {
      await cancelSubscription(undefined).unwrap();
      dispatch(showAlert({ message: "Subscription will be cancelled at the end of the current billing period.", severity: "success" }));
      setCancelDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      dispatch(showAlert({ message: extractErrorMessage(error, "Failed to cancel subscription. Please try again."), severity: "error" }));
    }
  };

  const handleResumeConfirm = async () => {
    try {
      await resumeSubscription(undefined).unwrap();
      dispatch(showAlert({ message: "Subscription has been resumed successfully.", severity: "success" }));
      setResumeDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      dispatch(showAlert({ message: extractErrorMessage(error, "Failed to resume subscription. Please try again."), severity: "error" }));
    }
  };

  const handleChangePlanSubmit = async (data: Step2FormInputs) => {
    if (!data.plan) {
      dispatch(showAlert({ message: "Please select a plan.", severity: "error" }));
      return;
    }

    // Don't allow selecting the current plan
    if (data.plan === plan?.id) {
      dispatch(showAlert({ message: "This is your current plan. Please select a different plan.", severity: "error" }));
      return;
    }

    // Find the selected plan to get its backend plan UUID (for checkout API)
    const selectedPlan = availablePlans.find((p) => p.id === data.plan);
    if (!selectedPlan) {
      dispatch(showAlert({ message: "Invalid plan selected. Please try again.", severity: "error" }));
      return;
    }

    // Prevent downgrades: if current plan is yearly, don't allow selecting monthly
    if (plan?.interval === "year" && selectedPlan.interval === "month") {
      dispatch(showAlert({ message: "Downgrades are not allowed. You can only upgrade your plan.", severity: "error" }));
      return;
    }

    // Verify this is an upgrade (monthly -> yearly)
    const isUpgrade = plan?.interval === "month" && selectedPlan.interval === "year";
    if (!isUpgrade && plan?.interval === selectedPlan.interval) {
      dispatch(showAlert({ message: "Please select a different plan to upgrade.", severity: "error" }));
      return;
    }

    try {
      // Directly call changePlan endpoint for upgrades
      await changePlan({
        priceId: selectedPlan.stripePriceId, // Use Stripe price ID for change-plan endpoint
      }).unwrap();

      // Close modal after successful upgrade scheduling
      setChangePlanDialogOpen(false);
      setSelectedPlanData(null);
      
      // Show success message indicating upgrade will start after current plan expires
      const currentPeriodEnd = subscription?.currentPeriodEnd 
        ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
        : "current billing period";
      dispatch(showAlert({ 
        message: `Upgrade scheduled successfully! Your plan will upgrade to ${selectedPlan.name} after your current plan expires on ${currentPeriodEnd}.`, 
        severity: "success" 
      }));
      
      // Refresh subscription status
      refetch();
    } catch (error: unknown) {
      dispatch(showAlert({ 
        message: extractErrorMessage(error, "Failed to schedule upgrade. Please try again."), 
        severity: "error" 
      }));
    }
  };

  if (isLoading) {
    return (
      <ServiceProviderLayout>
        <Box
          sx={{
            p: { xs: 1.5, md: 3 },
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </ServiceProviderLayout>
    );
  }

  if (isError || !hasSubscription) {
    return (
      <ServiceProviderLayout>
        <Box
          sx={{
            p: { xs: 1.5, md: 3 },
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: 1,
              bgcolor: "#F9FAFB",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography fontWeight={600} fontSize={20} color="#111927" mb={1}>
              No Active Subscription
            </Typography>
            <Typography fontSize={14} color="#6C737F">
              You don't have an active subscription. Please subscribe to a plan to continue.
            </Typography>
          </Card>
        </Box>
      </ServiceProviderLayout>
    );
  }

  const priceText = plan
    ? `${formatPrice(plan.price, plan.currency)} / ${plan.interval === "month" ? "Month" : "Year"}`
    : "N/A";
  const renewalDate = subscription.renewsOn || subscription.currentPeriodEnd
    ? (subscription.renewsOn || (subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : "N/A"))
    : "N/A";


  return (
    <ServiceProviderLayout>
      <Box
        sx={{
          p: { xs: 1.5, md: 3 },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: "#D2E7FF",
            display: "flex",
            position: "relative",
            minHeight: { xs: "calc(100vh - 154px)", md: "auto" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <CardContent sx={{ py: 2 }}>
            <Typography fontWeight={600} fontSize={32} color="#111927">
              {plan?.name || "N/A"}
            </Typography>
            <Typography fontWeight={600} fontSize={16} color="#6C737F" mt={1}>
              {priceText}
            </Typography>
            <Typography fontWeight={600} fontSize={16} color="#6C737F">
              Subscription Renews On: {renewalDate}
            </Typography>
            {subscription.status && (
              <Typography fontWeight={500} fontSize={14} color="#6C737F" mt={0.5}>
                Status: <span style={{ textTransform: "capitalize", color: subscription.status === "active" || subscription.status === "trialing" ? "#12B76A" : "#F97066" }}>{subscription.status}</span>
              </Typography>
            )}
            {subscription.cancelAtPeriodEnd && (
              <Typography fontWeight={500} fontSize={14} color="#F97066" mt={0.5}>
                Subscription will cancel at period end
              </Typography>
            )}

            <Box mt={2}>
              {plan?.features && plan.features.length > 0 ? (
                plan.features.map((feature, index) => (
                  <Box key={index} display="flex" alignItems="center">
                    <Box
                      component="img"
                      src="/assets/icons/check_icon_box.svg"
                      sx={{ width: 20, height: 20, mr: 1.5 }}
                    />
                    <Typography fontSize={14} color="#595959">
                      {feature}
                    </Typography>
                  </Box>
                ))
              ) : (
                // Fallback to default features if API doesn't provide them
                <>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src="/assets/icons/check_icon_box.svg"
                      sx={{ width: 20, height: 20, mr: 1.5 }}
                    />
                    <Typography fontSize={14} color="#595959">
                      Personalized booking link
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src="/assets/icons/check_icon_box.svg"
                      sx={{ width: 20, height: 20, mr: 1.5 }}
                    />
                    <Typography fontSize={14} color="#595959">
                      Full access to features
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src="/assets/icons/check_icon_box.svg"
                      sx={{ width: 20, height: 20, mr: 1.5 }}
                    />
                    <Typography fontSize={14} color="#595959">
                      Unlimited leads
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src="/assets/icons/check_icon_box.svg"
                      sx={{ width: 20, height: 20, mr: 1.5 }}
                    />
                    <Typography fontSize={14} color="#595959">
                      Unlimited custom questions
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      component="img"
                      src="/assets/icons/check_icon_box.svg"
                      sx={{ width: 20, height: 20, mr: 1.5 }}
                    />
                    <Typography fontSize={14} color="#595959">
                      Lead management dashboard
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </CardContent>

          <Box
            sx={{
              position: "absolute",
              top: { xs: 12, md: 16 },
              right: { xs: 12, md: 16 },
              zIndex: 1,
            }}
          >
            <Button
              variant="secondary"
              onClick={handleOpen}
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                width: 147,
                height: 44,
              }}
            >
              <IconButton size="small" disableRipple>
                <img src="/assets/icons/edit.svg" width="20" alt="edit" />
              </IconButton>
              Edit Plan
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 180,
                },
              }}
            >
              {canChangePlan && (
                <MenuItem
                  onClick={handleChangePlanClick}
                  sx={{
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                >
                  Change Plan
                </MenuItem>
              )}
              {canResume && (
                <MenuItem
                  onClick={handleResumeClick}
                  sx={{
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                >
                  Resume Subscription
                </MenuItem>
              )}
              {canCancel && (
                <MenuItem
                  onClick={handleCancelClick}
                  sx={{
                    fontWeight: 400,
                    fontSize: "16px",
                    color: "#F97066",
                  }}
                >
                  Cancel Subscription
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Card>
      </Box>

      {/* Cancel Subscription Dialog */}
      <GlobalDialog
        open={cancelDialogOpen}
        handleClose={() => setCancelDialogOpen(false)}
        component={
          <CommonDialog
            handleCancel={() => setCancelDialogOpen(false)}
            handleConfirm={handleCancelConfirm}
            title="Cancel Subscription"
            subTitle="Are you sure you want to cancel your subscription? It will remain active until the end of the current billing period."
            confirmText="Yes, Cancel"
            cancelText="No, Keep Subscription"
            confirmDisabled={isCancelling}
          />
        }
      />

      {/* Resume Subscription Dialog */}
      <GlobalDialog
        open={resumeDialogOpen}
        handleClose={() => setResumeDialogOpen(false)}
        component={
          <CommonDialog
            handleCancel={() => setResumeDialogOpen(false)}
            handleConfirm={handleResumeConfirm}
            title="Resume Subscription"
            subTitle="Are you sure you want to resume your subscription? It will continue after the current billing period."
            confirmText="Yes, Resume"
            cancelText="No, Cancel"
            confirmDisabled={isResuming}
          />
        }
      />

      {/* Change Plan Dialog - Using Step2 Component */}
      <Dialog
        open={changePlanDialogOpen}
        onClose={() => {
          setChangePlanDialogOpen(false);
          setSelectedPlanData(null);
        }}
        maxWidth="md"
        fullWidth
        fullScreen={false}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "32px" },
            maxWidth: { xs: "100%", sm: "600px", md: "600px", lg: "600px", xl: "600px" },
            width: { xs: "100%", sm: "600px", md: "600px", lg: "600px", xl: "600px" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            height: { xs: "100vh", sm: "auto" },
            m: { xs: 0, sm: "auto" },
            margin: { xs: 0, sm: "auto" },
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            height: { xs: "100%", sm: "auto" },
            minHeight: { xs: "100%", sm: "auto" },
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          <Box sx={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* Header with title and close button in same row */}
            <Box 
              sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: { xs: "flex-start", sm: "center" },
                mb: { xs: 1.5, sm: 2 },
                gap: { xs: 1, sm: 2 },
                flexWrap: "nowrap",
              }}
            >
              <Typography 
                variant="h5" 
                fontWeight={600} 
                sx={{ 
                  fontSize: { xs: "18px", sm: "24px" }, 
                  color: "#111927",
                  flex: 1,
                  minWidth: 0,
                  lineHeight: { xs: 1.3, sm: 1.2 },
                  pr: { xs: 1, sm: 0 },
                }}
              >
                Change your subscription plan
              </Typography>
              <IconButton
                onClick={() => {
                  setChangePlanDialogOpen(false);
                  setSelectedPlanData(null);
                }}
                sx={{
                  color: "#6C737F",
                  flexShrink: 0,
                  p: { xs: 0.75, sm: 1 },
                  "&:hover": { backgroundColor: "#F9FAFB" },
                }}
                size="small"
              >
                <Close sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
              </IconButton>
            </Box>

            {/* Step2 Component adapted for modal */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: { xs: "flex-start", sm: "center" }, minHeight: 0, overflowY: "auto" }}>
              <Step2
                onNext={handleChangePlanSubmit}
                initialData={selectedPlanData}
                onBack={() => {
                  setChangePlanDialogOpen(false);
                  setSelectedPlanData(null);
                }}
                isLoading={isChangingPlan}
                plans={availablePlans}
                hideBackIcon={true}
                hideProgressIndicator={true}
                hideTopIcon={true}
                hideTitle={true}
                currentPlanId={plan?.id}
                currentPlanInterval={plan?.interval}
                buttonText="Continue to Checkout"
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </ServiceProviderLayout>
  );
}
