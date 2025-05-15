import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';

// Prefetch para as rotas principais
// Isso inicia o carregamento assim que o JavaScript é executado
const Login = lazy(() => import('../pages/auth/Login'));
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

// Layout protegido baseado no perfil do usuário
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // Redirecionar para dashboard apropriado se não tiver permissão
        if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" />;
        } else if (user.role === 'professional') {
            return <Navigate to="/professional/dashboard" />;
        } else {
            return <Navigate to="/patient/dashboard" />;
        }
    }

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
        {
            path: '*',
            element: <Navigate to="/login" replace />,
        },
    ]);
} 