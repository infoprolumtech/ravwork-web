import { useState, type JSX } from "react";
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
  Stack,
  IconButton,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import EarningsCard from "../../components/reusecard/Earnings";
import Pagination from "../../components/pagination/Pagination";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function EarningsPage(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock data - replace with actual API call when available
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

  // Mock pagination data - replace with actual API response when available
  const totalPages = 10; // This should come from API response
  return (
    <ServiceProviderLayout>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            p: { xs: 1.5, md: 3 },
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <Grid
            container
            spacing={{ xs: "8px", sm: "12px" }}
            sx={{ mb: { xs: "28px", sm: "20px" } }}
          >
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

          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              mb: "26px",
              alignItems: "center",
            }}
          >
            <DatePicker
              label="From"
              slotProps={{
                textField: {
                  sx: {
                    width: {
                      xs: "147.49px",
                      sm: "499.99px",
                    },
                  },
                  InputProps: {
                    sx: {
                      height: "56px",
                      borderRadius: "100px",
                      "& fieldset": {
                        borderRadius: "100px",
                      },
                    },
                  },
                  InputLabelProps: {
                    sx: {
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      letterSpacing: "0%",
                    },
                  },
                },
              }}
            />

            {/* TO */}
            <DatePicker
              label="To"
              slotProps={{
                textField: {
                  sx: {
                    width: {
                      xs: "147.49px",
                      sm: "499.99px",
                    },
                    height: "56px",
                  },
                  InputProps: {
                    sx: {
                      height: "56px",
                      borderRadius: "100px",
                      "& fieldset": {
                        borderRadius: "100px",
                      },
                    },
                  },
                  InputLabelProps: {
                    sx: {
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      letterSpacing: "0%",
                    },
                  },
                },
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </Box>
      </LocalizationProvider>
    </ServiceProviderLayout>
  );
}
