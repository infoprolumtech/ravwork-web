import { type JSX, useState } from 'react';
import { Box, Container, Typography, Button, Switch, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { spacing, colors } from '../styles';

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
                            transition: 'all 0.3s ease'
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
                        onClick={() => setIsAnnual(true)}
                        sx={{
                            color: isAnnual ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                            fontSize: '16px',
                            fontWeight: isAnnual ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Annual
                    </Typography>

                    {/* Discount Badge - Only visible when NOT monthly (i.e. Yearly is active?) 
                        The user said: "Save 31% will hide when switched montly".
                        This implies when Monthly IS selected, it hides. When Annual IS selected, it shows.
                        Wait, typically "Save 31%" is a permanent label next to "Annual" to entice the click. 
                        But the user explicitly said "hide when switched montly". 
                        I will follow usage: hide if isAnnual is false? Or maybe the user means hide it if the toggle is set to monthly mode?
                        Usually these badges are ALWAYS visible to encourage clicking Annual.
                        However, complying with "hide when switched montly":
                        If (isAnnual) -> Show. If (!isAnnual) -> Hide.
                        Let's verify interpretation: "Save 31% will hide when switched montly"
                        Scenario A: User is viewing Monthly. Badge is hidden.
                        Scenario B: User toggles to Annual. Badge appears.
                        
                        Alternative interpretation: The badge is part of the "Annual" label and should always be there to show *why* you should switch?
                        But user instruction is specific. I will hide it when `!isAnnual`.
                    */}
                    <Box
                        sx={{
                            background: 'rgba(34, 197, 94, 0.2)',
                            color: '#22C55E',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: 700,
                            opacity: isAnnual ? 1 : 0, // Fade out instead of unmount to keep layout stable or just hide?
                            visibility: isAnnual ? 'visible' : 'hidden',
                            transition: 'all 0.3s ease',
                            transform: isAnnual ? 'translateX(0)' : 'translateX(-10px)',
                        }}
                    >
                        Save 31%
                    </Box>
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
                            src={isAnnual ? "/assets/landing-page/pricing_yearly.png" : "/assets/landing-page/pricing.png"}
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
                            src={isAnnual ? "/assets/landing-page/pricing_yearly.png" : "/assets/landing-page/mobile-pricing.png"}
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
