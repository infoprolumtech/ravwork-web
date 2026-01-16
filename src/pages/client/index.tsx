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
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useGetPublicProfileQuery, useCreateBookingMutation, type PublicService, type FormFieldResponse } from "../../rtk/endpoints/publicApi";
import { getCloudFrontUrl } from "../../utils/helper";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import ClientContactInfoPage from "./components/ClientContactInfoPage";
import ClientQuestionsPage from "./components/ClientQuestionsPage";
import ShareModal from "./components/ShareModal";

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
      await createBooking({
        username,
        body: {
          clientName: data.fullName,
          clientEmail: data.email,
          clientCountryCode: profile?.countryCode || "+1",
          clientPhone: data.phoneNumber,
          serviceId: selectedService.id,
          type: "booking",
        },
      }).unwrap();

      dispatch(showAlert({ message: "Booking request submitted successfully!", severity: "success" }));
      handleContactDialogClose();
    } catch (error: any) {
      console.error("Submit error:", error);
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
      // Convert formFieldValues to responses array
      // Filter out empty values and ensure value is not null/undefined
      const responses: FormFieldResponse[] = Object.entries(formFieldValues)
        .filter(([fieldId, value]) => {
          // Filter out empty strings, null, undefined, and empty arrays
          if (value === null || value === undefined) return false;
          if (typeof value === "string" && value.trim() === "") return false;
          if (Array.isArray(value) && value.length === 0) return false;
          // For date_time fields, check if at least one value is present (for non-required fields)
          // or both are present (for required fields)
          if (typeof value === "object" && !Array.isArray(value)) {
            const dateTimeValue = value as { date?: string; time?: string };
            const field = selectedService?.formFields?.find(f => f.id === fieldId);
            // If field is required, both date and time must be present
            if (field?.isRequired) {
              return dateTimeValue.date && dateTimeValue.time && dateTimeValue.date !== "" && dateTimeValue.time !== "";
            }
            // If field is not required, allow if at least one is present
            return (dateTimeValue.date && dateTimeValue.date !== "") || (dateTimeValue.time && dateTimeValue.time !== "");
          }
          return true;
        })
        .map(([fieldId, value]) => {
          // Check if this is a date field (which now includes both date and time)
          const field = selectedService?.formFields?.find(f => f.id === fieldId);
          if (field?.fieldType === "date" && typeof value === "object" && !Array.isArray(value)) {
            const dateTimeValue = value as { date?: string; time?: string };
            // If both date and time are present, combine them
            if (dateTimeValue.date && dateTimeValue.time) {
              const combinedValue = `${dateTimeValue.date}T${dateTimeValue.time}:00`;
              return {
                fieldId,
                value: combinedValue,
              };
            }
            // If only date is present, return date only
            if (dateTimeValue.date) {
              return {
                fieldId,
                value: dateTimeValue.date,
              };
            }
            // If only time is present, return time only
            if (dateTimeValue.time) {
              return {
                fieldId,
                value: dateTimeValue.time,
              };
            }
          }
          // Also handle date_time for backward compatibility
          if (field?.fieldType === "date_time" && typeof value === "object" && !Array.isArray(value)) {
            const dateTimeValue = value as { date?: string; time?: string };
            // If both date and time are present, combine them
            if (dateTimeValue.date && dateTimeValue.time) {
              const combinedValue = `${dateTimeValue.date}T${dateTimeValue.time}:00`;
              return {
                fieldId,
                value: combinedValue,
              };
            }
            // If only date is present, return date only
            if (dateTimeValue.date) {
              return {
                fieldId,
                value: dateTimeValue.date,
              };
            }
            // If only time is present, return time only
            if (dateTimeValue.time) {
              return {
                fieldId,
                value: dateTimeValue.time,
              };
            }
          }
          return {
            fieldId,
            value: value as string | string[],
          };
        });

      await createBooking({
        username,
        body: {
          clientName: data.fullName,
          clientEmail: data.email,
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
      console.error("Submit error:", error);
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
      await createBooking({
        username,
        body: {
          clientName: data.fullName,
          clientEmail: data.email,
          clientCountryCode: profile?.countryCode || "+1",
          clientPhone: data.phoneNumber,
          type: "inquiry",
          description: data.description || "",
        },
      }).unwrap();

      dispatch(showAlert({ message: "Inquiry submitted successfully!", severity: "success" }));
      handleInquiryDialogClose();
    } catch (error: any) {
      console.error("Submit error:", error);
      dispatch(showAlert({
        message: error?.data?.message || "Failed to submit inquiry. Please try again.",
        severity: "error"
      }));
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <CircularProgress />
      </Box>
    );
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
        {/* <Card
          sx={{
            backgroundColor: "#D2E7FF",
            borderRadius: "16px",
            p: 3,
            mb: 4,
            boxShadow: "none",
          }}
        >
          <Box display="flex" gap="28px">
            <Avatar
              sx={{
                width: { xs: "75px", sm: "175px" },
                height: { xs: "75px", sm: "175px" },
                border: "2px solid #fff",
                display: { xs: "none", sm: "block" },
              }}
              src={profilePhotoUrl}
              alt={profile.displayName || profile.username}
            />
            <Stack
              display="flex"
              justifyContent="space-between"
              width={"100%"}
              gap={((profile.facebookUrl && profile.facebookUrl.trim()) || 
                (profile.linkedinUrl && profile.linkedinUrl.trim()) || 
                (profile.instagramUrl && profile.instagramUrl.trim())) ? undefined : 0}
            >
              <Box
                display={"flex"}
                flexDirection={{ xs: "column-reverse", sm: "row" }}
                justifyContent={"space-between"}
                gap={"4px"}
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
                  {((profile.facebookUrl && profile.facebookUrl.trim()) || 
                    (profile.linkedinUrl && profile.linkedinUrl.trim()) || 
                    (profile.instagramUrl && profile.instagramUrl.trim())) && (
                    <Box>
                      <img src="/assets/icons/line.svg" alt="" />
                  <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                        {profile.facebookUrl && profile.facebookUrl.trim() && (
                    <IconButton
                      size="small"
                            sx={{ width: 32, height: 32, p: 0.5 }}
                            onClick={() => window.open(profile.facebookUrl!, "_blank")}
                    >
                      <img
                        src="/assets/icons/Facebook.svg"
                        alt="Facebook"
                        style={{ width: "24px", height: "24px" }}
                      />
                    </IconButton>
                        )}
                        {profile.linkedinUrl && profile.linkedinUrl.trim() && (
                    <IconButton
                      size="small"
                            sx={{ width: 32, height: 32, p: 0.5 }}
                            onClick={() => window.open(profile.linkedinUrl!, "_blank")}
                    >
                      <img
                        src="/assets/icons/linkedin.svg"
                        alt="LinkedIn"
                        style={{ width: "24px", height: "24px" }}
                      />
                    </IconButton>
                        )}
                        {profile.instagramUrl && profile.instagramUrl.trim() && (
                    <IconButton
                      size="small"
                            sx={{ width: 32, height: 32, p: 0.5 }}
                            onClick={() => window.open(profile.instagramUrl!, "_blank")}
                    >
                      <img
                        src="/assets/icons/instagram.svg"
                        alt="Instagram"
                        style={{ width: "24px", height: "24px" }}
                      />
                    </IconButton>
                        )}
                  </Stack>
                </Box>
                  )}
                </Box>
                <Box
                  display="flex"
                  alignItems="flex-start"
                  justifyContent={"space-between"}
                >
                  <Avatar
              sx={{
                width: { xs: "75px", sm: "175px" },
                height: { xs: "75px", sm: "175px" },
                border: "2px solid #fff",
                      display: { xs: "block", sm: "none" },
              }}
                    src={profilePhotoUrl}
                    alt={profile.displayName || profile.username}
            />
                  <Button
                    variant="blackbutton"
                    startIcon={
                      <>
                        <img
                          src="/assets/icons/share-arroww.svg"
                          alt="Share"
                          className="icon-default"
                          style={{ width: "16px", height: "16px" }}
                        />
                        <img
                          src="/assets/icons/share-arrow.svg"
                          alt="Share"
                          className="icon-hover"
                          style={{ width: "16px", height: "16px" }}
                        />
                      </>
                    }
                    onClick={() => setShareModalOpen(true)}
                  >
                    Share
                  </Button>
                </Box>
              </Box>
              <Typography
                sx={{
                  color: "#6C737F",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  mt: ((profile.facebookUrl && profile.facebookUrl.trim()) || 
                    (profile.linkedinUrl && profile.linkedinUrl.trim()) || 
                    (profile.instagramUrl && profile.instagramUrl.trim())) ? 0 : -2,
                }}
              >
                {profile.businessDescription || "No description available."}
              </Typography>
            </Stack>
          </Box>
        </Card> */}

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
              // alt={profile.displayName || profile.username}
              
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
                    // alt={profile.displayName || profile.username}
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
                  window.location.href = `tel:${profile.countryCode}${profile.phoneNumber}`;
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
                  window.location.href = `sms:${profile.countryCode}${profile.phoneNumber}`;
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
                color: "#1C1C1C",
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
                component="a"
                href="#"
                sx={{
                  color: "#1C1C1C",
                  fontSize: { xs: "14px", sm: "18px" },
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body2"
                component="a"
                href="#"
                sx={{
                  color: "#1C1C1C",
                  fontSize: { xs: "14px", sm: "18px" },
                  fontWeight: 500,
                  textDecoration: "none",
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
    </Box>
  );
}
