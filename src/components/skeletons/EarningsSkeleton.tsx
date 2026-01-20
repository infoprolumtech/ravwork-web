import { Box, Card, CardContent, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function EarningsSkeleton() {
    return (
        <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%" }}>
            {/* Earnings Cards Skeleton */}
            <Grid container spacing={{ xs: "8px", sm: "12px" }} sx={{ mb: { xs: "28px", sm: "20px" } }}>
                {[1, 2, 3].map((i) => (
                    <Grid key={i} size={{ xs: 12, sm: 4 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: "#E3F5FF",
                                height: "100%"
                            }}
                        >
                            <Stack spacing={2}>
                                <Skeleton variant="circular" width={32} height={32} />
                                <Skeleton variant="text" width="80%" height={20} />
                            </Stack>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                <Skeleton variant="text" width="40%" height={32} />
                                <Skeleton variant="text" width="20%" height={20} />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Date Pickers Skeleton */}
            <Stack direction="row" gap={1} mb="26px" alignItems="center">
                <Skeleton variant="rectangular" width="45%" height={56} sx={{ borderRadius: "100px" }} />
                <Skeleton variant="rectangular" width="45%" height={56} sx={{ borderRadius: "100px" }} />
                <Skeleton variant="circular" width={40} height={40} />
            </Stack>

            {/* Table Skeleton */}
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
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
