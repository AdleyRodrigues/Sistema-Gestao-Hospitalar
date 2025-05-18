import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Paper,
    Snackbar,
    TextField,
    Typography,
    Alert
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const DataDeletionRequest = () => {
    useAuth();
    const theme = useTheme();
    const isExtraSmall = useMediaQuery('(max-width:400px)');
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [understand, setUnderstand] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDeleteReason('');
        setUnderstand(false);
    };

    const handleOpenConfirmDialog = () => {
        setOpenDialog(false);
        setConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialog(false);
    };

    const handleDeleteRequest = async () => {
        setLoading(true);

        try {
            // Aqui seria feita a chamada para a API real
            // await api.post('/api/users/deletion-request', {
            //   userId: user?.id,
            //   reason: deleteReason
            // });

            // Simulando uma chamada à API
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSnackbarMessage('Solicitação enviada com sucesso. Nossa equipe entrará em contato em até 5 dias úteis.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            handleCloseConfirmDialog();
            setDeleteReason('');
            setUnderstand(false);
        } catch {
            setSnackbarMessage('Erro ao enviar solicitação. Tente novamente mais tarde.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box>
            <Paper elevation={2} sx={{ p: isExtraSmall ? 2 : isSmall ? 2.5 : 3, mb: isSmall ? 3 : 4 }}>
                <Typography
                    variant={isExtraSmall ? "h6" : "h5"}
                    gutterBottom
                    color="primary"
                >
                    Exclusão de Dados Pessoais
                </Typography>
                <Divider sx={{ mb: isSmall ? 2 : 3 }} />

                <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontSize: isExtraSmall ? '0.9rem' : 'inherit' }}
                >
                    Conforme previsto na Lei Geral de Proteção de Dados (LGPD), você tem o direito de solicitar
                    a exclusão dos seus dados pessoais do nosso sistema.
                </Typography>

                <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontSize: isExtraSmall ? '0.9rem' : 'inherit' }}
                >
                    Ao solicitar a exclusão, é importante entender:
                </Typography>

                <Box component="ul" sx={{ pl: isExtraSmall ? 3 : 4, mb: isSmall ? 2 : 3 }}>
                    <Typography
                        component="li"
                        variant="body1"
                        paragraph
                        sx={{ fontSize: isExtraSmall ? '0.9rem' : 'inherit', mb: isExtraSmall ? 1 : 2 }}
                    >
                        A exclusão pode levar até 30 dias para ser processada.
                    </Typography>
                    <Typography
                        component="li"
                        variant="body1"
                        paragraph
                        sx={{ fontSize: isExtraSmall ? '0.9rem' : 'inherit', mb: isExtraSmall ? 1 : 2 }}
                    >
                        Alguns dados não poderão ser excluídos devido a obrigações legais ou regulatórias
                        (como registros médicos que devem ser mantidos por pelo menos 20 anos).
                    </Typography>
                    <Typography
                        component="li"
                        variant="body1"
                        paragraph
                        sx={{ fontSize: isExtraSmall ? '0.9rem' : 'inherit', mb: isExtraSmall ? 1 : 2 }}
                    >
                        Sua conta e acesso ao sistema serão desativados permanentemente.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleOpenDialog}
                    sx={{ mt: 2 }}
                >
                    Solicitar Exclusão de Dados
                </Button>
            </Paper>

            {/* Informações sobre dados armazenados */}
            <Card variant="outlined" sx={{ mb: isSmall ? 3 : 4 }}>
                <CardContent sx={{ p: isExtraSmall ? 2 : 3 }}>
                    <Typography
                        variant={isExtraSmall ? "subtitle1" : "h6"}
                        gutterBottom
                        color="primary"
                    >
                        Dados Armazenados no Sistema
                    </Typography>

                    <Typography
                        variant={isExtraSmall ? "subtitle2" : "subtitle1"}
                        gutterBottom
                        sx={{ mt: isSmall ? 1.5 : 2 }}
                    >
                        Dados Pessoais:
                    </Typography>
                    <Box component="ul" sx={{ pl: isExtraSmall ? 3 : 4, mb: isSmall ? 2 : 3 }}>
                        <Typography component="li" variant="body2">Nome Completo</Typography>
                        <Typography component="li" variant="body2">CPF/RG</Typography>
                        <Typography component="li" variant="body2">Data de Nascimento</Typography>
                        <Typography component="li" variant="body2">Endereço</Typography>
                        <Typography component="li" variant="body2">Telefone</Typography>
                        <Typography component="li" variant="body2">Email</Typography>
                    </Box>

                    <Typography
                        variant={isExtraSmall ? "subtitle2" : "subtitle1"}
                        gutterBottom
                    >
                        Dados de Saúde:
                    </Typography>
                    <Box component="ul" sx={{ pl: isExtraSmall ? 3 : 4, mb: isSmall ? 2 : 3 }}>
                        <Typography component="li" variant="body2">Histórico Médico</Typography>
                        <Typography component="li" variant="body2">Resultados de Exames</Typography>
                        <Typography component="li" variant="body2">Histórico de Consultas</Typography>
                        <Typography component="li" variant="body2">Tratamentos Realizados</Typography>
                        <Typography component="li" variant="body2">Medicações Receitadas</Typography>
                    </Box>

                    <Typography
                        variant={isExtraSmall ? "subtitle2" : "subtitle1"}
                        gutterBottom
                    >
                        Dados de Uso do Sistema:
                    </Typography>
                    <Box component="ul" sx={{ pl: isExtraSmall ? 3 : 4 }}>
                        <Typography component="li" variant="body2">Logs de Acesso</Typography>
                        <Typography component="li" variant="body2">Preferências de Usuário</Typography>
                        <Typography component="li" variant="body2">Histórico de Agendamentos</Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Diálogo inicial de solicitação */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="deletion-dialog-title"
                maxWidth="sm"
                fullWidth
                fullScreen={isExtraSmall}
                PaperProps={{
                    sx: {
                        borderRadius: isExtraSmall ? 0 : 2,
                        m: isExtraSmall ? 0 : isSmall ? 1 : 2
                    }
                }}
            >
                <DialogTitle id="deletion-dialog-title" sx={{ pt: isExtraSmall ? 2 : 3 }}>
                    Solicitar Exclusão de Dados
                </DialogTitle>
                <DialogContent sx={{ px: isExtraSmall ? 2 : 3 }}>
                    <DialogContentText component="div" sx={{ mb: 3 }}>
                        <Typography variant="body1" paragraph>
                            Esta ação irá iniciar o processo de exclusão dos seus dados pessoais do nosso sistema,
                            conforme permitido pela LGPD.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Importante:</strong> A exclusão é irreversível e você perderá o acesso ao sistema.
                        </Typography>
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="deletion-reason"
                        label="Motivo da solicitação (opcional)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={understand}
                                    onChange={(e) => setUnderstand(e.target.checked)}
                                />
                            }
                            label="Entendo que esta ação é permanente e que alguns dados podem ser mantidos por obrigações legais."
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions sx={{
                    px: isExtraSmall ? 2 : 3,
                    pb: isExtraSmall ? 2 : 3,
                    flexDirection: isExtraSmall ? 'column' : 'row',
                    gap: isExtraSmall ? 1 : 0
                }}>
                    <Button
                        onClick={handleCloseDialog}
                        color="primary"
                        fullWidth={isExtraSmall}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleOpenConfirmDialog}
                        color="error"
                        variant="contained"
                        disabled={!understand}
                        fullWidth={isExtraSmall}
                    >
                        Continuar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmação final */}
            <Dialog
                open={confirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="confirmation-dialog-title"
                maxWidth="xs"
                fullWidth
                fullScreen={isExtraSmall}
                PaperProps={{
                    sx: {
                        borderRadius: isExtraSmall ? 0 : 2,
                        m: isExtraSmall ? 0 : isSmall ? 1 : 2
                    }
                }}
            >
                <DialogTitle id="confirmation-dialog-title" color="error" sx={{ pt: isExtraSmall ? 2 : 3 }}>
                    Confirmação Final
                </DialogTitle>
                <DialogContent sx={{ px: isExtraSmall ? 2 : 3 }}>
                    <DialogContentText>
                        Tem certeza que deseja solicitar a exclusão de seus dados? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{
                    px: isExtraSmall ? 2 : 3,
                    pb: isExtraSmall ? 2 : 3,
                    flexDirection: isExtraSmall ? 'column' : 'row',
                    gap: isExtraSmall ? 1 : 0
                }}>
                    <Button
                        onClick={handleCloseConfirmDialog}
                        color="primary"
                        fullWidth={isExtraSmall}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteRequest}
                        color="error"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={isExtraSmall ? 16 : 20} color="inherit" />}
                        fullWidth={isExtraSmall}
                    >
                        {loading ? 'Processando...' : 'Confirmar Exclusão'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar de notificação */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DataDeletionRequest; 