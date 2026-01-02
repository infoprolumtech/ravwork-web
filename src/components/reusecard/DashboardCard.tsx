import { Paper, Stack, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

type Theme = "theme1" | "theme2";

interface DashboardCardProps {
  icon?: string | ReactNode;
  value: string | number;
  label: string;
  theme?: Theme;
}

const THEME_COLORS: Record<Theme, { cardBg: string; iconBg: string }> = {
  theme1: {
    cardBg: "#E3F5FF",
    iconBg: "#FFFFFF",
  },
  theme2: {
    cardBg: "#E5ECF6",
    iconBg: "#FFFFFF",
  },
};

export default function DashboardCard({
  icon,
  value,
  label,
  theme = "theme1",
}: DashboardCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: THEME_COLORS[theme].cardBg,
        width: { xs: "125px", sm: "200px", md: "260px" },
        maxWidth: "376px",
        flexGrow: 1,
      }}
    >
      <Stack spacing={2}>
        {icon && (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: THEME_COLORS[theme].iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {typeof icon === "string" ? (
              <img src={icon} alt="" width={16} height={16} />
            ) : (
              icon
            )}
          </Box>
        )}

        <Typography fontWeight={600} fontSize={{ xs: "11.67px", md: "14px" }}>
          {label}
        </Typography>
      </Stack>

      <Typography fontWeight={600} fontSize={{ xs: "19px", md: "24px" }}>
        {value}
      </Typography>
    </Paper>
  );
}
