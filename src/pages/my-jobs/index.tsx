import { useState, useMemo, useEffect, type JSX } from "react";
import { Box, Tabs, Tab, Stack, CircularProgress, Typography } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import JobCard from "../../components/reusecard/JobCard";
import GlobalDialog from "../../components/dialog";
import JobDetailsModal from "./components/JobDetailsModal";
import { useGetJobsQuery } from "../../rtk/endpoints/userApi";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import Pagination from "../../components/pagination/Pagination";

export default function MyJobsPage(): JSX.Element {
  const [tab, setTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Map tab index to status
  const statusMap: Array<"pending" | "completed" | "declined" | undefined> = [
    "pending", // Leads
    "completed", // Completed
    "declined", // Declined
  ];

  const currentStatus = statusMap[tab];

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  // Fetch jobs based on selected tab
  const { data: jobsData, isLoading, error, refetch } = useGetJobsQuery({
    status: currentStatus,
    page: currentPage,
    limit: 10,
  });

  const jobs = jobsData?.data || [];

  // Transform API job data to JobCard props
  const transformedJobs = useMemo(() => {
    return jobs.map((job) => ({
      id: job.id,
      title: job.serviceName || "Service",
      description: job.bookingDate && job.bookingTime
        ? `Scheduled for ${new Date(job.bookingDate).toLocaleDateString()} at ${job.bookingTime}`
        : job.type === "inquiry"
        ? "Inquiry"
        : "Booking",
      clientName: job.clientName,
      clientEmail: job.clientEmail,
      clientPhone: job.clientPhone,
      originalPrice: job.originalPrice,
      createdAt: job.createdAt,
    }));
  }, [jobs]);

  const handleComplete = async (jobId: string) => {
    // TODO: Implement complete job API call
    console.log("Complete", jobId);
    dispatch(showAlert({ message: "Job marked as complete", severity: "success" }));
    refetch();
  };

  const handleDecline = async (jobId: string) => {
    // TODO: Implement decline job API call
    console.log("Decline", jobId);
    dispatch(showAlert({ message: "Job declined", severity: "success" }));
    refetch();
  };

  const handleViewDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedJobId(null);
  };

  return (
    <ServiceProviderLayout>
      <Box sx={{ p: { xs: 1.5, md: 3 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
        {/* Pills */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: 36,
              borderRadius: 20,
              color: "#6C737F",
            },
            "& .Mui-selected": {
              backgroundColor: "#D2E7FF",
              color: "#111927 !important",
            },
          }}
        >
          <Tab label="Leads" />
          <Tab label="Completed" />
          <Tab label="Declined" />
        </Tabs>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            <Typography color="error">
              Failed to load jobs. Please try again.
            </Typography>
          </Box>
        ) : transformedJobs.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
            <Typography color="text.secondary">
              No {currentStatus === "pending" ? "leads" : currentStatus === "completed" ? "completed" : "declined"} jobs found.
            </Typography>
          </Box>
        ) : (
          <>
        <Stack spacing={2}>
              {transformedJobs.map((job) => (
            <JobCard
              key={job.id}
                  title={job.title}
                  description={job.description}
                  clientName={job.clientName}
                  clientEmail={job.clientEmail}
                  clientPhone={job.clientPhone}
              showActions={tab === 0}
                  onComplete={() => handleComplete(job.id)}
                  onDecline={() => handleDecline(job.id)}
                  onViewDetails={() => handleViewDetails(job.id)}
            />
          ))}
        </Stack>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={jobsData?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Job Details Dialog */}
        <GlobalDialog
          open={detailsDialogOpen}
          handleClose={handleCloseDetailsDialog}
          component={<JobDetailsModal jobId={selectedJobId} onClose={handleCloseDetailsDialog} />}
          hideWarningLine={true}
        />
      </Box>
    </ServiceProviderLayout>
  );
}
