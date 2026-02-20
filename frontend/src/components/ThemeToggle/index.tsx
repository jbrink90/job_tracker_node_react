import React from "react";
import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Brightness4, Brightness7, Settings } from "@mui/icons-material";
import { useThemeContext } from "../../context/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { siteTheme, resolvedTheme, setTheme } = useThemeContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (theme: "light" | "dark" | "system") => {
    setTheme(theme);
    handleClose();
  };

  const getThemeIcon = () => {
    if (siteTheme === "system") return <Settings />;
    return resolvedTheme === "dark" ? <Brightness4 /> : <Brightness7 />;
  };

  const getThemeLabel = () => {
    if (siteTheme === "system") return "System";
    return resolvedTheme === "dark" ? "Dark" : "Light";
  };

  return (
    <>
      <Tooltip title={`Theme: ${getThemeLabel()}`}>
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-label="theme selector"
          data-testid="theme-toggle"
        >
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem 
          onClick={() => handleThemeSelect("light")}
          selected={siteTheme === "light"}
        >
          <ListItemIcon>
            <Brightness7 fontSize="small" />
          </ListItemIcon>
          <ListItemText>Light</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleThemeSelect("dark")}
          selected={siteTheme === "dark"}
        >
          <ListItemIcon>
            <Brightness4 fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dark</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleThemeSelect("system")}
          selected={siteTheme === "system"}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>System</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeToggle;
