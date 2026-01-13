import { type JSX } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useGetJobByIdQuery } from "../../../rtk/endpoints/userApi";
import type { JobDetails } from "../../../rtk/endpoints/userApi";

interface JobDetailsModalProps {
  jobId: string | null;
  onClose: () => void;
}

export default function JobDetailsModal({
  jobId,
  onClose,
}: JobDetailsModalProps): JSX.Element {
  const { data: jobDetails, isLoading, error } = useGetJobByIdQuery(jobId || "", {
    skip: !jobId,
  });

  if (!jobId) return <></>;

  return (
    <Stack
      sx={{
        paddingLeft: { xs: "20px", sm: "32px", md: "40px" },
        paddingRight: { xs: "20px", sm: "32px", md: "40px" },
        paddingTop: { xs: "12px", sm: "20px", md: "28px" },
        paddingBottom: { xs: "20px", sm: "32px", md: "40px" },
        display: "flex",
        flexDirection: "column",
        gap: { xs: "16px", sm: "20px", md: "24px" },
        width: "100%",
        maxHeight: { xs: "85vh", sm: "80vh" },
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "22px", sm: "24px", md: "28px" },
            fontWeight: 600,
            color: "#111927",
            flex: 1,
            pr: { xs: 1, sm: 2 },
          }}
        >
          Job Details
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            p: 0.5,
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Typography color="error">
            Failed to load job details. Please try again.
          </Typography>
        </Box>
      ) : jobDetails ? (
        <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* Service Information */}
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "19px", md: "20px" },
                fontWeight: 600,
                color: "#111927",
                mb: { xs: 1, sm: 1.25, md: 1.5 },
              }}
            >
              Service Information
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.25, md: 1.5 }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", sm: "14px" },
                    fontWeight: 500,
                    color: "#6C737F",
                    mb: { xs: 0.25, sm: 0.5 },
                  }}
                >
                  Service Name
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "15px", sm: "16px" },
                    fontWeight: 500,
                    color: "#111927",
                  }}
                >
                  {jobDetails.serviceName || jobDetails.service?.name || "N/A"}
                </Typography>
              </Box>
              {jobDetails.originalPrice > 0 && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "13px", sm: "14px" },
                      fontWeight: 500,
                      color: "#6C737F",
                      mb: { xs: 0.25, sm: 0.5 },
                    }}
                  >
                    Price
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "15px", sm: "16px" },
                      fontWeight: 500,
                      color: "#111927",
                    }}
                  >
                    ${jobDetails.originalPrice.toFixed(2)}
                  </Typography>
                </Box>
              )}
              {jobDetails.bookingDate && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "13px", sm: "14px" },
                      fontWeight: 500,
                      color: "#6C737F",
                      mb: { xs: 0.25, sm: 0.5 },
                    }}
                  >
                    Booking Date
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "15px", sm: "16px" },
                      fontWeight: 500,
                      color: "#111927",
                    }}
                  >
                    {new Date(jobDetails.bookingDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
              {jobDetails.bookingTime && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "13px", sm: "14px" },
                      fontWeight: 500,
                      color: "#6C737F",
                      mb: { xs: 0.25, sm: 0.5 },
                    }}
                  >
                    Booking Time
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "15px", sm: "16px" },
                      fontWeight: 500,
                      color: "#111927",
                    }}
                  >
                    {jobDetails.bookingTime}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* Client Information */}
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "19px", md: "20px" },
                fontWeight: 600,
                color: "#111927",
                mb: { xs: 1, sm: 1.25, md: 1.5 },
              }}
            >
              Client Information
            </Typography>
            <Stack spacing={{ xs: 1, sm: 1.25, md: 1.5 }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", sm: "14px" },
                    fontWeight: 500,
                    color: "#6C737F",
                    mb: { xs: 0.25, sm: 0.5 },
                  }}
                >
                  Name
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "15px", sm: "16px" },
                    fontWeight: 500,
                    color: "#111927",
                    wordBreak: "break-word",
                  }}
                >
                  {jobDetails.clientName || jobDetails.client?.name || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", sm: "14px" },
                    fontWeight: 500,
                    color: "#6C737F",
                    mb: { xs: 0.25, sm: 0.5 },
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "15px", sm: "16px" },
                    fontWeight: 500,
                    color: "#111927",
                    wordBreak: "break-word",
                  }}
                >
                  {jobDetails.clientEmail || jobDetails.client?.email || "N/A"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", sm: "14px" },
                    fontWeight: 500,
                    color: "#6C737F",
                    mb: { xs: 0.25, sm: 0.5 },
                  }}
                >
                  Phone
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "15px", sm: "16px" },
                    fontWeight: 500,
                    color: "#111927",
                    wordBreak: "break-word",
                  }}
                >
                  {jobDetails.client?.countryCode || ""}{" "}
                  {jobDetails.clientPhone ||
                    jobDetails.client?.phoneNumber ||
                    "N/A"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Description (for inquiry) */}
          {jobDetails.description && (
            <>
              <Divider />
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "18px", sm: "19px", md: "20px" },
                    fontWeight: 600,
                    color: "#111927",
                    mb: { xs: 1, sm: 1.25, md: 1.5 },
                  }}
                >
                  Description
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "15px", sm: "16px" },
                    fontWeight: 400,
                    color: "#111927",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {jobDetails.description}
                </Typography>
              </Box>
            </>
          )}

          {/* Form Responses */}
          {jobDetails.formResponses && jobDetails.formResponses.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "18px", sm: "19px", md: "20px" },
                    fontWeight: 600,
                    color: "#111927",
                    mb: { xs: 1, sm: 1.25, md: 1.5 },
                  }}
                >
                  Form Responses
                </Typography>
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                  {jobDetails.formResponses.map((response, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        backgroundColor: "#F7F9FB",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "13px", sm: "14px" },
                          fontWeight: 600,
                          color: "#111927",
                          mb: { xs: 0.75, sm: 1 },
                        }}
                      >
                        {response.question}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "15px", sm: "16px" },
                          fontWeight: 400,
                          color: "#384250",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {(() => {
                          let answer = response.answer;
                          
                          // If it's already an array, use it
                          if (Array.isArray(answer)) {
                            return answer
                              .filter((item) => item && String(item).trim() !== "")
                              .map((item) => String(item).trim())
                              .join(" , ");
                          }
                          
                          // If it's a string that looks like a JSON array, try to parse it
                          if (typeof answer === "string" && answer.trim().startsWith("[")) {
                            try {
                              const parsed = JSON.parse(answer);
                              if (Array.isArray(parsed)) {
                                return parsed
                                  .filter((item) => item && String(item).trim() !== "")
                                  .map((item) => String(item).trim())
                                  .join(" , ");
                              }
                            } catch (e) {
                              // If parsing fails, just return the string as is
                            }
                          }
                          
                          // Otherwise, return as string
                          return String(answer || "");
                        })()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </>
          )}

        </Stack>
      ) : null}
    </Stack>
  );
}

