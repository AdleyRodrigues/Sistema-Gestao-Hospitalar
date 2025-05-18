import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Link,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ConsentModalProps {
    open: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

const ConsentModal = ({ open, onAccept, onDecline }: ConsentModalProps) => {
    const [consentChecked, setConsentChecked] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConsentChecked(event.target.checked);
    };

    const handleAccept = () => {
        if (consentChecked) {
            onAccept();
        }
    };

    const handlePrivacyPolicyClick = () => {
        navigate('/privacy-policy');
    };

    return (
        <Dialog
            open={open}
            aria-labelledby="consent-dialog-title"
            aria-describedby="consent-dialog-description"
            disableEscapeKeyDown
            maxWidth="md"
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : '12px',
                    m: isMobile ? 0 : 2,
                    height: isMobile ? '100%' : 'auto',
                    maxHeight: isMobile ? '100%' : 'calc(100% - 64px)',
                }
            }}
        >
            <DialogTitle
                id="consent-dialog-title"
                sx={{
                    pb: 1,
                    pt: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
            >
                Política de Privacidade e Consentimento
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
                <DialogContentText
                    id="consent-dialog-description"
                    component="div"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                    <Typography
                        variant="body1"
                        paragraph
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                        Bem-vindo ao Sistema de Gestão Hospitalar e Serviços de Saúde (SGHSS).
                        Para utilizar nosso sistema, precisamos do seu consentimento para coletar e processar dados pessoais,
                        incluindo dados sensíveis relacionados à sua saúde.
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mt: 2,
                            fontSize: { xs: '1rem', sm: '1.1rem' }
                        }}
                    >
                        Como utilizamos seus dados:
                    </Typography>

                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography
                            component="li"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 }}
                        >
                            Dados de identificação para autenticação e personalização do sistema
                        </Typography>
                        <Typography
                            component="li"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 }}
                        >
                            Dados médicos para gerenciar seu histórico de saúde e consultas
                        </Typography>
                        <Typography
                            component="li"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                            Informações de agendamento para gerenciar suas consultas
                        </Typography>
                    </Box>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mt: 2,
                            fontSize: { xs: '1rem', sm: '1.1rem' }
                        }}
                    >
                        Seus direitos incluem:
                    </Typography>

                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography
                            component="li"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 }}
                        >
                            Acessar e corrigir seus dados pessoais
                        </Typography>
                        <Typography
                            component="li"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 0.5 }}
                        >
                            Solicitar a exclusão de seus dados
                        </Typography>
                        <Typography
                            component="li"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                            Retirar seu consentimento a qualquer momento
                        </Typography>
                    </Box>

                    <Typography
                        variant="body1"
                        paragraph
                        sx={{
                            mt: 2,
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}
                    >
                        Para mais detalhes, consulte nossa{' '}
                        <Link
                            component="button"
                            variant="body1"
                            onClick={handlePrivacyPolicyClick}
                            sx={{
                                fontWeight: 'bold',
                                fontSize: 'inherit'
                            }}
                        >
                            Política de Privacidade completa
                        </Link>.
                    </Typography>
                </DialogContentText>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={consentChecked}
                            onChange={handleCheckboxChange}
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                        />
                    }
                    label={
                        <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                            Li e concordo com a Política de Privacidade e dou meu consentimento para o processamento dos meus dados pessoais conforme descrito.
                        </Typography>
                    }
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions sx={{
                px: { xs: 2, sm: 3 },
                pb: { xs: 2, sm: 3 },
                pt: { xs: 1, sm: 2 },
                flexDirection: isMobile ? 'column' : 'row',
                '& > button': {
                    width: isMobile ? '100%' : 'auto',
                    mb: isMobile ? 1 : 0,
                }
            }}>
                <Button
                    onClick={onDecline}
                    color="error"
                    variant="outlined"
                    fullWidth={isMobile}
                    size={isMobile ? "medium" : "large"}
                >
                    Recusar
                </Button>
                <Button
                    onClick={handleAccept}
                    color="primary"
                    variant="contained"
                    disabled={!consentChecked}
                    fullWidth={isMobile}
                    size={isMobile ? "medium" : "large"}
                >
                    Aceitar e Continuar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConsentModal; 