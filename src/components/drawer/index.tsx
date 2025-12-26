import Drawer from "@mui/material/Drawer";
import { type JSX } from "react";

interface GlobalDrawerProps{
    component:JSX.Element;
    handleClose: ()=>void;
    open: boolean;
}
export default function GlobalDrawer({component, handleClose, open}:GlobalDrawerProps) {
  return (
    <div>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: 1500,
          "& .MuiPaper-root": {
            height: "calc(100% - 1%)",
            marginTop: "0.3%",
            marginRight:{xs:0, sm:"10px"},
            borderRadius:"32px",
            minWidth:{xs:"100%", sm:"450px", md:"600px"},
            maxWidth:"600px",
            padding:{xs:2, sm:3.5, md:5}
          },
        }}
      >
        {component}
      </Drawer>
    </div>
  );
}
