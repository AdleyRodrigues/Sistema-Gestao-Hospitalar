import React from 'react';
import { Box, Typography, Paper, Grid, Divider, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import { History, Description, InsertDriveFile } from '@mui/icons-material';

const MedicalHistory = () => {
    // Dados mockados de histórico médico
    const medicalRecords = [
        {
            id: 1,
            date: '10/03/2025',
            doctor: 'Dr. Carlos Silva',
            specialty: 'Cardiologia',
            diagnosis: 'Hipertensão Arterial Leve',
            recommendations: 'Redução do consumo de sal, prática de exercícios leves'
        },
        {
            id: 2,
            date: '05/02/2025',
            doctor: 'Dra. Ana Oliveira',
            specialty: 'Endocrinologia',
            diagnosis: 'Diabetes Tipo 2 - Controle',
            recommendations: 'Manter medicação, dieta de baixo índice glicêmico'
        },
    ];

    const exams = [
        { id: 1, name: 'Hemograma Completo', date: '15/03/2025', status: 'Disponível' },
        { id: 2, name: 'Eletrocardiograma', date: '11/03/2025', status: 'Disponível' },
        { id: 3, name: 'Glicemia em Jejum', date: '05/02/2025', status: 'Disponível' },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Histórico Médico
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Consulte seu histórico de atendimentos, diagnósticos e exames.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <History sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">
                                Prontuários e Consultas
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <List>
                            {medicalRecords.map((record) => (
                                <Paper key={record.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Consulta em {record.date}
                                        </Typography>
                                        <Chip size="small" label={record.specialty} color="primary" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Médico: {record.doctor}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body2">
                                        <strong>Diagnóstico:</strong> {record.diagnosis}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        <strong>Recomendações:</strong> {record.recommendations}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Button size="small" variant="outlined" startIcon={<Description />}>
                                            Ver Detalhes
                                        </Button>
                                    </Box>
                                </Paper>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <InsertDriveFile sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">
                                Exames Realizados
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        <List>
                            {exams.map((exam) => (
                                <ListItem
                                    key={exam.id}
                                    divider
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        p: 2
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                                        <Typography variant="subtitle1">
                                            {exam.name}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={exam.status}
                                            color={exam.status === 'Disponível' ? 'success' : 'warning'}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Data: {exam.date}
                                    </Typography>
                                    <Box sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button size="small" variant="outlined">
                                            Visualizar
                                        </Button>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MedicalHistory; 