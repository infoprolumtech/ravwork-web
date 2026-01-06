import React, { type JSX } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import { Add } from "@mui/icons-material";
import ServiceOfferedCard from "../../components/reusecard/ServiceOfferedCard";
import ServiceDetailsDialog, { type ServiceFormData } from "../../components/dialog/dialog-content/ServiceDetailsDialog";
import ContactMethodDialog from "../../components/dialog/dialog-content/ContactMethodDialog";
import QuickContactDialog, { type QuickContactFormData } from "../../components/dialog/dialog-content/QuickContactDialog";
import ContactInfoDialog, { type ContactInfoFormData } from "../../components/dialog/dialog-content/ContactInfoDialog";
import CustomQuestionsDialog from "../../components/dialog/dialog-content/CustomQuestionsDialog";
import Dialog from "@mui/material/Dialog";


interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  contactMethod: string;
  iconColor: string;
  iconType: "lightning" | "document";
}

// Mock data - replace with API call
const mockServices: Service[] = [
  {
    id: "1",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$566",
    contactMethod: "Contact Method: Quick Contact",
    iconColor: "#12B76A",
    iconType: "lightning",
  },
  {
    id: "2",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$900",
    contactMethod: "Contact Method: Contact info + Job Questions",
    iconColor: "#4693DD",
    iconType: "document",
  },
  {
    id: "3",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$566",
    contactMethod: "Contact Method: Quick Contact",
    iconColor: "#12B76A",
    iconType: "lightning",
  },
];

type DialogStep = "service_details" | "contact_method" | "quick_contact" | "contact_info" | "contact_info_questions" | null;

export default function ServicesOfferedPage(): JSX.Element {
  const [dialogStep, setDialogStep] = React.useState<DialogStep>(null);
  const [serviceData, setServiceData] = React.useState<ServiceFormData | null>(null);

  const handleAddService = () => {
    setDialogStep("service_details");
  };

  const handleCloseDialog = () => {
    setDialogStep(null);
    setServiceData(null);
  };

  const handleServiceDetailsNext = (data: ServiceFormData) => {
    setServiceData(data);
    setDialogStep("contact_method");
  };

  const handleContactMethodSelect = (method: "quick_contact" | "contact_info_questions") => {
    if (method === "quick_contact") {
      setDialogStep("quick_contact");
    } else {
      // For "contact_info_questions", first show contact info form
      setDialogStep("contact_info");
    }
  };

  const handleContactInfoNext = (data: ContactInfoFormData) => {
    console.log("Contact info data:", data);
    // Store contact info data and proceed to custom questions
    setDialogStep("contact_info_questions");
  };

  const handleCreateQuestion = (questions: any[]) => {
    console.log("Service data:", serviceData);
    console.log("Custom questions data:", questions);
    // TODO: Implement API call to save service with custom questions
    setDialogStep(null);
    setServiceData(null);
  };

  const handleQuickContactSubmit = (data: QuickContactFormData) => {
    console.log("Service data:", serviceData);
    console.log("Quick contact data:", data);
    // TODO: Implement API call to save service with quick contact method
    setDialogStep(null);
    setServiceData(null);
  };

  const handleEditService = (id: string) => {
    // TODO: Implement edit service functionality
    console.log("Edit service:", id);
  };

  const handleDeleteService = (id: string) => {
    // TODO: Implement delete service functionality
    console.log("Delete service:", id);
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

        <Stack spacing={{ xs: 1.5, md: 2 }}>
          {mockServices.map((service) => (
            <ServiceOfferedCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              price={service.price}
              contactMethod={service.contactMethod}
              iconColor={service.iconColor}
              iconType={service.iconType}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          ))}
        </Stack>
      </Box>

      {/* Service Details Dialog - Step 1 */}
      <Dialog
        open={dialogStep === "service_details"}
        onClose={handleCloseDialog}
        aria-labelledby="service-details-dialog-title"
        aria-describedby="service-details-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            width: "768px",
            maxWidth: { xs: "calc(100% - 32px)", sm: "768px" },
            borderRadius: "32px",
            background: "#FFF",
            padding: 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          zIndex: 1600,
        }}
      >
        <ServiceDetailsDialog
          handleClose={handleCloseDialog}
          onNext={handleServiceDetailsNext}
        />
      </Dialog>

      {/* Contact Method Dialog - Step 2 */}
      <Dialog
        open={dialogStep === "contact_method"}
        onClose={(_event, reason) => {
          // Only close if clicking backdrop or pressing escape, not when selecting a method
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            handleCloseDialog();
          }
        }}
        aria-labelledby="contact-method-dialog-title"
        aria-describedby="contact-method-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            width: "768px",
            maxWidth: { xs: "calc(100% - 32px)", sm: "768px" },
            borderRadius: "32px",
            background: "#FFF",
            padding: 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          zIndex: 1600,
        }}
      >
        <ContactMethodDialog
          handleClose={handleCloseDialog}
          onSelect={handleContactMethodSelect}
        />
      </Dialog>

      {/* Quick Contact Dialog - Step 3a */}
      <Dialog
        open={dialogStep === "quick_contact"}
        onClose={handleCloseDialog}
        aria-labelledby="quick-contact-dialog-title"
        aria-describedby="quick-contact-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            width: "768px",
            maxWidth: { xs: "calc(100% - 32px)", sm: "768px" },
            borderRadius: "32px",
            background: "#FFF",
            padding: 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          zIndex: 1600,
        }}
      >
        <QuickContactDialog
          handleClose={handleCloseDialog}
          onSubmit={handleQuickContactSubmit}
        />
      </Dialog>

      {/* Contact Info Dialog - Step 3a (for Contact Info + Job Questions path) */}
      <Dialog
        open={dialogStep === "contact_info"}
        onClose={handleCloseDialog}
        aria-labelledby="contact-info-dialog-title"
        aria-describedby="contact-info-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            width: "768px",
            maxWidth: { xs: "calc(100% - 32px)", sm: "768px" },
            borderRadius: "32px",
            background: "#FFF",
            padding: 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          zIndex: 1600,
        }}
      >
        <ContactInfoDialog
          handleClose={handleCloseDialog}
          onNext={handleContactInfoNext}
        />
      </Dialog>

      {/* Custom Questions Dialog - Step 3b */}
      <Dialog
        open={dialogStep === "contact_info_questions"}
        onClose={handleCloseDialog}
        aria-labelledby="custom-questions-dialog-title"
        aria-describedby="custom-questions-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            width: "768px",
            maxWidth: { xs: "calc(100% - 32px)", sm: "768px" },
            borderRadius: "32px",
            background: "#FFF",
            padding: 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          zIndex: 1600,
        }}
      >
        <CustomQuestionsDialog
          handleClose={handleCloseDialog}
          onCreateQuestion={handleCreateQuestion}
        />
      </Dialog>
    </ServiceProviderLayout>
  );
}

