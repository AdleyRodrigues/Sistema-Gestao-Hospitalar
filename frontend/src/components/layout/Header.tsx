import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Notifications, AccountCircle, Logout } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    onSidebarToggle: () => void;
}

export const Header = ({ onSidebarToggle }: HeaderProps) => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onSidebarToggle}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    VidaPlus
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" sx={{ ml: 1 }}>
                        <Notifications />
                    </IconButton>

                    <Tooltip title="Minha conta">
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                            sx={{ ml: 1 }}
                        >
                            {user?.avatar ? (
                                <Avatar
                                    src={user.avatar}
                                    alt={user.name}
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <AccountCircle />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        keepMounted
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleClose}>Meu Perfil</MenuItem>
                        <MenuItem onClick={handleClose}>Configurações</MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <Logout fontSize="small" sx={{ mr: 1 }} />
                            Sair
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}; 