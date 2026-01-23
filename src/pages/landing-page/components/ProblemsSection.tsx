import { type JSX } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { sectionTitleStyle, spacing } from '../styles';

const problems = [
    {
        text: "Clients messaging you on different apps?",
        icon: "/assets/landing-page/problems-icons/icon-1.png",
    },
    {
        text: "Spending too much time asking basic questions?",
        icon: "/assets/landing-page/problems-icons/icon-2.png",
    },
    {
        text: "Hard to look professional without a website?",
        icon: "/assets/landing-page/problems-icons/icon-3.png",
    },
    {
        text: "Losing leads because you're disorganized?",
        icon: "/assets/landing-page/problems-icons/icon-4.png",
    },
];

export default function ProblemsSection(): JSX.Element {
    return (
        <Box
            sx={{
                background: '#000000',
                padding: spacing.sectionPadding,
                textAlign: 'center',
            }}
        >
            <Container maxWidth="md">
                <Typography
                    sx={{
                        ...sectionTitleStyle,
                        mb: 6,
                        fontSize: { xs: '32px', md: '44px' },
                        color: '#FFFFFF',
                        fontWeight: 700,
                    }}
                >
                    The Problems You Keep Ignoring
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                    {problems.map((problem, index) => (
                        <Box
                            key={index}
                            sx={{
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                borderRadius: '24px',
                                padding: '24px 32px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                width: '100%',
                                maxWidth: '700px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    borderColor: 'rgba(59, 130, 246, 0.4)',
                                    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.1)',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={problem.icon}
                                alt=""
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                }}
                            />
                            <Typography
                                sx={{
                                    color: '#FFFFFF',
                                    fontSize: { xs: '16px', md: '20px' },
                                    fontWeight: 500,
                                    textAlign: 'left',
                                }}
                            >
                                {problem.text}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
