import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Chip,
    Avatar,
    Button,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Search,
    MedicalServices,
    LocalHospital,
    Assignment,
    FilePresent,
    History,
    CalendarToday,
    Medication,
    Description,
    Download,
    Print,
    FilterList,
    AccessTime,
    KeyboardArrowDown,
    KeyboardArrowUp
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { MedicalRecordEntry, Prescription } from '../../types/medicalRecord';

const PatientMedicalHistory = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<MedicalRecordEntry[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<MedicalRecordEntry[]>([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
    const [recordDetailsExpanded, setRecordDetailsExpanded] = useState<{ [key: string]: boolean }>({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    // Buscar dados ao carregar a página
    useEffect(() => {
        if (user) {
            fetchMedicalRecords();
            fetchPrescriptions();
        }
    }, [user]);

    // Filtrar registros com base na busca
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredRecords(records);
            setFilteredPrescriptions(prescriptions);
        } else {
            const query = searchQuery.toLowerCase();

            // Filtrar prontuários
            const filteredMedicalRecords = records.filter(record =>
                record.title.toLowerCase().includes(query) ||
                record.description.toLowerCase().includes(query) ||
                (record.diagnosis && record.diagnosis.toLowerCase().includes(query)) ||
                (record.treatment && record.treatment.toLowerCase().includes(query)) ||
                record.type.toLowerCase().includes(query)
            );
            setFilteredRecords(filteredMedicalRecords);

            // Filtrar prescrições
            const filteredMeds = prescriptions.filter(prescription =>
                prescription.medications.some(med =>
                    med.name.toLowerCase().includes(query) ||
                    med.dosage.toLowerCase().includes(query) ||
                    med.instructions.toLowerCase().includes(query)
                ) ||
                prescription.instructions.toLowerCase().includes(query)
            );
            setFilteredPrescriptions(filteredMeds);
        }
    }, [searchQuery, records, prescriptions]);

    const fetchMedicalRecords = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/medical_records?patientId=${user?.id}`);
            // Ordenar por data (mais recente primeiro)
            const sortedRecords = response.data.sort((a: MedicalRecordEntry, b: MedicalRecordEntry) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setRecords(sortedRecords);
            setFilteredRecords(sortedRecords);

            // Inicializar o estado expandido para cada registro
            const expandedState: { [key: string]: boolean } = {};
            sortedRecords.forEach((record: MedicalRecordEntry) => {
                expandedState[record.id] = false;
            });
            setRecordDetailsExpanded(expandedState);
        } catch (error) {
            console.error('Erro ao buscar histórico médico:', error);
            showSnackbar('Erro ao carregar histórico médico', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/prescriptions?patientId=${user?.id}`);
            // Ordenar por data (mais recente primeiro)
            const sortedPrescriptions = response.data.sort((a: Prescription, b: Prescription) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setPrescriptions(sortedPrescriptions);
            setFilteredPrescriptions(sortedPrescriptions);
        } catch (error) {
            console.error('Erro ao buscar prescrições:', error);
            showSnackbar('Erro ao carregar prescrições médicas', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleOpenPrescriptionDialog = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setOpenPrescriptionDialog(true);
    };

    const handleClosePrescriptionDialog = () => {
        setOpenPrescriptionDialog(false);
    };

    const toggleRecordDetails = (recordId: string) => {
        setRecordDetailsExpanded(prev => ({
            ...prev,
            [recordId]: !prev[recordId]
        }));
    };

    const handlePrintPrescription = () => {
        if (!selectedPrescription) return;

        // Na implementação real isso abriria uma página de impressão formatada
        // Para este exemplo, apenas mostraremos uma notificação
        showSnackbar('Enviando prescrição para impressão...', 'info');

        setTimeout(() => {
            showSnackbar('Prescrição enviada para impressão com sucesso!', 'success');
            handleClosePrescriptionDialog();
        }, 1500);
    };

    const handleDownloadPrescription = () => {
        if (!selectedPrescription) return;

        // Na implementação real, isso geraria um PDF para download
        // Para este exemplo, apenas mostraremos uma notificação
        showSnackbar('Preparando download da prescrição em PDF...', 'info');

        setTimeout(() => {
            showSnackbar('Prescrição baixada com sucesso!', 'success');
            handleClosePrescriptionDialog();
        }, 1500);
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    const formatDateTime = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    };

    const getRecordTypeLabel = (type: string) => {
        switch (type) {
            case 'consultation':
                return { label: 'Consulta', color: 'primary' as const, icon: <MedicalServices /> };
            case 'exam':
                return { label: 'Exame', color: 'secondary' as const, icon: <Description /> };
            case 'procedure':
                return { label: 'Procedimento', color: 'info' as const, icon: <LocalHospital /> };
            default:
                return { label: 'Outro', color: 'default' as const, icon: <Assignment /> };
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Meu Histórico Médico
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Visualize seu histórico médico completo e todas as suas prescrições.
            </Typography>

            <Paper sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Buscar por diagnóstico, tipo de atendimento, medicamentos..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ p: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <Paper sx={{ mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab
                        icon={<Assignment sx={{ mr: 1 }} />}
                        label="Prontuário"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<Medication sx={{ mr: 1 }} />}
                        label="Prescrições"
                        iconPosition="start"
                    />
                </Tabs>

                {/* Aba de Prontuário */}
                <Box role="tabpanel" hidden={tabValue !== 0} sx={{ p: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredRecords.length > 0 ? (
                        <Grid container spacing={3}>
                            {filteredRecords.map((record) => {
                                const recordType = getRecordTypeLabel(record.type);
                                const isExpanded = recordDetailsExpanded[record.id];

                                return (
                                    <Grid item xs={12} key={record.id}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                avatar={
                                                    <Avatar sx={{ bgcolor: `${recordType.color}.main` }}>
                                                        {recordType.icon}
                                                    </Avatar>
                                                }
                                                title={
                                                    <Typography variant="h6">
                                                        {record.title}
                                                    </Typography>
                                                }
                                                subheader={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CalendarToday fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                {formatDate(record.date)}
                                                            </Typography>
                                                        </Box>
                                                        <Chip
                                                            size="small"
                                                            label={recordType.label}
                                                            color={recordType.color}
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </Box>
                                                }
                                                action={
                                                    <IconButton
                                                        onClick={() => toggleRecordDetails(record.id)}
                                                        aria-expanded={isExpanded}
                                                        aria-label="mostrar mais"
                                                    >
                                                        {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </IconButton>
                                                }
                                            />
                                            <Divider />
                                            <CardContent>
                                                <Typography variant="body1" paragraph>
                                                    {record.description}
                                                </Typography>

                                                {isExpanded && (
                                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                                        {record.diagnosis && (
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                                    Diagnóstico:
                                                                </Typography>
                                                                <Typography variant="body2" paragraph>
                                                                    {record.diagnosis}
                                                                </Typography>
                                                            </Grid>
                                                        )}

                                                        {record.symptoms && (
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                                    Sintomas:
                                                                </Typography>
                                                                <Typography variant="body2" paragraph>
                                                                    {record.symptoms}
                                                                </Typography>
                                                            </Grid>
                                                        )}

                                                        {record.treatment && (
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                                    Tratamento:
                                                                </Typography>
                                                                <Typography variant="body2" paragraph>
                                                                    {record.treatment}
                                                                </Typography>
                                                            </Grid>
                                                        )}

                                                        {record.notes && (
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                                    Observações:
                                                                </Typography>
                                                                <Typography variant="body2" paragraph>
                                                                    {record.notes}
                                                                </Typography>
                                                            </Grid>
                                                        )}

                                                        {record.prescriptions && record.prescriptions.length > 0 && (
                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                                                    Prescrições Associadas:
                                                                </Typography>
                                                                <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                                                    {record.prescriptions.map((prescription) => (
                                                                        <ListItem
                                                                            key={prescription.id}
                                                                            button
                                                                            onClick={() => handleOpenPrescriptionDialog(prescription)}
                                                                            divider
                                                                        >
                                                                            <ListItemAvatar>
                                                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                                                    <Medication />
                                                                                </Avatar>
                                                                            </ListItemAvatar>
                                                                            <ListItemText
                                                                                primary={`Prescrição de ${formatDate(prescription.date)}`}
                                                                                secondary={`${prescription.medications.length} medicamento(s)`}
                                                                            />
                                                                            <Chip
                                                                                size="small"
                                                                                label={
                                                                                    prescription.status === 'active' ? 'Ativa' :
                                                                                        prescription.status === 'expired' ? 'Expirada' : 'Cancelada'
                                                                                }
                                                                                color={
                                                                                    prescription.status === 'active' ? 'success' :
                                                                                        prescription.status === 'expired' ? 'warning' : 'error'
                                                                                }
                                                                            />
                                                                        </ListItem>
                                                                    ))}
                                                                </List>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                )}

                                                {!isExpanded && (
                                                    <Button
                                                        variant="text"
                                                        color="primary"
                                                        onClick={() => toggleRecordDetails(record.id)}
                                                        startIcon={<KeyboardArrowDown />}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        Ver detalhes
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Nenhum registro encontrado.
                            </Typography>
                            {searchQuery && (
                                <Typography variant="body2" color="text.secondary">
                                    Tente buscar por outros termos ou limpe o campo de busca.
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Aba de Prescrições */}
                <Box role="tabpanel" hidden={tabValue !== 1} sx={{ p: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredPrescriptions.length > 0 ? (
                        <Grid container spacing={3}>
                            {filteredPrescriptions.map((prescription) => (
                                <Grid item xs={12} sm={6} md={4} key={prescription.id}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: 3,
                                                cursor: 'pointer'
                                            }
                                        }}
                                        onClick={() => handleOpenPrescriptionDialog(prescription)}
                                    >
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <Medication />
                                                </Avatar>
                                            }
                                            title="Prescrição Médica"
                                            subheader={formatDateTime(prescription.date)}
                                            action={
                                                <Chip
                                                    size="small"
                                                    label={
                                                        prescription.status === 'active' ? 'Ativa' :
                                                            prescription.status === 'expired' ? 'Expirada' : 'Cancelada'
                                                    }
                                                    color={
                                                        prescription.status === 'active' ? 'success' :
                                                            prescription.status === 'expired' ? 'warning' : 'error'
                                                    }
                                                    sx={{ mt: 1 }}
                                                />
                                            }
                                        />
                                        <Divider />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Medicamentos:
                                            </Typography>
                                            <List dense disablePadding>
                                                {prescription.medications.slice(0, 3).map((medication, index) => (
                                                    <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                                        <ListItemText
                                                            primary={medication.name}
                                                            secondary={`${medication.dosage} - ${medication.frequency}`}
                                                            primaryTypographyProps={{ variant: 'body2' }}
                                                            secondaryTypographyProps={{ variant: 'caption' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                                {prescription.medications.length > 3 && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                        + {prescription.medications.length - 3} outros medicamentos
                                                    </Typography>
                                                )}
                                            </List>

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                <Button
                                                    size="small"
                                                    startIcon={<Assignment />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenPrescriptionDialog(prescription);
                                                    }}
                                                >
                                                    Ver detalhes
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Nenhuma prescrição encontrada.
                            </Typography>
                            {searchQuery && (
                                <Typography variant="body2" color="text.secondary">
                                    Tente buscar por outros termos ou limpe o campo de busca.
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Modal de detalhes da prescrição */}
            <Dialog
                open={openPrescriptionDialog}
                onClose={handleClosePrescriptionDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedPrescription && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    Prescrição Médica
                                </Typography>
                                <Chip
                                    label={
                                        selectedPrescription.status === 'active' ? 'Ativa' :
                                            selectedPrescription.status === 'expired' ? 'Expirada' : 'Cancelada'
                                    }
                                    color={
                                        selectedPrescription.status === 'active' ? 'success' :
                                            selectedPrescription.status === 'expired' ? 'warning' : 'error'
                                    }
                                    size="small"
                                />
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Data de Emissão
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(selectedPrescription.date)}
                                        </Typography>
                                    </Box>

                                    {selectedPrescription.expirationDate && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Validade
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(selectedPrescription.expirationDate)}
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Medicamentos Prescritos
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                                        {selectedPrescription.medications.map((medication, index) => (
                                            <Box key={index} sx={{ mb: index < selectedPrescription.medications.length - 1 ? 3 : 0 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {medication.name} - {medication.dosage}
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Frequência:</strong> {medication.frequency}
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Duração:</strong> {medication.duration}
                                                </Typography>
                                                {medication.instructions && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Instruções específicas:</strong> {medication.instructions}
                                                    </Typography>
                                                )}
                                                {index < selectedPrescription.medications.length - 1 && <Divider sx={{ my: 2 }} />}
                                            </Box>
                                        ))}
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Instruções Gerais
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="body1">
                                            {selectedPrescription.instructions}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleDownloadPrescription}
                                startIcon={<Download />}
                                color="primary"
                            >
                                Download PDF
                            </Button>
                            <Button
                                onClick={handlePrintPrescription}
                                startIcon={<Print />}
                                variant="contained"
                                color="primary"
                            >
                                Imprimir
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Snackbar para mensagens */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PatientMedicalHistory; 