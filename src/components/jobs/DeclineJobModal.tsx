import { type JSX } from "react";
import {
  Stack,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface DeclineJobModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting?: boolean;
}

export default function DeclineJobModal({
  onClose,
  onConfirm,
  isSubmitting = false,
}: DeclineJobModalProps): JSX.Element {
  return (
    <Stack
      sx={{
        padding: { xs: "20px", sm: "32px", md: "40px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: { xs: "16px", sm: "20px", md: "24px" },
        width: "100%",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Header - Title and Close icon in same row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "100%" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            fontWeight: 600,
            color: "#111927",
            flex: 1,
          }}
        >
          Decline Job
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

      {/* Message */}
      <Typography
        sx={{
          fontSize: { xs: "16px", sm: "18px" },
          fontWeight: 400,
          color: "#6C737F",
          width: "100%",
        }}
      >
        Are you sure you want to decline this job? This action cannot be undone.
      </Typography>

      {/* Action Buttons */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{
          width: "100%",
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Button
          variant="primary"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#111927",
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 2, sm: 3 },
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={onConfirm}
          disabled={isSubmitting}
          sx={{
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: { xs: "14px", sm: "16px" },
            px: { xs: 2, sm: 3 },
            backgroundColor: "#F04438",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#DC2626",
            },
            "&:disabled": {
              backgroundColor: "#9CA3AF",
            },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Decline Job"
          )}
        </Button>
      </Stack>
    </Stack>
  );
}

