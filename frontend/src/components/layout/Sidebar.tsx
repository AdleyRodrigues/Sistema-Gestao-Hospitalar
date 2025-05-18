import React from 'react';
import {
    Assignment,
    Business,
    CalendarMonth,
    ConstructionRounded,
    Dashboard,
    Description,
    Event,
    Group,
    LocalHospital,
    Logout,
    Person,
    PrivacyTip,
    Settings,
    VideoCall,
    Close as CloseIcon
} from '@mui/icons-material';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    styled,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

interface SidebarProps {
    open: boolean;
    width: number;
    onClose: () => void;
    variant: "permanent" | "persistent" | "temporary";
}

// Menus para diferentes perfis de usuário
const menuItems = {
    patient: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/patient/dashboard', implemented: true },
        { text: 'Consultas', icon: <Event />, path: '/patient/appointments', implemented: false },
        { text: 'Histórico Médico', icon: <Description />, path: '/patient/medical-history', implemented: false },
        { text: 'Telemedicina', icon: <VideoCall />, path: '/patient/telemedicine', implemented: false },
        { text: 'Configurações de Privacidade', icon: <PrivacyTip />, path: '/patient/privacy-settings', implemented: true },
    ],
    professional: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/professional/dashboard', implemented: true },
        { text: 'Agenda', icon: <CalendarMonth />, path: '/professional/schedule', implemented: true },
        { text: 'Prontuários', icon: <Assignment />, path: '/professional/records', implemented: false },
        { text: 'Pacientes', icon: <Person />, path: '/professional/patients', implemented: true },
        { text: 'Telemedicina', icon: <VideoCall />, path: '/professional/telemedicine', implemented: false },
        { text: 'Configurações de Privacidade', icon: <PrivacyTip />, path: '/professional/privacy-settings', implemented: true },
    ],
    admin: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard', implemented: true },
        { text: 'Usuários', icon: <Person />, path: '/admin/users', implemented: true },
        { text: 'Hospitais', icon: <Business />, path: '/admin/hospitals', implemented: false },
        { text: 'Profissionais', icon: <Group />, path: '/admin/professionals', implemented: false },
        { text: 'Configurações', icon: <Settings />, path: '/admin/settings', implemented: false },
        { text: 'Configurações de Privacidade', icon: <PrivacyTip />, path: '/admin/privacy-settings', implemented: true },
    ],
};

// Estilização do Drawer
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
        minHeight: '56px',
    },
    [theme.breakpoints.down('xs')]: {
        minHeight: '48px',
        padding: theme.spacing(0, 0.5),
    },
}));

const Logo = styled('div')(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
        marginRight: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.25rem',
    },
    [theme.breakpoints.down(400)]: {
        fontSize: '1.1rem',
        '& svg': {
            marginRight: theme.spacing(0.5),
            fontSize: '1.2rem',
        },
    },
}));

export const Sidebar = ({ open, width, onClose, variant }: SidebarProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isExtraSmall = useMediaQuery('(max-width:400px)');
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Verifica o perfil do usuário
    const userRole = user?.role || 'patient';

    // Seleciona os itens do menu baseado no perfil
    const items = menuItems[userRole as UserRole].filter(item => item.implemented);

    const handleNavigate = (path: string, implemented: boolean) => {
        if (implemented) {
            navigate(path);
            if (isMobile) onClose();
        }
    };

    // Handler para logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            sx={{
                width: open ? width : 0,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: isMobile ? (isExtraSmall ? '85%' : isSmall ? '80%' : '70%') : width,
                    boxSizing: 'border-box',
                    transition: (theme) => theme.transitions.create(['width', 'box-shadow'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.standard,
                    }),
                    overflowX: 'hidden',
                    boxShadow: isMobile ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
                },
            }}
        >
            <DrawerHeader>
                <Logo>
                    <LocalHospital fontSize={isExtraSmall ? "small" : "medium"} />
                    <span>SGHSS</span>
                </Logo>
                {isMobile && (
                    <IconButton
                        onClick={onClose}
                        aria-label="fechar menu"
                        size={isExtraSmall ? "small" : "medium"}
                        sx={{
                            padding: isExtraSmall ? '4px' : '8px',
                        }}
                    >
                        <CloseIcon fontSize={isExtraSmall ? "small" : "medium"} />
                    </IconButton>
                )}
            </DrawerHeader>
            <Divider />
            <Box sx={{ overflow: 'auto', mt: { xs: isExtraSmall ? 1 : 1.5, sm: 2 } }}>
                <List sx={{ px: { xs: isExtraSmall ? 0.5 : 1, sm: 1.5 } }}>
                    {items.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: { xs: 0.5, sm: 1 } }}>
                            <Tooltip
                                title={item.implemented ? "" : "Página em desenvolvimento"}
                                placement="right"
                            >
                                <ListItemButton
                                    selected={location.pathname === item.path}
                                    onClick={() => handleNavigate(item.path, item.implemented)}
                                    disabled={!item.implemented}
                                    sx={{
                                        opacity: item.implemented ? 1 : 0.6,
                                        '&.Mui-disabled': {
                                            opacity: 0.6,
                                        },
                                        py: { xs: isExtraSmall ? 0.75 : 1, sm: 1.25, md: 1.5 },
                                        px: { xs: isExtraSmall ? 1 : 1.5, sm: 2 },
                                        borderRadius: '8px',
                                        '&.Mui-selected': {
                                            backgroundColor: 'primary.light',
                                            color: 'white',
                                            '& .MuiListItemIcon-root': {
                                                color: 'white',
                                            },
                                        },
                                        '&:hover': {
                                            borderRadius: '8px',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        minWidth: { xs: isExtraSmall ? 36 : 40, sm: 48 },
                                        color: 'inherit'
                                    }}>
                                        {item.implemented
                                            ? React.cloneElement(item.icon, {
                                                fontSize: isExtraSmall ? "small" : isSmall ? "medium" : "medium"
                                            })
                                            : <ConstructionRounded fontSize={isExtraSmall ? "small" : "medium"} />
                                        }
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: {
                                                xs: isExtraSmall ? '0.85rem' : '0.9rem',
                                                sm: '0.95rem',
                                                md: 'inherit'
                                            },
                                            fontWeight: location.pathname === item.path ? 600 : 400
                                        }}
                                    />
                                    {!item.implemented && (
                                        <ConstructionRounded
                                            fontSize="small"
                                            sx={{
                                                ml: { xs: 0.5, sm: 1 },
                                                opacity: 0.7,
                                                display: { xs: isExtraSmall ? 'none' : 'block', sm: 'block' }
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
            </Box>
            <Divider />
            <List sx={{ px: { xs: isExtraSmall ? 0.5 : 1, sm: 1.5 } }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            py: { xs: isExtraSmall ? 0.75 : 1, sm: 1.25, md: 1.5 },
                            px: { xs: isExtraSmall ? 1 : 1.5, sm: 2 },
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.contrastText',
                                '& .MuiListItemIcon-root': {
                                    color: 'error.contrastText',
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{
                            minWidth: { xs: isExtraSmall ? 36 : 40, sm: 48 },
                            color: 'inherit'
                        }}>
                            <Logout fontSize={isExtraSmall ? "small" : isSmall ? "medium" : "medium"} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Sair"
                            primaryTypographyProps={{
                                fontSize: {
                                    xs: isExtraSmall ? '0.85rem' : '0.9rem',
                                    sm: '0.95rem',
                                    md: 'inherit'
                                }
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
}; 