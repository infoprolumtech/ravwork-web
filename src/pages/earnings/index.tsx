import { useState, useMemo, type JSX } from "react";
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
  CircularProgress,
  Typography,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import EarningsCard from "../../components/reusecard/Earnings";
import EarningsSkeleton from "../../components/skeletons/EarningsSkeleton";

import Pagination from "../../components/pagination/Pagination";
import { useGetEarningsQuery, useExportEarningsMutation } from "../../rtk/endpoints/userApi";
import { useAppDispatch } from "../../rtk/store";
import { showAlert } from "../../rtk/feature/alertSlice";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function EarningsPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Format dates for API (YYYY-MM-DD)
  const fromDateString = useMemo(() =>
    fromDate && fromDate.isValid() ? fromDate.format("YYYY-MM-DD") : undefined
    , [fromDate]);

  const toDateString = useMemo(() =>
    toDate && toDate.isValid() ? toDate.format("YYYY-MM-DD") : undefined
    , [toDate]);

  // Memoize query parameters
  const earningsParams = useMemo(
    () => ({
      fromDate: fromDateString,
      toDate: toDateString,
      page: currentPage,
      limit: 10,
    }),
    [fromDateString, toDateString, currentPage]
  );

  // Fetch earnings data
  const { data: earningsData, isLoading, isFetching, error } = useGetEarningsQuery(earningsParams);
  const [exportEarnings, { isLoading: isExporting }] = useExportEarningsMutation();

  // Handle export
  const handleExport = async () => {
    if (!fromDateString || !toDateString) {
      dispatch(showAlert({ message: "Please select both From and To dates", severity: "error" }));
      return;
    }

    try {
      await exportEarnings({
        fromDate: fromDateString,
        toDate: toDateString,
      }).unwrap();
      setExportSuccess(true);
      dispatch(showAlert({ message: "Earnings report has been sent to your email", severity: "success" }));
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to export earnings. Please try again.";
      dispatch(showAlert({ message: errorMessage, severity: "error" }));
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage change
  const formatPercentage = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Reset to page 1 when dates change
  const handleFromDateChange = (newDate: Dayjs | null) => {
    setFromDate(newDate);
    setCurrentPage(1);
  };

  const handleToDateChange = (newDate: Dayjs | null) => {
    setToDate(newDate);
    setCurrentPage(1);
  };

  const summary = earningsData?.summary;
  const earnings = earningsData?.earnings;
  if (isLoading) {
    return (
      <ServiceProviderLayout>
        <EarningsSkeleton />
      </ServiceProviderLayout>
    );
  }

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
              label="Total Earnings"
              value={!summary || isFetching ? null : formatCurrency(summary.totalEarnings).replace("$", "")}
              percentage={!summary || isFetching ? undefined : formatPercentage(summary.totalChange)}
              theme="theme1"
              backgroundColor="#E3F5FF"
              isLoading={!summary || isFetching}
            />
            <EarningsCard
              icon="/assets/icons/IconText.svg"
              label="Earnings this Week"
              value={!summary || isFetching ? null : formatCurrency(summary.weekEarnings).replace("$", "")}
              percentage={!summary || isFetching ? undefined : formatPercentage(summary.weekChange)}
              theme="theme2"
              backgroundColor="#E3F5FF"
              isLoading={!summary || isFetching}
            />
            <EarningsCard
              icon="/assets/icons/IconText.svg"
              label="Earnings this Month"
              value={!summary || isFetching ? null : formatCurrency(summary.monthEarnings).replace("$", "")}
              percentage={!summary || isFetching ? undefined : formatPercentage(summary.monthChange)}
              theme="theme1"
              backgroundColor="#E3F5FF"
              isLoading={!summary || isFetching}
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
              value={fromDate}
              onChange={handleFromDateChange}
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
              value={toDate}
              onChange={handleToDateChange}
              minDate={fromDate || undefined}
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
              onClick={handleExport}
              disabled={isExporting || !fromDateString || !toDateString}
              sx={{
                width: "40px",
                height: "40px",
                bgcolor: "#E3F5FF",
                borderRadius: 50,
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              {isExporting ? (
                <CircularProgress size={20} />
              ) : (
                <>
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
                </>
              )}
            </IconButton>
          </Stack>

          {/* Recent Activity Table */}
          <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#384250", textAlign: "left" }}>
                        Job Title
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#384250", textAlign: "center" }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#384250", textAlign: "right" }}>
                        Earnings
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isFetching ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-row-${index}`}>
                          <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                          <TableCell align="center"><Skeleton variant="text" width="60%" sx={{ mx: "auto" }} /></TableCell>
                          <TableCell align="right"><Skeleton variant="text" width="80%" sx={{ ml: "auto" }} /></TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Typography color="error">
                            Failed to load earnings. Please try again.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : earnings?.data && earnings.data.length > 0 ? (
                      earnings.data.map((job) => (
                        <TableRow
                          key={job.id}
                          sx={{
                            "&:hover": { backgroundColor: "#F3F4F6", cursor: "pointer" },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell sx={{ color: "#384250", textAlign: "left" }}>
                            {job.jobTitle}
                          </TableCell>
                          <TableCell sx={{ color: "#384250", textAlign: "center" }}>
                            {formatDate(job.date)}
                          </TableCell>
                          <TableCell sx={{ color: "#384250", textAlign: "right" }}>
                            {formatCurrency(job.earnings)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No earnings found for the selected period.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {earnings && earnings.totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={earnings.totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </CardContent>
          </Card>

          {/* Export Success Snackbar */}
          <Snackbar
            open={exportSuccess}
            autoHideDuration={3000}
            onClose={() => setExportSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setExportSuccess(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Earnings report has been sent to your email
            </Alert>
          </Snackbar>
        </Box>
      </LocalizationProvider>
    </ServiceProviderLayout>
  );
}
