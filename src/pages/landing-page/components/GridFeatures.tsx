import { type JSX } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { sectionTitleStyle, spacing } from '../styles';

export default function GridFeatures(): JSX.Element {
    return (
        <Box
            sx={{
                background: '#000000',
                padding: spacing.sectionPadding,
                textAlign: 'center',
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    sx={{
                        ...sectionTitleStyle,
                        textAlign: 'center',
                        mb: { xs: 6, md: 8 },
                        fontSize: { xs: '32px', sm: '44px' },
                        color: '#FFFFFF',
                        fontWeight: 700,
                        lineHeight: 1.2,
                    }}
                >
                    Look Professional. Stay Organized.
                    <br />
                    Get More Clients.
                </Typography>

                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    sx={{
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* Desktop Image */}
                    <Box
                        component="img"
                        src="/assets/landing-page/grid-features.png"
                        alt="RavworkLink Features"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '12px',
                            display: { xs: 'none', md: 'block' },
                        }}
                    />

                    {/* Mobile Image */}
                    <Box
                        component="img"
                        src="/assets/landing-page/grid-features-mobile.png"
                        alt="RavworkLink Features"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '400px',
                            borderRadius: '12px',
                            display: { xs: 'block', md: 'none' },
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
