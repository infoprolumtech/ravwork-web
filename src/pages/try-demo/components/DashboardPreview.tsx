import { type JSX, useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import GridViewIcon from '@mui/icons-material/GridView';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import { motion } from "framer-motion";
import StepHeader from "./shared/StepHeader";
import GoBackButton from "./shared/GoBackButton";
import HandHint from "./shared/HandHint";
import DashboardSidebar from "./shared/DashboardSidebar";

interface DashboardPreviewProps {
    onBack: () => void;
    onNext: () => void;
}

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

const MetricCard = ({ metric, bgColor }: { metric: { title: string; value: string; icon: JSX.Element }; bgColor: string }) => (
    <Box sx={{ backgroundColor: bgColor, borderRadius: '12px', p: { xs: 2, sm: 3 } }}>
        <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', mb: 2 }}>
            {metric.icon}
        </Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#111827', mb: 1 }}>{metric.title}</Typography>
        <Typography sx={{ fontSize: { xs: '20px', sm: '24px' }, fontWeight: 700, color: '#111827' }}>{metric.value}</Typography>
    </Box>
);

export default function DashboardPreview({ onBack, onNext }: DashboardPreviewProps): JSX.Element {
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
                title="Track Your Growth"
                subtitle="See clicks, bookings, and how your business is growing."
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
                        minHeight: { xs: 'auto', md: '750px' }
                    }}
                >
                    {/* Sidebar */}
                    <DashboardSidebar activeItem="Dashboard" showFooterExtras />

                    {/* Main Workspace Content */}
                    <Box sx={{ flex: 1, backgroundColor: '#FFFFFF', p: { xs: 2, sm: 3, md: 5 }, overflow: 'hidden' }}>

                        {/* Header Details */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
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
                        <Box sx={{ backgroundColor: '#DBEAFE', borderRadius: '16px', p: { xs: 2, sm: 3 }, mb: 4 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1E3A8A', mb: 2 }}>Welcome back!</Typography>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'center' }, gap: 2 }}>
                                <Box sx={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #FFFFFF', flexShrink: 0 }}>
                                    <DirectionsCarIcon sx={{ fontSize: '30px', color: '#1E3A8A' }} />
                                </Box>
                                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#111827' }}>Marties Car Spa</Typography>
                                    <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#374151', mt: 0.5 }}>Start Your Growth Engine</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                        <Typography sx={{ fontSize: { xs: '11px', sm: '13px' }, color: '#6B7280', wordBreak: 'break-all' }}>https://ravwork.link/martiecarspa</Typography>
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
                                                    '@keyframes pulseBtn': {
                                                        '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
                                                        '70%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
                                                        '100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' }
                                                    },
                                                    position: 'relative',
                                                    zIndex: 1
                                                }}
                                            >
                                                <HandHint show={showHint} direction="down" sx={{ left: '0px', top: '15px', width: '35px' }} />
                                                <ReplyIcon sx={{ fontSize: '14px', color: '#4B5563', transform: 'scaleX(-1)' }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Metrics */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
                            {metricsTop.map((m, i) => <MetricCard key={i} metric={m} bgColor="#E0F2FE" />)}
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
                            {metricsBottom.map((m, i) => <MetricCard key={i} metric={m} bgColor="#F3F4F6" />)}
                        </Box>

                        {/* Data Table */}
                        <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden' }}>
                            <TableContainer sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: { xs: 400, md: 650 } }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: '13px', borderBottom: '1px solid #E5E7EB', py: 2 }}>Name</TableCell>
                                            <TableCell sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: '13px', borderBottom: '1px solid #E5E7EB', py: 2 }}>Job Type</TableCell>
                                            <TableCell align="right" sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: '13px', borderBottom: '1px solid #E5E7EB', py: 2 }}>Date & Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData.map((row, index) => (
                                            <TableRow key={index} sx={{ backgroundColor: index === 1 ? '#F9FAFB' : '#FFFFFF', '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#111827', borderBottom: index === 2 ? 'none' : '1px solid #F3F4F6', py: 2 }}>{row.name}</TableCell>
                                                <TableCell sx={{ color: '#4B5563', borderBottom: index === 2 ? 'none' : '1px solid #F3F4F6', py: 2 }}>{row.jobType}</TableCell>
                                                <TableCell align="right" sx={{ color: '#111827', fontWeight: 600, borderBottom: index === 2 ? 'none' : '1px solid #F3F4F6', py: 2, whiteSpace: 'nowrap' }}>{row.dateTime}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid #E5E7EB' }}>
                                <Button startIcon={<ArrowBackIcon fontSize="small" />} sx={{ color: '#9CA3AF', textTransform: 'none', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' } }}>
                                    Previous
                                </Button>
                                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
                                    {[1, 2, 3, '...', 8, 9, 10].map((page, i) => (
                                        <Box key={i} sx={{ width: '28px', height: '28px', backgroundColor: page === 1 ? '#F9FAFB' : 'transparent', color: page === 1 ? '#111827' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '13px', fontWeight: page === 1 ? 600 : 400, cursor: typeof page === 'number' ? 'pointer' : 'default', '&:hover': typeof page === 'number' ? { backgroundColor: '#F9FAFB' } : {} }}>{page}</Box>
                                    ))}
                                </Box>
                                <Button endIcon={<ArrowForwardIcon fontSize="small" />} sx={{ color: '#6B7280', textTransform: 'none', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, '&:hover': { color: '#111827' } }}>
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <GoBackButton onClick={onBack} />
        </Box>
    );
}
