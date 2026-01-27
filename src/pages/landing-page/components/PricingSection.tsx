import { type JSX, useState } from 'react';
import { Box, Container, Typography, Button, Switch, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { spacing } from '../styles';

// Custom Styled Switch
// Custom Styled Switch matching the provided design (Neon Blue, Black Track)
const AntSwitch = styled(Switch)(() => ({
    width: 50,
    height: 28,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 22,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(20px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 3,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(22px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#000000',
                borderColor: '#1C0EE8',
            },
            '& .MuiSwitch-thumb': {
                backgroundColor: '#1C0EE8',
            },
        },
        // Unchecked state (Monthly)
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 22,
            height: 22,
            backgroundColor: '#1C0EE8', // Keep consistent blue thumb
        },
    },
    '& .MuiSwitch-track': {
        borderRadius: 28 / 2,
        opacity: 1,
        backgroundColor: '#000000',
        border: `2px solid #1C0EE8`,
        boxSizing: 'border-box',
    },
}));

export default function PricingSection(): JSX.Element {
    const [isAnnual, setIsAnnual] = useState(false);

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
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    sx={{
                        fontSize: { xs: '32px', md: '48px' },
                        lineHeight: { xs: '1.3', md: '1.2' },
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
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        mb: { xs: 6, md: 8 },
                    }}
                >
                    <Typography
                        onClick={() => setIsAnnual(false)}
                        sx={{
                            color: !isAnnual ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                            fontSize: '16px',
                            fontWeight: !isAnnual ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            width: '70px',
                            textAlign: 'right',
                        }}
                    >
                        Monthly
                    </Typography>

                    <AntSwitch
                        checked={isAnnual}
                        onChange={(e) => setIsAnnual(e.target.checked)}
                        inputProps={{ 'aria-label': 'toggle pricing' }}
                    />

                    <Typography
                        component="div"
                        onClick={() => setIsAnnual(true)}
                        sx={{
                            color: isAnnual ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                            fontSize: '16px',
                            fontWeight: isAnnual ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            width: '70px',
                            textAlign: 'left',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        Annual
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '100%',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                marginLeft: '6px',
                                background: 'rgba(34, 197, 94, 0.2)',
                                color: '#22C55E',
                                padding: '2px 8px',
                                borderRadius: '100px',
                                fontSize: '10px',
                                fontWeight: 700,
                                opacity: isAnnual ? 1 : 0,
                                visibility: isAnnual ? 'visible' : 'hidden',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Save 31%
                        </Box>
                    </Typography>
                </Box>

                {/* Pricing Card */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    key={isAnnual ? 'annual' : 'monthly'} // Key change triggers re-animation which might be nice
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '700px',
                        mx: 'auto',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    role="img"
                    aria-label={`Pricing: ${isAnnual ? 'Yearly' : 'Monthly'} plan.`}
                >
                    {/* Desktop View */}
                    <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%', position: 'relative' }}>
                        <Box
                            component="img"
                            src={isAnnual ? "/assets/landing-page/pricing_yearly_web.png" : "/assets/landing-page/pricing_monthly_web.png"}
                            alt="Pricing Plan"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                            }}
                        />
                        <Button
                            href="/signup"
                            sx={{
                                position: 'absolute',
                                bottom: '10%',
                                left: '50.5%',
                                transform: 'translateX(-50%)',
                                width: '22%',
                                height: '10%',
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

                    {/* Mobile View */}
                    <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', position: 'relative' }}>
                        <Box
                            component="img"
                            src={isAnnual ? "/assets/landing-page/pricing_yearly_mobile.png" : "/assets/landing-page/pricing_monthly_mobile.png"}
                            alt="Pricing Plan"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                            }}
                        />
                        <Button
                            href="/signup"
                            sx={{
                                position: 'absolute',
                                bottom: '10%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '85%',
                                height: '14%',
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
                </Box>
            </Container>
        </Box>
    );
}
