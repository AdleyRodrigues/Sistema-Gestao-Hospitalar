import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications,
    AccountCircle,
    Logout,
    LocalHospital
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

interface HeaderProps {
    onSidebarToggle: () => void;
}

export const Header = ({ onSidebarToggle }: HeaderProps) => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isExtraSmall = useMediaQuery('(max-width:400px)');
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        window.location.href = '/login'; // Navegação direta para login
    };

    // Determinar o caminho de perfil com base no tipo de usuário
    const getProfilePath = () => {
        if (!user) return '/login';

        if (user.role === 'admin') {
            return '/admin/profile';
        } else if (user.role === 'professional') {
            return '/professional/profile';
        } else {
            return '/patient/profile';
        }
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{
                minHeight: { xs: isExtraSmall ? '48px' : '56px', sm: '64px' },
                px: { xs: isExtraSmall ? 0.5 : 1, sm: 1.5, md: 2 }
            }}>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onSidebarToggle}
                    sx={{
                        mr: { xs: 0.5, sm: 1 },
                        padding: { xs: isExtraSmall ? '6px' : '8px', sm: '10px', md: '12px' }
                    }}
                    aria-label="menu"
                >
                    <MenuIcon fontSize={isExtraSmall ? 'small' : 'medium'} />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 2 } }}>
                    <LocalHospital fontSize={isExtraSmall ? 'small' : isSmall ? 'medium' : 'large'} />
                    {!isExtraSmall && (
                        <Typography
                            variant={isSmall ? "body1" : "h6"}
                            component="div"
                            sx={{
                                ml: 1,
                                display: { xs: isSmall ? 'none' : 'block', sm: 'block' }
                            }}
                        >
                            SGHSS
                        </Typography>
                    )}
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!isExtraSmall && (
                        <Tooltip title="Notificações">
                            <IconButton
                                color="inherit"
                                sx={{
                                    ml: { xs: 0.5, sm: 1 },
                                    padding: { xs: '6px', sm: '8px', md: '12px' }
                                }}
                                aria-label="notificações"
                            >
                                <Notifications fontSize={isSmall ? 'small' : 'medium'} />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title="Minha conta">
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                            sx={{
                                ml: { xs: 0.5, sm: 1 },
                                padding: { xs: isExtraSmall ? '4px' : '6px', sm: '8px', md: '12px' }
                            }}
                            aria-label="perfil"
                        >
                            {user?.avatar ? (
                                <Avatar
                                    src={user.avatar}
                                    alt={user.name}
                                    sx={{
                                        width: { xs: isExtraSmall ? 24 : 28, sm: 32, md: 36 },
                                        height: { xs: isExtraSmall ? 24 : 28, sm: 32, md: 36 }
                                    }}
                                />
                            ) : (
                                <AccountCircle fontSize={isExtraSmall ? 'small' : isSmall ? 'medium' : 'large'} />
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
                        PaperProps={{
                            sx: {
                                mt: 1,
                                width: { xs: isExtraSmall ? 160 : 180, sm: 200, md: 220 },
                                '& .MuiMenuItem-root': {
                                    fontSize: { xs: isExtraSmall ? '0.8rem' : '0.875rem', sm: '0.925rem', md: '1rem' },
                                    py: { xs: isExtraSmall ? 0.75 : 1, sm: 1.25, md: 1.5 }
                                }
                            }
                        }}
                    >
                        <MenuItem component={Link} to={getProfilePath()} onClick={handleClose}>
                            Meu Perfil
                        </MenuItem>
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