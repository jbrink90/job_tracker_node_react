import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import ContrastIcon from '@mui/icons-material/Contrast';
import Logout from '@mui/icons-material/Logout';
import Link from "@mui/material/Link";
import { useThemeContext } from '../../context/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import ClearIcon from '@mui/icons-material/Clear';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '500px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    flex: 1,
    maxWidth: '600px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

interface NewNavBarProps {
  onSearchChange?: (searchTerm: string) => void;
}

const NewNavBar: React.FC<NewNavBarProps> = ({onSearchChange}) => {
  const { siteTheme, setTheme } = useThemeContext();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = React.useState('');

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isThemeMenuOpen = Boolean(themeMenuAnchorEl);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchValue(searchTerm);
    if (onSearchChange) {
      onSearchChange(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => { setAnchorEl(null); handleMobileMenuClose(); };
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setMobileMoreAnchorEl(event.currentTarget);
  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => setThemeMenuAnchorEl(event.currentTarget);
  const handleThemeMenuClose = () => setThemeMenuAnchorEl(null);
  const handleThemeSelect = (theme: "light" | "dark" | "system") => {
    setTheme(theme);
    handleThemeMenuClose();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id='primary-search-account-menu'
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={Link} href="/account" onClick={handleMenuClose}>Account</MenuItem>
      <MenuItem component={Link} href="/logout" onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

  const renderThemeMenu = (
    <Menu
      anchorEl={themeMenuAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id='theme-selection-menu'
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isThemeMenuOpen}
      onClose={handleThemeMenuClose}
    >
      <MenuItem onClick={() => handleThemeSelect("light")} selected={siteTheme === "light"}>
        <LightModeIcon sx={{ mr: 1 }} />
        Light
      </MenuItem>
      <MenuItem onClick={() => handleThemeSelect("dark")} selected={siteTheme === "dark"}>
        <DarkModeIcon sx={{ mr: 1 }} />
        Dark
      </MenuItem>
      <MenuItem onClick={() => handleThemeSelect("system")} selected={siteTheme === "system"}>
        <SettingsBrightnessIcon sx={{ mr: 1 }} />
        System
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id='primary-search-account-menu-mobile'
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleThemeMenuOpen}>
        <IconButton size="large" color="inherit" aria-label='select theme'>
            <ContrastIcon />
          </IconButton>
        <p>Select Theme</p>
      </MenuItem>
      <MenuItem component={Link} href="/account">
      <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls='primary-search-account-menu'
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Account</p>
      </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} href="/logout" >
                <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls='primary-search-account-menu'
            aria-haspopup="true"
            color="inherit"
          >
            <Logout />
          </IconButton>
            <p>Logout</p>
          </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" enableColorOnDark color="primary">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            JobTrackr
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase 
              placeholder="Search jobs…" 
              inputProps={{ 'aria-label': 'search jobs' }}
              value={searchValue}
              onChange={handleSearchChange}
            />
            {searchValue && (
              <IconButton
                size="small"
                aria-label="clear search"
                onClick={handleClearSearch}
                sx={{
                  position: 'absolute',
                  right: theme.spacing(1),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'inherit',
                  padding: theme.spacing(0.5),
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" color="inherit" onClick={handleThemeMenuOpen}>
                <ContrastIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls='primary-search-account-menu'
              aria-haspopup="true"
              onClick={handleAccountMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls='primary-search-account-menu-mobile'
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderThemeMenu}
    </Box>
  );
}
export default NewNavBar;