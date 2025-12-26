import { Button, Menu, MenuItem, useTheme } from "@mui/material";
import React from "react";

interface menuListOption{
    title:string;
    menuAction:()=>void
}

interface GlobalBulkActionProps{
menuList:menuListOption[];
}
export default function GlobalBulkAction({menuList}:GlobalBulkActionProps){
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const theme = useTheme();
      const open = Boolean(anchorEl);
      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    return (
      <>
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "100px",
            width: "143px",
            height: "44px",
            textTransform: "none",
            fontSize: "14px",
            px: 2,
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
          endIcon={<img src={"/assets/icons/dropdown-arrow.svg"} alt="arrow-down" width={14} height={14}/>}
        >
          Bulk Action
        </Button>
         <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                  list: {
                    "aria-labelledby": "basic-button",
                  },
                }}
              >
                {menuList?.map((menu, index) => (
                  <MenuItem
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color:
                        menu.title === "Delete"
                          ? "#FF0005"
                          : theme.palette.secondary[900],
                    }}
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      menu.menuAction();
                      handleClose();
                    }}
                  >
                    {menu.title}
                  </MenuItem>
                ))}
              </Menu>
      </>
    );
}