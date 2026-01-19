import React, { useState, type JSX } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ServiceOfferedCard from "../../components/reusecard/ServiceOfferedCard";
import {
  useGetServicesQuery,
  useDeleteServiceMutation,
  type Service,
} from "../../rtk/endpoints/serviceApi";
import { showAlert } from "../../rtk/feature/alertSlice";
import { useAppDispatch } from "../../rtk/store";
import GlobalDialog from "../../components/dialog";
import CommonDialog from "../../components/dialog/dialog-content/CommonDialog";
import Pagination from "../../components/pagination/Pagination";
import { extractErrorMessage } from "../../utils/helper";



// Transform API Service to UI format
const transformServiceToUI = (service: Service) => {
  const contactMethodMap: Record<string, string> = {
    quick_contact: "Contact Method: Quick Contact",
    custom_form: "Contact Method: Custom Form",
  };

  const hasFormFields = service.formFields && service.formFields.length > 0;
  const contactMethodText = contactMethodMap[service.contactMethod] || "Contact Method: " + service.contactMethod;
  const finalContactMethod = hasFormFields
    ? `${contactMethodText} + Job Questions`
    : contactMethodText;

  return {
    id: service.id,
    title: service.name,
    description: service.description || "",
    price: service.price && service.price > 0 ? `$${service.price}` : "",
    contactMethod: finalContactMethod,
    iconColor: hasFormFields ? "#4693DD" : "#12B76A",
    iconType: (hasFormFields ? "document" : "lightning") as "lightning" | "document",
  };
};

export default function ServicesOfferedPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState<string | null>(null);

  // Memoize query parameters to ensure RTK Query properly tracks changes
  const queryParams = React.useMemo(
    () => ({
      page: currentPage,
      limit: 10,
    }),
    [currentPage]
  );

  // API hooks
  const { data: servicesResponse, isLoading, error, refetch } = useGetServicesQuery(queryParams, {
    refetchOnMountOrArgChange: true, // Ensure refetch when component mounts
  });

  // Ensure query runs when component first mounts
  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount (refetch is stable)
  const [deleteService, { isLoading: isDeletingService }] = useDeleteServiceMutation();

  // Transform services data - handle both paginated and non-paginated responses
  const services = React.useMemo(() => {
    if (!servicesResponse) return [];

    // Check if response is paginated (has data property)
    if ('data' in servicesResponse && Array.isArray(servicesResponse.data)) {
      return servicesResponse.data.map(transformServiceToUI);
    }

    // Non-paginated response (direct array)
    if (Array.isArray(servicesResponse)) {
      return servicesResponse.map(transformServiceToUI);
    }

    return [];
  }, [servicesResponse]);

  // Get pagination info if available
  const paginationData = React.useMemo(() => {
    if (!servicesResponse) {
      return { totalPages: 1 };
    }

    // Check if response is paginated (has data property with array and totalPages)
    if ('data' in servicesResponse && Array.isArray(servicesResponse.data) && 'totalPages' in servicesResponse) {
      const paginatedResponse = servicesResponse as { totalPages: number; total?: number; limit?: number };
      return {
        totalPages: paginatedResponse.totalPages || 1,
      };
    }

    // Check if response has totalPages directly (paginated structure)
    if ('totalPages' in servicesResponse) {
      const paginatedResponse = servicesResponse as { totalPages: number; total?: number; limit?: number };
      return {
        totalPages: paginatedResponse.totalPages || 1,
      };
    }

    // If we have total and limit, calculate totalPages
    if ('total' in servicesResponse && 'limit' in servicesResponse) {
      const paginatedResponse = servicesResponse as { total: number; limit: number };
      return {
        totalPages: Math.ceil(paginatedResponse.total / paginatedResponse.limit) || 1,
      };
    }

    // Non-paginated response (direct array) - default to 1 page
    // Since we're sending page/limit params, assume at least 1 page
    return { totalPages: 1 };
  }, [servicesResponse]);

  const handleAddService = () => {
    navigate("/services-offered/add-new-service");
  };

  const handleEditService = (id: string) => {
    navigate(`/services-offered/edit/${id}`);
  };

  // Open delete confirmation dialog
  const handleDeleteService = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete).unwrap();
      dispatch(showAlert({ message: "Service deleted successfully", severity: "success" }));
      refetch();
      handleCloseDeleteDialog();
    } catch (error: any) {
      dispatch(showAlert({
        message: extractErrorMessage(error, "Failed to delete service"),
        severity: "error"
      }));
    }
  };

  return (
    <ServiceProviderLayout>
      <Box sx={{
        p: { xs: 1.5, md: 3 },
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        minHeight: "100%",
        backgroundColor: "transparent"
      }}>
        {/* Add New Service Section */}
        <Card
          onClick={handleAddService}
          sx={{
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: "16px", md: "32px" },
            border: "1px dashed #2D2D2D",
            backgroundColor: "transparent",
            boxShadow: "none",
            cursor: "pointer",
            display: "flex",
            height: { xs: "48px", md: "56px" },
            padding: { xs: "10px 12px", md: "12px 14px" },
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            alignSelf: "stretch",
            width: "100%",
            "&:hover": {
              backgroundColor: "#F9FAFB",
              borderColor: "#2D2D2D",
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ color: "#2D2D2D" }}
          >
            <Add sx={{ fontSize: { xs: 18, md: 20 } }} />
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                fontWeight: 500,
                color: "#2D2D2D",
              }}
            >
              Add New Service
            </Typography>
          </Stack>
        </Card>

        {/* Your Services Section */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#111927",
            mb: { xs: 1.5, md: 2 },
            fontSize: { xs: "16px", md: "20px" },
          }}
        >
          Your services
        </Typography>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load services. Please try again.
          </Alert>
        )}

        {/* Services List */}
        {!isLoading && !error && (
          <>
            <Stack spacing={{ xs: 1.5, md: 2 }}>
              {services.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6C737F",
                    textAlign: "center",
                    py: 4,
                  }}
                >
                  No services yet. Click "Add New Service" to get started.
                </Typography>
              ) : (
                services.map((service) => (
                  <ServiceOfferedCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    description={service.description}
                    price={service.price}
                    contactMethod={service.contactMethod}
                    iconType={service.iconType}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                  />
                ))
              )}
            </Stack>

            {/* Pagination - Show when there are services */}
            {services.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <GlobalDialog
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        component={
          <CommonDialog
            handleCancel={handleCloseDeleteDialog}
            title="Delete Service"
            subTitle="Are you sure you want to delete this service? This action cannot be undone."
            handleConfirm={handleConfirmDelete}
            confirmText={isDeletingService ? "Deleting..." : "Delete"}
            confirmDisabled={isDeletingService}
          />
        }
      />
    </ServiceProviderLayout>
  );
}

