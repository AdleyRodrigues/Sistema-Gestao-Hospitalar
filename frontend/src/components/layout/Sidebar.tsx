import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Collapse,
    Tooltip,
    styled,
    IconButton,
} from '@mui/material';
import {
    Dashboard,
    CalendarMonth,
    MedicalServices,
    AdminPanelSettings,
    Person,
    People,
    VideoCall,
    Assignment,
    ExpandLess,
    ExpandMore,
    History,
    ConstructionRounded,
    Event,
    LocalHospital,
    Settings,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Description,
    AssignmentInd,
    Group,
    Business,
    Logout,
    Security,
    PrivacyTip,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

interface SidebarProps {
    open: boolean;
    width: number;
    onClose: () => void;
}

// Definir quais páginas estão implementadas
const implementedPages = [
    '/admin/dashboard',
    '/professional/dashboard',
    '/patient/dashboard',
    '/login',
    '/patient/privacy-settings',
    '/professional/privacy-settings',
    '/admin/privacy-settings',
];

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
        { text: 'Agenda', icon: <CalendarMonth />, path: '/professional/schedule', implemented: false },
        { text: 'Prontuários', icon: <Assignment />, path: '/professional/records', implemented: false },
        { text: 'Pacientes', icon: <Person />, path: '/professional/patients', implemented: false },
        { text: 'Telemedicina', icon: <VideoCall />, path: '/professional/telemedicine', implemented: false },
        { text: 'Configurações de Privacidade', icon: <PrivacyTip />, path: '/professional/privacy-settings', implemented: true },
    ],
    admin: [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard', implemented: true },
        { text: 'Usuários', icon: <Person />, path: '/admin/users', implemented: false },
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
    justifyContent: 'center',
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
}));

export const Sidebar = ({ open, width, onClose }: SidebarProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    // Verifica o perfil do usuário
    const userRole = user?.role || 'patient';

    // Seleciona os itens do menu baseado no perfil
    const items = menuItems[userRole as UserRole];

    const handleNavigate = (path: string, implemented: boolean) => {
        if (implemented) {
            navigate(path);
        }
    };

    const toggleSubMenu = (key: string) => {
        setOpenSubMenu(openSubMenu === key ? null : key);
    };

    // Handler para logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Drawer
            variant="persistent"
            open={open}
            sx={{
                width: open ? width : 0,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width,
                    boxSizing: 'border-box',
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: 'hidden',
                },
            }}
        >
            <DrawerHeader>
                <Logo>
                    <LocalHospital /> SGHSS
                </Logo>
            </DrawerHeader>
            <Divider />
            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List>
                    {items.map((item) => (
                        <ListItem key={item.text} disablePadding>
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
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        {item.implemented ? item.icon : <ConstructionRounded />}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                    {!item.implemented && <ConstructionRounded fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Sair" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
}; 