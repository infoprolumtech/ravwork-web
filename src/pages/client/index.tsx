import { type JSX } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Avatar,
  IconButton,
  Container,
} from "@mui/material";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  iconColor: string;
  iconType: "lightning" | "document";
}

// Mock data - replace with API call
const mockServices: Service[] = [
  {
    id: "1",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$150",
    iconColor: "#12B76A",
    iconType: "lightning",
  },
  {
    id: "2",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$150",
    iconColor: "#4693DD",
    iconType: "document",
  },
  {
    id: "3",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$150",
    iconColor: "#12B76A",
    iconType: "lightning",
  },
  {
    id: "4",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$150",
    iconColor: "#4693DD",
    iconType: "document",
  },
  {
    id: "5",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$150",
    iconColor: "#12B76A",
    iconType: "lightning",
  },
  {
    id: "6",
    title: "Plumbing Repair",
    description: "Fix a leaking kitchen faucet",
    price: "$150",
    iconColor: "#4693DD",
    iconType: "document",
  },
];

export default function ClientPage(): JSX.Element {
  const { username } = useParams<{ username: string }>();

  // TODO: Use username to fetch user data from API
  console.log("Username from URL:", username);

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
          <Box display={"flex"} gap={'28px'}>
            <Avatar
              sx={{
                width: { xs: "75px", sm: "175px" },
                height: { xs: "75px", sm: "175px" },
                border: "2px solid #fff",
                display:{xs:"none", sm:"block"}
              }}
              src="/assets/images/avatar.png"
              alt="Profile"
            />
            <Stack
              display="flex"
              justifyContent="space-between"
              width={"100%"}
            >
              <Box display={"flex"} flexDirection={{xs:'column-reverse', sm:'row'}} justifyContent={"space-between"} gap={'4px'}>
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
                    Joe's Plumbing Service
                  </Typography>
                  <img src="/assets/icons/line.svg" />
                  <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                    <IconButton
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        p: 0.5,
                      }}
                    >
                      <img
                        src="/assets/icons/Facebook.svg"
                        alt="Facebook"
                        style={{ width: "24px", height: "24px" }}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        p: 0.5,
                      }}
                    >
                      <img
                        src="/assets/icons/linkedin.svg"
                        alt="LinkedIn"
                        style={{ width: "24px", height: "24px" }}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        p: 0.5,
                      }}
                    >
                      <img
                        src="/assets/icons/instagram.svg"
                        alt="Instagram"
                        style={{ width: "24px", height: "24px" }}
                      />
                    </IconButton>
                  </Stack>
                </Box>
                <Box display="flex" alignItems="flex-start" justifyContent={'space-between'}>
                  <Avatar
              sx={{
                width: { xs: "75px", sm: "175px" },
                height: { xs: "75px", sm: "175px" },
                border: "2px solid #fff",
                display:{xs:"block", sm:"none"}
              }}
              src="/assets/images/avatar.png"
              alt="Profile"
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
                  >
                    Share
                  </Button>
                </Box>
              </Box>
              <Typography
                sx={{
                  color: "#6C737F",
                  fontWeight: 400,
                  fontSize: "14px",
                  listspacing: "12px",
                  lineHeight: "20px",
                }}
              >
                Licensed & insured junk removal for homes and businesses.
                Same-day service available.
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
          {mockServices.map((service) => (
            <Card
              key={service.id}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                p: 2.5,
                boxShadow: "none",
                border: "1px solid #E5E7EB",
                height: "100%",
              }}
            >
              <Stack spacing={2}>
                {/* Icon and Title */}
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={service.iconType === "lightning" 
                        ? "/assets/icons/service_offered_icons/quick_contact.svg"
                        : "/assets/icons/service_offered_icons/custom_form.svg"
                      }
                      alt="Service"
                      style={{
                        width: "48px",
                        height: "48px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#111927",
                        fontSize: "18px",
                        mb: 0.5,
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6C737F",
                        fontSize: "14px",
                        mb: 1,
                      }}
                    >
                      {service.description}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#111927",
                        fontSize: "20px",
                      }}
                    >
                      {service.price}
                    </Typography>
                  </Box>
                </Stack>

                {/* Book Now Button */}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#111927",
                    color: "#fff",
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    borderRadius: "8px",
                    py: 1.25,
                    "&:hover": {
                      backgroundColor: "#384250",
                    },
                  }}
                >
                  Book Now
                </Button>
              </Stack>
            </Card>
          ))}
        </Box>

        {/* Have a Question Section */}
        <Card
          sx={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            p: 3,
            mb: 3,
            boxShadow: "none",
            border: "1px solid #E5E7EB",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#F59E0B",
                  }}
                >
                  ?
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#111927",
                    fontSize: "16px",
                    mb: 0.5,
                  }}
                >
                  Have a question?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6C737F",
                    fontSize: "14px",
                  }}
                >
                  Provide your contact info.
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#111927",
                color: "#fff",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "8px",
                px: 3,
                py: 1.25,
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  backgroundColor: "#384250",
                },
              }}
            >
              Request
            </Button>
          </Stack>
        </Card>

        {/* Quick Contact Section */}
        <Card
          sx={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            p: 3,
            mb: 4,
            boxShadow: "none",
            border: "1px solid #E5E7EB",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#111927",
              fontSize: "16px",
              mb: 2,
            }}
          >
            Quick Contact
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#E5E7EB",
                color: "#111927",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "8px",
                py: 1.25,
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
              }}
              startIcon={
                <img
                  src="/assets/icons/phone.svg"
                  alt="Call"
                  style={{ width: "20px", height: "20px" }}
                />
              }
            >
              Call Now
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#E5E7EB",
                color: "#111927",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "8px",
                py: 1.25,
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
              }}
              startIcon={
                <img
                  src="/assets/icons/sms.svg"
                  alt="Text"
                  style={{ width: "20px", height: "20px" }}
                />
              }
            >
              Text Us
            </Button>
          </Stack>
        </Card>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            pt: 3,
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: { xs: 1, sm: 0 } }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#9CA3AF",
                fontSize: "12px",
              }}
            >
              Powered by
            </Typography>
            <img
              src="/assets/icons/ravwork_logo_icon.svg"
              alt="Ravwork"
              style={{ width: "20px", height: "20px" }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#9CA3AF",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              Ravwork
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 3 }}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#9CA3AF",
                fontSize: "12px",
              }}
            >
              support@ravwork.com
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="body2"
                component="a"
                href="#"
                sx={{
                  color: "#9CA3AF",
                  fontSize: "12px",
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
                  color: "#9CA3AF",
                  fontSize: "12px",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Terms of Service
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
