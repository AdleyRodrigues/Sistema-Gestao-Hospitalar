const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({ cors: true });
const routes = require('./routes.json');
const port = 3001;

// Middleware CORS explícito
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    // Pré-voo OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// Middleware personalizado para adicionar timestamp
server.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (req.body) {
            req.body.createdAt = Date.now();
        }
    }
    next();
});

// Usar middlewares padrão (logger, static, cors e no-cache)
server.use(middlewares);

// Parse do corpo da requisição como JSON
server.use(jsonServer.bodyParser);

// Adicionar rota de login (precisa vir antes das rotas reescritas)
server.post('/api/login', (req, res) => {
    console.log('Recebida requisição de login:', req.body);
    const { email, password } = req.body || {};

    console.log('Email:', email, 'Senha:', password);

    try {
        // Acessar usuários do db.json diretamente
        const db = router.db.__wrapped__;
        console.log('Database:', db);

        const users = db.users || [];
        console.log('Usuários encontrados:', users.length);

        // Verificar se o usuário existe e a senha está correta
        const user = users.find(u => u.email === email && u.password === password);
        console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

        if (user) {
            // Clone o usuário para não modificar o original
            const userCopy = { ...user };
            // Remover a senha do objeto copiado
            delete userCopy.password;

            // Simula um token JWT
            const token = `token-${Math.random().toString(36).substring(2)}`;

            console.log('Login bem-sucedido para:', email);
            // Retorna o usuário e o token
            return res.json({
                user: userCopy,
                token
            });
        } else {
            console.log('Credenciais inválidas para:', email);
            // Usuário não encontrado ou senha incorreta
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro no processamento de login:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Configurar rotas personalizadas
server.use(jsonServer.rewriter(routes));

// Usar o router
server.use(router);

// Iniciar o servidor
server.listen(port, () => {
    console.log(`API VidaPlus rodando em http://localhost:${port}`);
}); 