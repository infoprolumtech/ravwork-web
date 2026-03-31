import { useState } from "react";
import type { JSX, ReactNode } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HandHint from "./HandHint";
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
}

interface DashboardSidebarProps {
    activeItem: string;
    onItemClick?: (text: string) => void;
    showFooterExtras?: boolean;
    clickableItem?: string;
    onBack?: () => void;
    showHint?: boolean;
}

const navItems: SidebarItem[] = [
    { icon: <GridViewIcon fontSize="small" />, text: "Dashboard" },
    { icon: <WorkOutlineIcon fontSize="small" />, text: "My Jobs" },
    { icon: <HandymanIcon fontSize="small" />, text: "Services Offered" },
    { icon: <AttachMoneyIcon fontSize="small" />, text: "Earnings" },
    { icon: <PersonOutlineIcon fontSize="small" />, text: "My profile" },
    { icon: <MailOutlineIcon fontSize="small" />, text: "Email and SMS" },
    { icon: <SubscriptionsOutlinedIcon fontSize="small" />, text: "Manage Subscription" },
];

export default function DashboardSidebar({ activeItem, onItemClick, showFooterExtras = false, clickableItem, onBack, showHint }: DashboardSidebarProps): JSX.Element {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const activeNavIcon = navItems.find(i => i.text === activeItem)?.icon;

    const handleItemClick = (text: string) => {
        const isClickable = !clickableItem || text === clickableItem;
        if (isClickable) {
            onItemClick?.(text);
            setDrawerOpen(false);
        }
    };

    const profileArea = (
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
                <Button size="small" sx={{ backgroundColor: '#000000', color: '#FFFFFF', fontSize: '10px', textTransform: 'none', py: 0.5, px: 1.5, borderRadius: '12px', pointerEvents: 'none', cursor: 'default', '&:hover': { backgroundColor: '#000000' } }}>
                    Complete profile
                </Button>
            </Box>
        </Box>
    );

    const navLinks = (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5, px: 2 }}>
            {navItems.map((item, index) => {
                const isActive = item.text === activeItem;
                const isClickable = !clickableItem || item.text === clickableItem;
                const isDashboard = item.text === 'Dashboard';
                // Show hint on Dashboard item when: desktop always, or mobile when drawer is open
                const showDashboardHint = showHint && isDashboard;
                return (
                    <Box
                        key={index}
                        onClick={() => handleItemClick(item.text)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 2,
                            py: 1.2,
                            borderRadius: '8px',
                            cursor: isClickable ? 'pointer' : 'default',
                            pointerEvents: isClickable ? 'auto' : 'none',
                            backgroundColor: isActive ? '#F3F4F6' : 'transparent',
                            color: isActive ? '#111827' : '#4B5563',
                            fontWeight: isActive ? 600 : 500,
                            fontSize: '14px',
                            position: 'relative',
                            '&:hover': isClickable ? { backgroundColor: '#F9FAFB', color: '#111827' } : {}
                        }}
                    >
                        {isActive && (
                            <Box sx={{ position: 'absolute', left: '-16px', top: '10%', bottom: '10%', width: '4px', backgroundColor: '#000000', borderRadius: '0 4px 4px 0' }} />
                        )}
                        {item.icon}
                        <Box>{item.text}</Box>
                        {/* Desktop: always show hint. Mobile: only when drawer is open */}
                        {showDashboardHint && (
                            <HandHint
                                show={drawerOpen || true}
                                direction="left"
                                sx={{
                                    display: { xs: drawerOpen ? 'block' : 'none', md: 'block' },
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%) rotate(90deg)',
                                    width: '28px',
                                }}
                            />
                        )}
                    </Box>
                );
            })}
        </Box>
    );

    const footerLinks = (
        <Box sx={{ px: 4, mt: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'default', pointerEvents: 'none' }}>Terms & Conditions</Typography>
            <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'default', pointerEvents: 'none' }}>About Us</Typography>
            <Typography sx={{ fontSize: '12px', color: '#9CA3AF', cursor: 'default', pointerEvents: 'none' }}>Privacy Policy</Typography>
            {showFooterExtras && (
                <>
                    <Typography sx={{ fontSize: '11px', color: '#9CA3AF', mt: 1, cursor: 'default', pointerEvents: 'none' }}>Log Out</Typography>
                    <Typography sx={{ fontSize: '10px', color: '#D1D5DB', mt: 3, lineHeight: 1.4 }}>Ravwork Inc. © 2023 All Right<br />Reserved</Typography>
                </>
            )}
        </Box>
    );

    return (
        <>
            {/* ── Mobile: Top Navbar ── */}
            <Box sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                borderBottom: '1px solid #E5E7EB',
                width: '100%',
                backgroundColor: '#FFFFFF',
                position: 'relative',
                zIndex: 10,
            }}>
                {/* Left: Back button (if provided) + Hamburger */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {onBack && (
                        <IconButton onClick={onBack} sx={{ p: 0.5 }}>
                            <ArrowBackIcon sx={{ color: '#4B5563', fontSize: '22px' }} />
                        </IconButton>
                    )}
                    {/* Hamburger with hint pointing at it when drawer is closed */}
                    <Box sx={{ position: 'relative' }}>
                        <IconButton onClick={() => setDrawerOpen(true)} sx={{ p: 0.5 }}>
                            <MenuIcon sx={{ color: '#4B5563', fontSize: '24px' }} />
                        </IconButton>
                        <HandHint
                            show={!!showHint && !drawerOpen}
                            direction="down"
                            sx={{
                                bottom: '-34px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '28px',
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: '#4B5563', display: 'flex' }}>{activeNavIcon}</Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#4B5563' }}>{activeItem}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box component="img" src="/assets/icons/ravwork_logo_icon.svg" alt="Ravwork" sx={{ width: '22px', height: '22px' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>Ravwork</Typography>
                </Box>
            </Box>

            {/* ── Mobile: In-Card Sliding Panel ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <Box
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            position: 'absolute',
                            inset: 0,
                            zIndex: 20,
                            pointerEvents: 'auto',
                        }}
                    >
                        {/* Backdrop */}
                        <Box
                            onClick={() => setDrawerOpen(false)}
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0,0,0,0.25)',
                            }}
                        />

                        {/* Sliding Panel */}
                        <Box
                            component={motion.div}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: '280px',
                                backgroundColor: '#FFFFFF',
                                display: 'flex',
                                flexDirection: 'column',
                                pt: 1,
                                pb: 2,
                                overflowY: 'auto',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1 }}>
                                <IconButton onClick={() => setDrawerOpen(false)} sx={{ p: 0.5 }}>
                                    <CloseIcon sx={{ fontSize: '22px', color: '#111827' }} />
                                </IconButton>
                            </Box>
                            {profileArea}
                            {navLinks}
                            {footerLinks}
                        </Box>
                    </Box>
                )}
            </AnimatePresence>

            {/* ── Desktop: Full Sidebar ── */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                width: '260px',
                minWidth: '260px',
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid #E5E7EB',
                pt: 4,
                pb: 2,
            }}>
                {profileArea}
                {navLinks}
                {footerLinks}
            </Box>
        </>
    );
}
