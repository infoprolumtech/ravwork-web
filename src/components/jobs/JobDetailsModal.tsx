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
import { useGetJobByIdQuery } from "../../rtk/endpoints/userApi";
import { getCloudFrontUrl } from "../../utils/helper";

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
        paddingTop: { xs: "20px", sm: "24px", md: "32px" },
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
              {jobDetails.status === "completed" && jobDetails.finalPrice !== undefined && jobDetails.finalPrice !== null && jobDetails.finalPrice > 0 && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "13px", sm: "14px" },
                      fontWeight: 500,
                      color: "#6C737F",
                      mb: { xs: 0.25, sm: 0.5 },
                    }}
                  >
                    Job close price
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "15px", sm: "16px" },
                      fontWeight: 600,
                      color: "#111927",
                    }}
                  >
                    ${jobDetails.finalPrice.toFixed(2)}
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
                  {jobDetails.formResponses.map((response, index) => {
                    let answer = response.answer;
                    let imageUrls: string[] = [];
                    
                    // Check if answer is an array of image URLs
                    if (Array.isArray(answer)) {
                      imageUrls = answer
                        .filter((item) => item && String(item).trim() !== "")
                        .map((item) => String(item).trim())
                        .filter((item) => item.startsWith("http"));
                    } else if (typeof answer === "string" && answer.trim().startsWith("[")) {
                      // If it's a string that looks like a JSON array, try to parse it
                      try {
                        const parsed = JSON.parse(answer);
                        if (Array.isArray(parsed)) {
                          imageUrls = parsed
                            .filter((item) => item && String(item).trim() !== "")
                            .map((item) => String(item).trim())
                            .filter((item) => item.startsWith("http"));
                        }
                      } catch (e) {
                        // If parsing fails, check if it's a single URL
                        if (answer.startsWith("http")) {
                          imageUrls = [answer];
                        }
                      }
                    } else if (typeof answer === "string" && answer.startsWith("http")) {
                      // Single image URL
                      imageUrls = [answer];
                    }
                    
                    const isImageField = imageUrls.length > 0;
                    
                    return (
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
                        {isImageField ? (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "repeat(2, 1fr)",
                                sm: "repeat(3, 1fr)",
                                md: "repeat(4, 1fr)",
                              },
                              gap: { xs: 1.5, sm: 2 },
                              mt: 1,
                            }}
                          >
                            {imageUrls.map((imageUrl, imgIndex) => (
                              <Box
                                key={imgIndex}
                                sx={{
                                  position: "relative",
                                  width: "100%",
                                  aspectRatio: "1",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  border: "1px solid #D1D5DB",
                                  cursor: "pointer",
                                  "&:hover": {
                                    opacity: 0.9,
                                  },
                                }}
                                onClick={() => {
                                  // Open image in new tab
                                  window.open(getCloudFrontUrl(imageUrl), "_blank");
                                }}
                              >
                                <Box
                                  component="img"
                                  src={getCloudFrontUrl(imageUrl)}
                                  alt={`${response.question} - Image ${imgIndex + 1}`}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            ))}
                          </Box>
                        ) : (
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
                              // Helper function to format ISO datetime strings
                              const formatDateTime = (value: any): string => {
                                const str = String(value).trim();
                                if (!str) return "";
                                
                                // Check if it's an ISO datetime string (format: YYYY-MM-DDTHH:MM:SS or YYYY-MM-DDTHH:MM:SSZ)
                                const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
                                if (isoDateTimeRegex.test(str)) {
                                  try {
                                    const date = new Date(str);
                                    if (!isNaN(date.getTime())) {
                                      // Format as: "January 14, 2026 at 9:25 PM"
                                      const dateStr = date.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      });
                                      const timeStr = date.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                      });
                                      return `${dateStr} at ${timeStr}`;
                                    }
                                  } catch (e) {
                                    // If parsing fails, return as is
                                  }
                                }
                                
                                return str;
                              };
                              
                              // If it's already an array, use it
                              if (Array.isArray(answer)) {
                                return answer
                                  .filter((item) => item && String(item).trim() !== "")
                                  .map((item) => formatDateTime(item))
                                  .join(" , ");
                              }
                              
                              // If it's a string that looks like a JSON array, try to parse it
                              if (typeof answer === "string" && answer.trim().startsWith("[")) {
                                try {
                                  const parsed = JSON.parse(answer);
                                  if (Array.isArray(parsed)) {
                                    return parsed
                                      .filter((item) => item && String(item).trim() !== "")
                                      .map((item) => formatDateTime(item))
                                      .join(" , ");
                                  }
                                } catch (e) {
                                  // If parsing fails, try to format as single datetime
                                  return formatDateTime(answer);
                                }
                              }
                              
                              // Otherwise, format as string (checking for datetime)
                              return formatDateTime(answer);
                            })()}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            </>
          )}

        </Stack>
      ) : null}
    </Stack>
  );
}

