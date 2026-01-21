import { useEffect, useState, type JSX } from "react";
import { Box, Typography, Card, Stack, Switch } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";

export default function NotificationsPage(): JSX.Element {
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);
  const [smsEnabled, setSmsEnabled] = useState<boolean>(true);
  // Match the toggle used in service custom questions (Required toggle)
  const requiredToggleSx = {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#111927",
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#111927",
    },
  } as const;

  // Local-only persistence until backend preferences are available.
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("notifications.emailEnabled");
      const storedSms = localStorage.getItem("notifications.smsEnabled");
      if (storedEmail !== null) setEmailEnabled(storedEmail === "true");
      if (storedSms !== null) setSmsEnabled(storedSms === "true");
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("notifications.emailEnabled", String(emailEnabled));
      localStorage.setItem("notifications.smsEnabled", String(smsEnabled));
    } catch {
      // ignore storage errors
    }
  }, [emailEnabled, smsEnabled]);

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
              <Switch
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                inputProps={{ "aria-label": "Enable email notifications" }}
                sx={requiredToggleSx}
              />
            </Box>

            <Box
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
              <Switch
                checked={smsEnabled}
                onChange={(e) => setSmsEnabled(e.target.checked)}
                inputProps={{ "aria-label": "Enable SMS notifications" }}
                sx={requiredToggleSx}
              />
            </Box>
          </Stack>
        </Card>
      </Box>
    </ServiceProviderLayout>
  );
}

