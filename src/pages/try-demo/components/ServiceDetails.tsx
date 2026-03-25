import { type JSX, useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { useNavigate } from "react-router-dom";

interface ServiceDetailsProps {
    onNext: () => void;
}

export default function ServiceDetails({ onNext }: ServiceDetailsProps): JSX.Element {
    const navigate = useNavigate();
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Titles above the card */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#FFFFFF', fontSize: { xs: '32px', sm: '48px' } }}>
                    Start Setting Up Your Service
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
                    Add your service details, pricing, and response time
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
                            {/* Small vertical green bar on the far left edge of the card */}
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

                            {/* Green lightning icon badge */}
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
                            <TextField
                                fullWidth
                                defaultValue="Exterior Wash"
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

                        <Box>
                            <Typography sx={{ color: '#4B5563', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>What's Included?</Typography>
                            <TextField
                                fullWidth
                                defaultValue="Hand wash, wheel/tire cleaning, and a spray wax for a quick shine."
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#FFFFFF',
                                        '& fieldset': { borderColor: '#E5E7EB' },
                                        '&:hover fieldset': { borderColor: '#D1D5DB' },
                                        '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '1px' },
                                        color: '#4B5563',
                                        fontSize: '14px'
                                    }
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography sx={{ color: '#4B5563', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>Service price</Typography>
                            <TextField
                                fullWidth
                                defaultValue="$150"
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

                        <Box>
                            <Typography sx={{ color: '#4B5563', fontSize: '13px', fontWeight: 600, mb: 0.5, ml: 1 }}>Response time</Typography>
                            <TextField
                                fullWidth
                                defaultValue="Select"
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#FFFFFF',
                                        '& fieldset': { borderColor: '#E5E7EB' },
                                        '&:hover fieldset': { borderColor: '#D1D5DB' },
                                        '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '1px' },
                                        color: '#9CA3AF',
                                    }
                                }}
                            />
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
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Floating Go Back Button */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={() => navigate(-1)}
                    sx={{
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '24px',
                        px: 3,
                        py: 1,
                        '&:hover': { backgroundColor: '#F3F4F6' }
                    }}
                >
                    Go Back
                </Button>
            </Box>
        </Box>
    );
}
