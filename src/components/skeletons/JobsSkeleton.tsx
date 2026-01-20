import { Box, Card, Skeleton, Stack } from "@mui/material";

export function JobCardSkeleton() {
    return (
        <Card
            sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                bgcolor: "#F8FAFC",
                boxShadow: "none",
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={{ xs: 1.5, sm: 0 }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2 }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                >
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Skeleton variant="text" width={150} height={24} />
                        <Skeleton variant="text" width={200} height={20} sx={{ mt: 0.5 }} />
                    </Box>
                </Stack>
                <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}>
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 1 }} />
                </Box>
            </Stack>

            {/* Client Info Section Skeleton */}
            <Box
                sx={{
                    mt: 2,
                    bgcolor: "#FFFFFF",
                    borderRadius: 3,
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 1.5, sm: 2 },
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "flex-start" }}
                    justifyContent={{ xs: "flex-start", sm: "space-between" }}
                    spacing={{ xs: 2, sm: 1.5, md: 2 }}
                    sx={{
                        flexWrap: { xs: "nowrap", sm: "wrap", md: "nowrap" },
                        width: "100%",
                    }}
                >
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 1.5, md: 2 }, flex: 1 }}>
                        {[1, 2, 3].map((i) => (
                            <Box key={i} sx={{ display: "flex", gap: 1, minWidth: { xs: "100%", sm: "160px" } }}>
                                <Skeleton variant="circular" width={24} height={24} />
                                <Box>
                                    <Skeleton variant="text" width={100} height={20} />
                                    <Skeleton variant="text" width={60} height={16} />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1, mt: { xs: 1, sm: 0 } }} />
                </Stack>
            </Box>
        </Card>
    );
}

export default function JobsSkeleton() {
    return (
        <Stack spacing={2} sx={{ width: "100%" }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <JobCardSkeleton key={i} />
            ))}
        </Stack>
    );
}
