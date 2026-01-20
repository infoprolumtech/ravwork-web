import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

export function ProfileViewSkeleton() {
    return (
        <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%" }}>
            {/* Profile Header Card */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1, bgcolor: "#D2E7FF" }}>
                <CardContent sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Skeleton variant="text" width={60} height={20} />
                        <Skeleton variant="rectangular" width={100} height={28} sx={{ borderRadius: 1 }} />
                    </Box>

                    <Box gap={2}>
                        <Skeleton variant="circular" width={74} height={74} sx={{ border: "4px solid #FFFFFF" }} />
                        <Box flex={1} sx={{ mt: 1 }}>
                            <Skeleton variant="text" width={120} height={28} />
                            <Skeleton variant="text" width="40%" height={24} />
                        </Box>
                    </Box>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} marginTop={"14px"} justifyContent={"space-between"}>
                        {[1, 2, 3].map((i) => (
                            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Skeleton variant="circular" width={24} height={24} />
                                <Box>
                                    <Skeleton variant="text" width={100} height={20} />
                                    <Skeleton variant="text" width={60} height={16} />
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            {/* Business Details Card */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1, bgcolor: "#F7F9FB" }}>
                <CardContent sx={{ py: 2 }}>
                    <Skeleton variant="text" width={150} height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={100} height={24} sx={{ mt: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1, borderRadius: 1 }} />

                    <Box mt={2} display="flex" flexDirection="column" gap={1.2}>
                        {[1, 2, 3].map((i) => (
                            <Box key={i} display="flex" alignItems="center" gap={1}>
                                <Skeleton variant="circular" width={18} height={18} />
                                <Skeleton variant="text" width="30%" height={18} />
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export function ProfileEditSkeleton() {
    return (
        <Box sx={{ p: { xs: 2, md: 0 }, maxWidth: 900, mx: "auto", width: "100%" }}>
            {/* Header Skeleton */}
            <Box mb={3}>
                <CardContent sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Skeleton variant="text" width={60} height={20} />
                        <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Skeleton variant="circular" width={74} height={74} />
                        <Skeleton variant="rectangular" width={120} height={28} sx={{ borderRadius: 1 }} />
                    </Box>
                </CardContent>
            </Box>

            {/* Form Fields Skeletons */}
            {[1, 2, 3, 4].map((i) => (
                <Box key={i} mb={3} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
                    <Box width={"281px"} mb={{ xs: 1, sm: 0 }}>
                        <Skeleton variant="text" width={100} height={24} />
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: "100px", maxWidth: "493px" }} />
                </Box>
            ))}

            {/* Social URLs Skeletons */}
            <Box mb={3} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
                <Box width={"281px"} mb={{ xs: 1, sm: 0 }}>
                    <Skeleton variant="text" width={120} height={24} />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%", maxWidth: "493px" }}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rectangular" width="100%" height={48} sx={{ borderRadius: "100px" }} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
