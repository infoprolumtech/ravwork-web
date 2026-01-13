import { Card, Box, Typography, Stack, Button, Divider } from "@mui/material";

export type JobCardProps = {
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  showActions?: boolean;
  onComplete?: () => void;
  onDecline?: () => void;
  onViewDetails?: () => void;
};

const InfoItem = ({ icon, value, label }: any) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          bgcolor: "#E5ECF6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
        }}
      >
        <img src={icon} width={15.2} height={15.2} alt="" />
      </Box>
      <Typography fontWeight={600} fontSize={14} lineHeight="20px" color="#111927">
        {value}
      </Typography>
    </Box>
    <Typography fontSize={12} fontWeight={500} color="#6C737F" sx={{ ml: 4 }}>
      {label}
    </Typography>
  </Box>
);

export default function JobCard({
  title,
  description,
  clientName,
  clientEmail,
  clientPhone,
  showActions = false,
  onComplete,
  onDecline,
  onViewDetails,
}: JobCardProps) {
  return (
    <Card sx={{ p: 2 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#E3F5FF",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/icons/sidebar_menu_icon/briefcase.svg"
            width={18}
            height={18}
            alt="Job"
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={600} fontSize={18} color="#111927">
            {title}
          </Typography>
          <Typography fontSize={14} color="#6C737F" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        </Box>

        {showActions && (
          <Stack direction={{ xs: "row", md: "row-reverse" }} spacing={1}>
            <Button
              size="small"
              sx={{
                bgcolor: "#fff",
                color: "#F04438",
                fontWeight: 500,
                textTransform: "none",
                               "&:hover": {
                  bgcolor: "#FEF2F2",
                  border: "1px solid #F04438",
                },
              }}
              onClick={onDecline}
            >
              Decline
            </Button>

            <Button
              size="small"
              variant="contained"
              sx={{
                bgcolor: "#BAEDBD",
                color: "#111927",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#A8E0AB",
                },
              }}
              onClick={onComplete}
            >
              Mark as Complete
            </Button>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Client Info */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent={"space-between"} alignItems={{ xs: "flex-start", sm: "center" }}>
        <InfoItem
          icon="./assets/icons/personalcard.svg"
          value={clientName}
          label="Client Name"
        />

        <InfoItem
          icon="./assets/icons/mail.svg"
          value={clientEmail}
          label="Client Email"
        />

        <InfoItem
          icon="./assets/icons/phone.svg"
          value={clientPhone}
          label="Client Phone"
        />

        {/* View Details */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Typography
            fontSize={14}
            fontWeight={500}
            sx={{ cursor: "pointer" }}
            onClick={onViewDetails}
          >
            View Details
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
