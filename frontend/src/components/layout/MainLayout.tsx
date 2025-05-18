import { useState, useEffect } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

// Drawer width responsivo para diferentes tamanhos de tela
const DRAWER_WIDTH = {
    xs: 260,  // Telas muito pequenas
    sm: 280,  // Telas pequenas
    md: 300,  // Telas médias
    lg: 320,  // Telas grandes
};

export const MainLayout = ({ children }: MainLayoutProps) => {
    const theme = useTheme();
    const isExtraSmall = useMediaQuery('(max-width:400px)');
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.down('md'));
    
    // Determina o tamanho do drawer baseado no tamanho da tela
    const drawerWidth = isExtraSmall 
        ? DRAWER_WIDTH.xs 
        : isSmall 
            ? DRAWER_WIDTH.sm 
            : isMedium 
                ? DRAWER_WIDTH.md 
                : DRAWER_WIDTH.lg;
    
    // Determina se o sidebar deve ser temporário baseado no tamanho da tela
    const isMobile = isMedium;
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    // Ajustar estado do sidebar ao mudar o tamanho da tela
    useEffect(() => {
        setSidebarOpen(!isMobile);
    }, [isMobile]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Header 
                onSidebarToggle={handleSidebarToggle} 
            />
            <Sidebar
                open={sidebarOpen}
                width={drawerWidth}
                onClose={handleSidebarClose}
                variant={isMobile ? "temporary" : "persistent"}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { 
                        xs: isExtraSmall ? 1 : 2, 
                        sm: 2, 
                        md: 3 
                    },
                    width: '100%', // Sempre usa 100% da largura disponível
                    transition: (theme) => theme.transitions.create(['padding'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.standard,
                    }),
                }}
            >
                <Toolbar /> {/* Espaço para o header fixo */}
                <Box 
                    sx={{ 
                        maxWidth: {
                            xs: '100%',
                            sm: '100%',
                            md: sidebarOpen ? '1200px' : '1400px',
                            lg: sidebarOpen ? '1400px' : '1600px',
                        },
                        mx: 'auto', // Centraliza o conteúdo
                        width: '100%',
                        transition: (theme) => theme.transitions.create('max-width', {
                            easing: theme.transitions.easing.easeInOut,
                            duration: theme.transitions.duration.standard,
                        }),
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};