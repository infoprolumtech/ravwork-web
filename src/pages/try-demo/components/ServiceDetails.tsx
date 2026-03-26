import { type JSX, useState, useEffect } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { useNavigate } from "react-router-dom";
import GlowingCard from "./shared/GlowingCard";
import StepHeader from "./shared/StepHeader";
import GoBackButton from "./shared/GoBackButton";
import HandHint from "./shared/HandHint";
import PulseCTAButton from "./shared/PulseCTAButton";
import { textFieldSx, greenIconBadgeSx, greenBarSx } from "./shared/styles";

interface ServiceDetailsProps {
    onNext: () => void;
}

export default function ServiceDetails({ onNext }: ServiceDetailsProps): JSX.Element {
    const navigate = useNavigate();
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowHint(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StepHeader
                title="Start Setting Up Your Service"
                subtitle="Add your service details, pricing, and response time"
            />

            <GlowingCard>
                {/* Top Row: Green Icon & Close Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <Box sx={greenBarSx} />
                        <Box sx={greenIconBadgeSx}>
                            <ElectricBoltIcon fontSize="small" />
                        </Box>
                    </Box>
                    <IconButton sx={{ backgroundColor: '#F3F4F6', '&:hover': { backgroundColor: '#E5E7EB' } }} onClick={() => navigate('/')}>
                        <CloseIcon sx={{ color: '#111827', fontSize: '20px' }} />
                    </IconButton>
                </Box>

                {/* Card Heading */}
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 4 }}>
                    Service details
                </Typography>

                {/* Form Fields */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography sx={{ color: '#4B5563', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>Service title</Typography>
                        <TextField fullWidth defaultValue="Exterior Wash" variant="outlined" size="small" sx={textFieldSx} />
                    </Box>
                    <Box>
                        <Typography sx={{ color: '#4B5563', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>What's Included?</Typography>
                        <TextField fullWidth defaultValue="Hand wash, wheel/tire cleaning, and a spray wax for a quick shine." variant="outlined" size="small" sx={{ ...textFieldSx, '& .MuiOutlinedInput-root': { ...textFieldSx['& .MuiOutlinedInput-root'], color: '#4B5563', fontSize: '14px' } }} />
                    </Box>
                    <Box>
                        <Typography sx={{ color: '#4B5563', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>Service price</Typography>
                        <TextField fullWidth defaultValue="$150" variant="outlined" size="small" sx={textFieldSx} />
                    </Box>
                    <Box>
                        <Typography sx={{ color: '#4B5563', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>Response time</Typography>
                        <TextField fullWidth defaultValue="Select" variant="outlined" size="small" sx={{ ...textFieldSx, '& .MuiOutlinedInput-root': { ...textFieldSx['& .MuiOutlinedInput-root'], color: '#9CA3AF' } }} />
                    </Box>
                </Box>

                {/* Bottom Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
                    <Button
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={{
                            color: '#111827',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: '24px',
                            px: 3,
                            py: 1,
                            backgroundColor: '#F9FAFB',
                            '&:hover': { backgroundColor: '#F3F4F6' }
                        }}
                    >
                        Cancel
                    </Button>
                    <Box sx={{ position: 'relative' }}>
                        <HandHint show={showHint} direction="down" sx={{ right: '-10px', top: '5px' }} />
                        <PulseCTAButton onClick={onNext} label="Next" showPulse={showHint} />
                    </Box>
                </Box>
            </GlowingCard>

            <GoBackButton onClick={() => navigate(-1)} />
        </Box>
    );
}
