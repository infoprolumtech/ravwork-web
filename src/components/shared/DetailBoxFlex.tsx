import { Box, Stack, Typography } from "@mui/material";
import { type JSX } from "react";

interface detailOption {
  title: string;
  value: JSX.Element | string | number;
  show?: boolean; // ✅ Optional visibility flag
  maxWidth?:string;
}

interface DetailBoxFlexProps {
  title?: string;
  detail?: detailOption[];
}

export default function DetailBoxFlex({ title, detail }: DetailBoxFlexProps) {

  return (
    <Box mb={4}>
      {title && (
        <Typography variant="h3" mb={2}>
          {title}
        </Typography>
      )}

      <Stack flexDirection={"row"} flexWrap={"wrap"} spacing={2} gap={2}>
        {detail
          ?.filter((item) => item.show !== false) // ✅ Skip items with show: false
          .map((item, index) => (
            <Stack
              key={index}
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{
                minWidth: 300,
                maxWidth: item.maxWidth || 300,
              }}
            >
              <Typography variant="title" sx={{ color: "text.secondary" }}>
                {item.title}
              </Typography>

              <Box flex={1}>
                {typeof item.value === "string" ||
                typeof item.value === "number" ? (
                  <Typography variant="caption">{item.value}</Typography>
                ) : (
                  item.value
                )}
              </Box>
            </Stack>
          ))}
      </Stack>
    </Box>
  );
}
