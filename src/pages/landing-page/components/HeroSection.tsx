import { type JSX } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Header from './Header';
import CallMadeIcon from '@mui/icons-material/CallMade';

export default function HeroSection(): JSX.Element {
    return (
        <Box
            sx={{
                background: '#000000',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
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
                    flex: 1,
                    py: { xs: 4, md: 8 },
                    textAlign: 'center',
                }}
            >
                {/* Headline */}
                <Typography
                    sx={{
                        fontSize: { xs: '32px', sm: '44px' },
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.1,
                        mb: 2,
                        maxWidth: '1000px',
                        px: { xs: 2, md: 0 },
                    }}
                >
                    Run Your Business Like
                    <br />
                    It's Going Somewhere
                </Typography>

                {/* Subheadline */}
                <Typography
                    sx={{
                        fontSize: { xs: '14px', sm: '18px', md: '20px' },
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.5,
                        mb: 4,
                        maxWidth: '750px',
                        px: { xs: 3, md: 0 },
                    }}
                >
                    Collect client info, automate questions, and manage all leads in one place
                    — with a simple link that works like your own mini-website.
                </Typography>

                {/* CTA Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: { xs: 1.5, sm: 2 },
                        mb: { xs: 6, md: 8 },
                        justifyContent: 'center',
                        width: '100%',
                        px: { xs: 1, sm: 0 },
                    }}
                >
                    <Button
                        href="/login"
                        sx={{
                            background: '#FFFFFF',
                            color: '#000000',
                            textTransform: 'none',
                            fontSize: { xs: '13px', sm: '18px' },
                            fontWeight: 600,
                            padding: { xs: '10px 16px', sm: '16px 40px' },
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            whiteSpace: 'nowrap',
                            '&:hover': {
                                background: '#F0F0F0',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Claim Your Link
                        <CallMadeIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                    </Button>
                    <Button
                        href="#how-it-works"
                        sx={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: '#FFFFFF',
                            textTransform: 'none',
                            fontSize: { xs: '13px', sm: '18px' },
                            fontWeight: 500,
                            padding: { xs: '10px 16px', sm: '16px 40px' },
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            whiteSpace: 'nowrap',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease',
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
                        position: 'relative',
                        mt: { xs: 2, md: 0 },
                    }}
                >
                    {/* Visual Glow behind image */}
                    <Box
                        sx={{
                            position: 'absolute',
                            width: '90%',
                            height: '90%',
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                            zIndex: 0,
                        }}
                    />
                    <Box
                        component="img"
                        src="/assets/landing-page/hero.png"
                        alt="RavworkLink Dashboard"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '12px',
                            position: 'relative',
                            zIndex: 1,
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        }}
                    />
                </Box>

                {/* Scroll Down Indicator */}
                <Box
                    sx={{
                        mt: { xs: 4, md: 6 },
                        display: 'flex',
                        justifyContent: 'center',
                        animation: 'bounce 2s infinite',
                        cursor: 'pointer',
                        '@keyframes bounce': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(10px)' },
                        },
                    }}
                    onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <Box
                        component="img"
                        src="/assets/landing-page/arrow.png"
                        alt="Scroll down"
                        sx={{
                            width: '40px',
                            height: '40px',
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
