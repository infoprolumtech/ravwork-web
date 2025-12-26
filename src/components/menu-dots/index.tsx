import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import theme from "../../theme";
interface menu{
  title:string;
  menuAction:(id:string)=>void
}
interface MenuDotsProps {
  menuList: menu[];
  id:string;
}
export default function MenuDots({ menuList, id }: MenuDotsProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event?: unknown) => {
    // Only stopPropagation if event is a MouseEvent and has stopPropagation method
    if (event && typeof event === "object" && "stopPropagation" in event && typeof (event as any).stopPropagation === "function") {
      (event as React.MouseEvent<HTMLElement>).stopPropagation();
    }
    setAnchorEl(null);
  };
  
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
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
              menu.menuAction(id);
              handleClose(e);
            }}
          >
            {menu.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
