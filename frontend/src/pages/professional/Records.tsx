import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Avatar,
    Chip,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Snackbar,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Person as PersonIcon,
    MedicalServices as MedicalServicesIcon,
    Biotech as BiotechIcon,
    LocalHospital as LocalHospitalIcon,
    Assignment as AssignmentIcon,
    AccessTime as AccessTimeIcon,
    Event as EventIcon,
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { MedicalRecordEntry, Patient, Prescription } from '../../types/medicalRecord';

interface MedicalRecord {
    id: number;
    patientId: number;
    patientName: string;
    patientAvatar?: string;
    date: string;
    type: 'Consulta' | 'Exame' | 'Cirurgia' | 'Retorno';
    diagnosis: string;
    prescription?: string;
    notes?: string;
    status: 'Concluído' | 'Em andamento' | 'Agendado';
}

const mockRecords: MedicalRecord[] = [
    {
        id: 1,
        patientId: 1,
        patientName: "Ana Silva",
        patientAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        date: "10/08/2023",
        type: "Consulta",
        diagnosis: "Hipertensão arterial controlada",
        prescription: "Losartana 50mg - 1 comprimido por dia",
        notes: "Paciente relatou melhora na pressão após início da atividade física",
        status: "Concluído"
    },
    {
        id: 2,
        patientId: 2,
        patientName: "João Santos",
        patientAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        date: "05/08/2023",
        type: "Exame",
        diagnosis: "Glicemia elevada",
        prescription: "Metformina 850mg - 2 comprimidos por dia",
        notes: "Encaminhado para nutricionista",
        status: "Concluído"
    },
    {
        id: 3,
        patientId: 3,
        patientName: "Maria Oliveira",
        patientAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        date: "15/08/2023",
        type: "Retorno",
        diagnosis: "Ansiedade",
        prescription: "Escitalopram 10mg - 1 comprimido por dia",
        notes: "Paciente relatou melhora nos sintomas de ansiedade",
        status: "Em andamento"
    },
    {
        id: 4,
        patientId: 4,
        patientName: "Pedro Ferreira",
        patientAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        date: "22/08/2023",
        type: "Cirurgia",
        diagnosis: "Hérnia inguinal bilateral",
        notes: "Procedimento cirúrgico agendado",
        status: "Agendado"
    },
    {
        id: 5,
        patientId: 5,
        patientName: "Carla Souza",
        patientAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
        date: "18/08/2023",
        type: "Consulta",
        diagnosis: "Cefaleia tensional",
        prescription: "Dipirona 1g - em caso de dor",
        notes: "Orientada a reduzir tempo de exposição a telas",
        status: "Concluído"
    }
];

const ProfessionalRecords = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [records, setRecords] = useState<MedicalRecordEntry[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecordEntry | null>(null);
    const [openRecordDialog, setOpenRecordDialog] = useState(false);
    const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });
    const [newRecord, setNewRecord] = useState<Partial<MedicalRecordEntry>>({
        type: 'consultation',
        title: '',
        description: '',
        diagnosis: '',
        symptoms: '',
        treatment: '',
        notes: ''
    });

    // Estado para a prescrição
    const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
        medications: [],
        instructions: '',
        status: 'active'
    });

    // Estado para um medicamento temporário
    const [tempMedication, setTempMedication] = useState({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(patient =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPatients(filtered);
        }
    }, [searchQuery, patients]);

    useEffect(() => {
        if (selectedPatient) {
            fetchPatientRecords(selectedPatient.id);
        }
    }, [selectedPatient]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/patients');
            setPatients(response.data);
            setFilteredPatients(response.data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
            showSnackbar('Erro ao carregar lista de pacientes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientRecords = async (patientId: string) => {
        setLoading(true);
        try {
            const response = await api.get(`/medical_records?patientId=${patientId}`);
            setRecords(response.data);
        } catch (error) {
            console.error('Erro ao buscar prontuário:', error);
            showSnackbar('Erro ao carregar prontuário do paciente', 'error');
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

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setTabValue(1); // Muda para a aba de prontuário
    };

    const handleOpenRecordDialog = (record: MedicalRecordEntry | null = null) => {
        if (record) {
            setSelectedRecord(record);
            setNewRecord({
                type: record.type,
                title: record.title,
                description: record.description,
                diagnosis: record.diagnosis || '',
                symptoms: record.symptoms || '',
                treatment: record.treatment || '',
                notes: record.notes || ''
            });
        } else {
            setSelectedRecord(null);
            setNewRecord({
                type: 'consultation',
                title: '',
                description: '',
                diagnosis: '',
                symptoms: '',
                treatment: '',
                notes: ''
            });
        }
        setOpenRecordDialog(true);
    };

    const handleCloseRecordDialog = () => {
        setOpenRecordDialog(false);
    };

    const handleOpenPrescriptionDialog = () => {
        setNewPrescription({
            medications: [],
            instructions: '',
            status: 'active'
        });
        setOpenPrescriptionDialog(true);
    };

    const handleClosePrescriptionDialog = () => {
        setOpenPrescriptionDialog(false);
    };

    const handleRecordInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target as { name: string; value: string };
        setNewRecord(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveRecord = async () => {
        if (!selectedPatient || !user) return;

        setLoading(true);

        try {
            const recordData = {
                ...newRecord,
                patientId: selectedPatient.id,
                professionalId: user.id,
                date: new Date().toISOString()
            };

            let response;

            if (selectedRecord) {
                // Atualizar prontuário existente
                response = await api.put(`/medical_records/${selectedRecord.id}`, {
                    ...selectedRecord,
                    ...recordData
                });
                showSnackbar('Prontuário atualizado com sucesso!', 'success');
            } else {
                // Criar novo prontuário
                response = await api.post('/medical_records', recordData);
                showSnackbar('Novo registro adicionado ao prontuário!', 'success');
            }

            // Atualiza a lista de prontuários
            fetchPatientRecords(selectedPatient.id);
            handleCloseRecordDialog();
        } catch (error) {
            console.error('Erro ao salvar prontuário:', error);
            showSnackbar('Erro ao salvar informações do prontuário', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMedicationInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setTempMedication(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMedication = () => {
        if (!tempMedication.name || !tempMedication.dosage) return;

        setNewPrescription(prev => ({
            ...prev,
            medications: [
                ...(prev.medications || []),
                {
                    id: Date.now().toString(), // ID temporário
                    ...tempMedication
                }
            ]
        }));

        // Limpa o formulário de medicamento
        setTempMedication({
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        });
    };

    const handleRemoveMedication = (index: number) => {
        const updatedMedications = [...(newPrescription.medications || [])];
        updatedMedications.splice(index, 1);
        setNewPrescription(prev => ({ ...prev, medications: updatedMedications }));
    };

    const handlePrescriptionInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewPrescription(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePrescription = async () => {
        if (!selectedPatient || !user || !selectedRecord) return;

        setLoading(true);

        try {
            const prescriptionData = {
                ...newPrescription,
                medicalRecordId: selectedRecord.id,
                patientId: selectedPatient.id,
                professionalId: user.id,
                date: new Date().toISOString(),
                expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
            };

            // Salvar prescrição
            const response = await api.post('/prescriptions', prescriptionData);

            // Atualizar o prontuário para incluir a referência à prescrição
            const updatedRecord = {
                ...selectedRecord,
                prescriptions: [
                    ...(selectedRecord.prescriptions || []),
                    response.data
                ]
            };

            await api.put(`/medical_records/${selectedRecord.id}`, updatedRecord);

            // Atualiza o prontuário atual
            fetchPatientRecords(selectedPatient.id);
            handleClosePrescriptionDialog();
            showSnackbar('Prescrição médica emitida com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar prescrição:', error);
            showSnackbar('Erro ao emitir prescrição médica', 'error');
        } finally {
            setLoading(false);
        }
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
        return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gerenciamento de Prontuários
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Acesse e gerencie os prontuários eletrônicos dos pacientes.
            </Typography>

            <Paper elevation={2} sx={{ mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Buscar Paciente" />
                    {selectedPatient && <Tab label={`Prontuário: ${selectedPatient.name}`} />}
                </Tabs>

                {/* Aba de busca de pacientes */}
                <Box role="tabpanel" hidden={tabValue !== 0} sx={{ p: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar paciente por nome ou e-mail"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map(patient => (
                                    <Grid item xs={12} sm={6} md={4} key={patient.id}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    boxShadow: 3,
                                                    transform: 'translateY(-4px)'
                                                }
                                            }}
                                            onClick={() => handleSelectPatient(patient)}
                                        >
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" component="div">
                                                            {patient.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {patient.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Divider sx={{ my: 1 }} />
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant="body2" component="div">
                                                        <strong>Telefone:</strong> {patient.phone}
                                                    </Typography>
                                                    <Typography variant="body2" component="div">
                                                        <strong>Data de Nasc.:</strong> {format(new Date(patient.birthDate), 'dd/MM/yyyy')}
                                                    </Typography>
                                                    <Typography variant="body2" component="div">
                                                        <strong>Tipo Sanguíneo:</strong> {patient.bloodType || 'Não informado'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ mt: 'auto', pt: 2 }}>
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        onClick={() => handleSelectPatient(patient)}
                                                    >
                                                        Acessar Prontuário
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="h6" color="text.secondary">
                                            Nenhum paciente encontrado.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Box>

                {/* Aba de prontuário do paciente */}
                <Box role="tabpanel" hidden={tabValue !== 1 || !selectedPatient} sx={{ p: 3 }}>
                    {selectedPatient && (
                        <>
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h5" gutterBottom>
                                        Prontuário de {selectedPatient.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Data de Nascimento:</strong> {format(new Date(selectedPatient.birthDate), 'dd/MM/yyyy')} |
                                        <strong> Tipo Sanguíneo:</strong> {selectedPatient.bloodType || 'Não informado'}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenRecordDialog()}
                                >
                                    Novo Registro
                                </Button>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : records.length > 0 ? (
                                <Grid container spacing={3}>
                                    {records.map(record => (
                                        <Grid item xs={12} key={record.id}>
                                            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor:
                                                                    record.type === 'consultation'
                                                                        ? 'primary.main'
                                                                        : record.type === 'exam'
                                                                            ? 'secondary.main'
                                                                            : 'info.main',
                                                                mr: 2
                                                            }}
                                                        >
                                                            {record.type === 'consultation' ? <MedicalServicesIcon /> :
                                                                record.type === 'exam' ? <BiotechIcon /> :
                                                                    <LocalHospitalIcon />}
                                                        </Avatar>
                                                        <Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="h6">
                                                                    {record.title}
                                                                </Typography>
                                                                <Chip
                                                                    size="small"
                                                                    label={
                                                                        record.type === 'consultation' ? 'Consulta' :
                                                                            record.type === 'exam' ? 'Exame' : 'Procedimento'
                                                                    }
                                                                    color={
                                                                        record.type === 'consultation' ? 'primary' :
                                                                            record.type === 'exam' ? 'secondary' : 'info'
                                                                    }
                                                                />
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {formatDate(record.date)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleOpenRecordDialog(record)}
                                                            size="small"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body1" paragraph>
                                                            {record.description}
                                                        </Typography>
                                                    </Grid>

                                                    {record.diagnosis && (
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="subtitle2" color="primary">
                                                                Diagnóstico:
                                                            </Typography>
                                                            <Typography variant="body2" paragraph>
                                                                {record.diagnosis}
                                                            </Typography>
                                                        </Grid>
                                                    )}

                                                    {record.symptoms && (
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="subtitle2" color="primary">
                                                                Sintomas:
                                                            </Typography>
                                                            <Typography variant="body2" paragraph>
                                                                {record.symptoms}
                                                            </Typography>
                                                        </Grid>
                                                    )}

                                                    {record.treatment && (
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="subtitle2" color="primary">
                                                                Tratamento:
                                                            </Typography>
                                                            <Typography variant="body2" paragraph>
                                                                {record.treatment}
                                                            </Typography>
                                                        </Grid>
                                                    )}

                                                    {record.notes && (
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="subtitle2" color="primary">
                                                                Observações:
                                                            </Typography>
                                                            <Typography variant="body2" paragraph>
                                                                {record.notes}
                                                            </Typography>
                                                        </Grid>
                                                    )}
                                                </Grid>

                                                {/* Prescrições */}
                                                {record.prescriptions && record.prescriptions.length > 0 && (
                                                    <>
                                                        <Divider sx={{ my: 2 }} />
                                                        <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                                                            Prescrições Médicas
                                                        </Typography>

                                                        <Grid container spacing={1}>
                                                            {record.prescriptions.map(prescription => (
                                                                <Grid item xs={12} key={prescription.id}>
                                                                    <Card variant="outlined" sx={{ mb: 1 }}>
                                                                        <CardContent>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <Typography variant="subtitle2">
                                                                                    Emitida em: {format(new Date(prescription.date), 'dd/MM/yyyy')}
                                                                                </Typography>
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
                                                                            </Box>

                                                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                                                <strong>Medicamentos:</strong>
                                                                            </Typography>
                                                                            <ul>
                                                                                {prescription.medications.map((med, index) => (
                                                                                    <li key={index}>
                                                                                        <Typography variant="body2">
                                                                                            {med.name} - {med.dosage} ({med.frequency}) - {med.duration}
                                                                                        </Typography>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>

                                                                            <Typography variant="body2">
                                                                                <strong>Instruções:</strong> {prescription.instructions}
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </>
                                                )}

                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<MedicalServicesIcon />}
                                                        onClick={() => {
                                                            setSelectedRecord(record);
                                                            handleOpenPrescriptionDialog();
                                                        }}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Emitir Prescrição
                                                    </Button>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Nenhum registro encontrado para este paciente.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpenRecordDialog()}
                                        sx={{ mt: 2 }}
                                    >
                                        Adicionar Primeiro Registro
                                    </Button>
                                </Paper>
                            )}
                        </>
                    )}
                </Box>
            </Paper>

            {/* Modal para adicionar/editar prontuário */}
            <Dialog
                open={openRecordDialog}
                onClose={handleCloseRecordDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedRecord ? 'Editar Registro de Prontuário' : 'Novo Registro de Prontuário'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="record-type-label">Tipo de Registro</InputLabel>
                                <Select
                                    labelId="record-type-label"
                                    id="record-type"
                                    name="type"
                                    value={newRecord.type}
                                    onChange={handleRecordInputChange}
                                    label="Tipo de Registro"
                                >
                                    <MenuItem value="consultation">Consulta</MenuItem>
                                    <MenuItem value="exam">Exame</MenuItem>
                                    <MenuItem value="procedure">Procedimento</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Título"
                                name="title"
                                value={newRecord.title}
                                onChange={handleRecordInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descrição"
                                name="description"
                                value={newRecord.description}
                                onChange={handleRecordInputChange}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Diagnóstico"
                                name="diagnosis"
                                value={newRecord.diagnosis}
                                onChange={handleRecordInputChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sintomas"
                                name="symptoms"
                                value={newRecord.symptoms}
                                onChange={handleRecordInputChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tratamento"
                                name="treatment"
                                value={newRecord.treatment}
                                onChange={handleRecordInputChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Observações"
                                name="notes"
                                value={newRecord.notes}
                                onChange={handleRecordInputChange}
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRecordDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveRecord}
                        variant="contained"
                        disabled={!newRecord.title || !newRecord.description || loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {selectedRecord ? 'Atualizar' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para prescrições */}
            <Dialog
                open={openPrescriptionDialog}
                onClose={handleClosePrescriptionDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Nova Prescrição Médica
                </DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle2" color="primary" sx={{ mb: 2, mt: 1 }}>
                        Adicionar Medicamentos
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nome do Medicamento"
                                name="name"
                                value={tempMedication.name}
                                onChange={handleMedicationInputChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dosagem (ex: 500mg)"
                                name="dosage"
                                value={tempMedication.dosage}
                                onChange={handleMedicationInputChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Frequência (ex: 8/8h)"
                                name="frequency"
                                value={tempMedication.frequency}
                                onChange={handleMedicationInputChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Duração (ex: 7 dias)"
                                name="duration"
                                value={tempMedication.duration}
                                onChange={handleMedicationInputChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleAddMedication}
                                    disabled={!tempMedication.name || !tempMedication.dosage}
                                    fullWidth
                                    startIcon={<AddIcon />}
                                >
                                    Adicionar
                                </Button>
                            </Box>
                        </Grid>

                        {tempMedication.name && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instruções Específicas"
                                    name="instructions"
                                    value={tempMedication.instructions}
                                    onChange={handleMedicationInputChange}
                                    size="small"
                                    placeholder="Ex: Tomar após as refeições"
                                />
                            </Grid>
                        )}
                    </Grid>

                    {newPrescription.medications && newPrescription.medications.length > 0 && (
                        <>
                            <Typography variant="subtitle2" color="primary" sx={{ mt: 3, mb: 1 }}>
                                Medicamentos na Prescrição
                            </Typography>

                            <List dense>
                                {newPrescription.medications.map((med, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <IconButton edge="end" onClick={() => handleRemoveMedication(index)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        }
                                        divider
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <MedicalServicesIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${med.name} - ${med.dosage}`}
                                            secondary={`${med.frequency} - ${med.duration} ${med.instructions ? `- ${med.instructions}` : ''}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    )}

                    <Typography variant="subtitle2" color="primary" sx={{ mt: 3, mb: 1 }}>
                        Instruções Gerais
                    </Typography>

                    <TextField
                        fullWidth
                        label="Instruções para o paciente"
                        name="instructions"
                        value={newPrescription.instructions}
                        onChange={handlePrescriptionInputChange}
                        multiline
                        rows={3}
                        placeholder="Ex: Manter repouso, ingerir bastante água, retornar em caso de piora..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePrescriptionDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSavePrescription}
                        variant="contained"
                        disabled={
                            !newPrescription.medications?.length ||
                            !newPrescription.instructions ||
                            loading
                        }
                        startIcon={loading && <CircularProgress size={20} />}
                        color="primary"
                    >
                        Emitir Prescrição
                    </Button>
                </DialogActions>
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

export default ProfessionalRecords; 