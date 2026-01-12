import { type JSX, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import { useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "../../rtk/endpoints/userApi";
import { getCloudFrontUrl } from "../../utils/helper";
import ShareModal from "../client/components/ShareModal";

// Helper function to get profile URL dynamically (same as client page)
const getProfileUrl = (username: string) => {
  return `${window.location.origin}/${username}`;
};

export default function MyProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useGetUserProfileQuery();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleCopyUrl = () => {
    if (!profile?.username) return;
    const profileUrl = getProfileUrl(profile.username);
    navigator.clipboard.writeText(profileUrl);
    setToastOpen(true);
  };

  const handleShareClick = () => {
    setShareModalOpen(true);
  };
  
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

  if (isLoading) {
    return (
      <ServiceProviderLayout>
        <Box
          sx={{
            p: { xs: 1.5, md: 3 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </ServiceProviderLayout>
    );
  }

  if (error) {
    return (
      <ServiceProviderLayout>
        <Box sx={{ p: { xs: 1.5, md: 3 } }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load profile. Please try again.
          </Alert>
        </Box>
      </ServiceProviderLayout>
    );
  }

  if (!profile) {
    return (
      <ServiceProviderLayout>
        <Box sx={{ p: { xs: 1.5, md: 3 } }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            No profile data available.
          </Alert>
        </Box>
      </ServiceProviderLayout>
    );
  }

  const profileUrl = getProfileUrl(profile.username);
  const phoneDisplay = profile.countryCode && profile.phoneNumber 
    ? `${profile.countryCode} ${profile.phoneNumber}` 
    : "N/A";

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
                onClick={() => navigate(`/my-profile/${profile.id}`)}
              >
                Edit Profile
              </Button>
            </Box>

            {/* Body */}
            <Box gap={2}>
              <Avatar
                src={profile.profilePhoto ? getCloudFrontUrl(profile.profilePhoto) : "./assets/images/avatar.png"}
                sx={{ width: 74, height: 74 }}
                imgProps={{
                  onError: (e) => {
                    // Fallback to default avatar if image fails to load (e.g., Access Denied)
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "./assets/images/avatar.png" && !target.src.includes("avatar.png")) {
                      console.warn("Profile image failed to load, using default avatar. URL:", target.src);
                      target.src = "./assets/images/avatar.png";
                    }
                  },
                }}
              />

              <Box flex={1}>
                <Typography fontWeight={600} fontSize={18} sx={{ marginTop: "10px" }}>
                  {profile.username || "N/A"}
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
                    {profileUrl}
                  </Typography>

                  <Box display="flex" gap={0.5}>
                    <Box
                      onClick={handleCopyUrl}
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
                      <img src={`./assets/icons/copy.svg`} alt="copy" />
                    </Box>
                      <Box
                      onClick={handleShareClick}
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
                      <img src={`./assets/icons/share-arrow.svg`} alt="share" />
                      </Box>
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
                value={profile.displayName || profile.username || "N/A"}
                label="Company Name"
                showImg={false}
              />

              <InfoItem
                icon="./assets/icons/mail.svg"
                value={profile.email || "N/A"}
                label="Service Provider email id "
              />

              <InfoItem
                icon="./assets/icons/phone.svg"
                value={phoneDisplay}
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
            
            <img src="./assets/icons/line2.svg" alt="" />

            <Typography fontWeight={600} fontSize={14} color="#111927">
              {profile.displayName || "N/A"}
            </Typography>
            <Typography fontWeight={400} fontSize={16} color="#1C1C1C" mt={0.5}>
              {profile.businessDescription || "No business description provided."}
            </Typography>

            {/* Social / Benefits */}
            <Box mt={2} display="flex" flexDirection="column" gap={1.2}>
              {profile.instagramUrl && (
                <Box display="flex" alignItems="center" gap={1}>
                  <img src="./assets/icons/instagram.svg" alt="" />
                  <Typography fontSize={13} color="#6C737F">
                    {profile.instagramUrl}
                  </Typography>
                </Box>
              )}

              {profile.facebookUrl && (
                <Box display="flex" alignItems="center" gap={1}>
                  <img src="./assets/icons/Facebook.svg" alt="" />
                  <Typography fontSize={13} color="#6C737F">
                    {profile.facebookUrl}
                  </Typography>
                </Box>
              )}

              {profile.linkedinUrl && (
                <Box display="flex" alignItems="center" gap={1}>
                  <img src="./assets/icons/linkedin.svg" alt="" />
                  <Typography fontSize={13} color="#6C737F">
                    {profile.linkedinUrl}
                  </Typography>
                </Box>
              )}

              {!profile.instagramUrl && !profile.facebookUrl && !profile.linkedinUrl && (
                <Typography fontSize={13} color="#6C737F">
                  No social media links added.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Share Modal */}
      {profile && (
        <ShareModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          profileUrl={profileUrl}
          profileName={profile.displayName || profile.username || ""}
        />
      )}

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Copied!
        </Alert>
      </Snackbar>
    </ServiceProviderLayout>
  );
}
