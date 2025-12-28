import { Box } from "@mui/material";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps = 4 }: ProgressIndicatorProps) => {
  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center", width: 280 }}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: index + 1 <= currentStep ? "#D2E7FF" : "#E5E7EB",
          }}
        />
      ))}
    </Box>
  );
};

