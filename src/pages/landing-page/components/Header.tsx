import { type JSX, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { colors, primaryButton } from "../styles";

interface HeaderProps {
  onTermsClick: () => void;
}

export default function Header({ onTermsClick }: HeaderProps): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks: { title: string; href: string; isAction?: boolean }[] = [
    { title: "Home", href: "/" },
    // { title: 'How It Works', href: '/#how-it-works' },
    { title: "Pricing", href: "/#pricing" },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.split("#")[1];
      if (location.pathname === "/") {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ p: 3, background: "#000000", height: "100%", color: "#FFFFFF" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#FFFFFF" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        {navLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton
              onClick={() => handleNavClick(link.href)}
              sx={{ py: 2 }}
            >
              <ListItemText
                primary={link.title}
                primaryTypographyProps={{ fontSize: "20px", fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          href="/setup"
          fullWidth
          sx={{
            color: colors.textPrimary,
            textTransform: "none",
            fontSize: "18px",
            border: `1px solid ${colors.textPrimary}`,
            borderRadius: "24px",
            py: 1.5,
          }}
        >
          Sign Up
        </Button>
        <Button
          href="/login"
          fullWidth
          sx={{
            ...primaryButton,
            py: 1.5,
            borderRadius: "24px",
            fontSize: "18px",
            background: colors.secondary,
          }}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#000000",
        paddingTop: "12px",
        width: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          py: 1,
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/assets/landing-page/logo.png"
          alt="RavworkLink"
          sx={{
            height: "32px",
            width: "auto",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        />

        {/* Hamburger Menu Icon (Mobile) */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            display: { md: "none" },
            ml: "auto",
            padding: 1,
          }}
        >
          <Box
            component="img"
            src="/assets/landing-page/hamburger.png"
            alt="menu"
            sx={{
              width: "32px",
              height: "auto",
            }}
          />
        </IconButton>

        {/* Desktop Navigation Links & Buttons */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            {navLinks.map((link) => (
              <Button
                key={link.title}
                href={!link.isAction ? link.href : undefined}
                onClick={() => {
                  if (link.isAction && link.title === "Terms & Conditions") {
                    onTermsClick();
                  } else {
                    handleNavClick(link.href);
                  }
                }}
                sx={{
                  color: colors.textPrimary,
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 400,
                  "&:hover": {
                    color: colors.accent,
                    background: "transparent",
                  },
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              href="/setup"
              sx={{
                color: colors.textPrimary,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 400,
                border: `1px solid ${colors.textPrimary}`,
                borderRadius: "24px",
                padding: "8px 24px",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                  borderColor: colors.accent,
                },
              }}
            >
              Sign Up
            </Button>
            <Button
              href="/login"
              sx={{
                ...primaryButton,
                padding: "8px 24px",
                borderRadius: "24px",
                fontSize: "16px",
                fontWeight: 400,
                background: colors.secondary,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            background: "#000000",
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
