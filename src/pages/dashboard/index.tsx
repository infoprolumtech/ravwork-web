import { Typography, Box, Card, CardContent, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button, Stack } from "@mui/material";
import AdminLayout from "../../layouts/AdminLayout";

export default function Dashboard() {
  // Mock data - replace with actual API calls
  const profileComplete = 66; // percentage
  
  // Statistics data
  const statsData = {
    clicks: {
      today: "1,721K",
      thisWeek: "367K",
      thisMonth: "1,156"
    },
    bookings: {
      today: "721K",
      thisWeek: "367K",
      thisMonth: "1,156"
    }
  };

  const jobsData = [
    { name: "Sarah Johnson", jobType: "New Request", dateTime: "Nov 22, 2025 • 10:00 AM" },
    { name: "Sarah Johnson", jobType: "Plumbing Repair", dateTime: "No Date Available" },
    { name: "Sarah Johnson", jobType: "Plumbing Repair", dateTime: "Nov 22, 2025 • 10:00 AM" },
  ];

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        {/* Header Breadcrumb */}
        <Typography variant="body2" sx={{ color: "#6C737F", mb: 2 }}>
          Dashboards / Default
        </Typography>

        {/* Complete Setup Banner */}
        <Card 
          sx={{ 
            mb: 3, 
            borderRadius: 2, 
            boxShadow: 1,
            backgroundColor: "#E3F0F8",
            border: "none"
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600, color: "#111927" }}>
                  Complete Setup. Get More Clients with a complete Profile.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={profileComplete}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#D1D5DB",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        backgroundColor: "#0E6A37",
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#111927", minWidth: "60px" }}>
                    {profileComplete}% Complete
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#111927",
                  color: "#FFFFFF",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#384250",
                  },
                }}
              >
                Complete profile
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics Cards - Row 1: Clicks */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6C737F", mb: 1 }}>
                  Today's Clicks
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#111927" }}>
                  {statsData.clicks.today}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6C737F", mb: 1 }}>
                  Clicks This Week
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#111927" }}>
                  {statsData.clicks.thisWeek}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6C737F", mb: 1 }}>
                  Clicks This month
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#111927" }}>
                  {statsData.clicks.thisMonth}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistics Cards - Row 2: Bookings */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6C737F", mb: 1 }}>
                  Today's Bookings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#111927" }}>
                  {statsData.bookings.today}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6C737F", mb: 1 }}>
                  This Week's Bookings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#111927" }}>
                  {statsData.bookings.thisWeek}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" sx={{ color: "#6C737F", mb: 1 }}>
                  Bookings This Month
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#111927" }}>
                  {statsData.bookings.thisMonth}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity Table */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#111927" }}>
              Recent Activity
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#384250" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#384250" }}>Job Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#384250" }}>Date & Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobsData.map((job, index) => (
                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}>
                      <TableCell>{job.name}</TableCell>
                      <TableCell>{job.jobType}</TableCell>
                      <TableCell>{job.dateTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3, gap: 1 }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#D1D5DB",
                  color: "#384250",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 2,
                }}
              >
                ← Previous
              </Button>
              <Stack direction="row" spacing={0.5}>
                {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                  <Button
                    key={index}
                    variant={page === 1 ? "contained" : "outlined"}
                    sx={{
                      minWidth: "40px",
                      height: "40px",
                      borderColor: "#D1D5DB",
                      color: page === 1 ? "#FFFFFF" : "#384250",
                      backgroundColor: page === 1 ? "#111927" : "transparent",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: page === 1 ? "#384250" : "#F9FAFB",
                        borderColor: "#D1D5DB",
                      },
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </Stack>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#D1D5DB",
                  color: "#384250",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 2,
                }}
              >
                Next →
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  );
}
