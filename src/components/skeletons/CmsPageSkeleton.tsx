import { Skeleton, Stack } from "@mui/material";

export default function CmsPageSkeleton() {
  return (
    <Stack flexDirection={"column"} gap={1}>
    {Array.from({ length: 50 }).map((_, index) => (
      <Skeleton variant="rectangular" width={"100%"} height={20} key={index} />
    ))}
  </Stack>
  );
}