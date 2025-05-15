import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Button,
    Chip,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Tooltip,
    Snackbar,
    Alert,
    FormHelperText,
    Menu
} from '@mui/material';
import {
    Search,
    PersonAdd,
    Edit,
    Delete,
    MoreVert,
    Mail,
    Phone,
    LocationOn,
    MedicalServices,
    Person,
    CalendarMonth,
    School,
    WorkOutline,
    HealthAndSafety,
    Visibility,
    VisibilityOff,
    FilterList,
    Refresh,
    CloudDownload,
    Print
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';

// Tipos
interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'professional' | 'patient';
    status: 'active' | 'inactive';
    createdAt: string;
}

interface Patient extends User {
    birthDate: string;
    gender: string;
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

interface Professional extends User {
    specialty: string;
    crm?: string;
    availableDays: number[];
    startTime: string;
    endTime: string;
}

const AdminUserManagement = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    // Formulário de usuário
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'patient',
        status: 'active',
        specialty: '',
        crm: '',
        birthDate: '',
        gender: 'male',
        bloodType: '',
        address: {
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });

    // Erros do formulário
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        specialty: '',
        crm: '',
        birthDate: ''
    });

    // Status de filtro
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    useEffect(() => {
        fetchUsers();
    }, [tabValue]);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, users, tabValue, statusFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Determina qual endpoint usar com base na aba selecionada
            let endpoint = '';
            switch (tabValue) {
                case 0:
                    endpoint = '/users';
                    break;
                case 1:
                    endpoint = '/patients';
                    break;
                case 2:
                    endpoint = '/professionals';
                    break;
                case 3:
                    endpoint = '/users?role=admin';
                    break;
                default:
                    endpoint = '/users';
            }

            const response = await api.get(endpoint);
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            showSnackbar('Erro ao carregar lista de usuários', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        // Aplica os filtros (busca por texto e status)
        let filtered = users;

        // Filtra por status se não for "todos"
        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        // Filtra pelo termo de busca
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                user =>
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    (user as Professional).specialty?.toLowerCase().includes(term)
            );
        }

        setFilteredUsers(filtered);
        setPage(0); // Reseta para a primeira página ao filtrar
    };

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

    const handleFormInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target as { name: string; value: unknown };

        // Verifica se é um campo aninhado (endereço)
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setUserForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof typeof prev] as object,
                    [child]: value
                }
            }));
        } else {
            setUserForm(prev => ({ ...prev, [name]: value }));
        }

        // Limpa o erro do campo
        if (name in formErrors) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleOpenAddUserDialog = () => {
        // Reseta o formulário
        setUserForm({
            name: '',
            email: '',
            phone: '',
            password: '',
            role: tabValue === 1 ? 'patient' : tabValue === 2 ? 'professional' : 'patient',
            status: 'active',
            specialty: '',
            crm: '',
            birthDate: '',
            gender: 'male',
            bloodType: '',
            address: {
                street: '',
                number: '',
                neighborhood: '',
                city: '',
                state: '',
                zipCode: ''
            }
        });
        setFormErrors({
            name: '',
            email: '',
            phone: '',
            password: '',
            specialty: '',
            crm: '',
            birthDate: ''
        });
        setSelectedUser(null);
        setOpenUserDialog(true);
    };

    const handleOpenEditUserDialog = (user: User) => {
        setSelectedUser(user);

        // Preenche o formulário com os dados do usuário
        setUserForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            password: '', // Não preenche a senha para edição
            role: user.role,
            status: user.status,
            specialty: (user as Professional).specialty || '',
            crm: (user as Professional).crm || '',
            birthDate: (user as Patient).birthDate || '',
            gender: (user as Patient).gender || 'male',
            bloodType: (user as Patient).bloodType || '',
            address: (user as Patient).address || {
                street: '',
                number: '',
                neighborhood: '',
                city: '',
                state: '',
                zipCode: ''
            }
        });

        setFormErrors({
            name: '',
            email: '',
            phone: '',
            password: '',
            specialty: '',
            crm: '',
            birthDate: ''
        });

        setOpenUserDialog(true);
    };

    const handleCloseUserDialog = () => {
        setOpenUserDialog(false);
    };

    const handleOpenDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, userId: string) => {
        setActionMenuAnchorEl(event.currentTarget);
        setSelectedRow(userId);
    };

    const handleCloseActionMenu = () => {
        setActionMenuAnchorEl(null);
        setSelectedRow(null);
    };

    const handleOpenFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
        setFilterMenuAnchorEl(event.currentTarget);
    };

    const handleCloseFilterMenu = () => {
        setFilterMenuAnchorEl(null);
    };

    const handleFilterByStatus = (status: 'all' | 'active' | 'inactive') => {
        setStatusFilter(status);
        handleCloseFilterMenu();
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {
            name: '',
            email: '',
            phone: '',
            password: '',
            specialty: '',
            crm: '',
            birthDate: ''
        };

        // Validações básicas
        if (!userForm.name.trim()) {
            errors.name = 'O nome é obrigatório';
            isValid = false;
        }

        if (!userForm.email.trim()) {
            errors.email = 'O e-mail é obrigatório';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
            errors.email = 'E-mail inválido';
            isValid = false;
        }

        if (!userForm.phone.trim()) {
            errors.phone = 'O telefone é obrigatório';
            isValid = false;
        }

        // Senha é obrigatória apenas para novos usuários
        if (!selectedUser && !userForm.password.trim()) {
            errors.password = 'A senha é obrigatória';
            isValid = false;
        }

        // Validações específicas por tipo de usuário
        if (userForm.role === 'professional') {
            if (!userForm.specialty.trim()) {
                errors.specialty = 'A especialidade é obrigatória';
                isValid = false;
            }

            if (!userForm.crm?.trim()) {
                errors.crm = 'O registro profissional é obrigatório';
                isValid = false;
            }
        }

        if (userForm.role === 'patient') {
            if (!userForm.birthDate) {
                errors.birthDate = 'A data de nascimento é obrigatória';
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSaveUser = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Prepara os dados específicos com base no tipo de usuário
            let userData: any = {
                name: userForm.name,
                email: userForm.email,
                phone: userForm.phone,
                role: userForm.role,
                status: userForm.status
            };

            // Adiciona senha apenas para novos usuários
            if (!selectedUser && userForm.password) {
                userData.password = userForm.password;
            }

            // Adiciona dados específicos de paciente
            if (userForm.role === 'patient') {
                userData = {
                    ...userData,
                    birthDate: userForm.birthDate,
                    gender: userForm.gender,
                    bloodType: userForm.bloodType,
                    address: userForm.address
                };
            }

            // Adiciona dados específicos de profissional
            if (userForm.role === 'professional') {
                userData = {
                    ...userData,
                    specialty: userForm.specialty,
                    crm: userForm.crm,
                    // Valores padrão para disponibilidade
                    availableDays: [1, 2, 3, 4, 5], // Segunda a sexta
                    startTime: '08:00',
                    endTime: '18:00',
                    appointmentDuration: 30 // 30 minutos por consulta
                };
            }

            // Determina o endpoint com base no tipo de usuário
            const endpoint = userForm.role === 'patient'
                ? '/patients'
                : userForm.role === 'professional'
                    ? '/professionals'
                    : '/users';

            if (selectedUser) {
                // Atualização
                await api.put(`${endpoint}/${selectedUser.id}`, userData);
                showSnackbar('Usuário atualizado com sucesso!', 'success');
            } else {
                // Criação
                await api.post(endpoint, userData);
                showSnackbar('Usuário criado com sucesso!', 'success');
            }

            handleCloseUserDialog();
            fetchUsers(); // Atualiza a lista
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            showSnackbar('Erro ao salvar usuário. Verifique os dados e tente novamente.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            // Determina o endpoint com base no tipo de usuário
            const endpoint = selectedUser.role === 'patient'
                ? '/patients'
                : selectedUser.role === 'professional'
                    ? '/professionals'
                    : '/users';

            await api.delete(`${endpoint}/${selectedUser.id}`);

            showSnackbar('Usuário excluído com sucesso!', 'success');
            handleCloseDeleteDialog();
            fetchUsers(); // Atualiza a lista
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            showSnackbar('Erro ao excluir usuário', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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

    const renderUserDialogContent = () => {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Nome Completo"
                        name="name"
                        value={userForm.name}
                        onChange={handleFormInputChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="E-mail"
                        name="email"
                        type="email"
                        value={userForm.email}
                        onChange={handleFormInputChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Telefone"
                        name="phone"
                        value={userForm.phone}
                        onChange={handleFormInputChange}
                        error={!!formErrors.phone}
                        helperText={formErrors.phone}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Senha"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={userForm.password}
                        onChange={handleFormInputChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password || (selectedUser ? 'Deixe em branco para manter a senha atual' : '')}
                        required={!selectedUser}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="user-role-label">Perfil</InputLabel>
                        <Select
                            labelId="user-role-label"
                            id="user-role"
                            name="role"
                            value={userForm.role}
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
                            value={userForm.status}
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
                                value={userForm.specialty}
                                onChange={handleFormInputChange}
                                error={!!formErrors.specialty}
                                helperText={formErrors.specialty}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="CRM/Registro Profissional"
                                name="crm"
                                value={userForm.crm}
                                onChange={handleFormInputChange}
                                error={!!formErrors.crm}
                                helperText={formErrors.crm}
                                required
                            />
                        </Grid>
                    </>
                )}

                {/* Campos específicos para Paciente */}
                {userForm.role === 'patient' && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Data de Nascimento"
                                name="birthDate"
                                type="date"
                                value={userForm.birthDate}
                                onChange={handleFormInputChange}
                                error={!!formErrors.birthDate}
                                helperText={formErrors.birthDate}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="gender-label">Gênero</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={userForm.gender}
                                    onChange={handleFormInputChange}
                                    label="Gênero"
                                >
                                    <MenuItem value="male">Masculino</MenuItem>
                                    <MenuItem value="female">Feminino</MenuItem>
                                    <MenuItem value="other">Outro</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tipo Sanguíneo"
                                name="bloodType"
                                value={userForm.bloodType}
                                onChange={handleFormInputChange}
                                placeholder="Ex: A+, O-, AB+"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                                Endereço
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <TextField
                                fullWidth
                                label="Rua"
                                name="address.street"
                                value={userForm.address.street}
                                onChange={handleFormInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Número"
                                name="address.number"
                                value={userForm.address.number}
                                onChange={handleFormInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Bairro"
                                name="address.neighborhood"
                                value={userForm.address.neighborhood}
                                onChange={handleFormInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Cidade"
                                name="address.city"
                                value={userForm.address.city}
                                onChange={handleFormInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="Estado"
                                name="address.state"
                                value={userForm.address.state}
                                onChange={handleFormInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="CEP"
                                name="address.zipCode"
                                value={userForm.address.zipCode}
                                onChange={handleFormInputChange}
                            />
                        </Grid>
                    </>
                )}
            </Grid>
        );
    };

    // Obtém o ícone adequado para o perfil
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Person />;
            case 'professional':
                return <MedicalServices />;
            case 'patient':
                return <HealthAndSafety />;
            default:
                return <Person />;
        }
    };

    // Obtém o texto do perfil
    const getRoleText = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'professional':
                return 'Profissional';
            case 'patient':
                return 'Paciente';
            default:
                return role;
        }
    };

    // Obtém o texto do status
    const getStatusText = (status: string) => {
        return status === 'active' ? 'Ativo' : 'Inativo';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Gerenciamento de Usuários
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAdd />}
                    onClick={handleOpenAddUserDialog}
                >
                    Novo Usuário
                </Button>
            </Box>

            <Paper sx={{ mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Todos" />
                    <Tab label="Pacientes" />
                    <Tab label="Profissionais" />
                    <Tab label="Administradores" />
                </Tabs>

                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField
                        placeholder="Buscar por nome, email ou especialidade..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ width: '100%', maxWidth: 500 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ display: 'flex', ml: 2 }}>
                        <Button
                            startIcon={<FilterList />}
                            onClick={handleOpenFilterMenu}
                            variant="outlined"
                        >
                            Filtros
                        </Button>
                        <Menu
                            anchorEl={filterMenuAnchorEl}
                            open={Boolean(filterMenuAnchorEl)}
                            onClose={handleCloseFilterMenu}
                        >
                            <MenuItem onClick={() => handleFilterByStatus('all')}>
                                Todos os Status
                            </MenuItem>
                            <MenuItem onClick={() => handleFilterByStatus('active')}>
                                Apenas Ativos
                            </MenuItem>
                            <MenuItem onClick={() => handleFilterByStatus('inactive')}>
                                Apenas Inativos
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>E-mail</TableCell>
                                        <TableCell>Telefone</TableCell>
                                        <TableCell>Perfil</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Data de Cadastro</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((user) => (
                                                <TableRow key={user.id} hover>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ mr: 2, bgcolor: user.role === 'admin' ? 'primary.main' : user.role === 'professional' ? 'secondary.main' : 'success.main' }}>
                                                                {user.name.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="body2">
                                                                {user.name}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Mail fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                                                            <Typography variant="body2">
                                                                {user.email}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Phone fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                                                            <Typography variant="body2">
                                                                {user.phone || 'Não informado'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={getRoleIcon(user.role)}
                                                            label={getRoleText(user.role)}
                                                            size="small"
                                                            color={
                                                                user.role === 'admin'
                                                                    ? 'primary'
                                                                    : user.role === 'professional'
                                                                        ? 'secondary'
                                                                        : 'success'
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={getStatusText(user.status)}
                                                            size="small"
                                                            color={user.status === 'active' ? 'success' : 'error'}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CalendarMonth fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                                                            <Typography variant="body2">
                                                                {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                handleOpenActionMenu(e, user.id);
                                                                setSelectedUser(user);
                                                            }}
                                                        >
                                                            <MoreVert />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body1" color="text.secondary">
                                                    Nenhum usuário encontrado
                                                </Typography>
                                                {searchTerm && (
                                                    <Button
                                                        variant="text"
                                                        onClick={() => setSearchTerm('')}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        Limpar busca
                                                    </Button>
                                                )}
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
                    </>
                )}
            </Paper>

            {/* Menu de Ações */}
            <Menu
                anchorEl={actionMenuAnchorEl}
                open={Boolean(actionMenuAnchorEl)}
                onClose={handleCloseActionMenu}
            >
                <MenuItem
                    onClick={() => {
                        handleOpenEditUserDialog(selectedUser!);
                        handleCloseActionMenu();
                    }}
                >
                    <Edit fontSize="small" sx={{ mr: 1 }} />
                    Editar
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleOpenDeleteDialog(selectedUser!);
                        handleCloseActionMenu();
                    }}
                >
                    <Delete fontSize="small" sx={{ mr: 1 }} />
                    Excluir
                </MenuItem>
            </Menu>

            {/* Modal para adicionar/editar usuário */}
            <Dialog
                open={openUserDialog}
                onClose={handleCloseUserDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
                </DialogTitle>
                <DialogContent>
                    {renderUserDialogContent()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUserDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveUser}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Salvar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de confirmação de exclusão */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>
                    Confirmar Exclusão
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        Esta ação não pode ser desfeita.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteUser}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Excluir'}
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

export default AdminUserManagement; 