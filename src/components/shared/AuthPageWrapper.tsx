import { type JSX, type ReactNode } from "react";
import { Box, Typography, Button, CircularProgress, type BoxProps } from "@mui/material";
import SignupLayout from "../../layouts/SignupLayout";
import PageIcon from "./PageIcon";

interface AuthPageWrapperProps {
    children: ReactNode;
    title: string;
    description?: string;
    iconSrc?: string;
    iconAlt?: string;
    buttonText: string;
    buttonType?: "submit" | "button";
    isButtonDisabled?: boolean;
    isButtonLoading?: boolean;
    onButtonClick?: () => void;
    onSubmit?: (e: React.FormEvent) => void;
    showBackIcon?: boolean;
    onBackClick?: () => void;
    maxWidth?: BoxProps["maxWidth"];
    footer?: ReactNode;
}

/**
 * Standardized wrapper for Auth-related pages (Login, Forgot Password, Reset Password, etc.)
 * Ensures consistent layout, typography, and mobile behavior.
 */
export default function AuthPageWrapper({
    children,
    title,
    description,
    iconSrc,
    iconAlt = "page-icon",
    buttonText,
    buttonType = "submit",
    isButtonDisabled = false,
    isButtonLoading = false,
    onButtonClick,
    onSubmit,
    showBackIcon = false,
    onBackClick,
    maxWidth = "400px",
    footer,
}: AuthPageWrapperProps): JSX.Element {
    const content = (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mx: "auto",
                position: "relative",
            }}
        >
            {iconSrc && (
                <PageIcon iconSrc={iconSrc} iconAlt={iconAlt} />
            )}

            <Typography
                variant="h5"
                textAlign="center"
                mb={{ xs: 2, sm: 3 }}
                fontWeight={600}
                sx={{ fontSize: { xs: "24px", sm: "28px", md: "34px" } }}
            >
                {title}
            </Typography>

            {description && (
                <Typography
                    variant="body2"
                    textAlign="center"
                    mb={{ xs: 2, sm: 3 }}
                    sx={{
                        color: "#6C737F",
                        fontSize: { xs: "14px", sm: "16px" },
                        px: { xs: 1, sm: 0 },
                    }}
                >
                    {description}
                </Typography>
            )}

            <Box sx={{ width: "100%", mb: { xs: 10, sm: 0 } }}>
                {children}
            </Box>

            {/* Button Container - Fixed on mobile, static on desktop */}
            <Box
                sx={{
                    width: "100%",
                    position: { xs: "fixed", sm: "static" },
                    bottom: { xs: 0, sm: "auto" },
                    left: { xs: 0, sm: "auto" },
                    p: { xs: 2, sm: 0 },
                    backgroundColor: { xs: "#fff", sm: "transparent" },
                    zIndex: { xs: 10, sm: "auto" },
                    boxShadow: {
                        xs: "0 -2px 10px rgba(0,0,0,0.05)",
                        sm: "none",
                    },
                }}
            >
                <Button
                    fullWidth
                    type={buttonType}
                    variant="secondary"
                    disabled={isButtonDisabled || isButtonLoading}
                    onClick={onButtonClick}
                    sx={{
                        height: { xs: "44px", sm: "48px" },
                    }}
                >
                    {isButtonLoading ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                    ) : (
                        buttonText
                    )}
                </Button>
                {footer}
            </Box>
        </Box>
    );

    return (
        <SignupLayout showBackIcon={showBackIcon} onBackClick={onBackClick}>
            <Box
                width="100%"
                maxWidth={maxWidth}
                component={onSubmit ? "form" : "div"}
                onSubmit={onSubmit}
                sx={{ mx: "auto" }}
            >
                {content}
            </Box>
        </SignupLayout>
    );
}
