import { Box, Card, Skeleton, Stack, Container } from "@mui/material";

export default function ClientPageSkeleton() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
            }}
        >
            <Container maxWidth="md" sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Logo skeleton */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                </Box>

                {/* Profile Card Skeleton */}
                <Card sx={{ backgroundColor: "#D2E7FF", borderRadius: "16px", p: 3, mb: 4, boxShadow: "none" }}>
                    <Box display="flex" gap="28px">
                        <Skeleton
                            variant="circular"
                            sx={{
                                width: { xs: "0px", sm: "175px" },
                                height: { xs: "0px", sm: "175px" },
                                display: { xs: "none", sm: "flex" },
                                flexShrink: 0
                            }}
                        />
                        <Stack width="100%">
                            <Box display="flex" flexDirection={{ xs: "column-reverse", sm: "row" }} justifyContent="space-between" gap="8px">
                                <Box>
                                    <Skeleton variant="text" width={200} height={32} />
                                    <Skeleton variant="text" width={100} height={20} sx={{ mt: 1 }} />
                                    <Stack direction="row" spacing={1} mt={2}>
                                        <Skeleton variant="circular" width={32} height={32} />
                                        <Skeleton variant="circular" width={32} height={32} />
                                        <Skeleton variant="circular" width={32} height={32} />
                                    </Stack>
                                </Box>
                                <Box display="flex" gap={1} alignItems="flex-start">
                                    <Skeleton variant="circular" sx={{ width: "75px", height: "75px", display: { xs: "flex", sm: "none" } }} />
                                    <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: "50px" }} />
                                </Box>
                            </Box>
                            <Skeleton variant="text" width="100%" height={60} sx={{ mt: 2 }} />
                        </Stack>
                    </Box>
                </Card>

                {/* Services Grid Skeleton */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                        },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} sx={{ backgroundColor: "#F7F9FB", borderRadius: "12px", p: 2.5, boxShadow: "none", border: "1px solid #E5E7EB", height: "100%" }}>
                            <Stack spacing={2}>
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="text" width="70%" height={28} />
                                <Skeleton variant="text" width="100%" height={20} />
                                <Box sx={{ borderTop: "1px solid #ffffff", py: 1 }} />
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Skeleton variant="text" width="30%" height={40} />
                                    <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: "50px" }} />
                                </Box>
                            </Stack>
                        </Card>
                    ))}
                </Box>

                {/* Have a Question Section Skeleton */}
                <Card sx={{ backgroundColor: "#F7F9FB", borderRadius: "12px", p: 3, mb: 3, boxShadow: "none" }}>
                    <Stack spacing={2}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box flex={1}>
                                <Skeleton variant="text" width="40%" height={28} />
                                <Skeleton variant="text" width="60%" height={20} />
                            </Box>
                            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: "50px" }} />
                        </Box>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
}
