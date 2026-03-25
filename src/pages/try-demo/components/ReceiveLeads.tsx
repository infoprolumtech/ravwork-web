import { type JSX, useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GridViewIcon from '@mui/icons-material/GridView';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import HandymanIcon from '@mui/icons-material/Handyman';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { motion } from "framer-motion";

interface ReceiveLeadsProps {
    onBack: () => void;
    onNext: () => void;
    onFinish: () => void;
}

export default function ReceiveLeads({ onBack, onNext, onFinish }: ReceiveLeadsProps): JSX.Element {
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const sidebarItems = [
        { icon: <GridViewIcon fontSize="small" />, text: "Dashboard" },
        { icon: <WorkOutlineIcon fontSize="small" />, text: "My Jobs", active: true },
        { icon: <HandymanIcon fontSize="small" />, text: "Services Offered" },
        { icon: <AttachMoneyIcon fontSize="small" />, text: "Earnings" },
        { icon: <PersonOutlineIcon fontSize="small" />, text: "My profile" },
        { icon: <MailOutlineIcon fontSize="small" />, text: "Email and SMS" },
        { icon: <SubscriptionsOutlinedIcon fontSize="small" />, text: "Manage Subscription" },
    ];

    const leads = [
        {
            title: "Exterior Wash",
            desc: "Hand wash, wheel/tire cleaning, and a spray...",
            client: "Antwon Johnson",
            email: "antwonj646@gmail.com",
            phone: "6466138029"
        },
        {
            title: "Interior Clean",
            desc: "Thorough vacuuming, wiping down the dashbo...",
            client: "Mike Vett",
            email: "m1parr@gmail.com",
            phone: "6467550664"
        },
        {
            title: "Exterior Wash",
            desc: "Hand wash, wheel/tire cleaning, and a spray...",
            client: "Al Miller",
            email: "allen2001@gmail.com",
            phone: "6462743111"
        }
    ];

    return (
        <Box 
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            sx={{ width: '100%', maxWidth: '1050px', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            {/* Titles above the card */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#FFFFFF', fontSize: { xs: '32px', sm: '48px' } }}>
                    Receive Leads in One Place
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
                    No more scattered messages. Every client request is organized
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
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        minHeight: '600px'
                    }}
                >
                    {/* Sidebar */}
                    <Box sx={{ 
                        width: { xs: '100%', md: '260px' }, 
                        backgroundColor: '#FFFFFF', 
                        borderRight: { xs: 'none', md: '1px solid #E5E7EB' },
                        borderBottom: { xs: '1px solid #E5E7EB', md: 'none' },
                        display: 'flex',
                        flexDirection: 'column',
                        pt: 4,
                        pb: 2
                    }}>
                        {/* Profile Area */}
                        <Box sx={{ px: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ width: '40px', height: '40px', backgroundColor: '#BFDBFE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5 }}>
                                    <DirectionsCarIcon sx={{ fontSize: '20px', color: '#1E3A8A' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#111827', lineHeight: 1.2 }}>Marties</Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>Marties Car Spa</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: '12px', p: 2 }}>
                                <Typography sx={{ fontSize: '11px', color: '#6B7280', mb: 1 }}>Get More Clients with a complete Profile</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                                    <Box sx={{ flex: 1, height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', position: 'relative' }}>
                                        <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '77%', backgroundColor: '#10B981', borderRadius: '3px' }} />
                                    </Box>
                                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>77%</Typography>
                                </Box>
                                <Button size="small" sx={{ backgroundColor: '#000000', color: '#FFFFFF', fontSize: '10px', textTransform: 'none', py: 0.5, px: 1.5, borderRadius: '12px', '&:hover': { backgroundColor: '#1F2937' } }}>
                                    Complete profile
                                </Button>
                            </Box>
                        </Box>

                        {/* Navigation Links */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, px: 2, position: 'relative' }}>
                            {showHint && (
                                <Box
                                    component="img"
                                    src="/assets/landing-page/demo/hand.png"
                                    alt="Click Dashboard"
                                    sx={{
                                        position: 'absolute',
                                        left: '140px',
                                        top: '12px',
                                        width: '40px',
                                        height: 'auto',
                                        animation: 'bounceHandLeft 1.5s infinite',
                                        '@keyframes bounceHandLeft': {
                                            '0%, 100%': { transform: 'translateX(0)' },
                                            '50%': { transform: 'translateX(-10px)' },
                                        },
                                        zIndex: 10,
                                        transform: 'rotate(90deg)',
                                        pointerEvents: 'none'
                                    }}
                                />
                            )}
                            
                            {sidebarItems.map((item, index) => (
                                <Box 
                                    key={index}
                                    onClick={item.text === "Dashboard" ? onNext : undefined}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        px: 2,
                                        py: 1.2,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: item.active ? '#F3F4F6' : 'transparent',
                                        color: item.active ? '#111827' : '#4B5563',
                                        fontWeight: item.active ? 600 : 500,
                                        fontSize: '14px',
                                        position: 'relative',
                                        '&:hover': {
                                            backgroundColor: '#F9FAFB',
                                            color: '#111827'
                                        }
                                    }}
                                >
                                    {item.active && (
                                        <Box sx={{ position: 'absolute', left: '-16px', top: '10%', bottom: '10%', width: '4px', backgroundColor: '#000000', borderRadius: '0 4px 4px 0' }} />
                                    )}
                                    {item.icon}
                                    {item.text}
                                </Box>
                            ))}
                        </Box>

                        {/* Footer Links */}
                        <Box sx={{ px: 4, mt: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>Terms & Conditions</Typography>
                            <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>About Us</Typography>
                            <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>Privacy Policy</Typography>
                        </Box>
                    </Box>

                    {/* Main Workspace Content */}
                    <Box sx={{ flex: 1, backgroundColor: '#FFFFFF', p: { xs: 3, md: 5 } }}>
                        
                        {/* Header Details */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WorkOutlineIcon sx={{ color: '#4B5563' }} />
                                <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#4B5563' }}>My Jobs</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box component="img" src="/assets/icons/ravwork_logo_icon.svg" alt="Ravwork" sx={{ width: '24px', height: '24px' }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>Ravwork</Typography>
                            </Box>
                        </Box>
                        
                        <Divider sx={{ mb: 4 }} />

                        {/* Top Filters */}
                        <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                            <Box sx={{ backgroundColor: '#DBEAFE', color: '#1E3A8A', px: 3, py: 0.75, borderRadius: '20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                Leads
                            </Box>
                            <Box sx={{ color: '#6B7280', px: 2, py: 0.75, fontSize: '14px', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#111827' } }}>
                                Completed
                            </Box>
                            <Box sx={{ color: '#6B7280', px: 2, py: 0.75, fontSize: '14px', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#111827' } }}>
                                Declined
                            </Box>
                        </Box>

                        {/* Sub Cards List */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {leads.map((lead, idx) => (
                                <Box key={idx} sx={{ backgroundColor: '#F9FAFB', borderRadius: '16px', p: 3, border: '1px solid #F3F4F6' }}>
                                    
                                    {/* Top Half of Card */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{ width: '40px', height: '40px', backgroundColor: '#DBEAFE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <WorkOutlineIcon sx={{ color: '#1E3A8A', fontSize: '20px' }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#111827', mb: 0.5 }}>{lead.title}</Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>{lead.desc}</Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button sx={{ backgroundColor: '#D1FAE5', color: '#065F46', textTransform: 'none', fontWeight: 600, borderRadius: '20px', px: 3, '&:hover': { backgroundColor: '#A7F3D0' } }}>
                                                Mark as Complete
                                            </Button>
                                            <Button variant="outlined" sx={{ borderColor: 'transparent', color: '#EF4444', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#FEE2E2', borderColor: 'transparent' } }}>
                                                Decline
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Bottom Half Contact Info */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #E5E7EB' }}>
                                        <Box sx={{ display: 'flex', gap: 4 }}>
                                            {/* Client Name */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PermContactCalendarIcon sx={{ color: '#9CA3AF', fontSize: '18px' }} />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{lead.client}</Typography>
                                                    <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>Client Name</Typography>
                                                </Box>
                                            </Box>
                                            {/* Client Email */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EmailOutlinedIcon sx={{ color: '#9CA3AF', fontSize: '18px' }} />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{lead.email}</Typography>
                                                    <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>Client Email</Typography>
                                                </Box>
                                            </Box>
                                            {/* Client Phone */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PhoneOutlinedIcon sx={{ color: '#9CA3AF', fontSize: '18px' }} />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{lead.phone}</Typography>
                                                    <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>Client Phone</Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', cursor: 'pointer', '&:hover': { color: '#000000', textDecoration: 'underline' } }}>
                                            View Details
                                        </Typography>
                                    </Box>

                                </Box>
                            ))}
                        </Box>

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
