import type { JSX, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GridViewIcon from '@mui/icons-material/GridView';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import HandymanIcon from '@mui/icons-material/Handyman';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';

interface SidebarItem {
    icon: ReactNode;
    text: string;
    active?: boolean;
}

interface DashboardSidebarProps {
    activeItem: string;
    onItemClick?: (text: string) => void;
    showFooterExtras?: boolean;
}

const navItems: Omit<SidebarItem, 'active'>[] = [
    { icon: <GridViewIcon fontSize="small" />, text: "Dashboard" },
    { icon: <WorkOutlineIcon fontSize="small" />, text: "My Jobs" },
    { icon: <HandymanIcon fontSize="small" />, text: "Services Offered" },
    { icon: <AttachMoneyIcon fontSize="small" />, text: "Earnings" },
    { icon: <PersonOutlineIcon fontSize="small" />, text: "My profile" },
    { icon: <MailOutlineIcon fontSize="small" />, text: "Email and SMS" },
    { icon: <SubscriptionsOutlinedIcon fontSize="small" />, text: "Manage Subscription" },
];

export default function DashboardSidebar({ activeItem, onItemClick, showFooterExtras = false }: DashboardSidebarProps): JSX.Element {
    return (
        <Box sx={{
            width: { xs: '100%', md: '260px' },
            minWidth: { md: '260px' },
            backgroundColor: '#FFFFFF',
            borderRight: { xs: 'none', md: '1px solid #E5E7EB' },
            borderBottom: { xs: '1px solid #E5E7EB', md: 'none' },
            display: 'flex',
            flexDirection: 'column',
            pt: { xs: 2, md: 4 },
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
            <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 0.5, px: 2, overflowX: { xs: 'auto', md: 'visible' } }}>
                {navItems.map((item, index) => {
                    const isActive = item.text === activeItem;
                    return (
                        <Box
                            key={index}
                            onClick={() => onItemClick?.(item.text)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1.2,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: isActive ? '#F3F4F6' : 'transparent',
                                color: isActive ? '#111827' : '#4B5563',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                                position: 'relative',
                                '&:hover': {
                                    backgroundColor: '#F9FAFB',
                                    color: '#111827'
                                }
                            }}
                        >
                            {isActive && (
                                <Box sx={{ position: 'absolute', left: { xs: 0, md: '-16px' }, top: { xs: 'auto', md: '10%' }, bottom: { xs: 0, md: '10%' }, width: { xs: '100%', md: '4px' }, height: { xs: '3px', md: 'auto' }, backgroundColor: '#000000', borderRadius: { xs: '4px 4px 0 0', md: '0 4px 4px 0' } }} />
                            )}
                            {item.icon}
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{item.text}</Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Footer Links */}
            <Box sx={{ px: 4, mt: 4, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>Terms & Conditions</Typography>
                <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>About Us</Typography>
                <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>Privacy Policy</Typography>
                {showFooterExtras && (
                    <>
                        <Typography sx={{ fontSize: '11px', color: '#9CA3AF', mt: 1, cursor: 'pointer', '&:hover': { color: '#6B7280' } }}>Log Out</Typography>
                        <Typography sx={{ fontSize: '10px', color: '#D1D5DB', mt: 3, lineHeight: 1.4 }}>Ravwork Inc. © 2023 All Right<br/>Reserved</Typography>
                    </>
                )}
            </Box>
        </Box>
    );
}
