import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { DeleteOutlineIcon, MoreHorizIcon, AddBoxIcon } from "./Icons";
import AppUtilities from "../../utils/AppUtilities";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const ChatSession = ({ menuItems, onDelete, session_id }) => {
  const [activeItem, setActiveItem] = useState(Number(session_id));
  const [anchorEl, setAnchorEl] = useState(null); // For menu positioning
  const [currentItem, setCurrentItem] = useState(null); // Track the current item for menu actions
  const navigate = useNavigate();

  const handleSession = (id) => {
    setActiveItem(id);
    navigate(`c/${id}`);
  };

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setCurrentItem(item);
  };

  const handleMenuClose = () => {
    // Close only if the deletion is not pending
    if (!onDelete.isPending) {
      setAnchorEl(null);
      setCurrentItem(null);
    }
  };

  const handleDelete = () => {
    if (currentItem) {
      onDelete.mutate(currentItem.id, {
        onSuccess: () => {
          // Close the menu only after deletion is successful
          handleMenuClose();
        },
      });
    }
  };

  return (
    <div className="sidebar-content">
      <ul>
        <li onClick={() => navigate("c/0")} className="new-chat">
          <AddBoxIcon style={{ width: 20, height: 20 }} />
          <Button>New Chat</Button>
        </li>
        {menuItems?.map((item, _) => {
          const { session_name, id } = item;
          return (
            <li
              key={id}
              className={activeItem === id ? "active" : ""}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }} // Aligns the session name and options horizontally
              onClick={() => handleSession(id)}
            >
              <div className="font12" style={{ flex: 1 }}>
                {AppUtilities.truncateText(session_name, 15)}
              </div>
              <IconButton
                aria-label="options"
                style={{ width: 30, height: 30 }}
                onClick={(event) => handleMenuClick(event, item)}
              >
                <MoreHorizIcon />
              </IconButton>

              {/* Options Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "settings-button",
                  sx: { padding: 0 }, // Remove padding from MenuList
                }}
                PaperProps={{
                  sx: { padding: 0 }, // Remove padding from Paper component
                }}
              >
                <MenuItem
                  style={{ color: "red" }}
                  onClick={handleDelete}
                  disabled={onDelete.isPending} // Disable while deletion is in progress
                  className="menu-item-session"
                >
                  <DeleteOutlineIcon
                    style={{ marginRight: 10, fontSize: 14 }}
                  />
                  {onDelete.isPending ? "Deleting..." : "Delete"}
                </MenuItem>
              </Menu>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatSession;
