import { type JSX } from 'react';
import { Box, Container, Button } from '@mui/material';
import { spacing } from '../styles';

export default function CTASection(): JSX.Element {
    return (
        <Box
            id="cta"
            sx={{
                background: '#000000',
                padding: spacing.sectionPadding,
                textAlign: 'center',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                    }}
                    role="img"
                    aria-label="Ready to look more professional? Create Your Link Now. Quick to set up. Simple to use."
                >
                    {/* Desktop View */}
                    <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%', position: 'relative' }}>
                        <Box
                            component="img"
                            src="/assets/landing-page/footer.png"
                            alt=""
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
                                top: '63%',
                                left: '50.5%',
                                transform: 'translate(-50%, -50%)',
                                width: '23%',
                                height: '20%',
                                minHeight: '44px',
                                background: 'transparent',
                                borderRadius: '12px',
                                '&:hover': {
                                    // background: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                            aria-label="Create Your Link Now"
                        />
                    </Box>

                    {/* Mobile View */}
                    <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', position: 'relative' }}>
                        <Box
                            component="img"
                            src="/assets/landing-page/mobile-footer.png"
                            alt=""
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
                                // Adjusted for typical mobile-footer layout
                                top: '65%',
                                left: '50.5%',
                                transform: 'translate(-50%, -50%)',
                                width: '80%',
                                height: '25%',
                                minHeight: '44px',
                                background: 'transparent',
                                borderRadius: '12px',
                                '&:hover': {
                                    // background: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                            aria-label="Create Your Link Now"
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
