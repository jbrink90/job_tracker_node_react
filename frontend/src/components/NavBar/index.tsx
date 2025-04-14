import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./index.css";

const NavBar = () => {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorElement);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };
  
  const closeMenu = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <div className="navBar_main">
        <div className="navBar_userDiv">
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={openMenu}
            >
              Welcome Jordan
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorElement}
              open={open}
              onClose={closeMenu}
            >
              <MenuItem onClick={closeMenu}>My account</MenuItem>
              <MenuItem onClick={closeMenu}>Logout</MenuItem>
            </Menu>
        </div>
      </div>
    </>
  );
};

export default NavBar;
