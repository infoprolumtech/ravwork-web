import { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import DashboardCard from "../../components/reusecard/DashboardCard";
import { useGetUserProfileQuery, useGetDashboardRequestsQuery } from "../../rtk/endpoints/userApi";
import { getCloudFrontUrl } from "../../utils/helper";
import ShareModal from "../client/components/ShareModal";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import Pagination from "../../components/pagination/Pagination";
import GlobalDialog from "../../components/dialog";
import JobDetailsModal from "../my-jobs/components/JobDetailsModal";

// Helper function to get profile URL dynamically
const getProfileUrl = (username: string) => {
  return `${window.location.origin}/${username}`;
};

// Calculate profile completion percentage
const calculateProfileComplete = (profile: any): number => {
  if (!profile) return 0;
  
  const fields = [
    profile.displayName,
    profile.businessDescription,
    profile.profilePhoto,
    profile.instagramUrl,
    profile.facebookUrl,
    profile.linkedinUrl,
  ];
  
  const filledFields = fields.filter((field) => field && field.trim() !== "").length;
  return Math.round((filledFields / fields.length) * 100);
};

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: profile, isLoading: isLoadingProfile } = useGetUserProfileQuery();
  const { data: dashboardRequestsData, isLoading: isLoadingRequests } = useGetDashboardRequestsQuery({ 
    page: currentPage,
    limit: 10 
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobDetailsModalOpen, setJobDetailsModalOpen] = useState(false);

  // Calculate profile completion
  const profileComplete = useMemo(() => {
    return calculateProfileComplete(profile);
  }, [profile]);

  // Get profile URL
  const profileUrl = useMemo(() => {
    if (!profile?.username) return "";
    return getProfileUrl(profile.username);
  }, [profile]);

  const handleCopyUrl = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    dispatch(showAlert({ message: "Copied!", severity: "success" }));
  };

  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleCompleteSetup = () => {
    // Navigate to profile page
    window.location.href = "/my-profile";
  };

  // Transform dashboard requests data for Recent Activity table
  const recentJobs = useMemo(() => {
    if (!dashboardRequestsData?.data) return [];
    return dashboardRequestsData.data.map((request) => ({
      id: request.id,
      name: request.clientName || "N/A",
      jobType: request.serviceName || (request.type === "inquiry" ? "Inquiry" : "Booking"),
      dateTime: request.bookingDate && request.bookingTime
        ? `${new Date(request.bookingDate).toLocaleDateString()} • ${request.bookingTime}`
        : request.createdAt
        ? new Date(request.createdAt).toLocaleString()
        : "No Date Available",
    }));
  }, [dashboardRequestsData]);

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setJobDetailsModalOpen(true);
  };

  const handleCloseJobDetailsModal = () => {
    setJobDetailsModalOpen(false);
    setSelectedJobId(null);
  };

  // Get profile photo URL
  const profilePhotoUrl = useMemo(() => {
    if (!profile?.profilePhoto) return undefined;
    return getCloudFrontUrl(profile.profilePhoto);
  }, [profile]);

  if (isLoadingProfile) {
    return (
      <ServiceProviderLayout>
        <Box
          sx={{
            p: { xs: 1.5, md: 3 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </ServiceProviderLayout>
    );
  }

  return (
    <ServiceProviderLayout>
      <Box
        sx={{
          p: { xs: 1.5, md: 3 },
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Complete Setup Banner */}
        {profileComplete > 90 ? (
          /* ===== COMPLETED PROFILE CARD ===== */
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: 1,
              bgcolor: "#D2E7FF",
            }}
          >
            <CardContent sx={{ py: 2 }}>
              {/* Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography fontWeight={600} fontSize={14} color="#111927">
                  Welcome back!
                </Typography>
                <Button variant="dashboardbutton" onClick={handleCompleteSetup}>
                  Complete Setup
                </Button>
              </Box>

              {/* Body */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={profilePhotoUrl || "./assets/images/avatar.png"}
                  sx={{ width: 74, height: 74 }}
                >
                  {!profilePhotoUrl && profile?.username?.[0]?.toUpperCase()}
                </Avatar>

                <Box flex={1} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography fontWeight={600} fontSize={18} color="#111927">
                    {profile?.displayName || profile?.username || "Full Name Goes Here"}
                  </Typography>
                  <img src="./assets/icons/line.svg" alt="" height={"2px"} width={"27px"} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: 1,
                      maxWidth: "100%",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: { xs: "100%", sm: 260 },
                        overflow: { xs: "visible", sm: "hidden" },
                        textOverflow: { sm: "ellipsis" },
                        whiteSpace: { xs: "normal", sm: "nowrap" },
                        wordBreak: "break-all",
                        color: "#111927",
                      }}
                    >
                      {profileUrl || "https://rawwork.com/p/username"}
                    </Typography>

                    <Box display="flex" gap={0.5}>
                      <Box
                        onClick={handleCopyUrl}
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "#fff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <img src="./assets/icons/copy.svg" alt="copy" />
                      </Box>
                        <Box
                        onClick={handleShareClick}
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                        <img src="./assets/icons/share-arrow.svg" alt="share" />
                        </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ) : (
          /* ===== INCOMPLETE PROFILE CARD ===== */
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
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src="./assets/icons/User.svg" alt="" />
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Box>
                        <Typography
                          fontWeight={600}
                          fontSize={14}
                          lineHeight="20px"
                          letterSpacing="0%"
                        >
                          Complete Setup.
                        </Typography>

                        <Typography
                          fontWeight={400}
                          fontSize={10}
                          lineHeight="20px"
                          letterSpacing="0%"
                        >
                          Get more clients with a complete profile.
                        </Typography>
                      </Box>
                    </Box>

                    <Button variant="dashboardbutton" onClick={handleCompleteSetup}>
                      Complete profile
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Progress */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: { xs: "12px", md: "20px" }, // small: 12px, desktop: 20px
                    lineHeight: "36px",
                    letterSpacing: "0%",
                  }}
                >
                  {profileComplete}%
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "20px",
                    letterSpacing: "0%",
                    verticalAlign: "bottom",
                    ml: 0.5,
                  }}
                >
                  Complete
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards - Row 1: Clicks */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
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
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: "#111927" }}
            >
              Recent Activity
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#384250", textAlign: "left" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#384250", textAlign: "center" }}>
                      Job Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#384250", textAlign: "right" }}>
                      Date & Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingRequests ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : recentJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography color="text.secondary">
                          No recent activity
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentJobs.map((job, index) => (
                    <TableRow
                      key={index}
                        onClick={() => handleJobClick(job.id)}
                        sx={{
                          "&:hover": { backgroundColor: "#F3F4F6", cursor: "pointer" },
                          cursor: "pointer",
                        }}
                    >
                        <TableCell sx={{ color: "#384250", textAlign: "left" }}>{job.name}</TableCell>
                        <TableCell sx={{ color: "#384250", textAlign: "center" }}>{job.jobType}</TableCell>
                        <TableCell sx={{ color: "#384250", textAlign: "right" }}>{job.dateTime}</TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={dashboardRequestsData?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>

        {/* Share Modal */}
        {profile?.username && (
          <ShareModal
            open={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            profileUrl={profileUrl}
            profileName={profile?.displayName || profile?.username || ""}
          />
        )}

        {/* Job Details Modal */}
        <GlobalDialog
          open={jobDetailsModalOpen}
          handleClose={handleCloseJobDetailsModal}
          component={<JobDetailsModal jobId={selectedJobId} onClose={handleCloseJobDetailsModal} />}
          hideWarningLine={true}
        />
      </Box>
    </ServiceProviderLayout>
  );
}
