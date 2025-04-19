import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./index.css";

interface NavBarProps {
  isUserLoggedIn: boolean;
}

const NavBar: FC<NavBarProps> = ({ isUserLoggedIn }) => {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );

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
            {isUserLoggedIn ? "Welcome Jordan" : "Welcome Guest"}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorElement}
            open={open}
            onClose={closeMenu}
          >
            {isUserLoggedIn
              ? [
                  <MenuItem onClick={closeMenu} key="account">
                    <NavLink
                      to="/account"
                      style={{ textDecoration: "none" }}
                      onClick={closeMenu}
                    >
                      My account
                    </NavLink>
                  </MenuItem>,
                  <MenuItem onClick={closeMenu} key="logout">
                    <NavLink
                      to="/logout"
                      style={{ textDecoration: "none" }}
                      onClick={closeMenu}
                    >
                      Logout
                    </NavLink>
                  </MenuItem>,
                ]
              : [
                  <MenuItem key="login">
                    <NavLink
                      to="/login"
                      style={{ textDecoration: "none" }}
                      onClick={closeMenu}
                    >
                      Log In
                    </NavLink>
                  </MenuItem>,
                  <MenuItem onClick={closeMenu} key="create">
                    <NavLink
                      to="/create"
                      style={{ textDecoration: "none" }}
                      onClick={closeMenu}
                    >
                      Create Account
                    </NavLink>
                  </MenuItem>,
                ]}
          </Menu>
        </div>
      </div>
    </>
  );
};

export default NavBar;
