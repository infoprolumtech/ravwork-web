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
import QuickContactPage, { type QuickContactFormData } from "./QuickContactPage";
import ContactInfoPage, { type ContactInfoFormData } from "./ContactInfoPage";
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
import { useDispatch, useSelector } from "react-redux";
import { decryptAES } from "../../../utils/helper";

type StepType = "service_details" | "contact_method" | "quick_contact" | "contact_info" | "contact_info_questions";

// Map form responseTime to API responseTime
const mapResponseTimeToAPI = (formResponseTime: string): "within_1_hour" | "within_24_hours" | "within_48_hours" | "flexible" => {
  const mapping: Record<string, "within_1_hour" | "within_24_hours" | "within_48_hours" | "flexible"> = {
    "within_1_hour": "within_1_hour",
    "within_few_hours": "within_24_hours",
    "same_day": "within_24_hours",
    "within_24_hours": "within_24_hours",
    "no_response_time": "flexible",
  };
  return mapping[formResponseTime] || "flexible";
};

// Transform API FormFields to CustomQuestionData format
const transformFormFieldsToQuestions = (formFields: FormField[]): any[] => {
  return formFields.map((field) => ({
    question: field.label,
    answerType: field.fieldType === "select" ? "single_choice" : 
                field.fieldType === "checkbox" ? "multiselect" :
                field.fieldType === "textarea" ? "long_text" :
                field.fieldType === "date" ? "date" : "short_text",
    options: field.options || [],
    label: field.label,
    fieldType: field.fieldType,
    placeholder: field.placeholder,
    isRequired: field.isRequired,
  }));
};

const transformQuestionsToFormFields = (questions: any[]): FormField[] => {
  return questions.map((q, index) => ({
    label: q.label || q.question || "",
    fieldType: q.fieldType || "text",
    placeholder: q.placeholder || "",
    options: q.options || [],
    isRequired: q.isRequired || false,
    sortOrder: index,
  }));
};

export default function AddEditServicePage(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const isEditMode = !!id;

  const [currentStep, setCurrentStep] = useState<StepType>("service_details");
  const [serviceData, setServiceData] = useState<ServiceFormData | null>(null);
  const [contactInfoData, setContactInfoData] = useState<ContactInfoFormData | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [getServiceById, { isLoading: isLoadingService }] = useLazyGetServiceByIdQuery();

  // Load service data if editing
  useEffect(() => {
    if (isEditMode && id) {
      const loadService = async () => {
        try {
          const response = await getServiceById(id).unwrap();
          const service = response.data as Service;
          
          if (!service) {
            dispatch(showAlert({ message: "Service not found", severity: "error" }));
            navigate("/services-offered");
            return;
          }

          setEditingService(service);

          // Transform API service data to form data
          const formData: ServiceFormData = {
            serviceTitle: service.name,
            whatsIncluded: service.description,
            servicePrice: service.price.toString(),
            responseTime: service.responseTime,
          };
          setServiceData(formData);

          // Pre-fill contact info from current user's profile data
          const userContactInfo: ContactInfoFormData = {
            fullName: user?.firstName ? decryptAES(user.firstName) : "",
            email: user?.email ? decryptAES(user.email) : "",
            phoneNumber: "", // Phone number should be empty by default
          };
          setContactInfoData(userContactInfo);

          // Determine initial step based on service type
          if (service.contactMethod === "custom_form" || (service.formFields && service.formFields.length > 0)) {
            setCurrentStep("service_details");
          } else if (service.contactMethod === "quick_contact") {
            setCurrentStep("service_details");
          }
        } catch (error: any) {
          const errorMessage = error?.data?.message || "Failed to load service";
          dispatch(showAlert({ message: errorMessage, severity: "error" }));
          navigate("/services-offered");
        }
      };

      loadService();
    } else {
      // For new service, pre-fill contact info from user profile
      const userContactInfo: ContactInfoFormData = {
        fullName: user?.firstName ? decryptAES(user.firstName) : "",
        email: user?.email ? decryptAES(user.email) : "",
        phoneNumber: "", // Phone number should be empty by default
      };
      setContactInfoData(userContactInfo);
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
        // Go back to contact method (if new) or service details (if editing)
        if (editingService) {
          setCurrentStep("service_details");
        } else {
          setCurrentStep("contact_method");
        }
        break;
      case "quick_contact":
        // Go back to contact method (if new) or service details (if editing)
        if (editingService) {
          setCurrentStep("service_details");
        } else {
          setCurrentStep("contact_method");
        }
        break;
      case "contact_info_questions":
        // Go back to contact info
        setCurrentStep("contact_info");
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
        setCurrentStep("contact_info");
      } else if (editingService.contactMethod === "quick_contact") {
        setCurrentStep("quick_contact");
      } else {
        setCurrentStep("contact_info");
      }
    } else {
      // For new services, show contact method selection
      setCurrentStep("contact_method");
    }
  };

  const handleContactMethodSelect = (method: "quick_contact" | "contact_info_questions") => {
    if (method === "quick_contact") {
      setCurrentStep("quick_contact");
    } else {
      setCurrentStep("contact_info");
    }
  };

  const handleContactInfoNext = (data: ContactInfoFormData) => {
    setContactInfoData(data);
    setCurrentStep("contact_info_questions");
  };

  const handleCreateQuestion = async (questions: any[]) => {
    if (!serviceData) return;

    try {
      const formFields = transformQuestionsToFormFields(questions);
      const contactMethod: "quick_contact" | "custom_form" = "custom_form";
      
      const requestBody: CreateServiceRequest = {
        name: serviceData.serviceTitle,
        description: serviceData.whatsIncluded,
        price: parseFloat(serviceData.servicePrice.replace(/[^0-9.]/g, "")) || 0,
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

  const handleQuickContactSubmit = async (_data: QuickContactFormData) => {
    if (!serviceData) return;

    try {
      const requestBody: CreateServiceRequest = {
        name: serviceData.serviceTitle,
        description: serviceData.whatsIncluded,
        price: parseFloat(serviceData.servicePrice.replace(/[^0-9.]/g, "")) || 0,
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
            />
          )}

          {currentStep === "contact_method" && (
            <ContactMethodPage
              onBack={handleBack}
              onCancel={handleCancel}
              onSelect={handleContactMethodSelect}
            />
          )}

          {currentStep === "contact_info" && (
            <ContactInfoPage
              onBack={handleBack}
              onCancel={handleCancel}
              onNext={handleContactInfoNext}
              initialData={contactInfoData}
            />
          )}

          {currentStep === "quick_contact" && (
            <QuickContactPage
              onBack={handleBack}
              onCancel={handleCancel}
              onSubmit={handleQuickContactSubmit}
              initialData={contactInfoData}
              initialContactMethod={editingService?.contactMethod}
            />
          )}

          {currentStep === "contact_info_questions" && (
            <CustomQuestionsPage
              onBack={handleBack}
              onCancel={handleCancel}
              onSubmit={handleCreateQuestion}
              initialQuestions={editingService?.formFields ? transformFormFieldsToQuestions(editingService.formFields) : null}
            />
          )}
        </Card>
      </Box>
    </ServiceProviderLayout>
  );
}

