import { Box, Card, Skeleton, Stack } from "@mui/material";

export function ServiceCardSkeleton() {
    return (
        <Card
            sx={{
                display: "flex",
                padding: { xs: "16px", md: "20px" },
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: { xs: "12px", md: "16px" },
                alignSelf: "stretch",
                borderRadius: "12px",
                background: "#F7F9FB",
                boxShadow: "none",
                width: "100%",
            }}
        >
            <Stack direction="column" spacing={{ xs: 1, md: 1.5 }} sx={{ width: "100%" }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={{ xs: 1, md: 2 }}
                    justifyContent="space-between"
                    sx={{ width: "100%" }}
                >
                    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 2 }} sx={{ flex: 1 }}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={24} />
                            <Skeleton variant="text" width="80%" height={20} />
                            <Skeleton variant="text" width="30%" height={28} />
                        </Box>
                    </Stack>
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                        <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                    </Box>
                </Stack>
                <Skeleton variant="text" width="40%" height={16} />
            </Stack>
        </Card>
    );
}

export default function ServicesSkeleton() {
    return (
        <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%" }}>
            {/* Add New Service Card Skeleton */}
            <Skeleton
                variant="rectangular"
                width="100%"
                height={56}
                sx={{ mb: 4, borderRadius: "32px" }}
            />

            <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />

            <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                    <ServiceCardSkeleton key={i} />
                ))}
            </Stack>
        </Box>
    );
}
