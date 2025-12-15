import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./index.css";
const NavBar = ({ userEmailSplit }) => {
    const [anchorElement, setAnchorElement] = React.useState(null);
    const open = Boolean(anchorElement);
    const openMenu = (event) => {
        setAnchorElement(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorElement(null);
    };
    return (_jsx(_Fragment, { children: _jsx("div", { className: "navBar_main", children: _jsxs("div", { className: "navBar_userDiv", children: [_jsx(Button, { id: "basic-button", "aria-controls": open ? "basic-menu" : undefined, "aria-haspopup": "true", "aria-expanded": open ? "true" : undefined, onClick: openMenu, children: userEmailSplit ? `Welcome ${userEmailSplit}` : "Welcome Guest" }), _jsx(Menu, { id: "basic-menu", anchorEl: anchorElement, open: open, onClose: closeMenu, children: userEmailSplit
                            ? [
                                _jsx(MenuItem, { onClick: closeMenu, children: _jsx(NavLink, { to: "/account", style: { textDecoration: "none", color: "black" }, onClick: closeMenu, children: "My account" }) }, "account"),
                                _jsx(MenuItem, { onClick: closeMenu, children: _jsx(NavLink, { to: "/logout", style: { textDecoration: "none", color: "black" }, onClick: closeMenu, children: "Logout" }) }, "logout"),
                            ]
                            : [
                                _jsx(MenuItem, { children: _jsx(NavLink, { to: "/login", style: { textDecoration: "none", color: "black" }, onClick: closeMenu, children: "Log In" }) }, "login"),
                            ] })] }) }) }));
};
export default NavBar;
