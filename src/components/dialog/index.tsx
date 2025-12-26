
import { DialogContent } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import type { JSX } from "react";
import { WarningLine } from "../shared/WarningLine";

interface GlobalDialogProps{
    component:JSX.Element
    handleClose:()=>void;
    open:boolean;
};
export default function GlobalDialog({open, handleClose, component}:GlobalDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiPaper-root":{
            minWidth:{xs:"calc(100% - 1%)", sm:"500px", md:"650px"},
            // width:{xs:"calc(100% - 1%)", sm:"600px"},
            padding:"10px 0px",
            borderRadius:"32px",
        },
        zIndex: 1600, // Ensure dialog is above other elements
      }}
    >
      <DialogContent sx={{position:"relative", paddingLeft:"20px"}}>
        <WarningLine />
        {/* <Stack alignItems={"flex-end"}>
            <IconButton onClick={handleClose} sx={{width:"fit-content"}}>
                <CancelIcon/>
            </IconButton>
        </Stack> */}
        {component}
        </DialogContent>
    </Dialog>
  );
}
