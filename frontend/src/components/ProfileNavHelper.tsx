import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

const ProfileNavHelper = () => {
    const { user } = useAuth();
    const [hasAttempted, setHasAttempted] = useState(false);
    const [navError, setNavError] = useState<string | null>(null);

    // Função para abrir diretamente a página de perfil
    const goToProfile = () => {
        setHasAttempted(true);
        try {
            let url = '/login';

            if (user) {
                if (user.role === 'admin') {
                    url = '/admin/profile';
                } else if (user.role === 'professional') {
                    url = '/professional/profile';
                } else {
                    url = '/patient/profile';
                }
            }

            console.log(`Redirecionando para: ${url}`);
            window.location.href = url;
        } catch (error) {
            console.error('Erro ao navegar:', error);
            setNavError(`Erro ao navegar: ${error}`);
        }
    };

    // Registrar no console as informações de usuário
    useEffect(() => {
        console.log('Informações do usuário:', user);
    }, [user]);

    if (!user) return null;

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9999,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: 300
        }}>
            <Typography variant="subtitle2" gutterBottom>
                Navegação de Perfil (Debug)
            </Typography>

            <Typography variant="caption" display="block" gutterBottom>
                Usuário: {user.name}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
                Perfil: {user.role}
            </Typography>

            {navError && (
                <Typography variant="caption" color="error" display="block" gutterBottom>
                    {navError}
                </Typography>
            )}

            {hasAttempted && (
                <Typography variant="caption" color="primary" display="block" gutterBottom>
                    Tentativa realizada. Verifique o console para mais detalhes.
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={goToProfile}
                fullWidth
                sx={{ mt: 1 }}
            >
                Ir para Meu Perfil
            </Button>
        </Box>
    );
};

export default ProfileNavHelper; 