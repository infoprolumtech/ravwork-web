import { type JSX, useState, useEffect } from "react";
import { Box, Typography, Button, Paper, InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import IosShareIcon from '@mui/icons-material/IosShare';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { motion } from "framer-motion";

interface ClientPreviewProps {
    onBack: () => void;
    onNext: () => void;
    onFinish: () => void;
}

export default function ClientPreview({ onBack, onNext, onFinish }: ClientPreviewProps): JSX.Element {
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
                    What Your Clients See
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
                    A Clean, professional booking page. No Dms, no confusion.
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
                        overflow: 'hidden',
                        p: { xs: 3, sm: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >
                    {/* Header: Logo and Search */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        {/* Placeholder Logo */}
                        <Box sx={{ width: '40px', height: '40px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Box component="img" src="/assets/icons/ravwork_logo_icon.svg" alt="Logo" sx={{ width: '60px', height: '60px' }} />
                        </Box>
                        
                        <TextField 
                            placeholder="Search"
                            size="small"
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                            }}
                            sx={{
                                width: '250px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                    backgroundColor: '#F9FAFB',
                                    '& fieldset': { border: 'none' }
                                }
                            }}
                        />
                    </Box>

                    {/* Blue Banner Section */}
                    <Box sx={{ 
                        backgroundColor: '#DBEAFE', 
                        borderRadius: '16px', 
                        p: 4, 
                        display: 'flex',
                        position: 'relative'
                    }}>
                        {/* Avatar */}
                        <Box sx={{ 
                            width: '90px', 
                            height: '90px', 
                            borderRadius: '50%', 
                            overflow: 'hidden', 
                            mr: 3,
                            flexShrink: 0,
                            backgroundColor: '#BFDBFE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid #FFFFFF'
                        }}>
                             <DirectionsCarIcon sx={{ fontSize: '40px', color: '#1E3A8A' }} />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                                    Marties Car Spa
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    startIcon={<IosShareIcon fontSize="small" />}
                                    sx={{ 
                                        backgroundColor: '#111827', 
                                        color: '#FFFFFF', 
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        py: 0.5,
                                        '&:hover': { backgroundColor: '#374151' }
                                    }}
                                >
                                    Share
                                </Button>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <FacebookIcon sx={{ color: '#3B82F6', fontSize: '20px' }} />
                                <LinkedInIcon sx={{ color: '#2563EB', fontSize: '20px' }} />
                                <InstagramIcon sx={{ color: '#E1306C', fontSize: '20px' }} />
                            </Box>

                            <Typography sx={{ color: '#4B5563', fontSize: '13px', lineHeight: 1.5 }}>
                                Shine with Martie! ✨ Pick your service below, and I'll be in touch ASAP to get your ride looking brand new.
                            </Typography>
                        </Box>
                    </Box>

                    {/* Services Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        
                        {/* Exterior Wash Card */}
                        <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: '16px', p: 3, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', mb: 2 }}>
                                <ElectricBoltIcon sx={{ fontSize: '16px' }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>Exterior Wash</Typography>
                            <Typography sx={{ color: '#6B7280', fontSize: '13px', mb: 3, flex: 1 }}>
                                Hand wash, wheel/tire cleaning, and a spray wax for a quick shine.
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '24px', color: '#111827' }}>$55</Typography>
                                <Box sx={{ position: 'relative' }}>
                                    {showHint && (
                                        <Box
                                            component="img"
                                            src="/assets/landing-page/demo/hand.png"
                                            alt="Click Book Now"
                                            sx={{
                                                position: 'absolute',
                                                right: '-10px',
                                                top: '10px',
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
                                        onClick={onNext} 
                                        variant="contained" 
                                        sx={{ 
                                            backgroundColor: '#000000', 
                                            color: '#FFFFFF', 
                                            borderRadius: '20px', 
                                            textTransform: 'none', 
                                            px: 3, 
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
                                        Book Now
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Interior Clean Card */}
                        <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: '16px', p: 3, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', mb: 2 }}>
                                <DescriptionOutlinedIcon sx={{ fontSize: '16px' }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>Interior Clean</Typography>
                            <Typography sx={{ color: '#6B7280', fontSize: '13px', mb: 3, flex: 1 }}>
                                Thorough vacuuming, wiping down the dashboard/console, and cleaning the windows.
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '24px', color: '#111827' }}>$110</Typography>
                                <Button onClick={onNext} variant="contained" sx={{ backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '20px', textTransform: 'none', px: 3, '&:hover': { backgroundColor: '#1F2937' } }}>
                                    Book Now
                                </Button>
                            </Box>
                        </Box>

                    </Box>

                    {/* Question Card */}
                    <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: '16px', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FEF08A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A16207', mb: 2 }}>
                                <ChatBubbleOutlineIcon sx={{ fontSize: '16px' }} />
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>Have a question?</Typography>
                            <Typography sx={{ color: '#6B7280', fontSize: '13px' }}>Provide your contact info.</Typography>
                        </Box>
                        <Button onClick={onFinish} variant="contained" sx={{ backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '20px', textTransform: 'none', px: 4, '&:hover': { backgroundColor: '#1F2937' } }}>
                            Request
                        </Button>
                    </Box>


                </Paper>
            </Box>

            {/* Floating Buttons Below Card */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
