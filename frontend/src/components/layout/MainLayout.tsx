import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const DRAWER_WIDTH = 240;

export const MainLayout = ({ children }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Header onSidebarToggle={handleSidebarToggle} />
            <Sidebar open={sidebarOpen} width={DRAWER_WIDTH} onClose={handleSidebarClose} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : 0}px)` },
                    ml: { sm: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
                    transition: (theme) => theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar /> {/* Espaço para o header fixo */}
                {children}
            </Box>
        </Box>
    );
}; 