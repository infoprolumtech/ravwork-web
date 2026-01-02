import { type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import ServiceProviderLayout from "../../../layouts/ServiceProviderLayout";

export default function EditProfile(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSave = () => {
    // TODO: API call using `id`
    console.log("Saving profile for ID:", id);
    navigate("/my-profile");
  };
  const placeholderSx = {
  "& input::placeholder, & textarea::placeholder": {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
    opacity: 1,
  },
};


  return (
    <ServiceProviderLayout>
      <Box sx={{ p: { xs: 2, md: 0 }, maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <Box mb={3}>
          <CardContent sx={{ py: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography fontWeight={600} fontSize={14} color="#111927">
                Profile
              </Typography>
              <Button
                variant="secondary"
                sx={{ height: "28px", fontWeight: "500", fontSize: "9px" }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>

            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Avatar
                src="./assets/images/avatar.png"
                sx={{ width: 74, height: 74 }}
              />
              <Button
                variant="secondary"
                sx={{ height: "28px", fontWeight: "500", fontSize: "9px" }}
              >
                Change Photo
              </Button>
            </Box>
          </CardContent>
        </Box>

        {/* Name / Business */}
        <Box
          mb={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box width={"281px"}>
            <Typography fontSize={16} fontWeight={500} mb={0.5}>
              Name or Business Name
            </Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Enter Your Company Name"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
                width: { xs: "100%", sm: "380px" },
              },
              ...placeholderSx,
            }}
          />
        </Box>

        {/* About Business */}
        <Box
          mb={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box width={"281px"}>
            <Typography fontSize={16} fontWeight={500} mb={0.5}>
              About the business
            </Typography>
          </Box>
          <TextField
            multiline
            rows={2}
            size="small"
            placeholder="About the business"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 6,
                width: { xs: "100%", sm: "380px" },
                height: "78px",
              },
              ...placeholderSx,
            }}
          />
        </Box>

        {/* Social URLs */}
        <Box
          mb={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box width={"281px"}>
            <Typography fontSize={16} fontWeight={500} mb={0.5}>
              Your Public URL
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              width: { xs: "100%", sm: "493px" },
            }}
          >
            {[
              { icon: "/assets/icons/instagram.svg", label: "Paste Url" },
              { icon: "/assets/icons/Facebook.svg", label: "Paste Url" },
              { icon: "/assets/icons/linkedin.svg", label: "Paste Url" },
            ].map((item, index) => (
              <TextField
                key={index}
                fullWidth
                size="small"
                placeholder={item.label}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 6 },
                  ...placeholderSx,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={item.icon} alt="" width={18} height={18} />
                    </InputAdornment>
                  ),
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </ServiceProviderLayout>
  );
}
