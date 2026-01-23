import { type JSX } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { spacing } from '../styles';

export default function PricingSection(): JSX.Element {
    return (
        <Box
            id="pricing"
            sx={{
                background: '#000000',
                padding: spacing.sectionPadding,
                textAlign: 'center',
            }}
        >
            <Container maxWidth="lg">
                {/* Title */}
                <Typography
                    sx={{
                        fontSize: { xs: '32px', md: '48px' },
                        fontWeight: 700,
                        color: '#FFFFFF',
                        mb: 4,
                        textAlign: 'center',
                    }}
                >
                    Simple Pricing. No Hidden Fees.
                </Typography>

                {/* Toggle Section */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        mb: { xs: 6, md: 8 },
                    }}
                >
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
                        Monthly
                    </Typography>
                    <Box
                        component="img"
                        src="/assets/landing-page/toggle.png"
                        alt="Toggle Billing"
                        sx={{
                            width: 48,
                            height: 'auto',
                        }}
                    />
                    <Typography sx={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 600 }}>
                        Annual
                    </Typography>
                    <Box
                        sx={{
                            background: 'rgba(34, 197, 94, 0.2)',
                            color: '#22C55E',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: 700,
                        }}
                    >
                        Save 31%
                    </Box>
                </Box>

                {/* Pricing Card */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '850px',
                        mx: 'auto',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    role="img"
                    aria-label="Pricing: $20/month billed annually. Includes personalized booking link, full access to features, unlimited leads, unlimited custom questions, and lead management dashboard."
                >
                    <Box
                        component="img"
                        src="/assets/landing-page/pricing.png"
                        alt=""
                        sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    />

                    {/* Interactive overlay button positioned over 'Claim Your Link' area */}
                    <Button
                        href="/signup"
                        sx={{
                            position: 'absolute',
                            // These percentages align with the button area in pricing.png
                            bottom: '10%',
                            left: '50.5%',
                            transform: 'translateX(-50%)',
                            width: { xs: '60%', sm: '40%', md: '22%' },
                            height: { xs: '8%', md: '10%' },
                            minHeight: '44px',
                            background: 'transparent',
                            borderRadius: '12px',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                        aria-label="Claim Your Link Now"
                    />
                </Box>
            </Container>
        </Box>
    );
}
