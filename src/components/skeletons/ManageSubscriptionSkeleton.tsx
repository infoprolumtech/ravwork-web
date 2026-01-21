import { Box, Card, CardContent, Skeleton } from "@mui/material";

export default function ManageSubscriptionSkeleton() {
  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%", boxSizing: "border-box" }}>
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
        <CardContent sx={{ py: 2, flex: 1 }}>
          {/* Plan Name */}
          <Skeleton variant="text" width={200} height={40} sx={{ fontSize: "32px", mb: 1 }} />

          {/* Price */}
          <Skeleton variant="text" width={150} height={24} sx={{ fontSize: "16px", mb: 1 }} />

          {/* Renewal Date */}
          <Skeleton variant="text" width={250} height={24} sx={{ fontSize: "16px", mb: 1 }} />

          {/* Status */}
          <Skeleton variant="text" width={120} height={20} sx={{ fontSize: "14px", mb: 0.5 }} />

          {/* Features List */}
          <Box mt={2}>
            {[1, 2, 3, 4, 5].map((index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1.5 }} />
                <Skeleton variant="text" width={200} height={20} sx={{ fontSize: "14px" }} />
              </Box>
            ))}
          </Box>
        </CardContent>

        {/* Edit Plan Button Skeleton */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 12, md: 16 },
            right: { xs: 12, md: 16 },
            zIndex: 1,
          }}
        >
          <Skeleton variant="rectangular" width={147} height={44} sx={{ borderRadius: "8px" }} />
        </Box>
      </Card>
    </Box>
  );
}

