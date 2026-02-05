import { type JSX } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { colors, sectionTitleStyle, spacing } from '../styles';

const steps = [
    {
        title: "Personalized Business Link",
        description: "A simple link you can share everywhere: Instagram, Facebook, TikTok, QR codes.",
        image: "/assets/landing-page/how-it-works/first.png",
        reverse: false,
    },
    {
        title: "Service Customization",
        description: "Add your services, pricing, photos, descriptions — without coding.",
        image: "/assets/landing-page/how-it-works/second.png",
        reverse: true,
    },
    {
        title: "Custom Questions",
        description: "Ask exactly what you need to know to quote clients faster.",
        image: "/assets/landing-page/how-it-works/third.png",
        mobileImage: "/assets/landing-page/how-it-works/third_mobile.png",
        reverse: false,
    },
    {
        title: "Mobile-ready",
        description: "Works perfectly on any phone.",
        image: "/assets/landing-page/how-it-works/four.png",
        reverse: true,
    },
    {
        title: "Lead Collection Dashboard",
        description: "All client submissions are stored neatly in one place.",
        image: "/assets/landing-page/how-it-works/five.png",
        reverse: false,
    },
];

export default function HowItWorks(): JSX.Element {
    return (
        <Box
            id="how-it-works"
            sx={{
                background: '#000000',
                padding: spacing.sectionPadding,
                color: '#FFFFFF',
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{
                    textAlign: 'center',
                    mb: { xs: 6, md: 8 },
                }}>
                    <Typography
                        component={motion.div}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        sx={{
                            ...sectionTitleStyle,
                            mb: 2,
                            fontSize: { xs: '32px', md: '48px' },
                            fontWeight: 700,
                        }}
                    >
                        How it works
                    </Typography>
                    <Typography
                        component={motion.div}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        sx={{
                            color: colors.textSecondary,
                            fontSize: { xs: '16px', md: '20px' },
                            maxWidth: '800px',
                            mx: 'auto',
                            opacity: 0.8,
                        }}
                    >
                        Set it up in minutes. Use it everywhere.
                    </Typography>
                </Box>

                {/* Steps */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 0 } }}>
                    {steps.map((step, index) => (
                        <Box
                            key={index}
                            component={motion.div}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: {
                                    xs: 'column',
                                    md: step.reverse ? 'row-reverse' : 'row',
                                },
                                gap: { xs: 4, md: 16 },

                            }}
                        >
                            {/* Text Side */}
                            <Box sx={{
                                flex: 1, textAlign: { xs: 'center', md: 'left' },
                            }}>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '28px', md: '36px' },
                                        fontWeight: 700,
                                        mb: 2,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {step.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: { xs: '16px', md: '20px' },
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        lineHeight: 1.6,
                                        maxWidth: '500px',
                                        mx: { xs: 'auto', md: 0 },
                                    }}
                                >
                                    {step.description}
                                </Typography>
                            </Box>

                            {/* Image Side */}
                            <Box
                                sx={{
                                    flex: 1.5,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                {/* Visual Glow Effect behind image (matching Figma) */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        width: '80%',
                                        height: '80%',
                                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                                        zIndex: 0,
                                    }}
                                />
                                {/* Desktop Image */}
                                <Box
                                    component="img"
                                    src={step.image}
                                    alt={step.title}
                                    sx={{
                                        display: { xs: step.mobileImage ? 'none' : 'block', md: 'block' },
                                        width: '100%',
                                        height: 'auto',
                                        maxWidth: { xs: '100%', md: '800px' },
                                        borderRadius: '16px',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                />
                                {/* Mobile Image - only if mobileImage exists */}
                                {step.mobileImage && (
                                    <Box
                                        component="img"
                                        src={step.mobileImage}
                                        alt={step.title}
                                        sx={{
                                            display: { xs: 'block', md: 'none' },
                                            width: '100%',
                                            height: 'auto',
                                            maxWidth: '85%',
                                            mx: 'auto',
                                            borderRadius: '16px',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
