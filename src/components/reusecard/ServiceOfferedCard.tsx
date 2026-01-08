import { type JSX } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  IconButton,
} from "@mui/material";

export interface ServiceOfferedCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  contactMethod: string;
  iconType: "lightning" | "document";
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ServiceOfferedCard({
  id,
  title,
  description,
  price,
  contactMethod,
  iconType,
  onEdit,
  onDelete,
}: ServiceOfferedCardProps): JSX.Element {
  return (
    <Card
      sx={{
        display: "flex",
        padding: { xs: "16px", md: "20px" },
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: { xs: "12px", md: "16px" },
        alignSelf: "stretch",
        borderRadius: "12px",
        background: "#F7F9FB",
        boxShadow: "none",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Mobile Layout - Vertical Stack */}
      <Stack
        direction="column"
        spacing={{ xs: 1, md: 1.5 }}
        sx={{ width: "100%" }}
      >
        {/* Icon and Title Row for Desktop, Vertical for Mobile */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1, md: 2 }}
          alignItems={{ xs: "flex-start", md: "flex-start" }}
          sx={{ width: "100%" }}
        >
          {/* Service Icon */}
          <Box
            sx={{
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {contactMethod.toLowerCase().includes("quick contact") ? (
              <Box
                component="img"
                src="/assets/icons/service_offered_icons/quick_contact.svg"
                alt="Quick Contact"
                sx={{
                  width: "39px",
                  height: "39px",
                  objectFit: "contain",
                }}
              />
            ) : contactMethod.toLowerCase().includes("custom form") ? (
              <Box
                component="img"
                src="/assets/icons/service_offered_icons/custom_form.svg"
                alt="Custom Form"
                sx={{
                  width: "39px",
                  height: "39px",
                  objectFit: "contain",
                }}
              />
            ) : iconType === "lightning" ? (
              <Box
                component="img"
                src="/assets/icons/sidebar_menu_icon/flash.svg"
                alt="Service"
                sx={{
                  width: { xs: "20px", md: "24px" },
                  height: { xs: "20px", md: "24px" },
                  filter: "brightness(0) invert(1)",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: { xs: "18px", md: "20px" },
                  height: { xs: "18px", md: "20px" },
                  backgroundColor: "#FFFFFF",
                  borderRadius: "2px",
                }}
              />
            )}
          </Box>

          {/* Service Details - Title, Description, Price */}
          <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#111927",
                fontSize: { xs: "16px", md: "18px" },
                mb: { xs: 0.5, md: 0.5 },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6C737F",
                fontSize: { xs: "13px", md: "14px" },
                mb: { xs: 0.5, md: 1 },
              }}
            >
              {description}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#111927",
                fontSize: { xs: "18px", md: "20px" },
                mb: { xs: 1, md: 0.5 },
              }}
            >
              {price}
            </Typography>
          </Box>
        </Stack>

        {/* Action Buttons */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center"
          sx={{ 
            width: "100%",
            justifyContent: { xs: "flex-start", md: "flex-end" },
          }}
        >
          <Button
            variant="contained"
            onClick={() => onDelete(id)}
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#F04438",
              fontSize: { xs: "13px", md: "14px" },
              fontWeight: 500,
              textTransform: "none",
              minWidth: "auto",
              px: { xs: 2, md: 2.5 },
              py: { xs: 0.75, md: 1 },
              height: { xs: 36, md: 40 },
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#D92D20",
              },
            }}
          >
            Delete
          </Button>
          <IconButton
            onClick={() => onEdit(id)}
            sx={{
              backgroundColor: "#E3F0F8",
              color: "#0D4FAB",
              width: { xs: 36, md: 40 },
              height: { xs: 36, md: 40 },
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#D2E7FF",
              },
            }}
          >
            <Box
              component="img"
              src="/assets/icons/service_offered_icons/service_edit.svg"
              alt="Edit"
              sx={{
                width: "20px",
                height: "20px",
              }}
            />
          </IconButton>
        </Stack>

        {/* Contact Method - At Bottom */}
        <Typography
          variant="body2"
          sx={{
            color: "#6C737F",
            fontSize: { xs: "12px", md: "12px" },
            mt: { xs: 0, md: 0 },
          }}
        >
          {contactMethod}
        </Typography>
      </Stack>
    </Card>
  );
}

