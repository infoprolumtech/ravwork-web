import { useEffect, useState, useRef, type JSX } from "react";
import { Box, Typography, Card, Stack, Switch, styled } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "../../rtk/endpoints/userApi";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import { extractErrorMessage } from "../../utils/helper";
import NotificationsSkeleton from "../../components/skeletons/NotificationsSkeleton";

// Styled Switch components with isolated styles - prevent any color changes
const EmailSwitch = styled(Switch)({
  "& .MuiSwitch-switchBase": {
    color: "#9CA3AF", // Gray when unchecked
    "&.Mui-checked": {
      color: "#111927 !important", // Black when checked - force with !important
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#111927 !important", // Black track when checked
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#D1D5DB", // Gray track when unchecked
  },
  // Prevent any hover/focus color changes
  "& .MuiSwitch-switchBase:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiSwitch-switchBase.Mui-checked:hover": {
    backgroundColor: "transparent",
    color: "#111927 !important",
  },
});

const SmsSwitch = styled(Switch)({
  "& .MuiSwitch-switchBase": {
    color: "#9CA3AF", // Gray when unchecked
    "&.Mui-checked": {
      color: "#111927 !important", // Black when checked - force with !important
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#111927 !important", // Black track when checked
    },
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#D1D5DB", // Gray track when unchecked
  },
  // Prevent any hover/focus color changes
  "& .MuiSwitch-switchBase:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiSwitch-switchBase.Mui-checked:hover": {
    backgroundColor: "transparent",
    color: "#111927 !important",
  },
});

export default function NotificationsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { data: preferences, isLoading, error } = useGetNotificationPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdating }] = useUpdateNotificationPreferencesMutation();

  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const [smsEnabled, setSmsEnabled] = useState<boolean>(true);

  // Sync state with API data when it loads (only on initial load, not on updates)
  const isInitialLoad = useRef(true);
  useEffect(() => {
    if (preferences && isInitialLoad.current) {
      setEmailEnabled(preferences.emailEnabled);
      setSmsEnabled(preferences.smsEnabled);
      isInitialLoad.current = false;
    }
  }, [preferences]);

  // Handle email toggle change
  const handleEmailToggle = async (checked: boolean) => {
    setEmailEnabled(checked);
    try {
      const result = await updatePreferences({ emailEnabled: checked }).unwrap();
      // Only update email state from API response, don't touch SMS
      if (result.emailEnabled !== undefined) {
        setEmailEnabled(result.emailEnabled);
      }
      dispatch(showAlert({ message: "Email notification preference updated", severity: "success" }));
    } catch (error: unknown) {
      // Revert on error
      setEmailEnabled(!checked);
      dispatch(showAlert({ message: extractErrorMessage(error, "Failed to update email preference"), severity: "error" }));
    }
  };

  // Handle SMS toggle change
  const handleSmsToggle = async (checked: boolean) => {
    setSmsEnabled(checked);
    try {
      const result = await updatePreferences({ smsEnabled: checked }).unwrap();
      // Only update SMS state from API response, don't touch email
      if (result.smsEnabled !== undefined) {
        setSmsEnabled(result.smsEnabled);
      }
      dispatch(showAlert({ message: "SMS notification preference updated", severity: "success" }));
    } catch (error: unknown) {
      // Revert on error
      setSmsEnabled(!checked);
      dispatch(showAlert({ message: extractErrorMessage(error, "Failed to update SMS preference"), severity: "error" }));
    }
  };

  if (isLoading) {
    return (
      <ServiceProviderLayout>
        <NotificationsSkeleton />
      </ServiceProviderLayout>
    );
  }

  if (error) {
    return (
      <ServiceProviderLayout>
        <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
          <Card
            elevation={0}
            sx={{
              mt: 2,
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: "16px", color: "#F97066" }}>
              Failed to load notification preferences. Please try again.
            </Typography>
          </Card>
        </Box>
      </ServiceProviderLayout>
    );
  }

  return (
    <ServiceProviderLayout>
      <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
        
        <Card
          elevation={0}
          sx={{
            mt: 2,
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: { xs: 2, md: 2.5 }, py: 2 }}>
            <Typography sx={{ fontSize: "24px", fontWeight: 600, color: "#111927" }}>
              Email and SMS
            </Typography>
            {/* <Typography sx={{ fontSize: "16px", color: "#6C737F", mt: 0.5 }}>
              Enable how you want to receive notifications.
            </Typography> */}
          </Box>

          <Stack spacing={0} sx={{ px: { xs: 2, md: 2.5 }, py: 1 }}>
            <Box
              id="email-toggle-container"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "#111927" }}>
                  Email
                </Typography>
                {/* <Typography sx={{ fontSize: "14px", color: "#6C737F" }}>
                  Booking updates, reminders, and account notifications.
                </Typography> */}
              </Box>
              <EmailSwitch
                checked={emailEnabled}
                onChange={(e) => handleEmailToggle(e.target.checked)}
                disabled={isUpdating}
                inputProps={{ "aria-label": "Enable email notifications" }}
              />
            </Box>

            <Box
              id="sms-toggle-container"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "#111927" }}>
                  SMS
                </Typography>
                {/* <Typography sx={{ fontSize: "14px", color: "#6C737F" }}>
                  Time-sensitive alerts via text message.
                </Typography> */}
              </Box>
              <SmsSwitch
                checked={smsEnabled}
                onChange={(e) => handleSmsToggle(e.target.checked)}
                disabled={isUpdating}
                inputProps={{ "aria-label": "Enable SMS notifications" }}
              />
            </Box>
          </Stack>
        </Card>
      </Box>
    </ServiceProviderLayout>
  );
}

