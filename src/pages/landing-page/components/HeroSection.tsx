import { type JSX } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Header from './Header';

export default function HeroSection(): JSX.Element {
    return (
        <Box
            sx={{
                background: '#000000',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Navigation Bar */}
            <Header />

            {/* Hero Content */}
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 80px)',
                    py: { xs: 6, md: 8 },
                    textAlign: 'center',
                }}
            >
                {/* Headline */}
                <Typography
                    sx={{
                        fontSize: { xs: '36px', sm: '44px' },
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.2,
                        mb: 3,
                        maxWidth: '900px',
                    }}
                >
                    Run Your Business Like
                    <br />
                    It's Going Somewhere
                </Typography>

                {/* Subheadline */}
                <Typography
                    sx={{
                        fontSize: { xs: '16px', sm: '18px', md: '20px' },
                        fontWeight: 400,
                        color: '#FFFFFF',
                        lineHeight: 1.6,
                        mb: 5,
                        maxWidth: '700px',
                        opacity: 0.9,
                    }}
                >
                    Collect client info, automate questions, and manage all leads in one place
                    — with a simple link that works like your own mini-website.
                </Typography>

                {/* CTA Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 0,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        href="/claim"
                        sx={{
                            background: '#FFFFFF',
                            color: '#000000',
                            textTransform: 'none',
                            fontSize: '16px',
                            fontWeight: 500,
                            padding: '12px 32px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            '&:hover': {
                                background: '#F0F0F0',
                            },
                        }}
                    >
                        Claim Your Link
                        <Box component="span" sx={{ fontSize: '18px' }}>→</Box>
                    </Button>
                    <Button
                        href="#how-it-works"
                        sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#FFFFFF',
                            textTransform: 'none',
                            fontSize: '16px',
                            fontWeight: 500,
                            padding: '12px 32px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.15)',
                            },
                        }}
                    >
                        See How It Works
                    </Button>
                </Box>

                {/* Dashboard Mockup */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '1200px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: -12
                    }}
                >
                    <Box
                        component="img"
                        src="/assets/landing-page/hero.png"
                        alt="RavworkLink Dashboard"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '12px',

                        }}
                    />
                </Box>

                {/* Scroll Down Indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        cursor: 'pointer',
                        animation: 'bounce 2s infinite',
                        '@keyframes bounce': {
                            '0%, 100%': {
                                transform: 'translateX(-50%) translateY(0)',
                            },
                            '50%': {
                                transform: 'translateX(-50%) translateY(8px)',
                            },
                        },
                        '&:hover': {
                            opacity: 0.7,
                        },
                    }}
                    onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <Box
                        component="img"
                        src="/assets/landing-page/arrow.png"
                        alt="Scroll down"
                        sx={{
                            width: '48px',
                            height: '48px',
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
