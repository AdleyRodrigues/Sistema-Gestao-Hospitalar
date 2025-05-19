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
    res.json(db.financial_data || []);
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
    const { email } = req.body;

    // Lógica simplificada de login para testes
    let role = 'patient';
    if (email.includes('admin')) {
        role = 'admin';
    } else if (email.includes('doctor') || email.includes('professional')) {
        role = 'professional';
    }

    res.json({
        token: 'test-token-' + Date.now(),
        user: {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email,
            role,
            status: 'active'
        }
    });
});

// Mantendo a rota sem prefixo para compatibilidade com o código atual do frontend
app.post('/login', (req, res) => {
    console.log('Tentativa de login sem prefixo:', req.body);
    const { email } = req.body;

    // Lógica simplificada de login para testes
    let role = 'patient';
    if (email.includes('admin')) {
        role = 'admin';
    } else if (email.includes('doctor') || email.includes('professional')) {
        role = 'professional';
    }

    res.json({
        token: 'test-token-' + Date.now(),
        user: {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email,
            role,
            status: 'active'
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor de teste rodando em http://localhost:${port}`);
}); 