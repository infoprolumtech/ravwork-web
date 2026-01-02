import { Paper, Stack, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

type Theme = "theme1" | "theme2";

interface EarningsCardProps {
  icon?: string | ReactNode;
  value: string | number;
  label: string;
  percentage?: string | number; // new prop
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

export default function EarningsCard({
  icon,
  value,
  label,
  percentage,
  theme = "theme1",
}: EarningsCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: THEME_COLORS[theme].cardBg,
        width: { xs: "140px", sm: 150, md: 260 },
        maxWidth: 376,
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

        <Typography fontWeight={600} fontSize={14}>
          {label}
        </Typography>
      </Stack>

      <Box
        sx={{
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={500} fontSize={14}>
          {value}
        </Typography>
        {percentage && (
          <Typography
            fontWeight={500}
            fontSize={12}
            color={Number(percentage.toString().replace("%", "")) >= 0 ? "green" : "red"}
          >
            {percentage} <img src="./assets/icons/IconText.svg" alt=""  />
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
