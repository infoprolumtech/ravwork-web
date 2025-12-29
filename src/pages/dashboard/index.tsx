import { Typography, Box, Card, CardContent, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button, Stack } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import DashboardCard from "../../components/reusecard/DashboardCard";

export default function Dashboard() {
  // Mock data - replace with actual API calls
  const profileComplete = 36; // percentage
  const jobsData = [
    { name: "Sarah Johnson", jobType: "New Request", dateTime: "Nov 22, 2025 • 10:00 AM" },
    { name: "Sarah Johnson", jobType: "Plumbing Repair", dateTime: "No Date Available" },
    { name: "Sarah Johnson", jobType: "Plumbing Repair", dateTime: "Nov 22, 2025 • 10:00 AM" },
  ];

  return (
    <ServiceProviderLayout>
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
            bgcolor: "#D2E7FF",
          }}
        >
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

              {/* Icon */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#F9FAFB",
                  borderRadius: "50%",
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="./assets/icons/User.svg" alt="" />
              </Box>
              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Box>
                    <Typography fontWeight={600} color="#111927">
                      Complete Setup.
                    </Typography>
                    <Typography variant="body2">
                      Get More Clients with a complete Profile.
                    </Typography>
                  </Box>

                  <Button variant="secondary">
                    Complete profile
                  </Button>
                </Box>
              </Box>
            </Box>
            {/* Progress */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={profileComplete}
                sx={{
                  flex: 1,
                  height: 16,
                  borderRadius: 4,
                  bgcolor: "#D1D5DB",
                  border: "4px solid #FFFFFF",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#BAEDBD",
                    borderRadius: 4,
                  },
                }}
              />
              <Typography fontWeight={600} minWidth={70}>
                {profileComplete}% Complete
              </Typography>
            </Box>
          </CardContent>
        </Card>


        {/* Statistics Cards - Row 1: Clicks */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <DashboardCard
            icon="/assets/icons/mouse-square.svg"
            label="Today’s Clicks"
            value="1,721k"
            theme="theme1"
          />
          <DashboardCard
            icon="/assets/icons/mouse-square.svg"
            label="Clicks This Week"
            value="367k"
            theme="theme2"
          />
          <DashboardCard
            icon="/assets/icons/mouse-square.svg"
            label="Clicks This Month"
            value="1,156"
            theme="theme1"
          />
          <DashboardCard
            icon="/assets/icons/user-check.svg"
            label="Today’s Bookings"
            value="721k"
            theme="theme2"
          />
          <DashboardCard
            icon="/assets/icons/user-check.svg"
            label="This Week’s Bookings"
            value="367k"
            theme="theme1"
          />
          <DashboardCard
            icon="/assets/icons/user-check.svg"
            label="Bookings This Month"
            value="1,156"
            theme="theme2"
          />
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
    </ServiceProviderLayout>
  );
}
