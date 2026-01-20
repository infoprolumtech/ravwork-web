import { type JSX } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element {
  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Show up to 7 page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle section
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 0.5, sm: 1 },
        mt: 3,
        flexWrap: { xs: "nowrap", sm: "wrap" },
      }}
    >
      {/* Previous Button */}
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{
          borderColor: "#D1D5DB",
          color: "#384250",
          textTransform: "none",
          minWidth: { xs: "36px", sm: "auto" },
          width: { xs: "36px", sm: "auto" },
          height: { xs: "36px", sm: "40px" },
          px: { xs: 0, sm: 2 },
          "&:disabled": {
            borderColor: "#E5E7EB",
            color: "#9CA3AF",
          },
          "&:hover:not(:disabled)": {
            backgroundColor: "#F9FAFB",
            borderColor: "#D1D5DB",
          },
        }}
      >
        <KeyboardArrowLeft sx={{ fontSize: { xs: 16, sm: 18 }, mr: { xs: 0, sm: 0.5 } }} />
        <Box
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
          }}
        >
        Previous
        </Box>
      </Button>

      {/* Page Numbers - Hidden on mobile, shown on tablet and up */}
      <Stack 
        direction="row" 
        spacing={0.5}
        sx={{
          display: { xs: "none", sm: "flex" },
        }}
      >
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <Box
                key={`ellipsis-${index}`}
                sx={{
                  minWidth: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9CA3AF",
                }}
              >
                ...
              </Box>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "contained" : "outlined"}
              onClick={() => onPageChange(pageNum)}
              sx={{
                minWidth: "40px",
                height: "40px",
                borderColor: "#D1D5DB",
                color: isActive ? "#111927" : "#384250",
                backgroundColor: isActive ? "#F3F4F6" : "transparent",
                textTransform: "none",
                fontWeight: isActive ? 600 : 400,
                "&:hover": {
                  backgroundColor: isActive ? "#E5E7EB" : "#F9FAFB",
                  borderColor: "#D1D5DB",
                },
              }}
            >
              {pageNum}
            </Button>
          );
        })}
      </Stack>

      {/* Mobile: Current Page Display */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          justifyContent: "center",
          minWidth: "80px",
          height: "36px",
          px: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#384250",
          }}
        >
          {currentPage} / {totalPages}
        </Typography>
      </Box>

      {/* Next Button */}
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        sx={{
          borderColor: "#D1D5DB",
          color: "#384250",
          textTransform: "none",
          minWidth: { xs: "36px", sm: "auto" },
          width: { xs: "36px", sm: "auto" },
          height: { xs: "36px", sm: "40px" },
          px: { xs: 0, sm: 2 },
          "&:disabled": {
            borderColor: "#E5E7EB",
            color: "#9CA3AF",
          },
          "&:hover:not(:disabled)": {
            backgroundColor: "#F9FAFB",
            borderColor: "#D1D5DB",
          },
        }}
      >
        <Box
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
        }}
      >
        Next
        </Box>
        <KeyboardArrowRight sx={{ fontSize: { xs: 16, sm: 18 }, ml: { xs: 0, sm: 0.5 } }} />
      </Button>
    </Box>
  );
}

