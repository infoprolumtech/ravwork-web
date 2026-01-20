import { Box, Card, CardContent, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function DashboardSkeleton() {
    return (
        <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%" }}>
            {/* Banner Skeleton */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1, bgcolor: "#D2E7FF" }}>
                <CardContent sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 1 }} />
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Skeleton variant="circular" width={74} height={74} />
                        <Box flex={1}>
                            <Skeleton variant="text" width="60%" height={28} />
                            <Skeleton variant="text" width="40%" height={20} />
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: "6px" }}>
                        <Skeleton variant="rectangular" width="100%" height={16} sx={{ borderRadius: 4 }} />
                        <Skeleton variant="text" width={40} height={36} />
                    </Box>
                </CardContent>
            </Card>

            {/* Stats Cards Skeleton */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Grid key={i} size={{ xs: 6, sm: 4, md: 4, lg: 4 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: i % 2 === 1 ? "#E3F5FF" : "#E5ECF6",
                                height: "100%"
                            }}
                        >
                            <Stack spacing={2}>
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="text" width="80%" height={20} />
                            </Stack>
                            <Skeleton variant="text" width="40%" height={32} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Table Skeleton */}
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                    <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                                    <TableCell><Skeleton variant="text" /></TableCell>
                                    <TableCell><Skeleton variant="text" /></TableCell>
                                    <TableCell><Skeleton variant="text" /></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                        <TableCell><Skeleton variant="text" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Skeleton variant="rectangular" width={200} height={32} />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
