import { type JSX, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Avatar,
  IconButton,
  Container,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetPublicProfileQuery, useCreateBookingMutation, type PublicService } from "../../rtk/endpoints/publicApi";
import { getCloudFrontUrl } from "../../utils/helper";
import { colors } from "../../utils/constants";
import { transformFormResponses } from "../../utils/formHelpers";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import ClientContactInfoPage from "../../components/client/ClientContactInfoPage";
import ClientQuestionsPage from "../../components/client/ClientQuestionsPage";
import ShareModal from "../../components/client/ShareModal";
import ClientPageSkeleton from "../../components/skeletons/ClientPageSkeleton";


// Contact details form data
interface ContactDetails {
  fullName: string;
  email: string;
  phoneNumber: string;
  description?: string; // For inquiry type
}

// Dynamic form field values
interface FormFieldValues {
  [key: string]: string | string[] | { date?: string; time?: string };
}

export default function ClientPage(): JSX.Element {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Memoize query parameters to ensure RTK Query properly tracks changes
  const queryParams = useMemo(
    () => ({
      username: username || "",
    }),
    [username]
  );

  // Fetch public profile data
  const { data: profileData, isLoading, error, refetch } = useGetPublicProfileQuery(
    queryParams,
    {
      skip: !username,
      refetchOnMountOrArgChange: true, // Ensure refetch when component mounts
    }
  );

  // Ensure query runs when component first mounts and username is available
  useEffect(() => {
    if (username) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount (refetch is stable)

  // Booking mutation
  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();

  const profile = profileData?.profile;
  const services = profileData?.services?.data || [];

  // Booking dialog state
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [questionsDialogOpen, setQuestionsDialogOpen] = useState(false);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [phoneNumberDialogOpen, setPhoneNumberDialogOpen] = useState(false);
  const [privacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    fullName: "",
    email: "",
    phoneNumber: "",
    description: "",
  });
  const [formFieldValues, setFormFieldValues] = useState<FormFieldValues>({});

  // Handle Book Now click
  const handleBookNow = (service: PublicService) => {
    setSelectedService(service);
    setContactDetails({ fullName: "", email: "", phoneNumber: "", description: "" });
    setFormFieldValues({});
    // If service has custom questions, show questions first, otherwise show contact info
    if (service.contactMethod === "custom_form" && service.formFields && service.formFields.length > 0) {
      setQuestionsDialogOpen(true);
    } else {
      setContactDialogOpen(true);
    }
  };

  // Handle Request button click (for inquiry)
  const handleRequestClick = () => {
    setContactDetails({ fullName: "", email: "", phoneNumber: "", description: "" });
    setInquiryDialogOpen(true);
  };

  // Handle contact dialog close
  const handleContactDialogClose = () => {
    setContactDialogOpen(false);
    setSelectedService(null);
  };

  // Handle inquiry dialog close
  const handleInquiryDialogClose = () => {
    setInquiryDialogOpen(false);
    setContactDetails({ fullName: "", email: "", phoneNumber: "", description: "" });
  };

  // Handle questions dialog close
  const handleQuestionsDialogClose = () => {
    setQuestionsDialogOpen(false);
    setSelectedService(null);
    setFormFieldValues({});
  };

  // Handle Next button from questions to contact info (for custom_form)
  const handleNextToContactInfo = () => {
    setQuestionsDialogOpen(false);
    setContactDialogOpen(true);
  };

  // Handle Back button from contact info to questions (for custom_form)
  const handleBackToQuestions = () => {
    setContactDialogOpen(false);
    setQuestionsDialogOpen(true);
  };

  // Handle Next button from contact info to questions (for custom_form) - not used anymore but kept for compatibility
  const handleNextToQuestions = (data: ContactDetails) => {
    setContactDetails(data);
    setContactDialogOpen(false);
    setQuestionsDialogOpen(true);
  };

  // Handle Submit for quick_contact
  const handleQuickContactSubmit = async (data: ContactDetails) => {
    if (!selectedService || !username) return;
    setContactDetails(data);
    try {
      const email = data.email?.trim();
      await createBooking({
        username,
        body: {
          clientName: data.fullName,
          ...(email ? { clientEmail: email } : {}),
          clientCountryCode: profile?.countryCode || "+1",
          clientPhone: data.phoneNumber,
          serviceId: selectedService.id,
          type: "booking",
        },
      }).unwrap();

      dispatch(showAlert({ message: "Booking request submitted successfully!", severity: "success" }));
      handleContactDialogClose();
    } catch (error: any) {
      dispatch(showAlert({
        message: error?.data?.message || "Failed to submit booking. Please try again.",
        severity: "error"
      }));
    }
  };

  // Handle Submit for custom_form (from contact info page)
  const handleCustomFormSubmit = async (data: ContactDetails) => {
    if (!selectedService || !username) return;
    setContactDetails(data);
    try {
      const email = data.email?.trim();
      // Convert formFieldValues to responses array using helper
      const responses = transformFormResponses(formFieldValues, selectedService);

      await createBooking({
        username,
        body: {
          clientName: data.fullName,
          ...(email ? { clientEmail: email } : {}),
          clientCountryCode: profile?.countryCode || "+1",
          clientPhone: data.phoneNumber,
          serviceId: selectedService.id,
          type: "booking",
          responses: responses.length > 0 ? responses : undefined,
        },
      }).unwrap();

      dispatch(showAlert({ message: "Booking request submitted successfully!", severity: "success" }));
      handleContactDialogClose();
    } catch (error: any) {
      dispatch(showAlert({
        message: error?.data?.message || "Failed to submit booking. Please try again.",
        severity: "error"
      }));
    }
  };

  // Handle Submit for inquiry
  const handleInquirySubmit = async (data: ContactDetails) => {
    if (!username) return;
    setContactDetails(data);
    try {
      const email = data.email?.trim();
      await createBooking({
        username,
        body: {
          clientName: data.fullName,
          ...(email ? { clientEmail: email } : {}),
          clientCountryCode: profile?.countryCode || "+1",
          clientPhone: data.phoneNumber,
          type: "inquiry",
          description: data.description || "",
        },
      }).unwrap();

      dispatch(showAlert({ message: "Inquiry submitted successfully!", severity: "success" }));
      handleInquiryDialogClose();
    } catch (error: any) {
      dispatch(showAlert({
        message: error?.data?.message || "Failed to submit inquiry. Please try again.",
        severity: "error"
      }));
    }
  };

  if (isLoading) {
    return <ClientPageSkeleton />;
  }

  // Error state
  if (error || !profile) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {(error as any)?.data?.message || "Profile not found or subscription not active."}
        </Alert>
      </Box>
    );
  }

  const profilePhotoUrl = profile.profilePhoto ? getCloudFrontUrl(profile.profilePhoto) : "./assets/images/avatar.png";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Logo at top */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <img
            src="/assets/icons/ravwork_logo_icon.svg"
            alt="Ravwork Logo"
            style={{ width: "32px", height: "32px" }}
          />
        </Box>

        {/* Profile Card */}
        <Card
          sx={{
            backgroundColor: "#D2E7FF",
            borderRadius: "16px",
            p: 3,
            mb: 4,
            boxShadow: "none",
          }}
        >
          <Box display="flex" gap="28px">
            {/* Desktop Avatar */}

            <Avatar
              sx={{
                width: { xs: "75px", sm: "175px" },
                height: { xs: "75px", sm: "175px" },
                border: "2px solid #fff",
                display: { xs: "none", sm: "flex" },
              }}
              src={profilePhotoUrl}
             

            />

            <Stack width="100%">
              {/* Name + Share */}
              <Box
                display="flex"
                flexDirection={{ xs: "column-reverse", sm: "row" }}
                justifyContent="space-between"
                gap="8px"
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#111927",
                      mb: 0.5,
                      fontSize: { xs: "20px", md: "18px" },
                    }}
                  >
                    {profile.displayName || profile.username}
                  </Typography>
                  <img src="/assets/icons/line.svg" alt="" />

                  {/* Social Links */}
                  {(profile.facebookUrl?.trim() ||
                    profile.linkedinUrl?.trim() ||
                    profile.instagramUrl?.trim()) && (
                      <Box mt={1}>

                        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                          {profile.facebookUrl?.trim() && (
                            <IconButton
                              size="small"
                              sx={{ width: 32, height: 32, p: 0.5 }}
                              onClick={() =>
                                window.open(profile.facebookUrl!, "_blank")
                              }
                            >
                              <img
                                src="/assets/icons/Facebook.svg"
                                alt="Facebook"
                                style={{ width: 24, height: 24 }}
                              />
                            </IconButton>
                          )}

                          {profile.linkedinUrl?.trim() && (
                            <IconButton
                              size="small"
                              sx={{ width: 32, height: 32, p: 0.5 }}
                              onClick={() =>
                                window.open(profile.linkedinUrl!, "_blank")
                              }
                            >
                              <img
                                src="/assets/icons/linkedin.svg"
                                alt="LinkedIn"
                                style={{ width: 24, height: 24 }}
                              />
                            </IconButton>
                          )}

                          {profile.instagramUrl?.trim() && (
                            <IconButton
                              size="small"
                              sx={{ width: 32, height: 32, p: 0.5 }}
                              onClick={() =>
                                window.open(profile.instagramUrl!, "_blank")
                              }
                            >
                              <img
                                src="/assets/icons/instagram.svg"
                                alt="Instagram"
                                style={{ width: 24, height: 24 }}
                              />
                            </IconButton>
                          )}
                        </Stack>
                      </Box>
                    )}
                </Box>

                {/* Mobile Avatar + Share */}
                <Box
                  display="flex"
                  gap={1}
                  alignItems="flex-start"
                >
                  <Avatar
                    sx={{
                      width: "75px",
                      height: "75px",
                      border: "2px solid #fff",
                      display: { xs: "flex", sm: "none" },
                    }}
                    src={profilePhotoUrl}
                    
                  />

                  <Button
                    variant="blackbutton"
                    sx={{
                      ml: { xs: "auto", sm: 0 },
                    }}
                    startIcon={
                      <>
                        <img
                          src="/assets/icons/share-arroww.svg"
                          alt="Share"
                          className="icon-default"
                          style={{ width: 16, height: 16 }}
                        />
                        <img
                          src="/assets/icons/share-arrow.svg"
                          alt="Share"
                          className="icon-hover"
                          style={{ width: 16, height: 16 }}
                        />
                      </>
                    }
                    onClick={() => setShareModalOpen(true)}
                  >
                    Share
                  </Button>
                </Box>
              </Box>

              {/* Description */}
              <Typography
                sx={{
                  color: "#6C737F",
                  fontWeight: 600, // slightly bolder
                  fontSize: "14px",
                  lineHeight: "20px",
                  mt: 1,
                }}
              >
                {profile.businessDescription || "No description available."}
              </Typography>
            </Stack>
          </Box>
        </Card>


        {/* Services Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          {services.length === 0 ? (
            <Stack
              sx={{
                gridColumn: "1 / -1",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                gap: 2,
              }}
            >
              <Box
                component="img"
                src="/assets/icons/service_offered_icons/quick_contact.svg"
                alt="No services"
                sx={{
                  width: 66,
                  height: 66,
                }}
              />
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#111927",
                  textAlign: "center",
                }}
              >
                No service added yet!
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#6C737F",
                  textAlign: "center",
                  maxWidth: "400px",
                }}
              >
                {profile?.displayName || username || "This provider"} hasn't added any service yet visit again to check the services.
              </Typography>
            </Stack>
          ) : (
            services.map((service) => (
              <Card
                key={service.id}
                sx={{
                  backgroundColor: "#F7F9FB",
                  borderRadius: "12px",
                  p: 2.5,
                  boxShadow: "none",
                  border: "1px solid #E5E7EB",
                  height: "100%",
                }}
              >
                <Stack spacing={2} sx={{ width: "100%" }}>
                  {/* Icon and Title */}
                  <Stack spacing={1.5} alignItems="flex-start" sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        width: "39px",
                        height: "39px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={
                          service.contactMethod === "quick_contact"
                            ? "/assets/icons/service_offered_icons/quick_contact_client.svg"
                            : "/assets/icons/service_offered_icons/custom_form.svg"
                        }
                      // alt="Service"
                      />
                    </Box>
                    <Box sx={{ flex: 1, width: "100%" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#111927",
                          fontSize: "18px",
                          mb: 0.5,
                        }}
                      >
                        {service.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6C737F",
                          fontWeight: 500,
                          fontSize: "16px",
                          mb: 1,
                          minHeight: "24px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {service.description || ""}
                      </Typography>
                      <Box
                        sx={{
                          height: 5,
                          borderTop: "1px solid #ffffff",
                          mt: "20px",
                          mb: "20px",
                        }}
                      />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          width: "100%",
                        }}
                      >
                        {service.price > 0 ? (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#111927",
                              fontSize: { xs: "24px", sm: "30px" },
                            }}
                          >
                            ${service.price}
                          </Typography>
                        ) : (
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 500,

                              color: "#111927",
                              fontSize: { xs: "14px", sm: "20px" },
                            }}
                          >
                            Price on Request
                          </Typography>
                        )}
                        <Button
                          variant="contained"
                          onClick={() => handleBookNow(service)}
                          sx={{
                            backgroundColor: "#111927",
                            color: "#fff",
                            textTransform: "none",
                            width: { xs: "170px", sm: "170px" },
                            height: "36px",
                            fontSize: "14px",
                            fontWeight: 500,
                            borderRadius: "50px",
                            py: 1.25,
                            flexShrink: 0,
                            ml: 0,
                            "&:hover": {
                              backgroundColor: "#384250",
                            },
                          }}
                        >
                          Book Now
                        </Button>
                      </Stack>

                    </Box>
                  </Stack>
                  {service.responseTime && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6C737F",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ fontWeight: 600, color: "#111927" }}
                      >
                        Response Time :
                      </Box>{" "}
                      {service.responseTime
                        .split("_")
                        .join(" ")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </Typography>
                  )}


                </Stack>
              </Card>
            ))
          )}
        </Box>

        {/* Have a Question Section */}
        <Card
          sx={{
            backgroundColor: "#F7F9FB",
            borderRadius: "12px",
            p: 3,
            mb: 3,
            boxShadow: "none",
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#FEF7C3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img src="/assets/icons/Questionsicon.svg" alt="Question" />
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={{ xs: 2, sm: 0 }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{

                    fontWeight: 600,
                    color: "#111927",
                    fontSize: "18px",
                    mb: 0.5,
                  }}
                >
                  Have a question?
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#6C737F",
                    fontSize: 14,
                  }}
                >
                  Provide your contact info.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleRequestClick}
                sx={{
                  backgroundColor: "#111927",
                  color: "#fff",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  height: "36px",
                  borderRadius: "50px",
                  py: 1.25,
                  width: { xs: "170px", sm: "170px" },
                  "&:hover": {
                    backgroundColor: "#384250",
                  },
                }}
              >
                Request
              </Button>
            </Stack>
          </Stack>
        </Card>

        {/* Quick Contact Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: { xs: "20px", sm: "28px" },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#111927",
              fontSize: { xs: "18px", sm: "24px" },
              mb: 2,
              textAlign: "center",
            }}
          >
            Quick Contact
          </Typography>
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ gap: { xs: 1, sm: 2 } }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: "#E5E7EB",
                color: "#111927",
                textTransform: "none",
                fontSize: { xs: "12px", sm: "14px" },
                fontWeight: 500,
                borderRadius: "8px",
                px: { xs: 1.5, sm: 2.5 },
                py: 1,
                minWidth: "auto",
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
                height: "36px",
                width: { xs: "130px", sm: "170px" },
              }}
              startIcon={
                <img
                  src="/assets/icons/phone.svg"
                  alt="Call"
                  style={{ width: "18px", height: "18px" }}
                />
              }
              onClick={() => {
                if (profile?.phoneNumber) {
                  setPhoneNumberDialogOpen(true);
                }
              }}
            >
              Call Now
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#E5E7EB",
                color: "#111927",
                textTransform: "none",
                fontSize: { xs: "12px", sm: "14px" },
                fontWeight: 500,
                borderRadius: "8px",
                px: { xs: 1.5, sm: 2.5 },
                py: 1,
                minWidth: "auto",
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
                height: "36px",
                width: { xs: "130px", sm: "170px" },
              }}
              startIcon={
                <img
                  src="/assets/icons/message-square.svg"
                  alt="Text"
                  style={{ width: "18px", height: "18px" }}
                />
              }
              onClick={() => {
                if (profile?.phoneNumber) {
                  setPhoneNumberDialogOpen(true);
                }
              }}
            >
              Text Us
            </Button>
          </Stack>
        </Box>

        {/* Footer - Powered by Ravwork */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
          }}
        >
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="center"
            mb={{ xs: "40px", sm: "68px" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/landing-page");
            }}
            sx={{
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#111927",
                fontSize: { xs: "16px", sm: "24px" },
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Powered by
            </Typography>
            <Box
              component="img"
              src="/assets/icons/ravwork_logo_icon.svg"
              alt="Ravwork"
              sx={{
                width: { xs: "35px", sm: "59px" },
                height: { xs: "28px", sm: "47px" }
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#111927",
                fontSize: { xs: "16px", sm: "24px" },
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Ravwork
            </Typography>
          </Stack>

          {/* Footer Links */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              gap: { xs: 1.5, sm: 0 },
              px: { xs: 2, sm: "28px" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: colors["Base-Dark"],
                fontSize: { xs: "14px", sm: "18px" },
                fontWeight: 500,
              }}
            >
              support@ravwork.com
            </Typography>
            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 3 }}
            >
              <Typography
                variant="body2"
                onClick={() => setPrivacyPolicyModalOpen(true)}
                sx={{
                  color: colors["Base-Dark"],
                  fontSize: { xs: "14px", sm: "18px" },
                  fontWeight: 500,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body2"
                onClick={() => setTermsModalOpen(true)}
                sx={{
                  color: colors["Base-Dark"],
                  fontSize: { xs: "14px", sm: "18px" },
                  fontWeight: 500,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Terms of Service
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Contact Details Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={handleContactDialogClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            width: { xs: "100%", sm: "600px" },
            maxWidth: { xs: "100%", sm: "600px" },
            minWidth: { xs: "100%", sm: "600px" },
            margin: { xs: 0, sm: "auto" },
            borderRadius: { xs: "0px", sm: "16px" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            height: { xs: "100vh", sm: "auto" },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            pt: { xs: "20px", sm: 0 },
            height: { xs: "100%", sm: "auto" },
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <ClientContactInfoPage
            onClose={handleContactDialogClose}
            onBack={selectedService?.contactMethod === "custom_form" && selectedService?.formFields && selectedService.formFields.length > 0
              ? handleBackToQuestions
              : undefined}
            onNext={handleNextToQuestions}
            onSubmit={selectedService?.contactMethod === "custom_form" && selectedService?.formFields && selectedService.formFields.length > 0
              ? handleCustomFormSubmit
              : handleQuickContactSubmit}
            contactDetails={contactDetails}
            setContactDetails={setContactDetails}
            isQuickContact={selectedService?.contactMethod === "quick_contact"}
            isSubmitting={isSubmitting}
            isFromCustomQuestions={selectedService?.contactMethod === "custom_form" && selectedService?.formFields && selectedService.formFields.length > 0}
          />
        </DialogContent>
      </Dialog>

      {/* Additional Questions Dialog (for custom_form) */}
      <Dialog
        open={questionsDialogOpen}
        onClose={handleQuestionsDialogClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            width: { xs: "100%", sm: "600px" },
            maxWidth: { xs: "100%", sm: "600px" },
            minWidth: { xs: "100%", sm: "600px" },
            margin: { xs: 0, sm: "auto" },
            borderRadius: { xs: "0px", sm: "16px" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            height: { xs: "100vh", sm: "auto" },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            pt: { xs: "20px", sm: 0 },
            height: { xs: "100%", sm: "auto" },
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <ClientQuestionsPage
            onClose={handleQuestionsDialogClose}
            onSubmit={() => { }}
            onNext={handleNextToContactInfo}
            formFields={selectedService?.formFields || []}
            formFieldValues={formFieldValues}
            setFormFieldValues={setFormFieldValues}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Inquiry Dialog */}
      <Dialog
        open={inquiryDialogOpen}
        onClose={handleInquiryDialogClose}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            width: { xs: "100%", sm: "auto" },
            maxWidth: { xs: "100%", sm: "600px" },
            margin: { xs: 0, sm: "auto" },
            borderRadius: { xs: "0px", sm: "16px" },
            maxHeight: { xs: "100vh", sm: "90vh" },
            height: { xs: "100vh", sm: "auto" },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            pt: { xs: "20px", sm: 0 },
            height: { xs: "100%", sm: "auto" },
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <ClientContactInfoPage
            onClose={handleInquiryDialogClose}
            onNext={() => { }}
            onSubmit={handleInquirySubmit}
            contactDetails={contactDetails}
            setContactDetails={setContactDetails}
            isQuickContact={false}
            isInquiry={true}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        profileUrl={window.location.href}
        profileName={profile?.displayName || profile?.username || ""}
      />

      {/* Phone Number Dialog */}
      <Dialog
        open={phoneNumberDialogOpen}
        onClose={() => setPhoneNumberDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: "16px 16px 0 0", sm: "16px" },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: "90vh", sm: "auto" },
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "18px", sm: "20px" },
              fontWeight: 600,
              color: "#111927",
            }}
          >
            Contact Number
          </Typography>
          <IconButton
            onClick={() => setPhoneNumberDialogOpen(false)}
            sx={{
              color: "#6C737F",
              p: 0.5,
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 3, sm: 3 },
            pt: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                color: "#6C737F",
                textAlign: "center",
              }}
            >
              Phone Number
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "20px", sm: "24px" },
                fontWeight: 600,
                color: "#111927",
                textAlign: "center",
                wordBreak: "break-all",
              }}
            >
              {profile?.countryCode && profile?.phoneNumber
                ? `${profile.countryCode} ${profile.phoneNumber}`
                : profile?.phoneNumber || "Not available"}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog
        open={privacyPolicyModalOpen}
        onClose={() => setPrivacyPolicyModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { sm: "16px" },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: "100vh", sm: "90vh" },
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "18px", sm: "20px" },
              fontWeight: 600,
              color: "#111927",
              mt: "10px",
            }}
          >
            Privacy Policy – Ravwork Link
          </Typography>
          <IconButton
            onClick={() => setPrivacyPolicyModalOpen(false)}
            sx={{
              color: "#6C737F",
              p: 0.5,
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 3, sm: 3 },
            pt: 2,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Box sx={{ maxWidth: "900px", mx: "auto" }}>
            <Typography variant="body2" sx={{ mb: 4, color: "#6C737F" }}>
              Last Updated: 1/24/2026
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-line" }}>
                  This <span style={{ fontWeight: 600 }}>Privacy Policy</span> explains how <span style={{ fontWeight: 600 }}>Ravwork, Inc.</span> ("<span style={{ fontWeight: 600 }}>Ravwork</span>," "<span style={{ fontWeight: 600 }}>we</span>," "<span style={{ fontWeight: 600 }}>us</span>," or "<span style={{ fontWeight: 600 }}>our</span>") collects, uses,
                  and protects information when you use <span style={{ fontWeight: 600 }}>Ravwork Link</span>, including the website, application, and
                  related services (collectively, the "<span style={{ fontWeight: 600 }}>Service</span>").
                  {"\n\n"}
                  By using <span style={{ fontWeight: 600 }}>Ravwork Link</span>, you agree to this <span style={{ fontWeight: 600 }}>Privacy Policy</span>. If you do not agree, do not use the
                  <span style={{ fontWeight: 600 }}>Service</span>.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  1. Information We Collect
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  We collect only the information necessary to operate Ravwork Link
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  1.1 Information You Provide
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  When you create an account or use the Service, we may collect:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Name</Box>
                  <Box>• Email address</Box>
                  <Box>• Phone number</Box>
                  <Box>• Account credentials</Box>
                  <Box>• Service descriptions, pricing, and forms</Box>
                  <Box>• Any information submitted through custom forms you create</Box>
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  1.2 Information Collected Automatically
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  We may collect:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                  <Box>• IP address</Box>
                  <Box>• Device and browser information</Box>
                  <Box>• Usage data (pages visited, actions taken)</Box>
                  <Box>• Log and diagnostic data</Box>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  2. How We Use Information
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  We use your information <span style={{ fontWeight: 600 }}>only to operate and improve Ravwork Link</span>, including to:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Provide and maintain the Service</Box>
                  <Box>• Create and manage user accounts</Box>
                  <Box>• Deliver SMS and email notifications</Box>
                  <Box>• Enable platform features and APIs</Box>
                  <Box>• Process subscriptions and billing</Box>
                  <Box>• Prevent fraud, abuse, or illegal activity</Box>
                  <Box>• Comply with legal obligations</Box>
                </Typography>
                <Typography variant="body2">
                  We <span style={{ fontWeight: 600 }}>do not sell your personal data.</span>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  3. SMS & Email Communications
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  By creating an account, you consent to receive:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Transactional emails</Box>
                  <Box>• SMS notifications related to:</Box>
                  <Box sx={{ pl: 2 }}>○ Submissions</Box>
                  <Box sx={{ pl: 2 }}>○ Account activity</Box>
                  <Box sx={{ pl: 2 }}>○ Platform onboarding</Box>
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  These communications are <span style={{ fontWeight: 600 }}>not marketing messages.</span>
                </Typography>
                <Typography variant="body2">
                  You may disable SMS notifications at any time through your account settings.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  4. APIs & Third-Party Services
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  To operate Ravwork Link, we use trusted third-party service providers, including:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Hosting and infrastructure providers</Box>
                  <Box>• Email delivery services</Box>
                  <Box>• SMS messaging providers</Box>
                  <Box>• Payment processors (for Ravwork subscription billing only)</Box>
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  These providers may process limited data <span style={{ fontWeight: 600 }}>only as required to perform their services for </span>
                  Ravwork.
                </Typography>
                <Typography variant="body2">
                  We do <span style={{ fontWeight: 600 }}>not</span> authorize third parties to use your data for their own marketing purposes.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  5. Payments
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Ravwork collects payment information <span style={{ fontWeight: 600 }}>only for Ravwork subscription billing.</span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ravwork:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Does <span style={{ fontWeight: 600 }}>not</span> collect client payments</Box>
                  <Box>• Does <span style={{ fontWeight: 600 }}>not</span> process transactions between users and clients</Box>
                  <Box>• Is <span style={{ fontWeight: 600 }}>not</span> responsible for disputes or payments outside the platform</Box>
                </Typography>
                <Typography variant="body2">
                  Payment processing is handled securely by third-party processors.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  6. User Content & Forms
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Any content or form data you create is:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Stored only to operate Ravwork Link </Box>
                  <Box>• Accessible by you and those you choose to share it with</Box>
                </Typography>
                <Typography variant="body2">
                  You are responsible for the content you collect from others using your Ravwork Link.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  7. Data Sharing
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  We may share information:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• With service providers required to operate the platform</Box>
                  <Box>• If required by law, subpoena, or legal process</Box>
                  <Box>• To protect the rights, safety, or property of Ravwork or others</Box>
                </Typography>
                <Typography variant="body2">
                  We <span style={{ fontWeight: 600 }}>do not sell or rent personal information.</span>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  8. Data Retention
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  We retain information:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• For as long as your account is active</Box>
                  <Box>• As needed to operate the Service</Box>
                  <Box>• As required by law or legitimate business purposes</Box>
                </Typography>
                <Typography variant="body2">
                  You may request account deletion by contacting us.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  9. Security
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  We use reasonable administrative, technical, and organizational measures to protect
                  information.
                  {"\n\n"}
                  However, <span style={{ fontWeight: 600 }}>no system is 100% secure</span>, and we cannot guarantee absolute security.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  10. Children's Privacy
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ravwork Link is <span style={{ fontWeight: 600 }}>not intended for users under 18</span>.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  We do <span style={{ fontWeight: 600 }}>not</span> knowingly collect personal information from children.
                </Typography>
                <Typography variant="body2">
                  If you believe a minor has provided data, contact us for removal.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  11. Your Rights
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Depending on your location, you may have rights to:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Access your personal data</Box>
                  <Box>• Correct inaccurate data</Box>
                  <Box>• Request deletion of your data</Box>
                </Typography>
                <Typography variant="body2">
                  Requests can be sent to <span style={{ fontWeight: 600 }}>support@ravwork.com.</span>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  12. Changes to This Privacy Policy
                </Typography>
                <Typography variant="body2">
                  We may update this Privacy Policy at any time.
                  {"\n\n"}
                  Continued use of Ravwork Link after changes means you accept the updated policy.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, whiteSpace: "pre-line" }}>
                  If you have any questions about this Privacy Policy, our data practices, or wish to exercise your
                  privacy rights, you may contact us at:
                  {"\n\n"}
                  <span style={{ fontWeight: 600 }}>Company Name</span>: Ravwork, Inc.
                  {"\n"}
                  <span style={{ fontWeight: 600 }}>Entity Type</span>: Delaware C-Corporation
                  {"\n"}
                  <span style={{ fontWeight: 600 }}>Product</span>: Ravwork / Ravwork Link / ravwork.link
                  {"\n"}
                  <span style={{ fontWeight: 600 }}>Location</span>: Dearborn, Michigan, USA
                  {"\n"}
                  <span style={{ fontWeight: 600 }}>Email: support@ravwork.com</span>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: {  sm: "16px" },
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: "100vh", sm: "90vh" },
            position: { xs: "fixed", sm: "relative" },
            bottom: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: "auto" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "18px", sm: "20px" },
              fontWeight: 600,
              color: "#111927",
            }}
          >
            Ravwork Link – Terms & Conditions
          </Typography>
          <IconButton
            onClick={() => setTermsModalOpen(false)}
            sx={{
              color: "#6C737F",
              p: 0.5,
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 3, sm: 3 },
            pt: 2,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <Box sx={{ maxWidth: "900px", mx: "auto" }}>
            <Typography variant="body2" sx={{ mb: 4, color: "#6C737F" }}>
              Last Updated: 2/14/2026
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-line" }}>
                  These Terms & Conditions ("<span style={{ fontWeight: 600 }}>Terms</span>") govern your access to and use of <span style={{ fontWeight: 600 }}>Ravwork Link</span>, operated
                  by Ravwork, Inc., a Delaware corporation ("<span style={{ fontWeight: 600 }}>Ravwork</span>," "<span style={{ fontWeight: 600 }}>we</span>," "<span style={{ fontWeight: 600 }}>us</span>," or "<span style={{ fontWeight: 600 }}>our</span>").
                  {"\n\n"}
                  By accessing or using Ravwork Link (including any subdomains such as <span style={{ fontWeight: 600 }}>ravwork.link</span>), you
                  agree to be bound by these Terms. If you do not agree, do not use the platform.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  1. What Ravwork Link Is (and Is Not)
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Ravwork Link is a <span style={{ fontWeight: 600 }}>software-as-a-service (SaaS) tool</span> that allows users to create a personalized
                  link to display services, pricing, forms, and contact methods.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Ravwork is only a tool.
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  We do not:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Provide services</Box>
                  <Box>• Arrange, manage, or guarantee services</Box>
                  <Box>• Act as a marketplace, broker, agent, or intermediary</Box>
                  <Box>• Verify users, licenses, insurance, or qualifications</Box>
                  <Box>• Participate in transactions, payments, or disputes</Box>
                </Typography>
                <Typography variant="body2">
                  Any interaction, agreement, or service occurs <span style={{ fontWeight: 600 }}>solely between users and their clients</span>, at their
                  own risk.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  2. Eligibility
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 0 }}>
                  <Box>• You must be <span style={{ fontWeight: 600 }}>at least 18 years old</span> to use Ravwork Link.</Box>
                  <Box>• You may use the platform for <span style={{ fontWeight: 600 }}>any lawful purpose only</span>.</Box>
                  <Box>• Use of Ravwork Link for illegal, deceptive, harmful, or abusive activity is strictly
                  prohibited.</Box>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  3. Accounts & Subscriptions
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  3.1 Account Responsibility
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  You are responsible for:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• All activity under your account</Box>
                  <Box>• Maintaining accurate information</Box>
                  <Box>• Keeping login credentials secure</Box>
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  3.2 Subscription Fees
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ravwork Link currently offers paid subscriptions:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• <span style={{ fontWeight: 600 }}>$29/month</span>, or</Box>
                  <Box>• <span style={{ fontWeight: 600 }}>$240 Annually ($20/month)</span></Box>
                </Typography>
                <Typography variant="body2">
                  Fees are billed in advance and are <span style={{ fontWeight: 600 }}>non-refundable</span>, except where required by law.
                  {"\n"}
                  Ravwork may modify pricing or plans at any time with reasonable notice.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  4. Payments & Transactions
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 0 }}>
                  <Box>• Ravwork does not collect, process, hold, or manage client payments.</Box>
                  <Box>• Ravwork is <span style={{ fontWeight: 600 }}>not involved</span> in financial transactions between users and their clients.</Box>
                  <Box>• All pricing, payment methods, refunds, disputes, and chargebacks are handled <span style={{ fontWeight: 600 }}>entirely
                  by users</span>.</Box>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  5. User Content
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  5.1 Ownership
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  You retain ownership of all content you create or upload, including:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Service descriptions</Box>
                  <Box>• Pricing</Box>
                  <Box>• Forms</Box>
                  <Box>• Text, images, and other materials</Box>
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  5.2 License to Ravwork
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  By using Ravwork Link, you grant Ravwork a <span style={{ fontWeight: 600 }}>worldwide, perpetual, irrevocable, royalty-free
                  license</span> to:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                  <Box>• Host</Box>
                  <Box>• Store</Box>
                  <Box>• Display</Box>
                  <Box>• Transmit</Box>
                  <Box>• Modify (for technical or operational purposes)</Box>
                  <Box>• Remove such content</Box>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  This license is required to operate and improve the platform.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  6. Acceptable Use
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  You agree not to use Ravwork Link to:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Violate any law or regulation</Box>
                  <Box>• Misrepresent services or identity</Box>
                  <Box>• Harass, abuse, or harm others</Box>
                  <Box>• Collect data unlawfully</Box>
                  <Box>• Transmit malware or harmful code</Box>
                </Typography>
                <Typography variant="body2">
                  Ravwork may remove content or suspend accounts <span style={{ fontWeight: 600 }}>at its sole discretion</span>, without notice.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  7. No Verification & No Guarantees
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ravwork does not verify:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Licenses</Box>
                  <Box>• Insurance</Box>
                  <Box>• Backgrounds</Box>
                  <Box>• Certifications</Box>
                  <Box>• Service quality</Box>
                  <Box>• Identity accuracy</Box>
                </Typography>
                <Typography variant="body2">
                  You acknowledge that <span style={{ fontWeight: 600 }}>all use is at your own risk</span>.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  8. Platform Availability & Service Disclaimer
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  8.1 No Warranty of Availability
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Ravwork Link is provided "<span style={{ fontWeight: 600 }}>AS IS</span>" and "<span style={{ fontWeight: 600 }}>AS AVAILABLE</span>." Ravwork makes <span style={{ fontWeight: 600 }}>no representations
                  or warranties</span> of any kind regarding uptime, availability, reliability, performance, continuity, or
                  error-free operation of the platform.
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  8.2 Service Interruptions
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Ravwork may experience interruptions, delays, outages, errors, data loss, or other technical
                  issues due to maintenance, system failures, third-party services, force majeure events, or other
                  causes. Ravwork reserves the right to modify, suspend, or discontinue any aspect of the
                  platform at any time, with or without notice.
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  8.3 No Liability for Lost Business or Revenue
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  To the <span style={{ fontWeight: 600 }}>maximum extent permitted by law</span>, <span style={{ fontWeight: 600 }}>Ravwork shall not be liable for any loss of profits,
                  loss of revenue, loss of clients, loss of business opportunities, loss of data, business
                  interruption, reputational harm, or any other economic or consequential damages</span>, arising
                  out of or related to:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Platform downtime or unavailability</Box>
                  <Box>• Service interruptions or delays</Box>
                  <Box>• Errors, bugs, or technical failures</Box>
                  <Box>• Suspension or termination of access</Box>
                  <Box>• Reliance on the platform for business operations</Box>
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  8.4 Assumption of Risk
                </Typography>
                <Typography variant="body2">
                  You acknowledge and agree that you use Ravwork Link <span style={{ fontWeight: 600 }}>at your own risk</span> and that the platform
                  is <span style={{ fontWeight: 600 }}>not guaranteed to generate clients, revenue, leads, or business results of any kind</span>.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  9. Communications (SMS & Email)
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  By creating an account, you consent to receive:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Transactional emails</Box>
                  <Box>• SMS notifications related to submissions, account activity, and onboarding</Box>
                </Typography>
                <Typography variant="body2">
                  SMS notifications can be disabled in account settings.
                  {"\n"}
                  Messages are <span style={{ fontWeight: 600 }}>non-marketing</span> and directly related to platform functionality.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  10. Data & Privacy
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ravwork collects and uses data <span style={{ fontWeight: 600 }}>only to operate Ravwork Link</span>, including:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                  <Box>• Platform functionality</Box>
                  <Box>• Notifications</Box>
                  <Box>• APIs and infrastructure services (e.g., SMS/email providers)</Box>
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  We do <span style={{ fontWeight: 600 }}>not</span> sell user data.
                </Typography>
                <Typography variant="body2">
                  Use of Ravwork Link is also governed by our <span style={{ fontWeight: 600 }}>Privacy Policy</span>, which is incorporated into these
                  Terms by reference.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  11. Safety & Emergency Disclaimer
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ravwork Link is <span style={{ fontWeight: 600 }}>not intended for emergency, urgent, or safety-critical use</span>.
                </Typography>
                <Typography variant="body2">
                  Ravwork is not responsible for:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                  <Box>• Physical injury</Box>
                  <Box>• Property damage</Box>
                  <Box>• Losses resulting from user interactions or services</Box>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  12. Termination
                </Typography>
                <Typography variant="body2">
                  Ravwork may:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                  <Box>• Suspend or terminate any account</Box>
                  <Box>• Remove any content</Box>
                  <Box>• Deny access to the platform</Box>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <span style={{ fontWeight: 600 }}>At any time, for any reason, with or without notice</span>, and without liability.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  13. Limitation of Liability
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  To the <span style={{ fontWeight: 600 }}>maximum extent permitted by law</span>, Ravwork shall <span style={{ fontWeight: 600 }}>not be liable</span> for any indirect,
                  incidental, consequential, special, or punitive damages.
                </Typography>
                <Typography variant="body2">
                  Ravwork's total liability shall <span style={{ fontWeight: 600 }}>not exceed the amount paid by you to Ravwork in the prior 12
                  months, or $0 if none was paid</span>.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  14. Indemnification
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  You agree to indemnify, defend, and hold harmless Ravwork, Inc. from any claims, damages,
                  losses, liabilities, and expenses arising from:
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                  <Box>• Your use of Ravwork Link</Box>
                  <Box>• Your content</Box>
                  <Box>• Your services</Box>
                  <Box>• Your interactions with clients or third parties</Box>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  15. Arbitration & Class Action Waiver
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  15.1 Binding Arbitration
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  All disputes shall be resolved by <span style={{ fontWeight: 600 }}>binding arbitration conducted remotely</span>, not in court.
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                  15.2 No Class Actions
                </Typography>
                <Typography variant="body2">
                  You agree to resolve disputes <span style={{ fontWeight: 600 }}>individually</span>, and waive any right to participate in a class,
                  collective, or representative action.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  16. Governing Law
                </Typography>
                <Typography variant="body2">
                  These Terms are governed by the laws of the <span style={{ fontWeight: 600 }}>State of Delaware</span>, without regard to
                  conflict-of-law principles.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  17. Changes to These Terms
                </Typography>
                <Typography variant="body2">
                  Ravwork may update these Terms at any time. Continued use of Ravwork Link constitutes
                  acceptance of the updated Terms.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                  18. Contact Information
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  📧 <span style={{ fontWeight: 600 }}>support@ravwork.com</span>
                  {"\n\n"}
                  <span style={{ fontWeight: 600 }}>Company:</span>
                  {"\n"}
                  Ravwork, Inc.
                  {"\n"}
                  Dearborn, Michigan, USA
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
