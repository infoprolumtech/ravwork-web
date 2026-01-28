import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../rtk/feature/authSlice";
import { showAlert } from "../rtk/feature/alertSlice";
import { useAppSelector, useAppDispatch } from "../rtk/store";
import type { RootState } from "../rtk/store";
import theme from "../theme";
import GlobalDialog from "../components/dialog";
import CommonDialog from "../components/dialog/dialog-content/CommonDialog";
import { useLogoutMutation } from "../rtk/endpoints/authApi";
import { useGetUserProfileQuery } from "../rtk/endpoints/userApi";
import { useGetServicesQuery } from "../rtk/endpoints/serviceApi";
import { decryptAES, getCloudFrontUrl, calculateProfileComplete } from "../utils/helper";
import { getNextRoute } from "../utils/routeGuard";
import { Menu as MenuIcon, ChevronRight, Close } from "@mui/icons-material";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";

const DRAWER_WIDTH = 280;

interface NavigationItem {
  segment: string;
  title: string;
  icon: string;
  path: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: "/assets/icons/sidebar_menu_icon/ChartPieSlice.svg",
    path: "/dashboard",
  },
  {
    segment: "my-jobs",
    title: "My Jobs",
    icon: "/assets/icons/sidebar_menu_icon/briefcase.svg",
    path: "/my-jobs",
  },
  {
    segment: "services-offered",
    title: "My Services",
    icon: "/assets/icons/sidebar_menu_icon/flash.svg",
    path: "/services-offered",
  },
  {
    segment: "earnings",
    title: "Earnings",
    icon: "/assets/icons/sidebar_menu_icon/ArrowRise.svg",
    path: "/earnings",
  },
  {
    segment: "my-profile",
    title: "My profile",
    icon: "/assets/icons/sidebar_menu_icon/Group.svg",
    path: "/my-profile",
  },
  {
    segment: "email-and-sms",
    title: "Email and SMS",
    icon: "/assets/icons/sidebar_menu_icon/bell.svg",
    path: "/email-and-sms",
  },
  {
    segment: "subscription-services",
    title: "Subscription Services",
    icon: "/assets/icons/sidebar_menu_icon/crown.svg",
    path: "/subscription-services",
  },
];

// Memoized UserMenu component (currently unused but kept for future use)
const UserMenu = React.memo(() => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [logout, { isLoading: isLoggingOutUserMenu }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClose = React.useCallback(() => setAnchorEl(null), []);

  const handleChangePassword = React.useCallback(() => {
    navigate("/change-password");
    handleMenuClose();
  }, [navigate, handleMenuClose]);

  const handleCloseDialog = React.useCallback(() => setOpenDialog(false), []);

  const handleLogout = React.useCallback(() => {
    setOpenDialog(true);
    handleMenuClose();
  }, [handleMenuClose]);

  const handleLogoutConfirm = React.useCallback(async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(showAlert({ message: "Logged out successfully", severity: "success" }));
      dispatch(logoutUser());
      navigate("/login");
    } catch {
      // Even if logout fails, still log out user locally
      dispatch(logoutUser());
      navigate("/login");
    }
  }, [logout, dispatch, navigate]);

  const userName = React.useMemo(
    () => (user?.firstName ? decryptAES(user?.firstName) : "N/A"),
    [user?.firstName]
  );

  const userEmail = React.useMemo(
    () => (user?.email ? decryptAES(user?.email) : "N/A"),
    [user?.email]
  );

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          maxWidth: "300px",
          py: 2,
          "& .MuiPaper-root": {
            borderRadius: 2.5,
            width: "270px",
            minWidth: "270px",
            top: "70px !important",
          },
        }}
      >
        <Stack sx={{ display: { xs: "flex", sm: "flex" }, px: 2, mt: 1 }}>
          <Typography variant="headerTitle">{userName}</Typography>
          <Typography variant="headerSubtitle" sx={{ wordWrap: "break-word" }}>
            {userEmail}
          </Typography>
        </Stack>
        <Divider sx={{ mt: 2 }} />
        <MenuItem
          sx={{ fontSize: "14px", fontWeight: 400, color: "#384250" }}
          onClick={handleChangePassword}
        >
          Change Password
        </MenuItem>
        <Divider sx={{ mt: 2 }} />
        <MenuItem
          sx={{ fontSize: "14px", fontWeight: 400, color: "#384250" }}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>

      <GlobalDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        component={
          <CommonDialog
            handleCancel={handleCloseDialog}
            title="Logout"
            subTitle="Are you sure want to log out of your account?"
            handleConfirm={handleLogoutConfirm}
            confirmDisabled={isLoggingOutUserMenu}
          />
        }
      />
    </>
  );
});

UserMenu.displayName = "UserMenu";

interface ServiceProviderLayoutProps {
  children: React.ReactNode;
  window?: () => Window;
}

export default function ServiceProviderLayout(props: ServiceProviderLayoutProps) {
  const { children, window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Fetch user profile to get complete data including profile photo
  const { data: userProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: servicesData, isLoading: isLoadingServices } = useGetServicesQuery();

  const handleDrawerToggle = React.useCallback(() => {
    setMobileOpen((prev: boolean) => !prev);
  }, []);

  const handleDesktopDrawerToggle = React.useCallback(() => {
    setDesktopOpen((prev: boolean) => !prev);
  }, []);

  const handleLogout = React.useCallback(() => {
    setOpenLogoutDialog(true);
  }, []);

  const handleCloseLogoutDialog = React.useCallback(() => {
    setOpenLogoutDialog(false);
  }, []);

  const handleLogoutConfirm = React.useCallback(async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(showAlert({ message: "Logged out successfully", severity: "success" }));
      dispatch(logoutUser());
      navigate("/login");
    } catch {
      // Even if logout fails, still log out user locally
      dispatch(logoutUser());
      navigate("/login");
    }
  }, [logout, dispatch, navigate]);

  // Memoize path parts to avoid recalculating on every render
  const pathParts = React.useMemo(
    () => location.pathname.replace(/^\//, "").split("/"),
    [location.pathname]
  );

  const isPathSelected = React.useCallback(
    (segment: string) => pathParts.includes(segment),
    [pathParts]
  );

  const hasServices = React.useMemo(() => {
    if (!servicesData) return false;
    if (Array.isArray(servicesData)) return servicesData.length > 0;
    // Check for 'data' array or 'items' array (common pagination patterns)
    const list = (servicesData as any).data || (servicesData as any).items;
    return Array.isArray(list) ? list.length > 0 : false;
  }, [servicesData]);

  // Enforce post-signup navigation flow logic
  React.useEffect(() => {
    // Wait for data loading to complete before enforcing rules
    if (isLoadingProfile || isLoadingServices) return;

    const currentPath = location.pathname;

    // Public/Utility pages that should not be blocked
    const allowedPaths = ['/privacy-policy', '/terms-and-conditions'];
    if (allowedPaths.some(path => currentPath === path)) return;

    const targetRoute = getNextRoute(userProfile || null, hasServices);

    // Logic to determine if we need to redirect
    // We want to force users to the target route if they are "behind" in the flow.
    // i.e., If target is /my-profile, they can ONLY be on /my-profile.
    // If target is /services-offered, they can be on /my-profile OR /services-offered (to allowing editing profile).
    // If target is /dashboard, they can be anywhere.

    if (targetRoute === "/my-profile") {
      if (currentPath !== "/my-profile") {
        navigate("/my-profile", { replace: true });
      }
    } else if (targetRoute === "/services-offered") {
      // Allow them to be on profile (to fix things) or services (to add things)
      // Also allow sub-routes of services-offered
      const isAllowed = currentPath === "/my-profile" || currentPath.startsWith("/services-offered");
      if (!isAllowed) {
        navigate("/services-offered", { replace: true });
      }
    } else if (targetRoute === "/dashboard") {
      // If usage flow is complete, but they hit the landing page/root, send them in.
      if (currentPath === "/") {
        navigate("/dashboard", { replace: true });
      }
    }

  }, [isLoadingProfile, isLoadingServices, userProfile, hasServices, location.pathname, navigate]);

  const profileComplete = React.useMemo(() => calculateProfileComplete(userProfile || null, hasServices), [userProfile, hasServices]);

  const handleCompleteSetup = React.useCallback(() => {
    const profileOnlyCompletion = calculateProfileComplete(userProfile || null, false);
    if (profileOnlyCompletion >= 50 && !hasServices) {
      navigate("/services-offered");
    } else {
      navigate("/my-profile");
    }
  }, [userProfile, hasServices, navigate]);


  // Memoize current page info for breadcrumb
  const currentPageInfo = React.useMemo(() => {
    // Handle special pages: Privacy Policy and Terms & Conditions
    if (location.pathname === "/privacy-policy") {
      return {
        title: "Privacy Policy",
        icon: "/assets/icons/sidebar_menu_icon/bell.svg", // Default icon, can be changed if needed
      };
    }
    if (location.pathname === "/terms-and-conditions") {
      return {
        title: "Terms & Conditions",
        icon: "/assets/icons/sidebar_menu_icon/bell.svg", // Default icon, can be changed if needed
      };
    }

    const currentSegment = pathParts[0] || "dashboard";
    const navItem = NAVIGATION_ITEMS.find((item) => item.segment === currentSegment);
    return {
      title: navItem?.title || "Dashboard",
      icon: navItem?.icon || "/assets/icons/sidebar_menu_icon/ChartPieSlice.svg",
    };
  }, [pathParts, location.pathname]);

  // Memoize user info - use username and displayName from API
  const userInfo = React.useMemo(
    () => {
      // Get username from API profile
      const username = userProfile?.username || "Name Goes Here";

      // Get displayName from API profile
      const displayName = userProfile?.displayName || user?.displayName || "Company Name";

      // Get profile photo from API response, convert to CloudFront URL
      const rawPhotoUrl = userProfile?.profilePhoto || user?.profilePhoto || null;
      const profilePhoto = rawPhotoUrl ? getCloudFrontUrl(rawPhotoUrl) : null;

      return {
        firstName: username,
        companyName: displayName,
        avatarInitial: username.charAt(0).toUpperCase(),
        profilePhoto,
      };
    },
    [userProfile, user]
  );

  // Memoize drawer content to prevent unnecessary re-renders
  const drawer = React.useMemo(
    () => {
      if (isLoadingProfile) {
        return (
          <Box sx={{ height: "100%", backgroundColor: theme.palette.background.default }}>
            <SidebarSkeleton />
          </Box>
        );
      }
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.background.default,
            overflow: "auto",
            overflowX: "hidden",
            overscrollBehavior: "contain", // Prevent scroll chaining
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            // Hide scrollbar but keep scroll functionality
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          {/* Close button for mobile */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
              p: 1,
              pr: 2,
            }}
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: "#384250",
              }}
              aria-label="close drawer"
            >
              <Close />
            </IconButton>
          </Box>

          {/* User Profile Section */}
          <Box
            sx={{
              p: 2,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Avatar
                src={userInfo.profilePhoto || "./assets/images/avatar.png"}
                sx={{
                  width: 44,
                  height: 44,
                }}
                imgProps={{
                  onError: (e) => {
                    // Fallback to default avatar if image fails to load (e.g., Access Denied)
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "./assets/images/avatar.png" && !target.src.includes("avatar.png")) {
                      target.src = "./assets/images/avatar.png";
                    }
                  },
                }}
              />

              <Stack spacing={0}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#111927",
                    lineHeight: "20px",
                  }}
                >
                  {userInfo.firstName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#6C737F",
                    lineHeight: "18px",
                  }}
                >
                  {userInfo.companyName}
                </Typography>
              </Stack>
            </Stack>

            {/* Progress Card - hidden once completion reaches 100% */}
            {profileComplete < 100 && (
              <Box
                sx={{
                  backgroundColor: "#F7F9FB",
                  borderRadius: "14px",
                  px: 2,
                  py: 1.5,
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#6C737F",
                    fontWeight: 500,
                  }}
                >
                  Get More Clients with a complete Profile
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <LinearProgress
                    variant="determinate"
                    value={profileComplete}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 6,
                      backgroundColor: "#E5E7EB",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#12B76A",
                        borderRadius: 6,
                      },
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111927",
                      minWidth: "36px",
                      textAlign: "right",
                    }}
                  >
                    {profileComplete}%
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  onClick={handleCompleteSetup}
                  sx={{
                    height: "26px",
                    px: 1.5,
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 500,
                    textTransform: "none",
                    backgroundColor: "#000",
                    color: "#fff",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#111",
                      boxShadow: "none",
                    },
                  }}
                >
                  {profileComplete >= 50 ? "Complete Setup" : "Complete profile"}
                </Button>
              </Box>
            )}
          </Box>


          {/* Navigation Menu */}
          <Box sx={{ py: 2, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
            <List sx={{ px: { xs: 1, md: 2 }, width: "100%", maxWidth: "100%" }}>
              {NAVIGATION_ITEMS.map((item) => {
                const selected = isPathSelected(item.segment);
                const handleNavClick = () => navigate(item.path);
                return (
                  <ListItem key={item.segment} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={selected}
                      onClick={handleNavClick}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: selected ? "#F3F4F6" : "#fff",
                        py: 0.25,
                        pr: 0.5,
                        pl: selected ? 1.5 : 0.5,
                        position: "relative",
                        display: "flex",
                        justifyContent: "space-between",
                        // Vertical line indicator for active page - black bar
                        "&::before": selected
                          ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 8,
                            bottom: 8,
                            width: "4px",
                            borderRadius: "0 4px 4px 0",
                            backgroundColor: "#111927",
                            zIndex: 1,
                          }
                          : {},
                        "&:hover": {
                          backgroundColor: selected ? "#F3F4F6" : "#F9FAFB",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#F3F4F6",
                          "& .MuiTypography-root": {
                            color: "#111927",
                            fontWeight: 400,
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {/* Grey arrow for inactive items */}
                        {!selected && (
                          <ChevronRight
                            sx={{
                              fontSize: 14,
                              color: "#9CA3AF",
                              width: 16,
                              height: 16,
                            }}
                          />
                        )}
                        <ListItemIcon
                          sx={{
                            minWidth: 28,
                            "& img": {
                              width: 24,
                              height: 24,
                              // No filter - icons should be outlined in black
                            },
                          }}
                        >
                          <img src={item.icon} alt={item.title} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{
                            fontSize: "14px",
                            color: "#111927",
                            fontWeight: 400,
                          }}
                        />
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Footer Links */}
          <Box sx={{ p: { xs: 1.5, md: 2 }, pt: 1.5, width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
            <Stack spacing={1}>
              <Typography
                variant="body2"
                onClick={() => navigate("/terms-and-conditions")}
                sx={{
                  fontSize: "12px",
                  color: "#6C737F",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": { color: "#384250" },
                }}
              >
                Terms & Conditions
              </Typography>
              <Typography
                variant="body2"
                onClick={() => navigate("/privacy-policy")}
                sx={{
                  fontSize: "12px",
                  color: "#6C737F",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": { color: "#384250" },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body2"
                onClick={handleLogout}
                sx={{
                  fontSize: "12px",
                  color: "#6C737F",
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": { color: "#384250" },
                }}
              >
                Log Out
              </Typography>

              {/* Horizontal Divider */}
              <Divider sx={{ my: 1, borderColor: "#E5E7EB" }} />

              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  color: "#6C737F",
                }}
              >
                Ravwork Inc. © 2023 All Right Reserved
              </Typography>
            </Stack>
          </Box>
        </Box>
      );
    },
    [userInfo, profileComplete, isPathSelected, navigate, handleDrawerToggle, handleLogout, isLoadingProfile]
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{
      display: "flex",
      width: "100%",
      overflow: "hidden",
      height: "100vh",
    }}>
      {/* App Bar for Mobile */}
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: "100%",
            md: desktopOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%"
          },
          ml: {
            xs: 0,
            md: desktopOpen ? `${DRAWER_WIDTH}px` : 0
          },
          transition: "width 0.3s, margin-left 0.3s",
          backgroundColor: theme.palette.background.default,
          boxShadow: "none",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            pr: { xs: 1, md: 4 },
            pl: { xs: 1, md: 4 },
            minHeight: { xs: "56px", md: "64px" },
            overflow: "hidden",
          }}
        >
          {/* Left side - Breadcrumb */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, md: 1 },
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => {
                const isDesktop = window?.().innerWidth ? window().innerWidth >= 960 : false;
                if (isDesktop) {
                  handleDesktopDrawerToggle();
                } else {
                  handleDrawerToggle();
                }
              }}
              sx={{
                mr: { xs: 0.5, md: 1 },
                padding: { xs: "8px" },
                display: { xs: "flex", md: "none" }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, md: 1 }, minWidth: 0 }}>
              {/* Hide icon on Privacy Policy and Terms & Conditions pages */}
              {location.pathname !== "/privacy-policy" && location.pathname !== "/terms-and-conditions" && (
                <Box
                  component="img"
                  src={currentPageInfo.icon}
                  alt={currentPageInfo.title}
                  sx={{ width: "20px", height: "20px", flexShrink: 0 }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  color: "#6C737F",
                  fontWeight: 400,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentPageInfo.title}
              </Typography>
            </Box>
          </Box>

          {/* Right side - Logo (hidden on Privacy Policy and Terms & Conditions) */}
          {location.pathname !== "/privacy-policy" && location.pathname !== "/terms-and-conditions" && (
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, md: 1 },
              flexShrink: 0,
            }}>
              <Box
                component="img"
                src="/assets/icons/ravwork_logo_icon.svg"
                alt="Ravwork Icon"
                sx={{ height: "35px", width: "26px", maxWidth: "100%" }}
              />
              <Box
                component="img"
                src="/assets/icons/ravwork_logo_text.svg"
                alt="Ravwork"
                sx={{ width: "69px", height: "20px", maxWidth: "100%" }}
              />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: { xs: "100%", md: DRAWER_WIDTH },
              maxWidth: { xs: "100%", md: DRAWER_WIDTH },
              borderRight: "1px solid #E5E7EB",
              height: "100vh",
              overflow: "auto",
              overscrollBehavior: "contain",
              // Hide scrollbar but keep scroll functionality
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              border: "none",
              borderRight: "1px solid #E5E7EB",
              position: "relative",
              height: "100vh",
              overflow: "auto",
              overscrollBehavior: "contain",
              // Hide scrollbar but keep scroll functionality
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE and Edge
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md: desktopOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%"
          },
          ml: {
            xs: 0,
            md: 0
          },
          transition: "width 0.3s, margin-left 0.3s",
          mt: { xs: "56px", md: "64px" },
          height: { xs: "calc(100vh - 56px)", md: "calc(100vh - 64px)" },
          overflow: "auto",
          backgroundColor: theme.palette.background.default,
          p: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {children}
      </Box>

      {/* Logout Confirmation Dialog */}
      <GlobalDialog
        open={openLogoutDialog}
        handleClose={handleCloseLogoutDialog}
        component={
          <CommonDialog
            handleCancel={handleCloseLogoutDialog}
            title="Log Out"
            subTitle="Are you sure you want to log out?"
            handleConfirm={handleLogoutConfirm}
            confirmDisabled={isLoggingOut}
          />
        }
      />
    </Box>
  );
}
