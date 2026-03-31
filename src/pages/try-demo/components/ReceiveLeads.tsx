import { type JSX, useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { motion } from "framer-motion";
import StepHeader from "./shared/StepHeader";
import GoBackButton from "./shared/GoBackButton";
import HandHint from "./shared/HandHint";
import DashboardSidebar from "./shared/DashboardSidebar";

interface ReceiveLeadsProps {
    onBack: () => void;
    onNext: () => void;
    onFinish: () => void;
}

const leads = [
    { title: "Exterior Wash", desc: "Hand wash, wheel/tire cleaning, and a spray...", client: "Antwon Johnson", email: "antwonj646@gmail.com", phone: "6466138029" },
    { title: "Interior Clean", desc: "Thorough vacuuming, wiping down the dashbo...", client: "Mike Vett", email: "m1parr@gmail.com", phone: "6467550664" },
    { title: "Exterior Wash", desc: "Hand wash, wheel/tire cleaning, and a spray...", client: "Al Miller", email: "allen2001@gmail.com", phone: "6462743111" }
];

export default function ReceiveLeads({ onBack, onNext }: ReceiveLeadsProps): JSX.Element {
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
            sx={{ width: '100%', maxWidth: '1050px', mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <StepHeader
                title="Receive Leads in One Place"
                subtitle="No more scattered messages. Every client request is organized"
            />

            {/* The Glowing Card Wrapper */}
            <Box sx={{
                width: '100%',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px', left: '-20px', right: '-20px', bottom: '-20px',
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
                        minHeight: { xs: 'auto', md: '600px' }
                    }}
                >
                    {/* Sidebar with hand hint pointing up at Dashboard */}
                    <Box sx={{ position: 'relative' }}>
                        <HandHint show={showHint} direction="down" sx={{ left: { xs: '30px', md: '130px' }, top: { xs: '260px', md: '310px' } }} />
                        <DashboardSidebar
                            activeItem="My Jobs"
                            onItemClick={(text) => { if (text === "Dashboard") onNext(); }}
                        />
                    </Box>

                    {/* Main Workspace Content */}
                    <Box sx={{ flex: 1, backgroundColor: '#FFFFFF', p: { xs: 2, sm: 3, md: 5 } }}>

                        {/* Header Details */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
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
                        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 4 }, flexWrap: 'wrap' }}>
                            <Box sx={{ backgroundColor: '#DBEAFE', color: '#1E3A8A', px: 3, py: 0.75, borderRadius: '20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Leads</Box>
                            <Box sx={{ color: '#6B7280', px: 2, py: 0.75, fontSize: '14px', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#111827' } }}>Completed</Box>
                            <Box sx={{ color: '#6B7280', px: 2, py: 0.75, fontSize: '14px', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#111827' } }}>Declined</Box>
                        </Box>

                        {/* Lead Cards */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                            {leads.map((lead, idx) => (
                                <Box key={idx} sx={{ backgroundColor: '#F9FAFB', borderRadius: '16px', p: { xs: 2, sm: 3 }, border: '1px solid #F3F4F6' }}>

                                    {/* Top Half */}
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-start' }, mb: 3, gap: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{ width: '40px', height: '40px', backgroundColor: '#DBEAFE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <WorkOutlineIcon sx={{ color: '#1E3A8A', fontSize: '20px' }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#111827', mb: 0.5 }}>{lead.title}</Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>{lead.desc}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Button sx={{ backgroundColor: '#D1FAE5', color: '#065F46', textTransform: 'none', fontWeight: 600, borderRadius: '20px', px: { xs: 2, sm: 3 }, fontSize: { xs: '12px', sm: '14px' }, '&:hover': { backgroundColor: '#A7F3D0' } }}>
                                                Mark as Complete
                                            </Button>
                                            <Button variant="outlined" sx={{ borderColor: 'transparent', color: '#EF4444', textTransform: 'none', fontWeight: 600, fontSize: { xs: '12px', sm: '14px' }, '&:hover': { backgroundColor: '#FEE2E2', borderColor: 'transparent' } }}>
                                                Decline
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Bottom Half Contact Info */}
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, pt: 2, borderTop: '1px solid #E5E7EB', gap: 2 }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 4 } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PermContactCalendarIcon sx={{ color: '#9CA3AF', fontSize: '18px' }} />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{lead.client}</Typography>
                                                    <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>Client Name</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EmailOutlinedIcon sx={{ color: '#9CA3AF', fontSize: '18px' }} />
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '11px', sm: '13px' }, color: '#111827', wordBreak: 'break-all' }}>{lead.email}</Typography>
                                                    <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>Client Email</Typography>
                                                </Box>
                                            </Box>
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

            <GoBackButton onClick={onBack} />
        </Box>
    );
}
