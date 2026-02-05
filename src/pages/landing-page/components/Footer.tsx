import { Box, Typography, Stack, Divider } from "@mui/material";
import { colors, containerStyle } from "../styles";

interface FooterProps {
    onTermsClick: () => void;
    onPrivacyClick: () => void;
}

export default function Footer({ onTermsClick, onPrivacyClick }: FooterProps) {
    return (
        <Box sx={{ backgroundColor: "#05070a", pt: 6, pb: 4 }}>
            <Box sx={containerStyle}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 4,
                        mb: 4,
                    }}
                >
                    {/* Left Side: Logo + Email */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 6 }, flexDirection: { xs: "column", md: "row" } }}>
                        {/* Logo */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                                component="img"
                                src="/assets/landing-page/logo.png"
                                alt="Ravwork Link"
                                sx={{ height: 32 }}
                            />
                        </Box>

                        {/* Email */}
                        <Typography
                            component="a"
                            href="mailto:support@ravwork.com"
                            sx={{
                                color: colors.textPrimary,
                                textDecoration: "none",
                                fontSize: "14px",
                                "&:hover": { color: colors.accent },
                            }}
                        >
                            support@ravwork.com
                        </Typography>
                    </Box>

                    {/* Right Side: Links */}
                    <Stack direction="row" spacing={4}>
                        <Typography
                            onClick={onPrivacyClick}
                            sx={{
                                color: colors.textPrimary,
                                textDecoration: "none",
                                fontSize: "14px",
                                "&:hover": { color: colors.accent },
                                cursor: "pointer"
                            }}
                        >
                            Privacy Policy
                        </Typography>
                        <Typography
                            onClick={onTermsClick}
                            sx={{
                                color: colors.textPrimary,
                                textDecoration: "none",
                                fontSize: "14px",
                                "&:hover": { color: colors.accent },
                                cursor: "pointer"
                            }}
                        >
                            Terms of Service
                        </Typography>
                    </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 4 }} />

                {/* Bottom Section: Copyright Centered */}
                <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ color: colors.textSecondary, fontSize: "14px" }}>
                        © {new Date().getFullYear()} All Right Reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
