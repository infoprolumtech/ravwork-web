import { type JSX } from "react";
import { Box, Typography } from "@mui/material";
import AdminLayout from "../../layouts/AdminLayout";

export default function NotificationsPage(): JSX.Element {
  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Notifications
        </Typography>
      </Box>
    </AdminLayout>
  );
}

