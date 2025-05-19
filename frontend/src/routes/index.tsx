import { lazy, Suspense } from 'react';
import { Navigate, useRoutes, useParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';

// Componente para a rota de teste de perfil
const TestProfileRouter = () => {
    const { role } = useParams<{ role: string }>();

    if (role === 'admin') {
        return <AdminProfile />;
    } else if (role === 'professional') {
        return <ProfessionalProfile />;
    } else {
        return <PatientProfile />;
    }
};

// Prefetch para as rotas principais
// Isso inicia o carregamento assim que o JavaScript é executado
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const PatientDashboard = lazy(() => {
    const module = import('../pages/dashboard/patient/PatientDashboard');
    return module;
});
const ProfessionalDashboard = lazy(() => {
    const module = import('../pages/dashboard/professional/ProfessionalDashboard');
    return module;
});
const AdminDashboard = lazy(() => {
    const module = import('../pages/dashboard/admin/AdminDashboard');
    return module;
});

// Páginas de Pacientes
const PatientAppointments = lazy(() => import('../pages/patient/Appointments'));
const PatientMedicalHistory = lazy(() => import('../pages/patient/MedicalHistory'));
const PatientTelemedicine = lazy(() => import('../pages/patient/Telemedicine'));

// Páginas de Profissionais
const ProfessionalSchedule = lazy(() => import('../pages/professional/Schedule'));
const ProfessionalPatients = lazy(() => import('../pages/professional/Patients'));
const ProfessionalRecords = lazy(() => import('../pages/professional/Records'));
const ProfessionalTelemedicine = lazy(() => import('../pages/professional/Telemedicine'));

// Páginas de Privacidade
const PrivacyPolicy = lazy(() => import('../pages/privacy/PrivacyPolicy'));
const PrivacySettings = lazy(() => import('../pages/privacy/PrivacySettings'));

// Páginas de Perfil
const AdminProfile = lazy(() => import('../pages/admin/Profile'));
const ProfessionalProfile = lazy(() => import('../pages/professional/Profile'));
const PatientProfile = lazy(() => import('../pages/patient/Profile'));

// Páginas de Admin
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));

// Layout protegido baseado no perfil do usuário
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
    const { isAuthenticated, user } = useAuth();

    console.log('ProtectedRoute - Verificando permissões:', {
        isAuthenticated,
        user,
        allowedRoles,
        hasPermission: user ? allowedRoles.includes(user.role) : false
    });

    if (!isAuthenticated) {
        console.log('ProtectedRoute - Usuário não autenticado, redirecionando para login');
        return <Navigate to="/login" />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        console.log(`ProtectedRoute - Usuário não tem permissão (${user.role}), redirecionando para dashboard adequado`);
        // Redirecionar para dashboard apropriado se não tiver permissão
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" />;
        } else if (user.role === 'professional') {
            return <Navigate to="/professional/dashboard" />;
        } else {
            return <Navigate to="/patient/dashboard" />;
        }
    }

    console.log('ProtectedRoute - Usuário com permissão, renderizando componente');
    return <MainLayout>{children}</MainLayout>;
};

// Configuração de rotas
export default function Router() {
    return useRoutes([
        // Rotas públicas
        {
            path: 'login',
            element: (
                <Suspense fallback={null}>
                    <Login />
                </Suspense>
            ),
        },
        {
            path: 'register',
            element: (
                <Suspense fallback={null}>
                    <Register />
                </Suspense>
            ),
        },
        {
            path: 'privacy-policy',
            element: (
                <Suspense fallback={null}>
                    <PrivacyPolicy />
                </Suspense>
            ),
        },

        // Rotas para pacientes
        {
            path: 'patient',
            children: [
                {
                    path: 'dashboard',
                    element: (
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Suspense fallback={null}>
                                <PatientDashboard />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'profile',
                    element: (
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Suspense fallback={null}>
                                <PatientProfile />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'appointments',
                    element: (
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Suspense fallback={null}>
                                <PatientAppointments />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'medical-history',
                    element: (
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Suspense fallback={null}>
                                <PatientMedicalHistory />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'telemedicine',
                    element: (
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Suspense fallback={null}>
                                <PatientTelemedicine />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'privacy-settings',
                    element: (
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Suspense fallback={null}>
                                <PrivacySettings />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
            ],
        },

        // Rotas para profissionais de saúde
        {
            path: 'professional',
            children: [
                {
                    path: 'dashboard',
                    element: (
                        <ProtectedRoute allowedRoles={['professional']}>
                            <Suspense fallback={null}>
                                <ProfessionalDashboard />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'profile',
                    element: (
                        <ProtectedRoute allowedRoles={['professional']}>
                            <Suspense fallback={null}>
                                <ProfessionalProfile />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'schedule',
                    element: (
                        <ProtectedRoute allowedRoles={['professional']}>
                            <Suspense fallback={null}>
                                <ProfessionalSchedule />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'patients',
                    element: (
                        <ProtectedRoute allowedRoles={['professional']}>
                            <Suspense fallback={null}>
                                <ProfessionalPatients />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'records',
                    element: (
                        <ProtectedRoute allowedRoles={['professional']}>
                            <Suspense fallback={null}>
                                <ProfessionalRecords />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'telemedicine',
                    element: (
                        <ProtectedRoute allowedRoles={['professional']}>
                            <Suspense fallback={null}>
                                <ProfessionalTelemedicine />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'privacy-settings',
                    element: (
                        <ProtectedRoute allowedRoles={['professional']}>
                            <Suspense fallback={null}>
                                <PrivacySettings />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
            ],
        },

        // Rotas para administradores
        {
            path: 'admin',
            children: [
                {
                    path: 'dashboard',
                    element: (
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Suspense fallback={null}>
                                <AdminDashboard />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'profile',
                    element: (
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Suspense fallback={null}>
                                <AdminProfile />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'users',
                    element: (
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Suspense fallback={null}>
                                <UserManagement />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
                {
                    path: 'privacy-settings',
                    element: (
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Suspense fallback={null}>
                                <PrivacySettings />
                            </Suspense>
                        </ProtectedRoute>
                    ),
                },
            ],
        },

        // Redirecionamentos
        {
            path: '/',
            element: <Navigate to="/login" replace />,
        },

        // Rotas de teste para acesso direto aos perfis (para depuração)
        {
            path: 'test-profile/:role',
            element: (
                <Suspense fallback={null}>
                    <TestProfileRouter />
                </Suspense>
            ),
        },

        {
            path: '*',
            element: <Navigate to="/login" replace />,
        },
    ]);
} 