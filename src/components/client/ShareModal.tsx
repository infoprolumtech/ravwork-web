import { type JSX, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { Close, Twitter, WhatsApp } from "@mui/icons-material";
import { StyledTextField } from "../../utils/helper";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  profileUrl: string;
  profileName: string;
}

export default function ShareModal({
  open,
  onClose,
  profileUrl,
  profileName,
}: ShareModalProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(profileUrl);
    const encodedTitle = encodeURIComponent(profileName);

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "instagram":
        // Instagram doesn't support direct URL sharing, so copy to clipboard
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: "12px", sm: "16px" },
          mx: { xs: 2, sm: 3 },
          width: { xs: "calc(100% - 32px)", sm: "100%" },
          maxWidth: { xs: "calc(100% - 32px)", sm: "600px" },
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Stack
          sx={{
            padding: { xs: "20px", sm: "32px", md: "40px" },
            display: "flex",
            flexDirection: "column",
            gap: { xs: "16px", sm: "20px", md: "24px" },
            width: "100%",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Header - Title and Close icon */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "20px", sm: "22px", md: "24px" },
                fontWeight: 600,
                color: "#111927",
                textAlign: "left",
              }}
            >
              Share Profile
            </Typography>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                p: 0.5,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>

          {/* Top Section: Logo, Business Name, Social Icons */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ width: "100%" }}
          >
            {/* Ravwork Logo */}
            <Box
              component="img"
              src="/assets/icons/ravwork_logo_icon.svg"
              alt="Ravwork"
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                objectFit: "contain",
              }}
            />

            {/* Business Name */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "16px", sm: "18px" },
                fontWeight: 500,
                color: "#111927",
                flex: 1,
              }}
            >
              {profileName || "Business Name"}
            </Typography>

            {/* Social Share Icons */}
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => handleSocialShare("facebook")}
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  p: 0,
                  minWidth: { xs: 32, sm: 40 },
                }}
              >
                <Box
                  component="img"
                  src="/assets/icons/Facebook.svg"
                  alt="Facebook"
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </IconButton>
              <IconButton
                onClick={() => handleSocialShare("twitter")}
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  p: 0,
                  minWidth: { xs: 32, sm: 40 },
                }}
              >
                <Twitter sx={{ fontSize: { xs: 20, sm: 24 }, color: "#1DA1F2", width: "100%", height: "100%" }} />
              </IconButton>
              <IconButton
                onClick={() => handleSocialShare("instagram")}
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  p: 0,
                  minWidth: { xs: 32, sm: 40 },
                }}
              >
                <Box
                  component="img"
                  src="/assets/icons/instagram.svg"
                  alt="Instagram"
                  sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </IconButton>
              <IconButton
                onClick={() => handleSocialShare("whatsapp")}
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  p: 0,
                  minWidth: { xs: 32, sm: 40 },
                }}
              >
                <WhatsApp sx={{ fontSize: { xs: 20, sm: 24 }, color: "#25D366", width: "100%", height: "100%" }} />
              </IconButton>
            </Stack>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 1 }} />

          {/* Bottom Section: URL and Copy Button */}
          <Stack direction="row" spacing={2} alignItems="stretch" sx={{ width: "100%" }}>
            <StyledTextField
              value={profileUrl}
              variant="outlined"
              margin="none"
              inputProps={{ readOnly: true }}
              sx={{
                flex: 1,
                "& .MuiInputBase-root": {
                  borderRadius: "100px",
                },
                "& .MuiInputBase-input": {
                  padding: "12px 16px",
                },
              }}
            />
            <Button
              variant="secondary"
              onClick={handleCopyLink}
              sx={{
                minWidth: { xs: "80px", sm: "100px" },
                whiteSpace: "nowrap",
                alignSelf: "stretch",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

