import { type JSX } from 'react';
import { Box, Container, Button } from '@mui/material';
import { spacing } from '../styles';

export default function CTASection(): JSX.Element {
    return (
        <Box
            id="cta"
            sx={{
                background: '#000000',
                padding: { xs: '40px 20px', md: spacing.sectionPadding },
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
                    }}
                    role="img"
                    aria-label="Ready to look more professional? Create Your Link Now. Quick to set up. Simple to use."
                >
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

                    {/* Interactive overlay button positioned over the design's button */}
                    <Button
                        href="/signup"
                        sx={{
                            position: 'absolute',
                            // These percentages align with the button area in footer.png
                            top: '63%',
                            left: '50.5%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '60%', sm: '40%', md: '23%' },
                            height: { xs: '15%', md: '20%' },
                            minHeight: '44px',
                            background: 'transparent',
                            borderRadius: '12px',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                        aria-label="Create Your Link Now"
                    />
                </Box>
            </Container>
        </Box>
    );
}
