import { Card, Box, Typography, Stack, Button } from "@mui/material";

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

const InfoItem = ({ icon, value, label, fixedWidth }: any) => {
  const displayValue = value && value.trim() !== "" ? value : "N/A";
  
  return (
    <Stack 
      spacing={0.5} 
      sx={{ 
        minWidth: 0, 
        ...(fixedWidth ? { width: fixedWidth, minWidth: { xs: 0, sm: "140px" } } : { width: { xs: "100%", sm: "auto" } }),
        flex: { xs: "1 1 auto", sm: "0 0 auto" },
        maxWidth: { xs: "100%", sm: "none" },
      }}
    >
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center"
        sx={{ 
          minWidth: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { xs: 24, sm: 28 },
            height: { xs: 24, sm: 28 },
            bgcolor: "#EEF2F6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            flexGrow: 0,
          }}
        >
          <img src={icon} width={14} height={14} alt="" />
        </Box>

        <Typography
          fontSize={{ xs: 12, sm: 14 }}
          fontWeight={600}
          color="#111927"
          sx={{ 
            wordBreak: "break-word", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            minWidth: 0,
            flex: 1,
            lineHeight: 1.2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {displayValue}
        </Typography>
      </Stack>

      <Typography
        fontSize={{ xs: 11, sm: 12 }}
        fontWeight={500}
        color="#6C737F"
        sx={{ 
          pl: { xs: 3.5, sm: 4 },
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
};

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
    <Card
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        bgcolor: "#F8FAFC",
        boxShadow: "none",
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 1.5, sm: 0 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2 }}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              bgcolor: "#E3F5FF",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src="/assets/icons/sidebar_menu_icon/briefcase.svg"
              width={18}
              height={18}
              alt="Job"
            />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              fontSize={{ xs: 14, sm: 16 }}
              fontWeight={600}
              color="#111927"
              sx={{ wordBreak: "break-word" }}
            >
              {title}
            </Typography>
            <Typography
              fontSize={{ xs: 12, sm: 14 }}
              color="#6C737F"
              sx={{ mt: 0.5, wordBreak: "break-word" }}
            >
              {description}
            </Typography>
          </Box>
        </Stack>

        {showActions && (
          <Stack
            direction={{xs:"row", md:"row-reverse"}}
            spacing={1}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              size="small"
              onClick={onDecline}
              sx={{
                bgcolor: "#FFFFFF",
                color: "#F04438",
                
                px: { xs: 2, sm: 2.5 },
                textTransform: "none",
                fontWeight: 500,
                whiteSpace: "nowrap",
                flex: { xs: 1, sm: "none" },
                "&:hover": { bgcolor: "#FEF2F2" },
              }}
            >
              Decline
            </Button>

            <Button
              size="small"
              onClick={onComplete}
              sx={{
                bgcolor: "#BAEDBD",
                color: "#111927",
                px: { xs: 2, sm: 2.5 },
                textTransform: "none",
                fontWeight: 500,
                whiteSpace: "nowrap",
                flex: { xs: 1, sm: "none" },
                "&:hover": { bgcolor: "#A8E0AB" },
              }}
            >
              Mark as Complete
            </Button>
          </Stack>
        )}
      </Stack>

      {/* Client Info Section */}
      <Box
        sx={{
          mt: 2,
          bgcolor: "#FFFFFF",
          borderRadius: 3,
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "flex-start" }}
          justifyContent={{ xs: "flex-start", sm: "space-between" }}
          spacing={{ xs: 2, sm: 1.5, md: 2 }}
          sx={{
            flexWrap: { xs: "nowrap", sm: "wrap", md: "nowrap" },
            width: "100%",
          }}
        >
          <InfoItem
            icon="/assets/icons/personalcard.svg"
            value={clientName}
            label="Client Name"
            fixedWidth={{ xs: "100%", sm: "180px", md: "200px", lg: "220px" }}
          />

          <InfoItem
            icon="/assets/icons/mail.svg"
            value={clientEmail}
            label="Client Email"
            fixedWidth={{ xs: "100%", sm: "180px", md: "200px", lg: "220px" }}
          />

          <InfoItem
            icon="/assets/icons/phone.svg"
            value={clientPhone}
            label="Client Phone"
            fixedWidth={{ xs: "100%", sm: "160px", md: "180px", lg: "200px" }}
          />

          <Box sx={{ display: { xs: "none", sm: "block" }, flex: 1, minWidth: { sm: "20px", md: "40px" } }} />

          <Typography
            fontSize={{ xs: 12, sm: 14 }}
            fontWeight={500}
            color="#6C737F"
            sx={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              alignSelf: { xs: "flex-start", sm: "flex-start" },
              mt: { xs: 0, sm: 0 },
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={onViewDetails}
          >
            View Details
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}



