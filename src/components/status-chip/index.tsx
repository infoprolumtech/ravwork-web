import { Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { red, grey, green, orange } from "@mui/material/colors";

interface StatusChipProps {
  status: string;
}

// Define category-based styles
const statusCategories: Record<
  "success" | "warning" | "error" | "neutral" | "default",
  { color: string; bg: string }
> = {
  success: { color: green[700], bg: green[100] },
  warning: { color: orange[700], bg: orange[100] },
  error: { color: red[700], bg: red[100] },
  neutral: { color: grey[700], bg: grey[300] },
  default: { color: grey[600], bg: grey[100] },
};

// Map statuses to a category and label
const statusMap: Record<
  string,
  { label: string; category: keyof typeof statusCategories }
> = {
  active: { label: "Active", category: "success" },
  publish: { label: "Publish", category: "success" },
  resolved: { label: "Resolved", category: "success" },
  completed: { label: "Completed", category: "success" },
  "validation completed": { label: "Validation Completed", category: "success" },

  blocked: { label: "Blocked", category: "warning" },
  "in-progress": { label: "In Progress", category: "warning" },

  deleted: { label: "Deleted", category: "error" },
  ongoing: { label: "Ongoing", category: "warning" },
  rejected: { label: "Rejected", category: "error" },
  failed: { label: "Failed", category: "error" },

  hidden: { label: "Hidden", category: "neutral" },
  new: { label: "New", category: "neutral" },
  pending: { label: "Pending", category: "neutral" },
  inert: { label: "Inert", category: "neutral" },
  sent: { label: "Sent", category: "success" },
  schedule: { label: "Scheduled", category: "error" },
};

export default function StatusChip({ status }: StatusChipProps) {
  if (!status) return null;
  const normalized = status.trim().toLowerCase();
  const mapped = statusMap[normalized];

  const label = mapped?.label ?? "No status";
  const category = mapped?.category ?? "default";
  const { color, bg } = statusCategories[category];

  const isOutlined = normalized === "black" || label === "No status";

  return (
    <Chip
      icon={<CircleIcon sx={{ fontSize: 12 }} />}
      label={label}
      variant={isOutlined ? "outlined" : "filled"}
      sx={{
        color,
        backgroundColor: bg,
        "& .MuiChip-icon": { color },
      }}
    />
  );
}
