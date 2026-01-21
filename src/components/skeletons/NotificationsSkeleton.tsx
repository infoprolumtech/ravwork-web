import { Box, Card, Stack, Skeleton } from "@mui/material";

export default function NotificationsSkeleton() {
  return (
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
        {/* Title Skeleton */}
        <Box sx={{ px: { xs: 2, md: 2.5 }, py: 2 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ fontSize: "24px" }} />
        </Box>

        {/* Toggles Skeleton */}
        <Stack spacing={0} sx={{ px: { xs: 2, md: 2.5 }, py: 1 }}>
          {/* Email Toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1,
            }}
          >
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="rectangular" width={58} height={38} sx={{ borderRadius: "19px" }} />
          </Box>

          {/* SMS Toggle */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1,
            }}
          >
            <Skeleton variant="text" width={60} height={24} />
            <Skeleton variant="rectangular" width={58} height={38} sx={{ borderRadius: "19px" }} />
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}

