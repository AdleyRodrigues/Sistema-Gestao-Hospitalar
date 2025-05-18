import { ArrowBack } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    FormControlLabel,
    Paper,
    Snackbar,
    Switch,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataDeletionRequest from '../../components/privacy/DataDeletionRequest';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`privacy-tabpanel-${index}`}
            aria-labelledby={`privacy-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const PrivacySettings = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [consentSettings, setConsentSettings] = useState({
        marketing: false,
        researchUse: false,
        thirdPartySharing: false,
        anonymousDataCollection: true
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleConsentChange = (setting: keyof typeof consentSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setConsentSettings({
            ...consentSettings,
            [setting]: event.target.checked
        });
    };

    const handleSaveConsent = () => {
        // Aqui seria feita a chamada para a API real
        // await api.put('/api/users/consent-settings', consentSettings);

        // Simulação de salvamento
        setSnackbarOpen(true);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{ mr: 2 }}
                    >
                        Voltar
                    </Button>
                    <Typography variant="h4" component="h1">
                        Configurações de Privacidade
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="configurações de privacidade">
                        <Tab label="Gerenciamento de Consentimento" id="privacy-tab-0" aria-controls="privacy-tabpanel-0" />
                        <Tab label="Exclusão de Dados" id="privacy-tab-1" aria-controls="privacy-tabpanel-1" />
                        <Tab label="Histórico de Solicitações" id="privacy-tab-2" aria-controls="privacy-tabpanel-2" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Typography variant="h6" gutterBottom>
                        Preferências de Consentimento
                    </Typography>
                    <Typography variant="body2" paragraph>
                        Gerencie como seus dados podem ser utilizados pelo sistema. Você pode alterar estas configurações a qualquer momento.
                    </Typography>

                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={consentSettings.marketing}
                                        onChange={handleConsentChange('marketing')}
                                    />
                                }
                                label="Aceito receber comunicações de marketing e novidades sobre serviços"
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 4 }}>
                                Você receberá e-mails sobre novidades, promoções e informações sobre saúde.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={consentSettings.researchUse}
                                        onChange={handleConsentChange('researchUse')}
                                    />
                                }
                                label="Autorizo o uso dos meus dados para pesquisa científica e estatística (de forma anonimizada)"
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 4 }}>
                                Seus dados serão usados apenas de forma anônima para estudos e melhorias em processos de saúde.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={consentSettings.thirdPartySharing}
                                        onChange={handleConsentChange('thirdPartySharing')}
                                    />
                                }
                                label="Autorizo o compartilhamento dos meus dados com parceiros de saúde"
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 4 }}>
                                Seus dados podem ser compartilhados com farmácias, laboratórios e outros prestadores de serviços de saúde.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ mb: 4 }}>
                        <CardContent>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={consentSettings.anonymousDataCollection}
                                        onChange={handleConsentChange('anonymousDataCollection')}
                                    />
                                }
                                label="Autorizo a coleta de dados anônimos de uso para melhorar o sistema"
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 4 }}>
                                Informações sobre como você utiliza o sistema serão coletadas para melhorarmos a interface e a experiência do usuário.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveConsent}
                        >
                            Salvar Preferências
                        </Button>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <DataDeletionRequest />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" gutterBottom>
                        Histórico de Solicitações
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Aqui você encontra o histórico de todas as suas solicitações relacionadas a dados pessoais.
                    </Typography>

                    <Card variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            Você ainda não realizou nenhuma solicitação.
                        </Typography>
                    </Card>
                </TabPanel>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Preferências de privacidade atualizadas com sucesso!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PrivacySettings; 