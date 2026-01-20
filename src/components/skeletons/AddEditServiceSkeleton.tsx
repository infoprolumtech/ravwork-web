import { Box, Card, Skeleton, Stack } from "@mui/material";

export default function AddEditServiceSkeleton() {
    return (
        <Box
            sx={{
                p: { xs: 1.5, md: 3 },
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            {/* Header Skeleton */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: { xs: 2, md: 3 } }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={200} height={32} />
            </Stack>

            {/* Form Content Skeleton */}
            <Card
                sx={{
                    p: { xs: 2, md: 4 },
                    borderRadius: { xs: "16px", md: "32px" },
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#FFFFFF",
                    minHeight: "400px",
                }}
            >
                <Stack spacing={4}>
                    <Box>
                        <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                    </Box>
                    <Box>
                        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
                    </Box>
                    <Box>
                        <Skeleton variant="text" width="25%" height={24} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                    </Box>
                    <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
                        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: "50px" }} />
                        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: "50px" }} />
                    </Box>
                </Stack>
            </Card>
        </Box>
    );
}
