import { Paper, Stack, Typography, Box, Skeleton } from "@mui/material";
import type { ReactNode } from "react";

type Theme = "theme1" | "theme2";

interface EarningsCardProps {
  icon?: string | ReactNode;
  value?: string | number | null;
  label: string;
  percentage?: string | number; // new prop
  theme?: Theme;
  backgroundColor?: string;
  isLoading?: boolean;
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
  backgroundColor,
  isLoading = false,
}: EarningsCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: backgroundColor || THEME_COLORS[theme].cardBg,
        width: "100%",
        height: "100%",
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

      <Box
        sx={{
          mt: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={600} fontSize={{ xs: "19px", md: "24px" }}>
          {isLoading ? <Skeleton width={60} height={32} /> : value}
        </Typography>
        {isLoading ? (
          <Skeleton width={40} height={20} />
        ) : percentage && (
          <Typography
            fontWeight={400}
            fontSize={12}
            color={Number(percentage.toString().replace(/[+%]/g, "")) >= 0 ? "green" : "red"}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {percentage}{" "}
            <Box
              component="img"
              src="/assets/icons/IconText.svg"
              alt=""
              sx={{
                transform: (() => {
                  const numValue = Number(percentage.toString().replace(/[+%]/g, ""));
                  return numValue < 0 ? "rotate(180deg)" : "none";
                })(),
              }}
            />
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
