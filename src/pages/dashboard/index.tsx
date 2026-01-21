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
  // CircularProgress,
  Skeleton,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import DashboardCard from "../../components/reusecard/DashboardCard";
import { useGetUserProfileQuery, useGetDashboardRequestsQuery, useGetDashboardStatsQuery } from "../../rtk/endpoints/userApi";
import { useGetServicesQuery } from "../../rtk/endpoints/serviceApi";
import { getCloudFrontUrl, calculateProfileComplete, getProfileUrl } from "../../utils/helper";
import ShareModal from "../../components/client/ShareModal";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import Pagination from "../../components/pagination/Pagination";
import GlobalDialog from "../../components/dialog";
import JobDetailsModal from "../../components/jobs/JobDetailsModal";
import { useNavigate } from "react-router-dom";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";




export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const formatNumber = (value: number | undefined) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value ?? 0);

  // Memoize query parameters to ensure RTK Query properly tracks changes
  const dashboardRequestsParams = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
    }),
    [currentPage]
  );

  const { data: profile, isLoading: isLoadingProfile } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true, // Ensure refetch when component mounts
  });

  const { data: dashboardRequestsData, isLoading: isLoadingRequests, isFetching: isFetchingRequests } = useGetDashboardRequestsQuery(dashboardRequestsParams, {
    refetchOnMountOrArgChange: true, // Ensure refetch when component mounts
  });

  const { data: dashboardStats, isLoading: isLoadingStats } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: servicesData } = useGetServicesQuery();

  // Note: Refetching on mount is handled by refetchOnMountOrArgChange: true in the hooks above.
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobDetailsModalOpen, setJobDetailsModalOpen] = useState(false);

  const hasServices = useMemo(() => {
    if (!servicesData) return false;
    if (Array.isArray(servicesData)) return servicesData.length > 0;
    return (servicesData.data && servicesData.data.length > 0) || false;
  }, [servicesData]);

  // Calculate profile completion
  const profileComplete = useMemo(() => {
    return calculateProfileComplete(profile || null, hasServices);
  }, [profile, hasServices]);

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
    // If name, image, and description are filled (contribution to 50% complete), 
    // and they haven't created a service yet, redirect to my services page.
    const profileOnlyCompletion = calculateProfileComplete(profile || null, false);

    if (profileOnlyCompletion >= 50 && !hasServices) {
      navigate("/services-offered");
    } else {
      // Otherwise go to profile to complete core fields
      navigate("/my-profile");
    }
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

  if (isLoadingProfile || isLoadingStats || isLoadingRequests) {
    return (
      <ServiceProviderLayout>
        <DashboardSkeleton />
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
        {profileComplete >= 50 ? (
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
                {profileComplete < 100 && (
                  <Button variant="dashboardbutton" onClick={handleCompleteSetup}>
                    Complete Setup
                  </Button>
                )}
              </Box>

              {/* Body */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  
                  sx={{ width: 74, height: 74 }}
                >
                  {!profilePhotoUrl}
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

                    <Box display="flex" gap={1} alignItems="center">
                      <Button
                        onClick={handleCopyUrl}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: { xs: 0.375, sm: 0.5, md: 0.625 },
                          bgcolor: "#FFFFFF",
                          color: "#111927",
                          borderRadius: { xs: "14px", sm: "16px", md: "20px" },
                          px: { xs: 0.875, sm: 1.25, md: 1.5 },
                          py: { xs: 0.375, sm: 0.5, md: 0.625 },
                          minHeight: { xs: "24px", sm: "28px", md: "32px" },
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: { xs: "11px", sm: "12px", md: "13px" },
                          lineHeight: 1.2,
                          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
                          border: "none",
                          cursor: "pointer",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                          "&:hover": {
                            bgcolor: "#F9FAFB",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.08)",
                          },
                          "&:active": {
                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08)",
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src="./assets/icons/copy.svg"
                          alt="copy"
                          sx={{
                            width: { xs: 12, sm: 13, md: 14 },
                            height: { xs: 12, sm: 13, md: 14 },
                            flexShrink: 0,
                          }}
                        />
                        <Box component="span" sx={{ fontWeight: 600 }}>
                          Copy Link
                        </Box>
                      </Button>
                      <Box
                        onClick={handleShareClick}
                        sx={{
                          width: { xs: 24, sm: 28, md: 32 },
                          height: { xs: 24, sm: 28, md: 32 },
                          bgcolor: "#fff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                          "&:hover": {
                            bgcolor: "#F9FAFB",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <img
                          src="./assets/icons/share-arrow.svg"
                          alt="share"
                          style={{
                            width: `${14}px`,
                            height: `${14}px`,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Progress for Welcome Card (50% - 99%) */}
              {profileComplete < 100 && (
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: "6px" }}>
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
                      fontSize: { xs: "12px", md: "20px" },
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
                      color: "#111927"
                    }}
                  >
                    Complete
                  </Typography>
                </Box>
              )}
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
                <Avatar
                  src={profilePhotoUrl }
                  sx={{
                    width: 44,
                    height: 44,
                   
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  
                </Avatar>

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
            label="Today's Clicks"
            value={isLoadingStats ? "..." : formatNumber(dashboardStats?.clicks?.today)}
            theme="theme1"
            backgroundColor="#E3F5FF"
            mobileLeftColor="#E3F5FF"
          />
          <DashboardCard
            icon="/assets/icons/mouse-square.svg"
            label="Clicks This Week"
            value={isLoadingStats ? "..." : formatNumber(dashboardStats?.clicks?.thisWeek)}
            theme="theme2"
            backgroundColor="#E3F5FF"
            mobileRightColor="#E5ECF6"
          />
          <DashboardCard
            icon="/assets/icons/mouse-square.svg"
            label="Clicks This Month"
            value={isLoadingStats ? "..." : formatNumber(dashboardStats?.clicks?.thisMonth)}
            theme="theme1"
            backgroundColor="#E3F5FF"
            mobileLeftColor="#E3F5FF"
          />
          <DashboardCard
            icon="/assets/icons/user-check.svg"
            label="Today's Bookings"
            value={isLoadingStats ? "..." : formatNumber(dashboardStats?.bookings?.today)}
            theme="theme2"
            backgroundColor="#E5ECF6"
            mobileRightColor="#E5ECF6"
          />
          <DashboardCard
            icon="/assets/icons/user-check.svg"
            label="This Week's Bookings"
            value={isLoadingStats ? "..." : formatNumber(dashboardStats?.bookings?.thisWeek)}
            theme="theme1"
            backgroundColor="#E5ECF6"
            mobileLeftColor="#E3F5FF"
          />
          <DashboardCard
            icon="/assets/icons/user-check.svg"
            label="Bookings This Month"
            value={isLoadingStats ? "..." : formatNumber(dashboardStats?.bookings?.thisMonth)}
            theme="theme2"
            backgroundColor="#E5ECF6"
            mobileRightColor="#E5ECF6"
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
                  {isLoadingRequests || isFetchingRequests ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-row-${index}`}>
                        <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                        <TableCell align="center"><Skeleton variant="text" width="60%" sx={{ mx: "auto" }} /></TableCell>
                        <TableCell align="right"><Skeleton variant="text" width="80%" sx={{ ml: "auto" }} /></TableCell>
                      </TableRow>
                    ))
                  )
                    : recentJobs.length === 0 ? (
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
