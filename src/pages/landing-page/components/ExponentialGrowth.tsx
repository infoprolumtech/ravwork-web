import { type JSX } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
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
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
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
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: { xs: '14px', md: '20px' },
                        mb: { xs: 0, md: 10 },
                        maxWidth: '800px',
                        mx: 'auto',
                        lineHeight: 1.5,
                    }}
                >
                    Watch how fast your business spreads when people share your link
                </Typography>

                {/* Main Growth Graphic */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    sx={{
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        mb: { xs: 4, md: 12 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* Desktop Graphic */}
                    <Box
                        component="img"
                        src="/assets/landing-page/exponential-growth/first.png"
                        alt="Exponential Growth Sequence"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            display: { xs: 'none', md: 'block' },
                        }}
                    />

                    {/* Mobile Graphic */}
                    <Box
                        component="img"
                        src="/assets/landing-page/exponential-growth/mobile-first.png"
                        alt="Exponential Growth Sequence"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '100%',
                            display: { xs: 'block', md: 'none' },
                        }}
                    />
                </Box>

                {/* Viral Growth CTA Box */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    sx={{
                        width: '100%',
                        maxWidth: '700px',
                        mx: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        mt: { xs: 4, md: 0 },
                    }}
                >
                    {/* Desktop CTA Image */}
                    <Box
                        component="img"
                        src="/assets/landing-page/exponential-growth/Link.png"
                        alt="50x Viral Growth"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '24px',
                            boxShadow: '0 0 50px rgba(59, 130, 246, 0.2)',
                            display: { xs: 'none', md: 'block' },
                        }}
                    />

                    {/* Mobile CTA Image */}
                    <Box
                        component="img"
                        src="/assets/landing-page/exponential-growth/mobile-link.png"
                        alt="50x Viral Growth"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '24px',
                            boxShadow: '0 0 30px rgba(59, 130, 246, 0.1)',
                            display: { xs: 'block', md: 'none' },
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
