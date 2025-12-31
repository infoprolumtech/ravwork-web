import { type JSX } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";

export default function ManageSubscriptionPage(): JSX.Element {
  return (
    <ServiceProviderLayout>
      <Box
        sx={{
          p: { xs: 1.5, md: 3 },
          width: "100%",
          maxWidth: "100%",
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
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <CardContent sx={{ py: 2 }}>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight={600} fontSize={32} color="#111927">
                Monthly
              </Typography>
            </Box>
            <img src="./assets/icons/line.svg" alt="" />
            <Box gap={2}>
              <Box flex={1}>
                <Typography fontWeight={600} fontSize={16} color="#6C737F">
                  $15/ Month
                </Typography>
                <Typography fontWeight={600} fontSize={16} color="#6C737F">
                  Subscription Renews On: MM/DD/YYYY
                </Typography>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <Box
                    component="img"
                    src="/assets/icons/check_icon_box.svg"
                    alt=""
                    sx={{
                      width: "20.59px",
                      height: "20.59px",
                      mr: "12px",
                    }}
                  />
                  <Typography fontWeight={500} fontSize={14} color="#595959">
                    Create a clean Professional Booking Page
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box
                    component="img"
                    src="/assets/icons/check_icon_box.svg"
                    alt=""
                    sx={{
                      width: "20.59px",
                      height: "20.59px",
                      mr: "12px",
                    }}
                  />
                  <Typography fontWeight={500} fontSize={14} color="#595959">
                    Streamline client requests & info
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <Button variant="secondary">
              <IconButton>
                <img src="/assets/icons/edit.svg" width={"20px"} />
              </IconButton>
              Edit Plan
            </Button>
          </Box>
        </Card>
      </Box>
    </ServiceProviderLayout>
  );
}
