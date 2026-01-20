import { type JSX, useState, useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import { useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "../../rtk/endpoints/userApi";
import { useGetServicesQuery } from "../../rtk/endpoints/serviceApi";
import { getCloudFrontUrl, calculateProfileComplete } from "../../utils/helper";
import { colors } from "../../utils/constants";
import ShareModal from "../../components/client/ShareModal";
import { ProfileViewSkeleton } from "../../components/skeletons/ProfileSkeleton";


// Helper function to get profile URL dynamically (same as client page)
const getProfileUrl = (username: string) => {
  return `${window.location.origin}/${username}`;
};

export default function MyProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const { data: profile, isLoading, error, refetch } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true, // Ensure refetch when component mounts
  });
  const { data: servicesData } = useGetServicesQuery();

  const hasServices = useMemo(() => {
    if (!servicesData) return false;
    if (Array.isArray(servicesData)) return servicesData.length > 0;
    return (servicesData.data && servicesData.data.length > 0) || false;
  }, [servicesData]);

  const profileComplete = useMemo(() => {
    return calculateProfileComplete(profile || null, hasServices);
  }, [profile, hasServices]);

  const handleCompleteSetup = () => {
    const profileOnlyCompletion = calculateProfileComplete(profile || null, false);
    if (profileOnlyCompletion >= 50 && !hasServices) {
      navigate("/services-offered");
    } else {
      if (profile?.id) {
        navigate(`/my-profile/${profile.id}`);
      }
    }
  };

  // Ensure query runs when component first mounts
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount (refetch is stable)
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
    label?: string;
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
        {label && (
          <Typography fontSize={12} fontWeight={500}>
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (isLoading) {
    return (
      <ServiceProviderLayout>
        <ProfileViewSkeleton />
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
          <CardContent sx={{ py: 2, position: "relative" }}>
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
                sx={{ height: "28px", fontWeight: "500", fontSize: "14px" }}
                onClick={() => navigate(`/my-profile/${profile.id}`)}
              >
                Edit Profile
              </Button>
            </Box>

            {/* Profile Completion Button */}
            <Button
              onClick={handleCompleteSetup}
              sx={{
                display: "flex",
                padding: "3px 4px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                position: "absolute",
                left: "80px",
                top: "55px",
                borderRadius: "68px",
                background: "#BAEDBD",
                boxShadow: "0 4px 26px 0 rgba(0, 0, 0, 0.04)",
                textTransform: "none",
                color: "#111927",
                fontSize: "12px",
                fontWeight: 600,
                minWidth: "unset",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
                "&:hover": {
                  background: "#A9DCA9",
                },
              }}
            >
              {profileComplete}%
            </Button>

            {/* Body */}
            <Box gap={2}>

              <Avatar
                src={profile.profilePhoto ? getCloudFrontUrl(profile.profilePhoto) : "./assets/images/avatar.png"}
                sx={{
                  width: 74,
                  height: 74,
                  border: "4px solid #FFFFFF",
                  bgcolor: "#FFFFFF"
                }}
                imgProps={{
                  onError: (e) => {
                    // Fallback to default avatar if image fails to load (e.g., Access Denied)
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "./assets/images/avatar.png" && !target.src.includes("avatar.png")) {
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

                  <Box display="flex" gap={1} alignItems="center">
                    <Button
                      onClick={handleCopyUrl}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: { xs: 0.375, sm: 0.5, md: 0.625 },
                        bgcolor: "#FFFFFF",
                        color: "#111927",
                        borderRadius: { xs: "14px", sm: "16px", md: "20px" },
                        px: { xs: 0.875, sm: 1.25, md: 1.5 },
                        py: { xs: 0.375, sm: 0.5, md: 0.625 },
                        minHeight: { xs: "24px", sm: "28px", md: "32px" },
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: { xs: "11px", sm: "12px", md: "13px" },
                        lineHeight: 1.2,
                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
                        border: "none",
                        cursor: "pointer",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                        "&:hover": {
                          bgcolor: "#F9FAFB",
                          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.08)",
                        },
                        "&:active": {
                          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src="./assets/icons/copy.svg"
                        alt="copy"
                        sx={{
                          width: { xs: 12, sm: 13, md: 14 },
                          height: { xs: 12, sm: 13, md: 14 },
                          flexShrink: 0,
                        }}
                      />
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        Copy Link
                      </Box>
                    </Button>
                    <Box
                      onClick={handleShareClick}
                      sx={{
                        width: { xs: 24, sm: 28, md: 32 },
                        height: { xs: 24, sm: 28, md: 32 },
                        bgcolor: "#fff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                        "&:hover": {
                          bgcolor: "#F9FAFB",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <img
                        src={`./assets/icons/share-arrow.svg`}
                        alt="share"
                        style={{
                          width: `${14}px`,
                          height: `${14}px`,
                        }}
                      />
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

                showImg={false}
              />

              <InfoItem
                icon="./assets/icons/mail.svg"
                value={profile.email || "N/A"}

              />

              <InfoItem
                icon="./assets/icons/phone.svg"
                value={phoneDisplay || "N/A"}

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
            <Typography fontWeight={400} fontSize={16} color={colors["Base-Dark"]} mt={0.5}>
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
