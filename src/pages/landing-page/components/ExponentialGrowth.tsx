import { type JSX } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { sectionTitleStyle, spacing } from '../styles';

export default function ExponentialGrowth(): JSX.Element {
    return (
        <Box
            sx={{
                background: '#000000',
                padding: spacing.sectionPadding,
                textAlign: 'center',
            }}
        >
            <Container maxWidth="lg">
                {/* Title and Subtitle */}
                <Typography
                    sx={{
                        ...sectionTitleStyle,
                        mb: 2,
                        fontSize: { xs: '32px', md: '56px' },
                        color: '#FFFFFF',
                        fontWeight: 700,
                    }}
                >
                    Exponential Growth
                </Typography>
                <Typography
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: { xs: '16px', md: '20px' },
                        mb: { xs: 8, md: 10 },
                        maxWidth: '800px',
                        mx: 'auto',
                    }}
                >
                    Watch how fast your business spreads when people share your link
                </Typography>

                {/* Main Growth Graphic */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        mb: { xs: 8, md: 12 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        component="img"
                        src="/assets/landing-page/exponential-growth/first.png"
                        alt="Exponential Growth Sequence"
                        sx={{
                            width: '100%',
                            height: 'auto',
                        }}
                    />

                    {/* Labels (If not clearly visible in the image, we can add them here, but the user image suggests they are part of the design. 
                        In first.png they seem to be present but small. I'll stick to the image for now as requested.) */}
                </Box>

                {/* Viral Growth CTA Box */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '700px',
                        mx: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        component="img"
                        src="/assets/landing-page/exponential-growth/Link.png"
                        alt="50x Viral Growth"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '24px',
                            boxShadow: '0 0 50px rgba(59, 130, 246, 0.2)',
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
