import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as CoursesIcon,
  Assignment as AssignmentsIcon,
  Timeline as StudyPlansIcon,
  Payment as PaymentsIcon,
  People as UsersIcon,
  Assessment as ReportsIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { backgrounds } from '../../assets/images/backgrounds';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Courses', icon: <CoursesIcon />, path: '/courses' },
  { text: 'Assignments', icon: <AssignmentsIcon />, path: '/assignments' },
  { text: 'Study Plans', icon: <StudyPlansIcon />, path: '/study-plans' },
  { text: 'Payments', icon: <PaymentsIcon />, path: '/payments' },
  { text: 'Users', icon: <UsersIcon />, path: '/users' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Help', icon: <HelpIcon />, path: '/help' },
];

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const drawer = (
    <Box sx={{ height: '100%', background: '#ffffff' }}>
      {/* User Profile Section */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%), ${backgrounds.pattern2}`,
          backgroundBlendMode: 'overlay',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user?.profilePicture}
            sx={{
              width: 50,
              height: 50,
              border: '2px solid white',
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.fullName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'capitalize' }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Box
            sx={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 1,
              p: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">8</Typography>
            <Typography variant="caption">Courses</Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 1,
              p: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">12</Typography>
            <Typography variant="caption">Tasks</Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) onDrawerToggle();
              }}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd9 0%, #6a4191 100%)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'white' : theme.palette.text.secondary,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Bottom Menu */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/settings')}
            sx={{ mx: 1, borderRadius: 1 }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.secondary, minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logout}
            sx={{ mx: 1, borderRadius: 1, color: theme.palette.error.main }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Upgrade Plan Banner */}
      <Box
        sx={{
          m: 2,
          p: 2,
          borderRadius: 2,
          background: `linear-gradient(135deg, #f8b042 0%, #f56565 100%), ${backgrounds.pattern2}`,
          backgroundBlendMode: 'overlay',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Upgrade to Pro
        </Typography>
        <Typography variant="caption" display="block" sx={{ mb: 2 }}>
          Get access to all premium features
        </Typography>
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 1,
            p: 1,
            cursor: 'pointer',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          }}
          onClick={() => navigate('/payments')}
        >
          <Typography variant="button">Upgrade Now</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: '#ffffff',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            boxShadow: 'none',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;