
import { DialogContent, Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import type { JSX } from "react";
import { WarningLine } from "../shared/WarningLine";

interface GlobalDialogProps {
  component: JSX.Element
  handleClose: () => void;
  open: boolean;
  hideWarningLine?: boolean;
};
export default function GlobalDialog({ open, handleClose, component, hideWarningLine = false }: GlobalDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiPaper-root": {
          width: { xs: "100%", sm: "500px", md: "650px" },
          maxWidth: { xs: "100%", sm: "500px", md: "650px" },
          margin: { xs: 0, sm: "auto" },
          padding: "10px 0px",
          borderRadius: { xs: "0px", sm: "32px" },
          maxHeight: { xs: "100vh", sm: "90vh" },
          height: { xs: "100vh", sm: "auto" },
        },
        zIndex: 1600, // Ensure dialog is above other elements
      }}
    >
      <DialogContent sx={{
        position: "relative",
        paddingLeft: { xs: "16px", sm: "20px" },
        paddingRight: { xs: "16px", sm: "20px" },
        paddingTop: { xs: "20px", sm: "20px" },
        paddingBottom: { xs: "16px", sm: "20px" },
        height: { xs: "100%", sm: "auto" },
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}>
        {!hideWarningLine && (
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <WarningLine />
          </Box>
        )}
        {component}
      </DialogContent>
    </Dialog>
  );
}
