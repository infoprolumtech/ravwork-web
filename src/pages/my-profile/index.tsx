import { type JSX } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import { useNavigate } from "react-router-dom";

export default function MyProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const InfoItem = ({
    icon,
    value,
    label,
    showImg = true,
  }: {
    icon: string;
    value: string;
    label: string;
    showImg?: boolean;
  }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {showImg && (
        <Box
          component="img"
          src="./assets/icons/Vector 37.svg"
          alt=""
          sx={{ display: { xs: "none", sm: "block" }, marginRight: "24px" }}
        />
      )}

      <Box
        sx={{
          width: 24,
          height: 24,
          bgcolor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
        }}
      >
        <img src={icon} width={15.2} height={15.2} alt="" />
      </Box>

      <Box>
        <Typography fontWeight={600} fontSize={14} lineHeight="20px">
          {value}
        </Typography>
        <Typography fontSize={12} fontWeight={500}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
  const id = "12345"; // Example user ID, replace with actual data as needed
  return (
    <ServiceProviderLayout>
      <Box
        sx={{
          p: { xs: 1.5, md: 3 },
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: "#D2E7FF",
          }}
        >
          <CardContent sx={{ py: 2 }}>
            {/* Header */}
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
                onClick={() => navigate(`/my-profile/${id}`)}
              >
                Edit Profile
              </Button>
            </Box>

            {/* Body */}
            <Box gap={2}>
              <Avatar
                src="./assets/images/avatar.png"
                sx={{ width: 74, height: 74 }}
              />

              <Box flex={1}>
                <Typography fontWeight={600} fontSize={18}>
                  Full Name Goes Here
                </Typography>
                <Typography fontWeight={400} fontSize={16} color="#6C737F">
                  Company Name Goes Here
                </Typography>
                <img src="./assets/icons/line.svg" alt="" />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    maxWidth: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: { xs: "100%", sm: 260 },
                      overflow: { xs: "visible", sm: "hidden" },
                      textOverflow: { sm: "ellipsis" },
                      whiteSpace: { xs: "normal", sm: "nowrap" },
                      wordBreak: "break-all",
                    }}
                  >
                    https://rawwork.com/p/johndoe
                  </Typography>

                  <Box display="flex" gap={0.5}>
                    {["copy", "share-arrow"].map((icon) => (
                      <Box
                        key={icon}
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "#fff",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <img src={`./assets/icons/${icon}.svg`} alt={icon} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              marginTop={"14px"}
              justifyContent={"space-between"}
            >
              <InfoItem
                icon="./assets/icons/personalcard.svg"
                value="Sarah Johnson"
                label="Company Name"
                showImg={false}
              />

              <InfoItem
                icon="./assets/icons/mailwBG.svg"
                value="sarahjohnson@email.com"
                label="Service Provider email id "
              />

              <InfoItem
                icon="./assets/icons/phone.svg"
                value="+1 999-999-8989"
                label="Client Phone"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              ></Box>
            </Stack>
          </CardContent>
        </Card>
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: "#F7F9FB",
          }}
        >
          <CardContent sx={{ py: 2 }}>
            <Typography fontWeight={600} fontSize={14} color="#111927" mb={1}>
              Business Details
            </Typography>
            <Typography fontWeight={600} fontSize={14} color="#111927">
              Name or Business Name
            </Typography>
            <img src="./assets/icons/line2.svg" alt="" />
            <Typography fontWeight={400} fontSize={16} color="#1C1C1C" mt={0.5}>
              About your Business long description goes here may take upto two
              lines About your Business long description goes here may take upto
              two linesAbout your Business long description goes here may take
              upto two linesAbout your Business long description goes here may
              take upto two linesAbout your Business long description goes here
              may take upto two linesAbout your Business long description goes
              here may take upto two lines
            </Typography>

            {/* Social / Benefits */}
            <Box mt={2} display="flex" flexDirection="column" gap={1.2}>
              <Box display="flex" alignItems="center" gap={1}>
                <img src="./assets/icons/instagram.svg" alt="" />
                <Typography fontSize={13} color="#6C737F">
                  Paste Url goes here of insta
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <img src="./assets/icons/Facebook.svg" alt="" />
                <Typography fontSize={13} color="#6C737F">
                  Benefits of Premium Plan Goes here
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <img src="./assets/icons/linkedin.svg" alt="" />
                <Typography fontSize={13} color="#6C737F">
                  Benefits of Premium Plan Goes here
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ServiceProviderLayout>
  );
}
