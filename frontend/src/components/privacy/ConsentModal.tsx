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
    useTheme,
    IconButton,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { useState } from 'react';
import { Article, Close } from '@mui/icons-material';

interface ConsentModalProps {
    open: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

const ConsentModal = ({ open, onAccept, onDecline }: ConsentModalProps) => {
    const [consentChecked, setConsentChecked] = useState(false);
    const [openPrivacyDialog, setOpenPrivacyDialog] = useState(false);
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
        setOpenPrivacyDialog(true);
    };

    const handleClosePrivacyDialog = () => {
        setOpenPrivacyDialog(false);
    };

    return (
        <>
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

            {/* Diálogo de Política de Privacidade */}
            <Dialog
                open={openPrivacyDialog}
                onClose={handleClosePrivacyDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2, maxWidth: '800px' }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 2
                }}>
                    <Article />
                    <Typography variant="h6">Política de Privacidade</Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClosePrivacyDialog}
                        aria-label="close"
                        sx={{ ml: 'auto' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ px: 3, py: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Política de Privacidade do Sistema VidaPlus
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Última atualização: 15 de Agosto de 2024
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Esta Política de Privacidade descreve como o Sistema de Gestão Hospitalar VidaPlus ("nós", "nosso" ou "VidaPlus")
                        coleta, usa e compartilha seus dados pessoais quando você utiliza nossa plataforma.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        1. INFORMAÇÕES QUE COLETAMOS
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Dados de cadastro:</strong> Nome completo, e-mail, telefone, endereço, data de nascimento, gênero, tipo sanguíneo e outros dados demográficos.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Dados de saúde:</strong> Histórico médico, diagnósticos, resultados de exames, medicamentos, alergias e outras informações de saúde relevantes para seu atendimento.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        <strong>Dados de uso:</strong> Informações sobre como você utiliza nossa plataforma, incluindo registros de acesso, páginas visitadas e funcionalidades utilizadas.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        2. COMO USAMOS SUAS INFORMAÇÕES
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Utilizamos suas informações para:
                    </Typography>

                    <List dense>
                        <ListItem>
                            <ListItemText primary="Fornecer e melhorar nossos serviços de saúde" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Agendar consultas e procedimentos médicos" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Manter seu histórico médico para referência e continuidade do cuidado" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Comunicar-se com você sobre seu atendimento" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Cumprir obrigações legais e regulatórias" />
                        </ListItem>
                    </List>

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        3. COMPARTILHAMENTO DE INFORMAÇÕES
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Podemos compartilhar suas informações com:
                    </Typography>

                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="Profissionais de saúde envolvidos em seu atendimento"
                                secondary="Médicos, enfermeiros e outros profissionais que precisam acessar suas informações para prestar cuidados"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Serviços de terceiros"
                                secondary="Laboratórios, farmácias e outros serviços necessários para seu tratamento"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Autoridades competentes"
                                secondary="Quando exigido por lei, ordem judicial ou regulamentação aplicável"
                            />
                        </ListItem>
                    </List>

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        4. SEGURANÇA DA INFORMAÇÃO
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações contra acesso não autorizado,
                        perda, alteração ou divulgação. Todos os dados são criptografados e armazenados com segurança.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        5. SEUS DIREITOS
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Você tem o direito de:
                    </Typography>

                    <List dense>
                        <ListItem>
                            <ListItemText primary="Acessar suas informações pessoais" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Corrigir informações imprecisas" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Solicitar a exclusão de suas informações (sujeito a retenção legal)" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Obter uma cópia de seus dados em formato portátil" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Opor-se ao processamento de seus dados em determinadas circunstâncias" />
                        </ListItem>
                    </List>

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        6. RETENÇÃO DE DADOS
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Retemos suas informações pelo tempo necessário para cumprir as finalidades para as quais foram coletadas,
                        incluindo obrigações legais, contábeis ou de relatórios.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        7. ALTERAÇÕES A ESTA POLÍTICA
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível em nossa plataforma.
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                        8. CONTATO
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais,
                        entre em contato conosco pelo e-mail: privacidade@vidaplus.com.br
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleClosePrivacyDialog}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        Entendi
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ConsentModal; 