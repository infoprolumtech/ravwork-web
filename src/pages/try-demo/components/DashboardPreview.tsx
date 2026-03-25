import { type JSX, useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GridViewIcon from '@mui/icons-material/GridView';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import HandymanIcon from '@mui/icons-material/Handyman';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import { motion } from "framer-motion";

interface DashboardPreviewProps {
    onBack: () => void;
    onNext: () => void;
}

export default function DashboardPreview({ onBack, onNext }: DashboardPreviewProps): JSX.Element {
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const sidebarItems = [
        { icon: <GridViewIcon fontSize="small" />, text: "Dashboard", active: true },
        { icon: <WorkOutlineIcon fontSize="small" />, text: "My Jobs" },
        { icon: <HandymanIcon fontSize="small" />, text: "Services Offered" },
        { icon: <AttachMoneyIcon fontSize="small" />, text: "Earnings" },
        { icon: <PersonOutlineIcon fontSize="small" />, text: "My profile" },
        { icon: <MailOutlineIcon fontSize="small" />, text: "Email and SMS" },
        { icon: <SubscriptionsOutlinedIcon fontSize="small" />, text: "Manage Subscription" },
    ];

    const metricsTop = [
        { title: "Today's Clicks", value: "1,721K", icon: <MouseOutlinedIcon fontSize="small" /> },
        { title: "Clicks This Week", value: "367K", icon: <MouseOutlinedIcon fontSize="small" /> },
        { title: "Clicks This month", value: "1,156", icon: <MouseOutlinedIcon fontSize="small" /> }
    ];

    const metricsBottom = [
        { title: "Today's Bookings", value: "721K", icon: <BookOnlineOutlinedIcon fontSize="small" /> },
        { title: "This Week's Bookings", value: "367K", icon: <BookOnlineOutlinedIcon fontSize="small" /> },
        { title: "Bookings This Month", value: "1,156", icon: <BookOnlineOutlinedIcon fontSize="small" /> }
    ];

    const tableData = [
        { name: "Antwon Johnson", jobType: "Exterior Wash", dateTime: "Nov 22, 2025 • 10:00 AM" },
        { name: "Mike Henry", jobType: "Interior Clean", dateTime: "No Date Available" },
        { name: "Jim Deen", jobType: "Exterior Wash", dateTime: "Nov 22, 2025 • 10:00 AM" }
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
                    Track Your Growth
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
                    See clicks, bookings, and how your business is growing.
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
                        minHeight: '750px'
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
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, px: 2 }}>
                            {sidebarItems.map((item, index) => (
                                <Box 
                                    key={index}
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
                            <Typography sx={{ fontSize: '11px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>Terms & Conditions</Typography>
                            <Typography sx={{ fontSize: '11px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>About Us</Typography>
                            <Typography sx={{ fontSize: '11px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>Privacy Policy</Typography>
                            <Typography sx={{ fontSize: '11px', color: '#9CA3AF', mt: 1, cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>Log Out</Typography>
                            <Typography sx={{ fontSize: '10px', color: '#D1D5DB', mt: 3, lineHeight: 1.4 }}>Ravwork Inc. © 2023 All Right<br/>Reserved</Typography>
                        </Box>
                    </Box>

                    {/* Main Workspace Content */}
                    <Box sx={{ flex: 1, backgroundColor: '#FFFFFF', p: { xs: 3, md: 5 } }}>
                        
                        {/* Header Details */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <GridViewIcon sx={{ color: '#4B5563', fontSize: '18px' }} />
                                <Typography sx={{ fontSize: '13px', color: '#9CA3AF' }}>Dashboards</Typography>
                                <Typography sx={{ fontSize: '13px', color: '#D1D5DB', mx: 0.5 }}>/</Typography>
                                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#4B5563' }}>Default</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box component="img" src="/assets/icons/ravwork_logo_icon.svg" alt="Ravwork" sx={{ width: '24px', height: '24px' }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>Ravwork</Typography>
                            </Box>
                        </Box>
                        
                        <Divider sx={{ mb: 4 }} />

                        {/* Welcome Banner */}
                        <Box sx={{ backgroundColor: '#DBEAFE', borderRadius: '16px', p: 3, mb: 4, position: 'relative' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1E3A8A', mb: 2 }}>Welcome back!</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, border: '3px solid #FFFFFF' }}>
                                    <DirectionsCarIcon sx={{ fontSize: '30px', color: '#1E3A8A' }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#111827' }}>Marties Car Spa</Typography>
                                    <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#374151', mt: 0.5 }}>Start Your Growth Engine</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>https://ravwork.link/martiecarspa</Typography>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
                                            <Box sx={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { backgroundColor: '#F3F4F6' } }}>
                                                <ContentCopyIcon sx={{ fontSize: '12px', color: '#4B5563' }} />
                                            </Box>
                                            <Box 
                                                onClick={onNext}
                                                sx={{ 
                                                    width: '24px', 
                                                    height: '24px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: '#FFFFFF', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    cursor: 'pointer', 
                                                    '&:hover': { backgroundColor: '#F3F4F6' },
                                                    boxShadow: showHint ? '0 0 0 4px rgba(59, 130, 246, 0.4)' : 'none',
                                                    animation: showHint ? 'pulseBtn 2s infinite' : 'none',
                                                    position: 'relative',
                                                    zIndex: 1
                                                }}
                                            >
                                                {showHint && (
                                                    <Box
                                                        component="img"
                                                        src="/assets/landing-page/demo/hand.png"
                                                        alt="Click Share"
                                                        sx={{
                                                            position: 'absolute',
                                                            left: '0px',
                                                            top: '15px',
                                                            width: '35px',
                                                            height: 'auto',
                                                            animation: 'bounceHandUp 1.5s infinite',
                                                            '@keyframes bounceHandUp': {
                                                                '0%, 100%': { transform: 'translateY(0)' },
                                                                '50%': { transform: 'translateY(10px)' },
                                                            },
                                                            zIndex: 10,
                                                        }}
                                                    />
                                                )}
                                                <ReplyIcon sx={{ fontSize: '14px', color: '#4B5563', transform: 'scaleX(-1)' }} />
                                            </Box>
                                        </Box>

                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Top Metrics Row */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
                            {metricsTop.map((metric, idx) => (
                                <Box key={idx} sx={{ backgroundColor: '#E0F2FE', borderRadius: '12px', p: 3 }}>
                                    <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', mb: 2 }}>
                                        {metric.icon}
                                    </Box>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#111827', mb: 1 }}>{metric.title}</Typography>
                                    <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{metric.value}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Bottom Metrics Row */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
                            {metricsBottom.map((metric, idx) => (
                                <Box key={idx} sx={{ backgroundColor: '#F3F4F6', borderRadius: '12px', p: 3 }}>
                                    <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', mb: 2 }}>
                                        {metric.icon}
                                    </Box>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#111827', mb: 1 }}>{metric.title}</Typography>
                                    <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{metric.value}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Data Table */}
                        <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: '13px', borderBottom: '1px solid #E5E7EB', py: 2 }}>Name</TableCell>
                                            <TableCell sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: '13px', borderBottom: '1px solid #E5E7EB', py: 2 }}>Job Type</TableCell>
                                            <TableCell align="right" sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: '13px', borderBottom: '1px solid #E5E7EB', py: 2 }}>Date & Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData.map((row, index) => (
                                            <TableRow 
                                                key={index} 
                                                sx={{ 
                                                    backgroundColor: index === 1 ? '#F9FAFB' : '#FFFFFF',
                                                    '&:last-child td, &:last-child th': { border: 0 } 
                                                }}
                                            >
                                                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#111827', borderBottom: index === 2 ? 'none' : '1px solid #F3F4F6', py: 2 }}>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell sx={{ color: '#4B5563', borderBottom: index === 2 ? 'none' : '1px solid #F3F4F6', py: 2 }}>
                                                    {row.jobType}
                                                </TableCell>
                                                <TableCell align="right" sx={{ color: '#111827', fontWeight: 600, borderBottom: index === 2 ? 'none' : '1px solid #F3F4F6', py: 2 }}>
                                                    {row.dateTime}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                            {/* Pagination */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid #E5E7EB' }}>
                                <Button startIcon={<ArrowBackIcon fontSize="small" />} sx={{ color: '#9CA3AF', textTransform: 'none', fontWeight: 500 }}>
                                    Previous
                                </Button>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Box sx={{ width: '28px', height: '28px', backgroundColor: '#F9FAFB', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>1</Box>
                                    <Box sx={{ width: '28px', height: '28px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', '&:hover': { backgroundColor: '#F9FAFB' } }}>2</Box>
                                    <Box sx={{ width: '28px', height: '28px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', '&:hover': { backgroundColor: '#F9FAFB' } }}>3</Box>
                                    <Box sx={{ width: '28px', height: '28px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '13px' }}>...</Box>
                                    <Box sx={{ width: '28px', height: '28px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', '&:hover': { backgroundColor: '#F9FAFB' } }}>8</Box>
                                    <Box sx={{ width: '28px', height: '28px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', '&:hover': { backgroundColor: '#F9FAFB' } }}>9</Box>
                                    <Box sx={{ width: '28px', height: '28px', color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', '&:hover': { backgroundColor: '#F9FAFB' } }}>10</Box>
                                </Box>
                                <Button endIcon={<ArrowForwardIcon fontSize="small" />} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 500, '&:hover': { color: '#111827' } }}>
                                    Next
                                </Button>
                            </Box>
                        </Box>

                    </Box>
                </Paper>
            </Box>

            {/* Floating Buttons Below Card */}
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
