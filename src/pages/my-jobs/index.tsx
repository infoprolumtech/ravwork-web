import { useState, useMemo, useEffect, type JSX } from "react";
import { Box, Tabs, Tab, Stack, CircularProgress, Typography, Dialog, DialogContent } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import JobCard from "../../components/reusecard/JobCard";
import GlobalDialog from "../../components/dialog";
import JobDetailsModal from "./components/JobDetailsModal";
import CompleteJobModal from "./components/CompleteJobModal";
import DeclineJobModal from "./components/DeclineJobModal";
import { useGetJobsQuery, useUpdateJobStatusMutation } from "../../rtk/endpoints/userApi";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import Pagination from "../../components/pagination/Pagination";

export default function MyJobsPage(): JSX.Element {
  const [tab, setTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [jobToUpdate, setJobToUpdate] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  
  const [updateJobStatus, { isLoading: isUpdatingJobStatus }] = useUpdateJobStatusMutation();

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

  const handleComplete = (jobId: string) => {
    setJobToUpdate(jobId);
    setCompleteDialogOpen(true);
  };

  const handleDecline = (jobId: string) => {
    setJobToUpdate(jobId);
    setDeclineDialogOpen(true);
  };

  const handleCompleteSubmit = async (data: { finalPrice?: number; priceNotes?: string }) => {
    if (!jobToUpdate) return;

    try {
      await updateJobStatus({
        id: jobToUpdate,
        body: {
          status: "completed",
          finalPrice: data.finalPrice,
          priceNotes: data.priceNotes,
        },
      }).unwrap();

      dispatch(showAlert({ message: "Job marked as complete", severity: "success" }));
      setCompleteDialogOpen(false);
      setJobToUpdate(null);
      refetch();
    } catch (error: any) {
      dispatch(
        showAlert({
          message: error?.data?.message || "Failed to update job status",
          severity: "error",
        })
      );
    }
  };

  const handleDeclineConfirm = async () => {
    if (!jobToUpdate) return;

    try {
      await updateJobStatus({
        id: jobToUpdate,
        body: {
          status: "declined",
        },
      }).unwrap();

      dispatch(showAlert({ message: "Job declined", severity: "success" }));
      setDeclineDialogOpen(false);
      setJobToUpdate(null);
      refetch();
    } catch (error: any) {
      dispatch(
        showAlert({
          message: error?.data?.message || "Failed to decline job",
          severity: "error",
        })
      );
    }
  };

  const handleCloseCompleteDialog = () => {
    if (!isUpdatingJobStatus) {
      setCompleteDialogOpen(false);
      setJobToUpdate(null);
    }
  };

  const handleCloseDeclineDialog = () => {
    if (!isUpdatingJobStatus) {
      setDeclineDialogOpen(false);
      setJobToUpdate(null);
    }
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

        {/* Complete Job Dialog */}
        <Dialog
          open={completeDialogOpen}
          onClose={handleCloseCompleteDialog}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiPaper-root": {
              width: { xs: "100%", sm: "600px" },
              maxWidth: { xs: "100%", sm: "600px" },
              minWidth: { xs: "100%", sm: "600px" },
              margin: { xs: 0, sm: "auto" },
              borderRadius: { xs: "0px", sm: "16px" },
              maxHeight: { xs: "100vh", sm: "90vh" },
              height: { xs: "100vh", sm: "auto" },
            },
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              height: { xs: "100%", sm: "auto" },
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <CompleteJobModal
              onClose={handleCloseCompleteDialog}
              onSubmit={handleCompleteSubmit}
              isSubmitting={isUpdatingJobStatus}
            />
          </DialogContent>
        </Dialog>

        {/* Decline Job Dialog */}
        <Dialog
          open={declineDialogOpen}
          onClose={handleCloseDeclineDialog}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiPaper-root": {
              width: { xs: "100%", sm: "600px" },
              maxWidth: { xs: "100%", sm: "600px" },
              minWidth: { xs: "100%", sm: "600px" },
              margin: { xs: 0, sm: "auto" },
              borderRadius: { xs: "0px", sm: "16px" },
              maxHeight: { xs: "100vh", sm: "90vh" },
              height: { xs: "100vh", sm: "auto" },
            },
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              height: { xs: "100%", sm: "auto" },
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <DeclineJobModal
              onClose={handleCloseDeclineDialog}
              onConfirm={handleDeclineConfirm}
              isSubmitting={isUpdatingJobStatus}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </ServiceProviderLayout>
  );
}
