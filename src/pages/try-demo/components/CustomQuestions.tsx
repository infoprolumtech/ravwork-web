import { type JSX, useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ForumIcon from '@mui/icons-material/Forum';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface CustomQuestionsProps {
    onBack: () => void;
    onNext: () => void;
}

export default function CustomQuestions({ onBack, onNext }: CustomQuestionsProps): JSX.Element {
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
                    Customize Your Booking Form
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
                    Get job details upfront so you don't waste time going back and forth.
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

                            {/* Green forum/chat icon badge */}
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
                                <ForumIcon fontSize="small" />
                            </Box>
                        </Box>

                        <IconButton sx={{ backgroundColor: '#F3F4F6', '&:hover': { backgroundColor: '#E5E7EB' } }} onClick={() => navigate('/')}>
                            <CloseIcon sx={{ color: '#111827', fontSize: '20px' }} />
                        </IconButton>
                    </Box>

                    {/* Card Heading */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                            Custom Questions
                        </Typography>
                        <Typography sx={{ color: '#9CA3AF', fontSize: '13px', fontWeight: 500 }}>
                            Create Questions that will be asked to all clients during service booking
                        </Typography>
                    </Box>

                    {/* Form Fields */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        {/* Question Field */}
                        <Box>
                            <Typography sx={{ color: '#111827', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>Question</Typography>
                            <TextField
                                fullWidth
                                defaultValue="Select an interior service"
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#FFFFFF',
                                        '& fieldset': { borderColor: '#E5E7EB' },
                                        '&:hover fieldset': { borderColor: '#D1D5DB' },
                                        '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '1px' },
                                        color: '#111827',
                                        fontWeight: 500
                                    }
                                }}
                            />
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
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: '#FFFFFF',
                                            cursor: 'pointer',
                                            '& fieldset': { borderColor: '#E5E7EB' },
                                            '&:hover fieldset': { borderColor: '#D1D5DB' },
                                            color: '#4B5563',
                                            fontWeight: 500
                                        }
                                    }}
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
                                    <TextField
                                        fullWidth
                                        defaultValue="Basic Clean (thorough vacuum cleaning, wipe down, spotless windows/trims)"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: '#FFFFFF',
                                                '& fieldset': { borderColor: '#E5E7EB' },
                                                '&:hover fieldset': { borderColor: '#D1D5DB' },
                                                color: '#9CA3AF',
                                                fontSize: '14px'
                                            }
                                        }}
                                    />
                                    <IconButton size="small" sx={{ color: '#F87171', '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' } }}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                {/* Option 2 */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        defaultValue="Deep Clean (Deep cleaning of all surfaces, including shampooing carpets/seats, steam cleaning for stains, and leather conditioning to prevent cracking.)"
                                        variant="outlined"
                                        size="small"
                                        multiline
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: '#FFFFFF',
                                                '& fieldset': { borderColor: '#E5E7EB' },
                                                '&:hover fieldset': { borderColor: '#D1D5DB' },
                                                color: '#9CA3AF',
                                                fontSize: '14px',
                                                py: 1
                                            }
                                        }}
                                    />
                                    <IconButton size="small" sx={{ color: '#F87171', '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' } }}>
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                    <Button 
                                        variant="text" 
                                        disableRipple
                                        sx={{ 
                                            color: '#111827', 
                                            textTransform: 'none', 
                                            fontWeight: 700, 
                                            fontSize: '13px',
                                            '&:hover': { backgroundColor: 'transparent', opacity: 0.8 } 
                                        }}
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
                                sx={{ 
                                    backgroundColor: '#EFF6FF', 
                                    color: '#1E3A8A', 
                                    boxShadow: 'none',
                                    textTransform: 'none', 
                                    fontWeight: 600, 
                                    fontSize: '13px',
                                    borderRadius: '16px',
                                    py: 0.5,
                                    px: 2,
                                    '&:hover': { backgroundColor: '#DBEAFE', boxShadow: 'none' } 
                                }}
                                startIcon={<AddIcon sx={{ fontSize: '16px !important', color: '#1E3A8A' }} />}
                            >
                                Add Questions
                            </Button>
                        </Box>

                    </Box>

                    {/* Bottom Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 2, borderTop: '1px solid transparent' }}>
                        <Button
                            variant="text"
                            onClick={onBack}
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
                            {showHint && (
                                <Box
                                    component="img"
                                    src="/assets/landing-page/demo/hand.png"
                                    alt="Click Next"
                                    sx={{
                                        position: 'absolute',
                                        right: '-10px',
                                        top: '5px',
                                        width: '40px',
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
                            <Button
                                variant="contained"
                                onClick={onNext}
                                sx={{
                                    backgroundColor: '#000000',
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: '24px',
                                    px: 4,
                                    py: 1,
                                    boxShadow: showHint ? '0 0 0 4px rgba(59, 130, 246, 0.4)' : 'none',
                                    transition: 'background-color 0.3s ease',
                                    animation: showHint ? 'pulseBtn 2s infinite' : 'none',
                                    '@keyframes pulseBtn': {
                                        '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
                                        '70%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
                                        '100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' }
                                    },
                                    '&:hover': { backgroundColor: '#1F2937' }
                                }}
                            >
                                Create Question
                            </Button>
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
