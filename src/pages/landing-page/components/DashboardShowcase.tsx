import { type JSX } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { colors, sectionTitleStyle, subheadlineStyle, spacing } from '../styles';

interface DashboardShowcaseProps {
    title: string;
    description?: string;
    imagePath: string;
    imageAlt: string;
    reverse?: boolean;
}

export default function DashboardShowcase({
    title,
    description,
    imagePath,
    imageAlt,
    reverse = false,
}: DashboardShowcaseProps): JSX.Element {
    return (
        <Box
            sx={{
                background: reverse ? colors.secondaryBg : colors.primaryBg,
                padding: spacing.sectionPadding,
                position: 'relative',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: reverse ? 'row-reverse' : 'row' },
                        alignItems: 'center',
                        gap: { xs: 4, md: 6, lg: 8 },
                    }}
                >
                    {/* Text Content */}
                    <Box
                        sx={{
                            flex: 1,
                            textAlign: { xs: 'center', md: 'left' },
                            animation: 'fadeInUp 0.8s ease-out',
                            '@keyframes fadeInUp': {
                                from: {
                                    opacity: 0,
                                    transform: 'translateY(30px)',
                                },
                                to: {
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                },
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                ...sectionTitleStyle,
                                textAlign: { xs: 'center', md: 'left' },
                                fontSize: { xs: '28px', sm: '32px', md: '36px', lg: '40px' },
                            }}
                        >
                            {title}
                        </Typography>
                        {description && (
                            <Typography
                                sx={{
                                    ...subheadlineStyle,
                                    textAlign: { xs: 'center', md: 'left' },
                                    mb: 0,
                                }}
                            >
                                {description}
                            </Typography>
                        )}
                    </Box>

                    {/* Dashboard Image */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            animation: 'fadeIn 1s ease-out 0.3s both',
                            '@keyframes fadeIn': {
                                from: {
                                    opacity: 0,
                                },
                                to: {
                                    opacity: 1,
                                },
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src={imagePath}
                            alt={imageAlt}
                            sx={{
                                width: '100%',
                                maxWidth: '700px',
                                height: 'auto',
                                borderRadius: '16px',
                                boxShadow: `0 20px 60px rgba(59, 130, 246, 0.3)`,
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
