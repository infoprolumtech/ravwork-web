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
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";

export default function ManageSubscriptionPage(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            minHeight: { xs: "calc(100vh - 154px)", md: "auto" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <CardContent sx={{ py: 2 }}>
            <Typography fontWeight={600} fontSize={32} color="#111927">
              Monthly
            </Typography>
            <Typography fontWeight={600} fontSize={16} color="#6C737F" mt={1}>
              $15 / Month
            </Typography>
            <Typography fontWeight={600} fontSize={16} color="#6C737F">
              Subscription Renews On: MM/DD/YYYY
            </Typography>

            <Box mt={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box
                  component="img"
                  src="/assets/icons/check_icon_box.svg"
                  sx={{ width: 20, height: 20, mr: 1.5 }}
                />
                <Typography fontSize={14} color="#595959">
                  Create a clean Professional Booking Page
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Box
                  component="img"
                  src="/assets/icons/check_icon_box.svg"
                  sx={{ width: 20, height: 20, mr: 1.5 }}
                />
                <Typography fontSize={14} color="#595959">
                  Streamline client requests & info
                </Typography>
              </Box>
            </Box>
          </CardContent>

          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
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
