const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
const dbFile = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Funções de utilidade
function readDatabase() {
    try {
        const data = fs.readFileSync(dbFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler banco de dados:', error);
        return { users: [], patients: [], professionals: [] };
    }
}

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API VidaPlus está funcionando!' });
});

// Rotas de usuário
app.get('/api/users', (req, res) => {
    const db = readDatabase();
    res.json(db.users || []);
});

app.get('/api/users/:id', (req, res) => {
    const db = readDatabase();
    const user = (db.users || []).find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

// Rotas de profissionais
app.get('/api/professionals', (req, res) => {
    const db = readDatabase();
    res.json(db.professionals || []);
});

app.get('/api/professionals/:id', (req, res) => {
    const db = readDatabase();
    const professional = (db.professionals || []).find(p => p.id === req.params.id);
    if (professional) {
        res.json(professional);
    } else {
        res.status(404).json({ error: 'Profissional não encontrado' });
    }
});

// Rotas de pacientes
app.get('/api/patients', (req, res) => {
    const db = readDatabase();
    res.json(db.patients || []);
});

app.get('/api/patients/:id', (req, res) => {
    const db = readDatabase();
    const patient = (db.patients || []).find(p => p.id === req.params.id);
    if (patient) {
        res.json(patient);
    } else {
        res.status(404).json({ error: 'Paciente não encontrado' });
    }
});

// Rotas de agendamentos
app.get('/api/appointments', (req, res) => {
    const db = readDatabase();
    res.json(db.appointments || []);
});

// Rotas de dados financeiros
app.get('/api/financial_data', (req, res) => {
    const db = readDatabase();
    const financialData = db.financial_data || [];
    console.log('Enviando dados financeiros:', {
        total: financialData.length,
        primeiroItem: financialData.length > 0 ? financialData[0] : null
    });
    res.json(financialData);
});

// Rota de registro simplificada para teste
app.post('/api/register', (req, res) => {
    console.log('Dados recebidos:', req.body);
    res.status(201).json({
        message: 'Cadastro realizado com sucesso!',
        user: { ...req.body, id: Date.now().toString() }
    });
});

// Mantendo a rota sem prefixo para compatibilidade com o código atual do frontend
app.post('/register', (req, res) => {
    console.log('Dados recebidos:', req.body);
    res.status(201).json({
        message: 'Cadastro realizado com sucesso!',
        user: { ...req.body, id: Date.now().toString() }
    });
});

// Rota de login
app.post('/api/login', (req, res) => {
    console.log('Tentativa de login:', req.body);
    const { email, password } = req.body;

    // Buscar usuário no banco de dados
    const db = readDatabase();
    console.log('Todos os usuários:', db.users.map(u => ({ id: u.id, email: u.email, role: u.role })));

    const user = (db.users || []).find(u => u.email === email);
    console.log('Usuário encontrado:', user ? { id: user.id, email: user.email, role: user.role } : 'Nenhum');

    if (user && user.password === password) {
        // Usuário encontrado
        console.log('Login bem-sucedido:', { id: user.id, email: user.email, role: user.role });
        res.json({
            token: 'test-token-' + Date.now(),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } else {
        // Usuário não encontrado ou senha incorreta
        console.log('Falha no login: credenciais inválidas');
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

// Mantendo a rota sem prefixo para compatibilidade com o código atual do frontend
app.post('/login', (req, res) => {
    console.log('Tentativa de login sem prefixo:', req.body);
    const { email, password } = req.body;

    // Buscar usuário no banco de dados
    const db = readDatabase();
    console.log('Todos os usuários (rota sem prefixo):', db.users.map(u => ({ id: u.id, email: u.email, role: u.role })));

    const user = (db.users || []).find(u => u.email === email);
    console.log('Usuário encontrado (rota sem prefixo):', user ? { id: user.id, email: user.email, role: user.role } : 'Nenhum');

    if (user && user.password === password) {
        // Usuário encontrado
        console.log('Login bem-sucedido (rota sem prefixo):', { id: user.id, email: user.email, role: user.role });
        res.json({
            token: 'test-token-' + Date.now(),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } else {
        // Usuário não encontrado ou senha incorreta
        console.log('Falha no login (rota sem prefixo): credenciais inválidas');
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

// Rota para limpar sessão (utilizada para depuração)
app.post('/api/clear-session', (req, res) => {
    console.log('Limpando sessão para depuração');
    res.json({
        success: true,
        message: 'Sessão limpa. Limpe o localStorage no navegador também.'
    });
});

app.listen(port, () => {
    console.log(`API VidaPlus rodando em http://localhost:${port}`);
}); 