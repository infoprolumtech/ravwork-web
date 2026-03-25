import { type JSX, useState, useEffect } from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ReachOutProps {
    onBack: () => void;
    onNext: () => void;
    onFinish: () => void;
}

export default function ReachOut({ onBack, onNext, onFinish }: ReachOutProps): JSX.Element {
    const navigate = useNavigate();
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box 
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            sx={{ width: '100%', maxWidth: '900px', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            {/* Titles above the card */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#FFFFFF', fontSize: { xs: '32px', sm: '48px' } }}>
                    Choose How Clients Contact You
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
                    Collect basic info or ask custom questions before every job.
                </Typography>
            </Box>

            {/* The Glowing Card Wrapper */}
            <Box sx={{
                width: '100%',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    right: '-20px',
                    bottom: '-20px',
                    background: 'linear-gradient(180deg, rgba(81, 146, 251, 0.6) 0%, rgba(59, 130, 246, 0) 100%)',
                    filter: 'blur(50px)',
                    zIndex: 0,
                    borderRadius: '32px',
                    opacity: 0.8
                }
            }}>
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        position: 'relative',
                        zIndex: 1,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '24px',
                        overflow: 'visible',
                        p: { xs: 3, sm: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Top Row: Green Icon & Close Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            {/* Small vertical green bar */}
                            <Box sx={{ 
                                position: 'absolute', 
                                left: { xs: -24, sm: -40 }, 
                                top: 0,
                                bottom: 0,
                                width: '4px', 
                                backgroundColor: '#10B981',
                                borderTopRightRadius: '4px',
                                borderBottomRightRadius: '4px'
                            }} />

                            {/* Green headset icon badge */}
                            <Box sx={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                color: '#10B981'
                            }}>
                                <HeadsetMicIcon fontSize="small" />
                            </Box>
                        </Box>

                        <IconButton sx={{ backgroundColor: '#F3F4F6', '&:hover': { backgroundColor: '#E5E7EB' } }} onClick={() => navigate('/')}>
                            <CloseIcon sx={{ color: '#111827', fontSize: '20px' }} />
                        </IconButton>
                    </Box>

                    {/* Card Heading */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                            How Should Clients Reach Out?
                        </Typography>
                        <Typography sx={{ color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>
                            Choose how much information you want to collect before the job
                        </Typography>
                    </Box>

                    {/* Option Boxes */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        {/* Quick Contact Option */}
                        <Box 
                            onClick={onFinish}
                            sx={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: '16px',
                                p: 3,
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: '#E5E7EB',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>
                                    Quick Contact
                                </Typography>
                                <Box sx={{ 
                                    width: '28px', 
                                    height: '28px', 
                                    backgroundColor: '#D1FAE5', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#059669'
                                }}>
                                    <ElectricBoltIcon sx={{ fontSize: '16px' }} />
                                </Box>
                            </Box>

                            <Box sx={{ width: '40px', height: '1px', backgroundColor: '#D1D5DB', mb: 2 }} />

                            <Typography sx={{ fontWeight: 600, color: '#6B7280', fontSize: '13px', mb: 1 }}>
                                Collect Basic Information to get booked faster
                            </Typography>
                            
                            <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography sx={{ color: '#6B7280', fontSize: '13px', position: 'relative', '&::before': { content: '""', position: 'absolute', left: '-12px', top: '8px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6B7280' } }}>
                                    Name
                                </Typography>
                                <Typography sx={{ color: '#6B7280', fontSize: '13px', position: 'relative', '&::before': { content: '""', position: 'absolute', left: '-12px', top: '8px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6B7280' } }}>
                                    Phone Number
                                </Typography>
                            </Box>
                        </Box>

                        {/* Contact Info + Job Questions Option */}
                        <Box 
                            onClick={onNext}
                            sx={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: '16px',
                                p: 3,
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: '#E5E7EB',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {/* Hand hint */}
                            {showHint && (
                                <Box
                                    component="img"
                                    src="/assets/landing-page/demo/hand.png"
                                    alt="Click here"
                                    sx={{
                                        position: 'absolute',
                                        left: '250px',
                                        top: '10px',
                                        width: '45px',
                                        height: 'auto',
                                        animation: 'bounceHandDown 1.5s infinite',
                                        '@keyframes bounceHandDown': {
                                            '0%, 100%': { transform: 'translateY(0)' },
                                            '50%': { transform: 'translateY(10px)' },
                                        },
                                        zIndex: 10,
                                    }}
                                />
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>
                                    Contact info + Job Questions
                                </Typography>
                                <Box sx={{ 
                                    width: '28px', 
                                    height: '28px', 
                                    backgroundColor: '#E5E7EB', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: '#4B5563'
                                }}>
                                    <DescriptionOutlinedIcon sx={{ fontSize: '16px' }} />
                                </Box>
                            </Box>

                            <Box sx={{ width: '40px', height: '1px', backgroundColor: '#D1D5DB', mb: 2 }} />

                            <Typography sx={{ fontWeight: 600, color: '#6B7280', fontSize: '13px', mb: 0.5 }}>
                                Collect job details with a custom form
                            </Typography>
                            <Typography sx={{ color: '#6B7280', fontSize: '13px' }}>
                                you can create questions for your client to answer
                            </Typography>
                        </Box>

                    </Box>
                </Paper>
            </Box>

            {/* Floating Go Back Button */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                <Box
                    onClick={onBack}
                    sx={{
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '14px',
                        borderRadius: '24px',
                        px: 3,
                        py: 1.5,
                        cursor: 'pointer',
                        display: 'inline-block',
                        transition: 'backgroundColor 0.2s',
                        '&:hover': { backgroundColor: '#F3F4F6' }
                    }}
                >
                    Go Back
                </Box>
            </Box>
        </Box>
    );
}
