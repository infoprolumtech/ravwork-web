import { type JSX } from 'react';
import { Box, AppBar, Toolbar, Button } from '@mui/material';
import { colors, primaryButton, glassmorphism } from '../styles';

export default function Header(): JSX.Element {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                // ...glassmorphism,
                // background: 'rgba(15, 23, 42, 0.8)',
                background: '#000000',
                paddingTop: "12px",
                maxWidth: "1200px",
                mx: "auto"
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                {/* Logo */}
                <Box
                    component="img"
                    src="/assets/landing-page/logo.png"
                    alt="RavworkLink"
                    sx={{
                        height: '32px',
                        width: 'auto',
                        cursor: 'pointer',
                    }}
                    onClick={() => window.location.href = '/'}
                />

                {/* Navigation Links & Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {/* Navigation Links */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                        <Button
                            href="#home"
                            sx={{
                                color: colors.textPrimary,
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 400,
                                '&:hover': {
                                    color: colors.accent,
                                    background: 'transparent',
                                },
                            }}
                        >
                            Home
                        </Button>
                        <Button
                            href="#pricing"
                            sx={{
                                color: colors.textPrimary,
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 400,
                                '&:hover': {
                                    color: colors.accent,
                                    background: 'transparent',
                                },
                            }}
                        >
                            Pricing
                        </Button>
                        <Button
                            href="#terms"
                            sx={{
                                color: colors.textPrimary,
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 400,
                                '&:hover': {
                                    color: colors.accent,
                                    background: 'transparent',
                                },
                            }}
                        >
                            Terms & Conditions
                        </Button>
                    </Box>

                    {/* Auth Buttons */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            href="/signup"
                            sx={{
                                color: colors.textPrimary,
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 400,
                                border: `1px solid ${colors.textPrimary}`,
                                borderRadius: '24px',
                                padding: '8px 24px',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: colors.accent,
                                },
                            }}
                        >
                            Sign Up
                        </Button>
                        <Button
                            href="/login"
                            sx={{
                                ...primaryButton,
                                padding: '8px 24px',
                                borderRadius: '24px',
                                fontSize: '16px',
                                fontWeight: 400,
                            }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
