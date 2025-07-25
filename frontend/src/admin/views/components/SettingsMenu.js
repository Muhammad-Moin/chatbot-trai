import React, { useState } from "react";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { LogoutIcon, AccountIcon, IconSettings } from "./Icons";

const SettingsMenu = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(menuAnchor);

  // Open settings dropdown menu
  const handleOpenMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  // Close the menu
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  // Handle profile click action
  const handleProfileClick = () => {
    console.log("Profile clicked");
    handleCloseMenu();
  };

  // Handle logout action (implement your own logout logic)
  const handleLogoutClick = () => {
    console.log("Logout clicked");
    handleCloseMenu();
    // Add your logout functionality here, such as clearing tokens or redirecting
  };

  return (
    <>
      <IconButton
        onClick={handleOpenMenu}
        aria-controls={isMenuOpen ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? "true" : undefined}
        style={{ background: "var(--bg-white)", borderRadius: 50 }}
      >
        <IconSettings
          stroke={1.5}
          size="1.5rem"
          style={{ color: "var(--color-text)" }}
        />
      </IconButton>

      <Menu
        id="settings-menu"
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "settings-button",
        }}
      >
        <MenuItem onClick={handleProfileClick} className="menu-item">
          <AccountIcon fontSize="small" style={{ marginRight: 10 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick} className="menu-item">
          <LogoutIcon fontSize="small" style={{ marginRight: 10 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenu;
