import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfileNavHelper = () => {
    const { user } = useAuth();

    // Função para abrir diretamente a página de perfil

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

        </Box>
    );
};

export default ProfileNavHelper; 