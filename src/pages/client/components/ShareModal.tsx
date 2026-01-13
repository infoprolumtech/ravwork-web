import { type JSX, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Close, ContentCopy, Check, Twitter, WhatsApp } from "@mui/icons-material";
import { StyledTextField } from "../../../utils/helper";

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
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
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
            alignItems: "flex-end",
            gap: { xs: "16px", sm: "20px", md: "24px" },
            width: "100%",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Header - Title and Close icon on same row */}
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "20px", sm: "22px", md: "24px" },
                fontWeight: 600,
                color: "#111927",
                flex: 1,
                pr: 2,
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

          {/* Link URL Section */}
          <Box sx={{ width: "100%" }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                  fontWeight: 600,
                  color: "#111927",
                }}
              >
                Profile Link
              </Typography>
            </Stack>
            <StyledTextField
              fullWidth
              value={profileUrl}
              variant="outlined"
              margin="none"
              inputProps={{ readOnly: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleCopyLink}
                      size="small"
                      sx={{
                        color: copied ? "#12B76A" : "#6C737F",
                        mr: 1,
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {copied ? (
                        <Check sx={{ fontSize: 20 }} />
                      ) : (
                        <ContentCopy sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": {
                  borderRadius: "0 !important",
                },
              }}
            />
            {copied && (
              <Typography
                variant="caption"
                sx={{
                  color: "#12B76A",
                  fontSize: "12px",
                  mt: 0.5,
                  ml: 1,
                }}
              >
                Link copied!
              </Typography>
            )}
          </Box>

          {/* Social Share Icons */}
          <Box sx={{ width: "100%" }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "16px", sm: "18px", md: "20px" },
                  fontWeight: 600,
                  color: "#111927",
                }}
              >
                Share on
              </Typography>
            </Stack>
            <Stack 
              direction="row" 
              spacing={{ xs: 1.5, sm: 2 }} 
              flexWrap="wrap"
              sx={{ gap: { xs: 1.5, sm: 2 } }}
            >
              <IconButton
                onClick={() => handleSocialShare("facebook")}
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backgroundColor: "#F7F9FB",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  "&:hover": {
                    backgroundColor: "#E5ECF6",
                    borderColor: "#9CA3AF",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Box
                  component="img"
                  src="/assets/icons/Facebook.svg"
                  alt="Facebook"
                  sx={{ width: { xs: "24px", sm: "28px" }, height: { xs: "24px", sm: "28px" } }}
                />
              </IconButton>
              <IconButton
                onClick={() => handleSocialShare("twitter")}
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backgroundColor: "#F7F9FB",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  "&:hover": {
                    backgroundColor: "#E5ECF6",
                    borderColor: "#9CA3AF",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Twitter sx={{ fontSize: { xs: 24, sm: 28 }, color: "#1DA1F2" }} />
              </IconButton>
              <IconButton
                onClick={() => handleSocialShare("linkedin")}
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backgroundColor: "#F7F9FB",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  "&:hover": {
                    backgroundColor: "#E5ECF6",
                    borderColor: "#9CA3AF",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Box
                  component="img"
                  src="/assets/icons/linkedin.svg"
                  alt="LinkedIn"
                  sx={{ width: { xs: "24px", sm: "28px" }, height: { xs: "24px", sm: "28px" } }}
                />
              </IconButton>
              <IconButton
                onClick={() => handleSocialShare("whatsapp")}
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  backgroundColor: "#F7F9FB",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  "&:hover": {
                    backgroundColor: "#E5ECF6",
                    borderColor: "#9CA3AF",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <WhatsApp sx={{ fontSize: { xs: 24, sm: 28 }, color: "#25D366" }} />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

