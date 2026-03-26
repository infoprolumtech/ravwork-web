import { type JSX, useState, useEffect } from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ForumIcon from '@mui/icons-material/Forum';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GlowingCard from "./shared/GlowingCard";
import StepHeader from "./shared/StepHeader";
import GoBackButton from "./shared/GoBackButton";
import HandHint from "./shared/HandHint";
import PulseCTAButton from "./shared/PulseCTAButton";
import { textFieldSx, textFieldSxGray, greenIconBadgeSx, greenBarSx } from "./shared/styles";

interface CustomQuestionsProps {
    onBack: () => void;
    onNext: () => void;
}

export default function CustomQuestions({ onBack, onNext }: CustomQuestionsProps): JSX.Element {
    const navigate = useNavigate();
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowHint(true), 1000);
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
            <StepHeader
                title="Customize Your Booking Form"
                subtitle="Get job details upfront so you don't waste time going back and forth."
            />

            <GlowingCard>
                {/* Top Row: Green Icon & Close Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <Box sx={greenBarSx} />
                        <Box sx={greenIconBadgeSx}>
                            <ForumIcon fontSize="small" />
                        </Box>
                    </Box>
                    <IconButton sx={{ backgroundColor: '#F3F4F6', '&:hover': { backgroundColor: '#E5E7EB' } }} onClick={() => navigate('/')}>
                        <CloseIcon sx={{ color: '#111827', fontSize: '20px' }} />
                    </IconButton>
                </Box>

                {/* Card Heading */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>Custom Questions</Typography>
                    <Typography sx={{ color: '#9CA3AF', fontSize: '13px', fontWeight: 500 }}>
                        Create Questions that will be asked to all clients during service booking
                    </Typography>
                </Box>

                {/* Form Fields */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Question Field */}
                    <Box>
                        <Typography sx={{ color: '#111827', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>Question</Typography>
                        <TextField fullWidth defaultValue="Select an interior service" variant="outlined" size="small" sx={textFieldSx} />
                    </Box>

                    {/* Answer Type Field */}
                    <Box>
                        <Typography sx={{ color: '#9CA3AF', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>Answer Type</Typography>
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                fullWidth
                                defaultValue="Single Choice Dropdown"
                                variant="outlined"
                                size="small"
                                InputProps={{ readOnly: true }}
                                sx={{ ...textFieldSx, '& .MuiOutlinedInput-root': { ...textFieldSx['& .MuiOutlinedInput-root'], cursor: 'pointer', color: '#4B5563' } }}
                            />
                            <KeyboardArrowDownIcon sx={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none' }} />
                        </Box>
                    </Box>

                    {/* Options Section */}
                    <Box sx={{ mt: 1 }}>
                        <Typography sx={{ color: '#111827', fontSize: '13px', fontWeight: 700, mb: 2, ml: 1 }}>Options</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Option 1 */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField fullWidth defaultValue="Basic Clean (thorough vacuum cleaning, wipe down, spotless windows/trims)" variant="outlined" size="small" sx={textFieldSxGray} />
                                <IconButton size="small" sx={{ color: '#F87171', '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' } }}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            {/* Option 2 */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField fullWidth defaultValue="Deep Clean (Deep cleaning of all surfaces, including shampooing carpets/seats, steam cleaning for stains, and leather conditioning to prevent cracking.)" variant="outlined" size="small" multiline sx={{ ...textFieldSxGray, '& .MuiOutlinedInput-root': { ...textFieldSxGray['& .MuiOutlinedInput-root'], py: 1 } }} />
                                <IconButton size="small" sx={{ color: '#F87171', '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' } }}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button
                                    variant="text"
                                    disableRipple
                                    sx={{ color: '#111827', textTransform: 'none', fontWeight: 700, fontSize: '13px', '&:hover': { backgroundColor: 'transparent', opacity: 0.8 } }}
                                    startIcon={<AddIcon sx={{ fontSize: '18px !important' }} />}
                                >
                                    Add Options
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Add Questions Button */}
                    <Box sx={{ display: 'flex', mt: 1 }}>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#EFF6FF', color: '#1E3A8A', boxShadow: 'none', textTransform: 'none', fontWeight: 600, fontSize: '13px', borderRadius: '16px', py: 0.5, px: 2, '&:hover': { backgroundColor: '#DBEAFE', boxShadow: 'none' } }}
                            startIcon={<AddIcon sx={{ fontSize: '16px !important', color: '#1E3A8A' }} />}
                        >
                            Add Questions
                        </Button>
                    </Box>
                </Box>

                {/* Bottom Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2 }}>
                    <Button
                        variant="text"
                        onClick={onBack}
                        sx={{ color: '#111827', fontWeight: 600, textTransform: 'none', borderRadius: '24px', px: 3, py: 1, backgroundColor: '#F9FAFB', '&:hover': { backgroundColor: '#F3F4F6' } }}
                    >
                        Cancel
                    </Button>
                    <Box sx={{ position: 'relative' }}>
                        <HandHint show={showHint} direction="down" sx={{ left: '50%', transform: 'translateX(-50%)', top: '5px' }} />
                        <PulseCTAButton onClick={onNext} label="Create Question" showPulse={showHint} />
                    </Box>
                </Box>
            </GlowingCard>

            <GoBackButton onClick={onBack} />
        </Box>
    );
}
