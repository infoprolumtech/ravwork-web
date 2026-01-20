import { useState, useMemo, useEffect, type JSX } from "react";
import { Box, Tabs, Tab, Stack, Typography, Dialog, DialogContent } from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import JobCard from "../../components/reusecard/JobCard";
import GlobalDialog from "../../components/dialog";
import JobDetailsModal from "../../components/jobs/JobDetailsModal";
import CompleteJobModal from "../../components/jobs/CompleteJobModal";
import DeclineJobModal from "../../components/jobs/DeclineJobModal";
import { useGetJobsQuery, useUpdateJobStatusMutation } from "../../rtk/endpoints/userApi";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import Pagination from "../../components/pagination/Pagination";
import JobsSkeleton from "../../components/skeletons/JobsSkeleton";


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

  // Memoize query parameters to ensure RTK Query properly tracks changes
  const queryParams = useMemo(
    () => ({
      status: currentStatus,
      page: currentPage,
      limit: 10,
    }),
    [currentStatus, currentPage]
  );

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tab]);

  // Fetch jobs based on selected tab
  // The query will automatically run when queryParams change or component mounts
  const { data: jobsData, isLoading, isFetching, error, refetch } = useGetJobsQuery(queryParams, {
    // Don't skip - let RTK Query handle the request and errors
    // If no token, it will return 401 and handle it appropriately
    refetchOnMountOrArgChange: true, // Ensure refetch when component mounts
  });

  // Ensure query runs when component first mounts
  useEffect(() => {
    // Trigger refetch on mount to ensure data is fresh
    refetch();
  }, []); // Empty dependency array - only run on mount (refetch is stable)



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
      <Box sx={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
        {/* Pills - Fixed Position */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "#FFFFFF",
            width: "100%",
            px: { xs: 1.5, md: 3 },
            pt: { xs: 1.5, md: 3 },
            pb: 2,
            mb: 2,
            boxSizing: "border-box",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              width: "100%",
              minHeight: "36px",
              height: "36px",
              maxHeight: "36px",
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTabs-flexContainer": {
                gap: 0,
                alignItems: "center",
                height: "36px",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: "36px",
                height: "36px",
                maxHeight: "36px",
                borderRadius: "20px",
                color: "#6C737F",
                minWidth: "auto",
                width: "auto",
                px: 2,
                py: 0,
                fontSize: "14px",
                fontWeight: 500,
                transition: "background-color 0.2s ease, color 0.2s ease",
                flexShrink: 0,
                marginRight: "8px",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              },
              "& .Mui-selected": {
                backgroundColor: "#D2E7FF !important",
                color: "#111927 !important",
                fontWeight: 600,
              },
            }}
          >
            <Tab label="Leads" />
            <Tab label="Completed" />
            <Tab label="Declined" />
          </Tabs>
        </Box>

        <Box sx={{ px: { xs: 1.5, md: 3 }, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
          <Box sx={{ minHeight: "200px" }}>
            {isLoading || isFetching ? (
              <JobsSkeleton />
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
                <Box sx={{ pb: 4 }}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={jobsData?.totalPages || 1}
                    onPageChange={setCurrentPage}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>

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
              pt: { xs: "20px", sm: 0 },
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
              pt: { xs: "20px", sm: 0 },
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
