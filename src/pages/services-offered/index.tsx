import { type JSX } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import { Add } from "@mui/icons-material";
import ServiceOfferedCard from "../../components/reusecard/ServiceOfferedCard";


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

export default function ServicesOfferedPage(): JSX.Element {
  const handleAddService = () => {
    // TODO: Implement add service functionality
    console.log("Add service");
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
    </ServiceProviderLayout>
  );
}

