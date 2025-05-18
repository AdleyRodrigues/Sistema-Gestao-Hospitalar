import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Tema base com melhorias de responsividade
const baseTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,      // Telefones pequenos
            sm: 600,    // Telefones grandes e tablets pequenos
            md: 960,    // Tablets e pequenos laptops
            lg: 1280,   // Laptops e desktops
            xl: 1920,   // Telas grandes e monitores
        },
    },
    palette: {
        primary: {
            light: '#4B9FFF',
            main: '#1976D2',
            dark: '#115293',
        },
        secondary: {
            light: '#33EB91',
            main: '#00C853',
            dark: '#009624',
        },
        background: {
            default: '#F5F7FA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#6B7280',
        },
        error: {
            main: '#DC2626',
        },
        warning: {
            main: '#F59E0B',
        },
        info: {
            main: '#3B82F6',
        },
        success: {
            main: '#10B981',
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            '@media (max-width:1280px)': {
                fontSize: '2.25rem',
            },
            '@media (max-width:960px)': {
                fontSize: '2rem',
            },
            '@media (max-width:600px)': {
                fontSize: '1.75rem',
            },
            '@media (max-width:400px)': {
                fontSize: '1.5rem',
            },
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            '@media (max-width:1280px)': {
                fontSize: '1.875rem',
            },
            '@media (max-width:960px)': {
                fontSize: '1.75rem',
            },
            '@media (max-width:600px)': {
                fontSize: '1.5rem',
            },
            '@media (max-width:400px)': {
                fontSize: '1.375rem',
            },
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            '@media (max-width:1280px)': {
                fontSize: '1.625rem',
            },
            '@media (max-width:960px)': {
                fontSize: '1.5rem',
            },
            '@media (max-width:600px)': {
                fontSize: '1.35rem',
            },
            '@media (max-width:400px)': {
                fontSize: '1.25rem',
            },
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            '@media (max-width:1280px)': {
                fontSize: '1.375rem',
            },
            '@media (max-width:960px)': {
                fontSize: '1.25rem',
            },
            '@media (max-width:600px)': {
                fontSize: '1.15rem',
            },
            '@media (max-width:400px)': {
                fontSize: '1.1rem',
            },
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            '@media (max-width:1280px)': {
                fontSize: '1.2rem',
            },
            '@media (max-width:960px)': {
                fontSize: '1.15rem',
            },
            '@media (max-width:600px)': {
                fontSize: '1.05rem',
            },
            '@media (max-width:400px)': {
                fontSize: '1rem',
            },
        },
        h6: {
            fontSize: '1.125rem',
            fontWeight: 600,
            '@media (max-width:1280px)': {
                fontSize: '1.1rem',
            },
            '@media (max-width:960px)': {
                fontSize: '1.05rem',
            },
            '@media (max-width:600px)': {
                fontSize: '0.95rem',
            },
            '@media (max-width:400px)': {
                fontSize: '0.9rem',
            },
        },
        body1: {
            fontSize: '1rem',
            '@media (max-width:960px)': {
                fontSize: '0.975rem',
            },
            '@media (max-width:600px)': {
                fontSize: '0.95rem',
            },
            '@media (max-width:400px)': {
                fontSize: '0.9rem',
            },
        },
        body2: {
            fontSize: '0.875rem',
            '@media (max-width:960px)': {
                fontSize: '0.85rem',
            },
            '@media (max-width:600px)': {
                fontSize: '0.825rem',
            },
            '@media (max-width:400px)': {
                fontSize: '0.8rem',
            },
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    '@media (max-width:960px)': {
                        padding: '7px 14px',
                        fontSize: '0.925rem',
                    },
                    '@media (max-width:600px)': {
                        padding: '6px 12px',
                        fontSize: '0.875rem',
                    },
                    '@media (max-width:400px)': {
                        padding: '5px 10px',
                        fontSize: '0.85rem',
                    },
                },
                sizeSmall: {
                    '@media (max-width:960px)': {
                        padding: '5px 12px',
                        fontSize: '0.85rem',
                    },
                    '@media (max-width:600px)': {
                        padding: '4px 10px',
                        fontSize: '0.8125rem',
                    },
                    '@media (max-width:400px)': {
                        padding: '3px 8px',
                        fontSize: '0.8rem',
                    },
                },
                // Ajuste para botões em contêineres pequenos
                startIcon: {
                    '@media (max-width:400px)': {
                        marginRight: '4px',
                    },
                },
                endIcon: {
                    '@media (max-width:400px)': {
                        marginLeft: '4px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    '@media (max-width:960px)': {
                        borderRadius: '10px',
                    },
                    '@media (max-width:600px)': {
                        borderRadius: '8px',
                    },
                    '@media (max-width:400px)': {
                        borderRadius: '6px',
                    },
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        padding: '16px 12px',
                    },
                    '@media (max-width:400px)': {
                        padding: '12px 8px',
                    },
                    '&:last-child': {
                        paddingBottom: '16px',
                        '@media (max-width:600px)': {
                            paddingBottom: '12px',
                        },
                        '@media (max-width:400px)': {
                            paddingBottom: '8px',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    '@media (max-width:960px)': {
                        margin: '24px',
                        width: 'calc(100% - 48px)',
                        maxWidth: '100%',
                    },
                    '@media (max-width:600px)': {
                        margin: '16px',
                        width: 'calc(100% - 32px)',
                    },
                    '@media (max-width:400px)': {
                        margin: '12px',
                        width: 'calc(100% - 24px)',
                    },
                },
            },
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    '@media (max-width:960px)': {
                        padding: '20px 20px',
                    },
                    '@media (max-width:600px)': {
                        padding: '16px 16px',
                    },
                    '@media (max-width:400px)': {
                        padding: '12px 12px',
                    },
                },
            },
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    '@media (max-width:960px)': {
                        padding: '12px 20px 20px',
                    },
                    '@media (max-width:600px)': {
                        padding: '8px 16px 16px',
                    },
                    '@media (max-width:400px)': {
                        padding: '8px 12px 12px',
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    '@media (max-width:960px)': {
                        width: '70% !important',
                    },
                    '@media (max-width:600px)': {
                        width: '80% !important',
                    },
                    '@media (max-width:400px)': {
                        width: '85% !important',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '@media (max-width:960px)': {
                        fontSize: '0.925rem',
                    },
                    '@media (max-width:600px)': {
                        fontSize: '0.875rem',
                    },
                    '@media (max-width:400px)': {
                        fontSize: '0.85rem',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    '@media (max-width:960px)': {
                        padding: '14px 12px',
                    },
                    '@media (max-width:600px)': {
                        padding: '12px 8px',
                        fontSize: '0.875rem',
                    },
                    '@media (max-width:400px)': {
                        padding: '8px 6px',
                        fontSize: '0.85rem',
                    },
                },
                head: {
                    fontWeight: 600,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        height: '28px',
                        fontSize: '0.75rem',
                    },
                    '@media (max-width:400px)': {
                        height: '24px',
                        fontSize: '0.7rem',
                    },
                },
                sizeSmall: {
                    '@media (max-width:600px)': {
                        height: '22px',
                        fontSize: '0.7rem',
                    },
                    '@media (max-width:400px)': {
                        height: '20px',
                        fontSize: '0.65rem',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        minWidth: '72px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                    },
                    '@media (max-width:400px)': {
                        minWidth: '60px',
                        padding: '6px 8px',
                        fontSize: '0.7rem',
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        padding: '0 12px',
                    },
                    '@media (max-width:400px)': {
                        padding: '0 8px',
                    },
                },
            },
        },
    },
});

// Aplicar responsividade aos tamanhos de fonte
export const theme = responsiveFontSizes(baseTheme); 