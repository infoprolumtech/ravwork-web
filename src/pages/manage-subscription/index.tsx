import { type JSX } from "react";
import { Box, Typography } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";

export default function ManageSubscriptionPage(): JSX.Element {
  return (
    <ServiceProviderLayout>
      <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
        <Typography variant="h5" fontWeight={600}>
          Manage Subscription
        </Typography>
      </Box>
    </ServiceProviderLayout>
  );
}

