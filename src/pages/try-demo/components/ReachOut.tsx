import { type JSX, useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GlowingCard from "./shared/GlowingCard";
import StepHeader from "./shared/StepHeader";
import GoBackButton from "./shared/GoBackButton";
import HandHint from "./shared/HandHint";
import { greenIconBadgeSx, greenBarSx } from "./shared/styles";

interface ReachOutProps {
    onBack: () => void;
    onNext: () => void;
    onFinish: () => void;
}

export default function ReachOut({ onBack, onNext, onFinish }: ReachOutProps): JSX.Element {
    const navigate = useNavigate();
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowHint(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const optionBoxSx = {
        backgroundColor: '#F3F4F6',
        borderRadius: '16px',
        p: { xs: 2, sm: 3 },
        position: 'relative' as const,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#E5E7EB',
            transform: 'translateY(-2px)'
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            sx={{ width: '100%', maxWidth: '900px', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <StepHeader
                title="Choose How Clients Contact You"
                subtitle="Collect basic info or ask custom questions before every job."
            />

            <GlowingCard>
                {/* Top Row: Green Icon & Close Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <Box sx={greenBarSx} />
                        <Box sx={greenIconBadgeSx}>
                            <HeadsetMicIcon fontSize="small" />
                        </Box>
                    </Box>
                    <IconButton sx={{ backgroundColor: '#F3F4F6', pointerEvents: 'none', cursor: 'default', '&:hover': { backgroundColor: '#F3F4F6' } }}>
                        <CloseIcon sx={{ color: '#111827', fontSize: '20px' }} />
                    </IconButton>
                </Box>

                {/* Card Heading */}
                <Box sx={{ mb: { xs: 2, sm: 4 } }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                        How Should Clients Reach Out?
                    </Typography>
                    <Typography sx={{ color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>
                        Choose how much information you want to collect before the job
                    </Typography>
                </Box>

                {/* Option Boxes */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>

                    {/* Quick Contact Option */}
                    <Box sx={{ ...optionBoxSx, cursor: 'default', pointerEvents: 'none', '&:hover': { backgroundColor: '#F3F4F6', transform: 'none' } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>
                                Quick Contact
                            </Typography>
                            <Box sx={{ width: '28px', height: '28px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                                <ElectricBoltIcon sx={{ fontSize: '16px' }} />
                            </Box>
                        </Box>
                        <Box sx={{ width: '40px', height: '1px', backgroundColor: '#D1D5DB', mb: 2 }} />
                        <Typography sx={{ fontWeight: 600, color: '#6B7280', fontSize: '13px', mb: 1 }}>
                            Collect Basic Information to get booked faster
                        </Typography>
                        <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {['Name', 'Phone Number'].map((item) => (
                                <Typography key={item} sx={{ color: '#6B7280', fontSize: '13px', position: 'relative', '&::before': { content: '""', position: 'absolute', left: '-12px', top: '8px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6B7280' } }}>
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Box>

                    {/* Contact Info + Job Questions Option */}
                    <Box onClick={onNext} sx={optionBoxSx}>
                        <HandHint show={showHint} direction="down" sx={{ left: { xs: '180px', sm: '250px' }, top: '50px' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '15px' }}>
                                Contact info + Job Questions
                            </Typography>
                            <Box sx={{ width: '28px', height: '28px', backgroundColor: '#E5E7EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563' }}>
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
            </GlowingCard>

            <GoBackButton onClick={onBack} />
        </Box>
    );
}
