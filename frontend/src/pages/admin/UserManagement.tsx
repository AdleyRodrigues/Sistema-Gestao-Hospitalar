import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Add,
    Close,
    Delete,
    Edit,
    FilterAlt,
    HealthAndSafety,
    MedicalServices,
    Person,
    PersonAdd,
    PersonOff,
    Search,
    Visibility
} from '@mui/icons-material';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Interfaces para os usuários
interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    createdAt: string;
    specialty?: string;
    crm?: string;
    birthDate?: string;
    gender?: string;
    bloodType?: string;
    address?: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

const UserManagement = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const isExtraSmall = useMediaQuery('(max-width:400px)');

    // Estados para gerenciar os usuários e filtros
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado para formulário de usuário
    const [userForm, setUserForm] = useState<Partial<User>>({
        name: '',
        email: '',
        phone: '',
        role: 'patient',
        status: 'active',
    });

    // Estados para controles de UI
    const [searchTerm, setSearchTerm] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(false);

    // Carregar usuários da API
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            try {
                // Buscar todos os tipos de usuários
                const usersResponse = await api.get('/users');
                const patientsResponse = await api.get('/patients');
                const professionalsResponse = await api.get('/professionals');

                // Combinar e processar os dados para ter informações completas
                let allUsers = usersResponse.data || [];
                const patients = patientsResponse.data || [];
                const professionals = professionalsResponse.data || [];

                // Enriquecer os dados dos usuários com informações específicas
                allUsers = allUsers.map((user: User) => {
                    if (user.role === 'patient') {
                        const patientData = patients.find((p: User) => p.id === user.id);
                        return { ...user, ...patientData };
                    } else if (user.role === 'professional') {
                        const professionalData = professionals.find((p: User) => p.id === user.id);
                        return { ...user, ...professionalData };
                    }
                    return user;
                });

                setUsers(allUsers);
                setFilteredUsers(allUsers);
            } catch (err) {
                console.error('Erro ao buscar usuários:', err);
                setError('Erro ao carregar dados dos usuários. Por favor, tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Efeito para aplicar filtros
    useEffect(() => {
        let result = [...users];

        // Filtro por tab
        if (tabValue === 1) result = result.filter(user => user.role === 'patient');
        else if (tabValue === 2) result = result.filter(user => user.role === 'professional');
        else if (tabValue === 3) result = result.filter(user => user.role === 'admin');
        else if (tabValue === 4) result = result.filter(user => user.status === 'active');
        else if (tabValue === 5) result = result.filter(user => user.status === 'inactive');

        // Filtro por termo de busca
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                user =>
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    (user.phone && user.phone.includes(term))
            );
        }

        setFilteredUsers(result);
        setPage(0); // Reset para a primeira página ao filtrar
    }, [users, tabValue, searchTerm]);

    // Handlers
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = (edit: boolean = false, userId: string | null = null) => {
        setIsEdit(edit);

        if (edit && userId) {
            const userToEdit = users.find(u => u.id === userId);
            if (userToEdit) {
                setUserForm({
                    id: userToEdit.id,
                    name: userToEdit.name,
                    email: userToEdit.email,
                    phone: userToEdit.phone || '',
                    role: userToEdit.role,
                    status: userToEdit.status,
                    specialty: userToEdit.specialty || '',
                    crm: userToEdit.crm || '',
                    birthDate: userToEdit.birthDate || '',
                    gender: userToEdit.gender || '',
                    bloodType: userToEdit.bloodType || '',
                    // Não incluímos o endereço completo para simplificar, mas poderia ser adicionado
                });
                setSelectedUserId(userId);
            }
        } else {
            // Reset do formulário para novo usuário
            setUserForm({
                name: '',
                email: '',
                phone: '',
                role: 'patient',
                status: 'active',
                specialty: '',
                crm: '',
                birthDate: '',
                gender: '',
                bloodType: '',
            });
            setSelectedUserId(null);
        }

        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDeleteConfirm = (userId: string) => {
        setSelectedUserId(userId);
        setDeleteConfirmOpen(true);
    };

    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name) {
            setUserForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmitUser = async () => {
        try {
            if (isEdit && selectedUserId) {
                // Atualizar usuário existente
                await api.put(`/users/${selectedUserId}`, userForm);

                // Atualizar dados específicos dependendo do tipo de usuário
                if (userForm.role === 'patient') {
                    await api.put(`/patients/${selectedUserId}`, userForm);
                } else if (userForm.role === 'professional') {
                    await api.put(`/professionals/${selectedUserId}`, userForm);
                }

                // Atualizar estado local
                setUsers(prev =>
                    prev.map(u =>
                        u.id === selectedUserId ? { ...u, ...userForm } : u
                    )
                );

                alert('Usuário atualizado com sucesso!');
            } else {
                // Criar novo usuário
                // Em uma implementação real, geraria um ID único
                const newId = `user${Date.now()}`;
                const newUser = {
                    ...userForm,
                    id: newId,
                    createdAt: new Date().toISOString()
                };

                await api.post('/users', newUser);

                // Adicionar aos dados específicos
                if (userForm.role === 'patient') {
                    await api.post('/patients', newUser);
                } else if (userForm.role === 'professional') {
                    await api.post('/professionals', newUser);
                }

                // Atualizar estado local
                setUsers(prev => [...prev, newUser as User]);

                alert('Usuário criado com sucesso!');
            }

            handleCloseDialog();
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            alert('Erro ao salvar usuário. Por favor, tente novamente.');
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUserId) return;

        try {
            // Excluir usuário
            await api.delete(`/users/${selectedUserId}`);

            // Excluir dados específicos se necessário
            const userToDelete = users.find(u => u.id === selectedUserId);
            if (userToDelete) {
                if (userToDelete.role === 'patient') {
                    await api.delete(`/patients/${selectedUserId}`);
                } else if (userToDelete.role === 'professional') {
                    await api.delete(`/professionals/${selectedUserId}`);
                }
            }

            // Atualizar estado local
            setUsers(prev => prev.filter(u => u.id !== selectedUserId));

            alert('Usuário excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro ao excluir usuário. Por favor, tente novamente.');
        } finally {
            setDeleteConfirmOpen(false);
            setSelectedUserId(null);
        }
    };

    const handleViewUserDetails = (userId: string) => {
        const userToView = users.find(u => u.id === userId);
        if (!userToView) return;

        if (userToView.role === 'patient') {
            navigate(`/patient/profile/${userId}`);
        } else if (userToView.role === 'professional') {
            navigate(`/professional/profile/${userId}`);
        } else if (userToView.role === 'admin') {
            navigate(`/admin/profile/${userId}`);
        }
    };

    // Renderização de células da tabela
    const renderRoleCell = (role: string) => {
        let icon;
        let label;
        let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";

        switch (role) {
            case 'admin':
                icon = <Person />;
                label = 'Administrador';
                color = "secondary";
                break;
            case 'professional':
                icon = <MedicalServices />;
                label = 'Profissional';
                color = "primary";
                break;
            case 'patient':
                icon = <HealthAndSafety />;
                label = 'Paciente';
                color = "info";
                break;
            default:
                icon = <Person />;
                label = role;
        }

        return (
            <Chip
                icon={icon}
                label={label}
                size={isExtraSmall ? "small" : "medium"}
                color={color}
            />
        );
    };

    const renderStatusCell = (status: string) => {
        const isActive = status === 'active';

        return (
            <Chip
                icon={isActive ? <Person /> : <PersonOff />}
                label={isActive ? 'Ativo' : 'Inativo'}
                size={isExtraSmall ? "small" : "medium"}
                color={isActive ? "success" : "error"}
            />
        );
    };

    // Renderização do formulário de usuário baseado no tipo selecionado
    const renderUserDialogContent = () => {
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="Nome Completo"
                            name="name"
                            value={userForm.name || ''}
                            onChange={handleFormInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            type="email"
                            name="email"
                            value={userForm.email || ''}
                            onChange={handleFormInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Telefone"
                            name="phone"
                            value={userForm.phone || ''}
                            onChange={handleFormInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="user-role-label">Perfil</InputLabel>
                            <Select
                                labelId="user-role-label"
                                id="user-role"
                                name="role"
                                value={userForm.role || 'patient'}
                                onChange={handleFormInputChange}
                                label="Perfil"
                            >
                                <MenuItem value="patient">Paciente</MenuItem>
                                <MenuItem value="professional">Profissional de Saúde</MenuItem>
                                <MenuItem value="admin">Administrador</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="user-status-label">Status</InputLabel>
                            <Select
                                labelId="user-status-label"
                                id="user-status"
                                name="status"
                                value={userForm.status || 'active'}
                                onChange={handleFormInputChange}
                                label="Status"
                            >
                                <MenuItem value="active">Ativo</MenuItem>
                                <MenuItem value="inactive">Inativo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Campos específicos para Profissional de Saúde */}
                    {userForm.role === 'professional' && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Especialidade"
                                    name="specialty"
                                    value={userForm.specialty || ''}
                                    onChange={handleFormInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="CRM/Registro Profissional"
                                    name="crm"
                                    value={userForm.crm || ''}
                                    onChange={handleFormInputChange}
                                />
                            </Grid>
                        </>
                    )}

                    {/* Campos específicos para Pacientes */}
                    {userForm.role === 'patient' && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Data de Nascimento"
                                    name="birthDate"
                                    value={userForm.birthDate || ''}
                                    onChange={handleFormInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="user-gender-label">Gênero</InputLabel>
                                    <Select
                                        labelId="user-gender-label"
                                        id="user-gender"
                                        name="gender"
                                        value={userForm.gender || ''}
                                        onChange={handleFormInputChange}
                                        label="Gênero"
                                    >
                                        <MenuItem value="male">Masculino</MenuItem>
                                        <MenuItem value="female">Feminino</MenuItem>
                                        <MenuItem value="other">Outro</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="user-blood-label">Tipo Sanguíneo</InputLabel>
                                    <Select
                                        labelId="user-blood-label"
                                        id="user-blood"
                                        name="bloodType"
                                        value={userForm.bloodType || ''}
                                        onChange={handleFormInputChange}
                                        label="Tipo Sanguíneo"
                                    >
                                        <MenuItem value="A+">A+</MenuItem>
                                        <MenuItem value="A-">A-</MenuItem>
                                        <MenuItem value="B+">B+</MenuItem>
                                        <MenuItem value="B-">B-</MenuItem>
                                        <MenuItem value="AB+">AB+</MenuItem>
                                        <MenuItem value="AB-">AB-</MenuItem>
                                        <MenuItem value="O+">O+</MenuItem>
                                        <MenuItem value="O-">O-</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
                    )}
                </Grid>
            </>
        );
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                    <Typography variant={isSmall ? 'h5' : 'h4'} component="h1" sx={{ fontWeight: 'bold', mb: { xs: 1, sm: 0 } }}>
                        Gerenciamento de Usuários
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAdd />}
                        onClick={() => handleOpenDialog()}
                        size={isSmall ? "small" : "medium"}
                    >
                        Novo Usuário
                    </Button>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar por nome, email ou telefone..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            size={isSmall ? "small" : "medium"}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FilterAlt sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ mr: 2 }}>Filtros:</Typography>
                            <Chip
                                label={`Total: ${filteredUsers.length}`}
                                color="default"
                                size={isSmall ? "small" : "medium"}
                                sx={{ mr: 1 }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Todos" />
                    <Tab label="Pacientes" />
                    <Tab label="Profissionais" />
                    <Tab label="Administradores" />
                    <Tab label="Ativos" />
                    <Tab label="Inativos" />
                </Tabs>

                <TableContainer>
                    <Table sx={{ minWidth: 650 }} size={isSmall ? "small" : "medium"}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                {!isExtraSmall && <TableCell>Telefone</TableCell>}
                                <TableCell>Perfil</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell component="th" scope="row">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        {!isExtraSmall && <TableCell>{user.phone || '-'}</TableCell>}
                                        <TableCell>{renderRoleCell(user.role)}</TableCell>
                                        <TableCell>{renderStatusCell(user.status)}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Ver Detalhes">
                                                <IconButton
                                                    size={isExtraSmall ? "small" : "medium"}
                                                    onClick={() => handleViewUserDetails(user.id)}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    size={isExtraSmall ? "small" : "medium"}
                                                    color="primary"
                                                    onClick={() => handleOpenDialog(true, user.id)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Excluir">
                                                <IconButton
                                                    size={isExtraSmall ? "small" : "medium"}
                                                    color="error"
                                                    onClick={() => handleDeleteConfirm(user.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1" sx={{ py: 2 }}>
                                            Nenhum usuário encontrado.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Paper>

            {/* Dialog para adicionar/editar usuário */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isEdit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
                        <IconButton onClick={handleCloseDialog}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {renderUserDialogContent()}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitUser}
                        disabled={!userForm.name || !userForm.email}
                    >
                        {isEdit ? 'Atualizar' : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de confirmação de exclusão */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteUser}>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagement; 