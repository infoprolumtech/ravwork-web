import { Box, Stack, Skeleton, useTheme, useMediaQuery } from "@mui/material";

export default function CommonPageSkeleton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
      <Box mb={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header Skeleton */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2}
        >
          <Stack direction="row" alignItems="center" gap={1} mb={{ xs: 1, sm: 0 }}>
            <Skeleton variant="circular" width={36} height={36} /> {/* Back button */}
            <Skeleton variant="text" width={isMobile ? 140 : 200} height={36} /> {/* Title */}
            <Skeleton variant="rectangular" width={isMobile ? 60 : 80} height={28} /> {/* Status chip */}
          </Stack>
          <Stack direction="row" gap={1} width={{ xs: "100%", sm: "auto" }}>
            <Skeleton variant="rectangular" width={isMobile ? "100%" : 120} height={36} /> {/* Action button */}
            {!isMobile && <Skeleton variant="rectangular" width={120} height={36} />}
          </Stack>
        </Stack>

        {/* Controls Skeleton (Search, Filters, Bulk Actions) */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent={{ xs: "flex-start", sm: "flex-end" }}
          gap={isMobile ? 1 : 2}
        >
          <Skeleton variant="rectangular" width={isMobile ? "100%" : 200} height={36} /> {/* Search */}
          <Skeleton variant="rectangular" width={isMobile ? "100%" : 120} height={36} /> {/* Filter */}
          {!isMobile && <Skeleton variant="rectangular" width={120} height={36} />}
        </Stack>

        {/* Main Content Skeleton (Table) */}
        <Box mt={2}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={isMobile ? 220 : 400}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
  );
} 