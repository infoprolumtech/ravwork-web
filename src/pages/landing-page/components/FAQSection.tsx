import { type JSX, useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { colors, sectionTitleStyle, spacing } from '../styles';

const faqs = [
    {
        question: "How does the link work?",
        answer: "It's a simple, professional page that clients use to book your services and stay updated on their active projects."
    },
    {
        question: "Is there a free trial?",
        answer: "Yes, we offer a 14-day free trial on all paid plans. No credit card required to start."
    },
    {
        question: "Can I use my own domain?",
        answer: "Absolutely! You can connect your custom domain to your RavworkLink profile on our Pro and Enterprise plans."
    },
    {
        question: "What support do you offer?",
        answer: "We provide email support for all users, with priority support and dedicated account managers for our larger plans."
    },
];

export default function FAQSection(): JSX.Element {
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box
            sx={{
                background: '#000000',
                padding: { xs: '60px 20px', sm: spacing.sectionPadding },
            }}
        >
            <Container maxWidth="md">
                <Typography
                    sx={{
                        ...sectionTitleStyle,
                        textAlign: 'center',
                        mb: 1.5,
                        fontSize: { xs: '24px', md: '44px' },
                        color: '#FFFFFF',
                    }}
                >
                    Frequently Asked Questions
                </Typography>
                <Typography
                    sx={{
                        ...sectionTitleStyle,
                        textAlign: 'center',
                        mb: 8,
                        fontSize: { xs: '14px', sm: '18px', md: '20px' },
                        fontWeight: 400,
                        color: '#FFFFFF',
                    }}
                >
                    Got questions? We've got answers. Find everything you need to know about using our platform, plans, and features.
                </Typography>

                <Box>
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                            sx={{
                                background: 'transparent',
                                color: '#FFFFFF',
                                boxShadow: 'none',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                '&:before': { display: 'none' },
                                '&.Mui-expanded': { mb: 2 },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: colors.accent }} />}
                                sx={{
                                    padding: '20px 0',
                                    '& .MuiAccordionSummary-content': {
                                        margin: 0,
                                    },
                                }}
                            >
                                <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: '0 0 20px 0' }}>
                                <Typography sx={{ color: colors.textSecondary, lineHeight: 1.6 }}>
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
