import { type JSX } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

export interface ServiceOfferedCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  contactMethod: string;
  iconColor: string;
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
  iconColor,
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
      {/* Top Row: Icon + Content + Actions */}
      <Stack
        direction="row"
        spacing={{ xs: 1.5, md: 2 }}
        alignItems="flex-start"
        sx={{ width: "100%" }}
      >
        {/* Service Icon */}
        <Box
          sx={{
            width: { xs: 40, md: 48 },
            height: { xs: 40, md: 48 },
            borderRadius: "50%",
            backgroundColor: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {iconType === "lightning" ? (
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
        <Box sx={{ flex: 1, minWidth: 0 }}>
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
              mb: { xs: 0.5, md: 0.5 },
            }}
          >
            {price}
          </Typography>
        </Box>

        {/* Action Buttons - Top Right */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center"
          sx={{ 
            flexShrink: 0,
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
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#D92D20",
                color: "#FFFFFF",
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
            <Edit sx={{ fontSize: { xs: 18, md: 20 } }} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Contact Method - Below main content */}
      <Typography
        variant="body2"
        sx={{
          color: "#6C737F",
          fontSize: { xs: "12px", md: "12px" },
          ml: { xs: 0, md: 0 },
        }}
      >
        {contactMethod}
      </Typography>
    </Card>
  );
}

