import { type JSX } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import EarningsCard from "../../components/reusecard/Earnings";
import { StyledTextField } from "../../utils/helper";

export default function EarningsPage(): JSX.Element {
  const jobsData = [
    {
      name: "Sarah Johnson",
      jobType: "New Request",
      dateTime: "Nov 22, 2025 • 10:00 AM",
    },
    {
      name: "Sarah Johnson",
      jobType: "Plumbing Repair",
      dateTime: "No Date Available",
    },
    {
      name: "Sarah Johnson",
      jobType: "Plumbing Repair",
      dateTime: "Nov 22, 2025 • 10:00 AM",
    },
  ];
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
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <EarningsCard
            icon="/assets/icons/IconText.svg"
            label="Today’s Clicks"
            value="1,721k"
            percentage="+2.4%"
            theme="theme1"
          />
          <EarningsCard
            icon="/assets/icons/IconText.svg"
            label="Earnings this Week"
            value="367k"
            percentage="-5.2%"
            theme="theme2"
          />
          <EarningsCard
            icon="/assets/icons/IconText.svg"
            label="Earnings this Month"
            value="1,156"
            percentage="-11.2%"
            theme="theme1"
          />
        </Grid>
        <Stack sx={{ display: "flex", flexDirection: "row" }}>
          <StyledTextField
            sx={{ width: "450px", marginRight: "12px" }}
            variant="outlined"
            type="date"
            label="Select date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <StyledTextField
            sx={{ width: "450px", marginRight: "12px" }}
            variant="outlined"
            type="date"
            label="Select date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <IconButton
            sx={{
              width: "40px",
              height: "40px",
              bgcolor: "#E3F5FF",
              borderRadius: 50,
            }}
          >
            {/* Desktop / Tablet */}
            <Box
              component="img"
              src="/assets/icons/mail.svg"
              alt="mail"
              sx={{
                width: 20,
                height: 20,
                display: { xs: "none", sm: "block" },
              }}
            />

            {/* Mobile */}
            <Box
              component="img"
              src="/assets/icons/download.svg"
              alt="download"
              sx={{
                width: 20,
                height: 20,
                display: { xs: "block", sm: "none" },
              }}
            />
          </IconButton>
        </Stack>

        {/* Recent Activity Table */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#384250" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#384250" }}>
                      Job Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#384250" }}>
                      Date & Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobsData.map((job, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:hover": { backgroundColor: "#F9FAFB" } }}
                    >
                      <TableCell>{job.name}</TableCell>
                      <TableCell>{job.jobType}</TableCell>
                      <TableCell>{job.dateTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#D1D5DB",
                  color: "#384250",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 2,
                }}
              >
                ← Previous
              </Button>
              <Stack direction="row" spacing={0.5}>
                {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                  <Button
                    key={index}
                    variant={page === 1 ? "contained" : "outlined"}
                    sx={{
                      minWidth: "40px",
                      height: "40px",
                      borderColor: "#D1D5DB",
                      color: page === 1 ? "#FFFFFF" : "#384250",
                      backgroundColor: page === 1 ? "#111927" : "transparent",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: page === 1 ? "#384250" : "#F9FAFB",
                        borderColor: "#D1D5DB",
                      },
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </Stack>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#D1D5DB",
                  color: "#384250",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 2,
                }}
              >
                Next →
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ServiceProviderLayout>
  );
}
