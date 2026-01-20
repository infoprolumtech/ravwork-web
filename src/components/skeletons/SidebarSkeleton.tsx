import { Box, Stack, Skeleton } from "@mui/material";

export default function SidebarSkeleton() {
    return (
        <Box sx={{ p: 2, width: "100%", boxSizing: "border-box" }}>
            {/* User Profile Section Skeleton */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <Skeleton variant="circular" width={44} height={44} />
                <Stack spacing={0.5} flex={1}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={18} />
                </Stack>
            </Stack>

            {/* Progress Card Skeleton */}
            <Box
                sx={{
                    backgroundColor: "#F7F9FB",
                    borderRadius: "14px",
                    px: 2,
                    py: 1.5,
                    width: "100%",
                }}
            >
                <Skeleton variant="text" width="80%" height={14} sx={{ mb: 1 }} />
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 6, flex: 1 }} />
                    <Skeleton variant="text" width={30} height={20} />
                </Stack>
                <Skeleton variant="rectangular" width={100} height={26} sx={{ borderRadius: "999px", mt: 1 }} />
            </Box>

            {/* Navigation List Skeleton */}
            <Box sx={{ mt: 4 }}>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, px: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width="60%" height={24} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
