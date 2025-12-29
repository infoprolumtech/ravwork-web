import { type JSX } from "react";
import { Box, Typography } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";

export default function NotificationsPage(): JSX.Element {
  return (
    <ServiceProviderLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Notifications
        </Typography>
      </Box>
    </ServiceProviderLayout>
  );
}

