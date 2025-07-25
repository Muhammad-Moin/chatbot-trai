// Importing icons
import { IconFileTypeDocx, IconDashboard, IconLockAccess, IconUser } from '@tabler/icons-react';

// Constants for icons
const icons = {
  IconFileTypeDocx,
  IconDashboard,
  IconLockAccess,
  IconUser
};

// Function to create a menu item
const createMenuItem = (id, title, url, icon) => ({
  id,
  title,
  type: 'item',
  url,
  icon,
  breadcrumbs: false
});

// Menu items
const menuItems = {
  items: [
    // Dashboard
    {
      id: 'dashboard',      
      type: 'group',
      children: [createMenuItem('default', 'DASHBOARD', '/admin/dashboard/default', icons.IconDashboard)]
    },
    // Users
    {
      id: 'users',
      type: 'group',
      children: [createMenuItem('users', 'USERS', '/admin/users', icons.IconUser)]
    },

    // Utilities
    {
      id: 'documents',
      type: 'group',
      children: [createMenuItem('documents', 'DOCUMENTS', '/admin/documents', icons.IconFileTypeDocx)]
    },

    // Keys Configuration
    {
      id: 'keys',
      type: 'group',
      children: [createMenuItem('keys', 'KEYS CONFIGURATION', '/admin/keys', icons.IconLockAccess)]
    }
  ]
};

export default menuItems;
