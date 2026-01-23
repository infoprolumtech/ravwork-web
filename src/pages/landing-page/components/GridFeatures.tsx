import { type JSX } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { sectionTitleStyle, spacing } from '../styles';

export default function GridFeatures(): JSX.Element {
    return (
        <Box
            sx={{
                background: '#000000',
                padding: spacing.sectionPadding,
                paddingBottom: "0 !important",
                textAlign: 'center',
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    sx={{
                        ...sectionTitleStyle,
                        textAlign: 'center',
                        mb: { xs: 2 },
                        fontSize: { xs: '32px', sm: '44px' },
                        color: '#FFFFFF',
                        fontWeight: 700,
                        lineHeight: 1.2,
                    }}
                >
                    Look Professional. Stay Organized.<br />Get More Clients.
                </Typography>

                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '1200px',
                        mx: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        component="img"
                        src="/assets/landing-page/grid-features.png"
                        alt="RavworkLink Features"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '12px',
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
