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
    Typography
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
        >
            <DialogTitle id="consent-dialog-title" sx={{ pb: 1 }}>
                Política de Privacidade e Consentimento
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="consent-dialog-description" component="div">
                    <Typography variant="body1" paragraph>
                        Bem-vindo ao Sistema de Gestão Hospitalar e Serviços de Saúde (SGHSS).
                        Para utilizar nosso sistema, precisamos do seu consentimento para coletar e processar dados pessoais,
                        incluindo dados sensíveis relacionados à sua saúde.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                        Como utilizamos seus dados:
                    </Typography>

                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li">
                            Dados de identificação para autenticação e personalização do sistema
                        </Typography>
                        <Typography component="li">
                            Dados médicos para gerenciar seu histórico de saúde e consultas
                        </Typography>
                        <Typography component="li">
                            Informações de agendamento para gerenciar suas consultas
                        </Typography>
                    </Box>

                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                        Seus direitos incluem:
                    </Typography>

                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li">
                            Acessar e corrigir seus dados pessoais
                        </Typography>
                        <Typography component="li">
                            Solicitar a exclusão de seus dados
                        </Typography>
                        <Typography component="li">
                            Retirar seu consentimento a qualquer momento
                        </Typography>
                    </Box>

                    <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                        Para mais detalhes, consulte nossa{' '}
                        <Link
                            component="button"
                            variant="body1"
                            onClick={handlePrivacyPolicyClick}
                            sx={{ fontWeight: 'bold' }}
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
                        />
                    }
                    label="Li e concordo com a Política de Privacidade e dou meu consentimento para o processamento dos meus dados pessoais conforme descrito."
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onDecline} color="error" variant="outlined">
                    Recusar
                </Button>
                <Button
                    onClick={handleAccept}
                    color="primary"
                    variant="contained"
                    disabled={!consentChecked}
                >
                    Aceitar e Continuar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConsentModal; 