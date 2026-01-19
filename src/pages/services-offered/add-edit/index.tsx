import { useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import ServiceProviderLayout from "../../../layouts/ServiceProviderLayout";
import { ArrowBack } from "@mui/icons-material";
import ServiceDetailsPage, { type ServiceFormData } from "./ServiceDetailsPage";
import ContactMethodPage from "./ContactMethodPage";
import CustomQuestionsPage from "./CustomQuestionsPage";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useLazyGetServiceByIdQuery,
  type Service,
  type FormField,
  type CreateServiceRequest,
} from "../../../rtk/endpoints/serviceApi";
import { showAlert } from "../../../rtk/feature/alertSlice";
import { useAppSelector, useAppDispatch } from "../../../rtk/store";
import type { RootState } from "../../../rtk/store";
// decryptAES removed - contact info screen no longer used

type StepType = "service_details" | "contact_method" | "quick_contact" | "contact_info" | "contact_info_questions";

// Map form responseTime to API responseTime
// Maps "no_response_time" to null as per API requirements
const mapResponseTimeToAPI = (formResponseTime: string | null): "within_1_hour" | "within_24_hours" | "within_48_hours" | "flexible" | null => {
  if (!formResponseTime || formResponseTime === "" || formResponseTime === "no_response_time") {
    return null;
  }
  const mapping: Record<string, "within_1_hour" | "within_24_hours" | "within_48_hours" | "flexible"> = {
    "within_1_hour": "within_1_hour",
    "within_few_hours": "within_24_hours",
    "same_day": "within_24_hours",
    "within_24_hours": "within_24_hours",
  };
  return mapping[formResponseTime] || null;
};

// Map API responseTime to form responseTime
// Maps null from API to "no_response_time" for display in form
const mapResponseTimeFromAPI = (apiResponseTime: string | null): string | null => {
  if (!apiResponseTime || apiResponseTime === null) {
    return "no_response_time";
  }
  // Return as-is for valid values
  return apiResponseTime;
};

// Transform API FormFields to CustomQuestionData format
const transformFormFieldsToQuestions = (formFields: FormField[]): any[] => {
  return formFields
    .map((field) => ({
      question: field.label,
      answerType: field.fieldType === "select" ? "single_choice" :
        field.fieldType === "checkbox" ? "multiselect" :
          field.fieldType === "textarea" ? "long_text" :
            field.fieldType === "date" ? "date_time" :
              field.fieldType === "time" ? "date_time" :
                (field.fieldType === "images" || field.fieldType === "file") ? "image" : "short_text",
      options: field.options || [],
      label: field.label,
      fieldType: field.fieldType,
      placeholder: field.placeholder,
      isRequired: field.isRequired,
      sortOrder: field.sortOrder,
    }))
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)); // Sort by sortOrder
};

const transformQuestionsToFormFields = (questions: any[]): FormField[] => {
  // Map answerType (UI selection) to fieldType (API format)
  // UI Options → API fieldType:
  // - "Short Text" (short_text) → "text"
  // - "Long Text" (long_text) → "textarea"
  // - "Single choice (dropdown)" (single_choice) → "select"
  // - "Multichoice" (multiselect) → "checkbox"
  // - "Date & Time" (date_time) → "date"
  // - "Image Upload" (image) → "images"
  const mapAnswerTypeToFieldType = (answerType: string): string => {
    switch (answerType) {
      case "short_text": return "text";
      case "long_text": return "textarea";
      case "single_choice": return "select";
      case "multiselect": return "checkbox";
      case "date_time": return "date";
      case "date": return "date";
      case "time": return "time";
      case "image": return "images";
      default: return "text";
    }
  };

  return questions
    .map((q, index) => ({
      label: q.label || q.question || "",
      fieldType: q.fieldType || mapAnswerTypeToFieldType(q.answerType || "short_text"),
      placeholder: q.placeholder || "",
      options: q.options || [],
      isRequired: q.isRequired || false,
      sortOrder: q.sortOrder !== undefined ? q.sortOrder : index, // Use provided sortOrder or fallback to index
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder); // Sort by sortOrder before returning
};

export default function AddEditServicePage(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isEditMode = !!id;

  const [currentStep, setCurrentStep] = useState<StepType>("service_details");
  const [serviceData, setServiceData] = useState<ServiceFormData | null>(null);
  // Removed contactInfoData - no longer needed since contact info screen is skipped
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [createService, { isLoading: isCreatingService }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdatingService }] = useUpdateServiceMutation();
  const [getServiceById, { isLoading: isLoadingService }] = useLazyGetServiceByIdQuery();

  // Load service data if editing
  useEffect(() => {
    if (isEditMode && id) {
      const loadService = async () => {
        try {
          const response = await getServiceById(id).unwrap();

          const service = response;

          if (!service) {
            dispatch(showAlert({ message: "Service not found", severity: "error" }));
            navigate("/services-offered");
            return;
          }

          setEditingService(service);

          // Transform API service data to form data
          const formData: ServiceFormData = {
            serviceTitle: service.name,
            whatsIncluded: service.description || null,
            servicePrice: service.price != null ? service.price.toString() : null,
            responseTime: mapResponseTimeFromAPI(service.responseTime),
          };
          setServiceData(formData);

          // Contact info screen removed - no longer needed

          // Load questions data if editing
          if (service.formFields && service.formFields.length > 0) {
            const questions = transformFormFieldsToQuestions(service.formFields);
            setQuestionsData(questions);
          }

          // Determine initial step based on service type
          if (service.contactMethod === "custom_form" || (service.formFields && service.formFields.length > 0)) {
            setCurrentStep("service_details");
          } else if (service.contactMethod === "quick_contact") {
            setCurrentStep("service_details");
          }
        } catch (error: any) {
          const errorMessage = error?.data?.message || error?.message || "Failed to load service";
          dispatch(showAlert({ message: errorMessage, severity: "error" }));
          navigate("/services-offered");
        }
      };

      loadService();
    } else {
      // Contact info screen removed - no longer needed
    }
  }, [id, isEditMode, getServiceById, dispatch, navigate, user]);

  const handleBack = () => {
    // Navigate back one step in the flow
    switch (currentStep) {
      case "service_details":
        // If on first step, go back to services listing
        navigate("/services-offered");
        break;
      case "contact_method":
        // Go back to service details
        setCurrentStep("service_details");
        break;
      case "contact_info":
        // ContactInfoPage removed - go back to questions
        setCurrentStep("contact_info_questions");
        break;
      case "quick_contact":
        // QuickContactPage removed - go back appropriately
        if (editingService) {
          setCurrentStep("service_details");
        } else {
          setCurrentStep("contact_method");
        }
        break;
      case "contact_info_questions":
        // Go back to contact method (if new) or service details (if editing)
        if (editingService) {
          setCurrentStep("service_details");
        } else {
          setCurrentStep("contact_method");
        }
        break;
      default:
        navigate("/services-offered");
    }
  };

  const handleCancel = () => {
    navigate("/services-offered");
  };

  const handleServiceDetailsNext = (data: ServiceFormData) => {
    setServiceData(data);

    // If editing a service, skip contact method and go directly to the appropriate step
    if (editingService) {
      if (editingService.contactMethod === "custom_form" || (editingService.formFields && editingService.formFields.length > 0)) {
        setCurrentStep("contact_info_questions");
      } else if (editingService.contactMethod === "quick_contact") {
        // For quick_contact editing, we'll handle submit directly in ServiceDetailsPage
        // So we don't need to change step here
      } else {
        setCurrentStep("contact_info_questions");
      }
    } else {
      // For new services, show contact method selection
      setCurrentStep("contact_method");
    }
  };

  const handleQuickContactUpdateDirectly = async (data: ServiceFormData) => {
    // Handle quick_contact service update directly from ServiceDetailsPage
    if (!id) return;

    try {
      const requestBody: CreateServiceRequest = {
        name: data.serviceTitle,
        description: data.whatsIncluded,
        price: data.servicePrice && data.servicePrice.trim() ? parseFloat(data.servicePrice.replace(/[^0-9.]/g, "")) : null,
        responseTime: mapResponseTimeToAPI(data.responseTime),
        contactMethod: "quick_contact",
      };

      await updateService({ id, body: requestBody }).unwrap();
      dispatch(showAlert({ message: "Service updated successfully", severity: "success" }));
      navigate("/services-offered");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update service";
      dispatch(showAlert({ message: errorMessage, severity: "error" }));
    }
  };

  const handleContactMethodSelect = (method: "quick_contact" | "contact_info_questions") => {
    // This is only called for custom_form now (quick_contact is handled by onCreate in ContactMethodPage)
    if (method === "contact_info_questions") {
      setCurrentStep("contact_info_questions");
    }
  };

  const handleQuestionsNext = async (questions: any[]) => {
    setQuestionsData(questions);
    // Skip ContactInfoPage and directly submit
    if (!serviceData) return;
    await handleCustomFormSubmitDirectly(questions);
  };

  const handleCustomFormSubmitDirectly = async (questions: any[]) => {
    // Submit with questions, skipping contact info
    if (!serviceData) return;

    try {
      const formFields = transformQuestionsToFormFields(questions);
      const contactMethod: "quick_contact" | "custom_form" = "custom_form";

      const requestBody: CreateServiceRequest = {
        name: serviceData.serviceTitle,
        description: serviceData.whatsIncluded,
        price: serviceData.servicePrice && serviceData.servicePrice.trim() ? parseFloat(serviceData.servicePrice.replace(/[^0-9.]/g, "")) : null,
        responseTime: mapResponseTimeToAPI(serviceData.responseTime),
        contactMethod,
        formFields,
      };

      if (isEditMode && id) {
        await updateService({ id, body: requestBody }).unwrap();
        dispatch(showAlert({ message: "Service updated successfully", severity: "success" }));
      } else {
        await createService(requestBody).unwrap();
        dispatch(showAlert({ message: "Service created successfully", severity: "success" }));
      }

      navigate("/services-offered");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to save service";
      dispatch(showAlert({ message: errorMessage, severity: "error" }));
    }
  };

  const handleQuickContactSubmitDirectly = async () => {
    if (!serviceData) return;

    try {
      const requestBody: CreateServiceRequest = {
        name: serviceData.serviceTitle,
        description: serviceData.whatsIncluded,
        price: serviceData.servicePrice && serviceData.servicePrice.trim() ? parseFloat(serviceData.servicePrice.replace(/[^0-9.]/g, "")) : null,
        responseTime: mapResponseTimeToAPI(serviceData.responseTime),
        contactMethod: "quick_contact",
      };

      if (isEditMode && id) {
        await updateService({ id, body: requestBody }).unwrap();
        dispatch(showAlert({ message: "Service updated successfully", severity: "success" }));
      } else {
        await createService(requestBody).unwrap();
        dispatch(showAlert({ message: "Service created successfully", severity: "success" }));
      }

      navigate("/services-offered");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to save service";
      dispatch(showAlert({ message: errorMessage, severity: "error" }));
    }
  };

  const isSubmittingService = isCreatingService || isUpdatingService;

  if (isLoadingService) {
    return (
      <ServiceProviderLayout>
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          p: { xs: 2, md: 3 },
        }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ color: "#6C737F" }}>
              Loading service...
            </Typography>
          </Stack>
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
          minHeight: "100%",
          backgroundColor: "transparent",
        }}
      >
        {/* Header with Back Button */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: { xs: 2, md: 3 } }}>
          <Button
            onClick={handleBack}
            sx={{
              color: "#111927",
              minWidth: "auto",
              padding: "8px",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <ArrowBack />
          </Button>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#111927",
              fontSize: { xs: "18px", md: "24px" },
            }}
          >
            {isEditMode ? "Edit Service" : "Add New Service"}
          </Typography>
        </Stack>

        {/* Step Content */}
        <Card
          sx={{
            p: 0,
            borderRadius: { xs: "16px", md: "32px" },
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#FFFFFF",
            minHeight: "400px",
            overflow: "hidden",
          }}
        >
          {currentStep === "service_details" && (
            <ServiceDetailsPage
              onBack={handleBack}
              onCancel={handleCancel}
              onNext={handleServiceDetailsNext}
              initialData={serviceData}
              isEditMode={isEditMode}
              isQuickContact={editingService?.contactMethod === "quick_contact"}
              onSubmit={handleQuickContactUpdateDirectly}
              isSubmitting={isSubmittingService}
            />
          )}

          {currentStep === "contact_method" && (
            <ContactMethodPage
              onBack={handleBack}
              onCancel={handleCancel}
              onSelect={handleContactMethodSelect}
              onCreate={handleQuickContactSubmitDirectly}
              isEditMode={isEditMode}
            />
          )}

          {/* QuickContactPage removed - directly submit after selecting quick_contact method */}
          {currentStep === "quick_contact" && null}

          {currentStep === "contact_info_questions" && (
            <CustomQuestionsPage
              onBack={handleBack}
              onCancel={handleCancel}
              onSubmit={handleQuestionsNext}
              initialQuestions={editingService?.formFields ? transformFormFieldsToQuestions(editingService.formFields) : questionsData.length > 0 ? questionsData : null}
              isSubmitting={isSubmittingService}
              isEditMode={isEditMode}
            />
          )}

          {/* ContactInfoPage removed - directly submit after questions for custom_form */}
          {currentStep === "contact_info" && null}
        </Card>
      </Box>
    </ServiceProviderLayout>
  );
}

