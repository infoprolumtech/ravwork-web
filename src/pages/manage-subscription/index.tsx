import { type JSX, useState } from "react";
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
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import { useGetSubscriptionStatusQuery } from "../../rtk/endpoints/subscriptionApi";

const formatPrice = (price: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
};

export default function ManageSubscriptionPage(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { data: subscriptionStatus, isLoading, isError } = useGetSubscriptionStatusQuery();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const subscription = subscriptionStatus?.subscription;
  const plan = subscription?.plan;
  const hasSubscription = subscriptionStatus?.hasSubscription && subscription;

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
              <MenuItem
                onClick={handleClose}
                sx={{
                  fontWeight: 400,
                  fontSize: "16px",
                }}
              >
                Change Plan
              </MenuItem>

              <MenuItem
                onClick={handleClose}
                sx={{
                  fontWeight: 400,
                  fontSize: "16px",
                }}
              >
                Cancel Subscription
              </MenuItem>
            </Menu>
          </Box>
        </Card>
      </Box>
    </ServiceProviderLayout>
  );
}
