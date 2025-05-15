import { Box, Container, Typography, Paper, Divider, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{ mr: 2 }}
                    >
                        Voltar
                    </Button>
                    <Typography variant="h4" component="h1">
                        Política de Privacidade
                    </Typography>
                </Box>
                <Divider sx={{ mb: 4 }} />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Introdução
                    </Typography>
                    <Typography variant="body1" paragraph>
                        O Sistema de Gestão Hospitalar e Serviços de Saúde (SGHSS) está comprometido com a
                        proteção da sua privacidade e de seus dados pessoais. Esta Política de Privacidade
                        explica como coletamos, usamos, compartilhamos e protegemos suas informações em
                        conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Ao utilizar nosso sistema, você aceita as práticas descritas nesta política.
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Dados Coletados
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Podemos coletar os seguintes tipos de informações:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Dados de identificação:</strong> nome, CPF, RG, data de nascimento,
                            endereço, e-mail, telefone.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Dados de saúde:</strong> histórico médico, resultados de exames,
                            diagnósticos, tratamentos, medicações, alergias e outras informações relacionadas
                            à saúde (considerados dados pessoais sensíveis).
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Dados de uso do sistema:</strong> informações sobre como você usa o
                            sistema, incluindo registros de acesso, ações realizadas e preferências.
                        </Typography>
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Finalidades do Tratamento
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Utilizamos seus dados pessoais para:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <Typography component="li" variant="body1" paragraph>
                            Prestação de serviços de saúde, incluindo agendamentos, consultas e
                            acompanhamento médico.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Gestão do seu histórico médico e prontuário eletrônico.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Comunicação sobre consultas, exames e resultados.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Gestão administrativa e financeira dos serviços prestados.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Cumprimento de obrigações legais e regulatórias.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Melhoria dos nossos serviços e da experiência do usuário.
                        </Typography>
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Base Legal
                    </Typography>
                    <Typography variant="body1" paragraph>
                        O tratamento dos seus dados é realizado com base nas seguintes hipóteses legais:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Consentimento:</strong> quando você concorda expressamente com o tratamento
                            dos seus dados para finalidades específicas.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Execução de contrato:</strong> para prestar os serviços de saúde solicitados.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Obrigação legal:</strong> para cumprir exigências legais aplicáveis aos
                            serviços de saúde.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Tutela da saúde:</strong> para procedimentos realizados por profissionais
                            de saúde ou entidades sanitárias.
                        </Typography>
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Compartilhamento de Dados
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Podemos compartilhar seus dados nas seguintes situações:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <Typography component="li" variant="body1" paragraph>
                            Com profissionais de saúde envolvidos no seu atendimento.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Com laboratórios e serviços de diagnóstico para realização de exames.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Com operadoras de planos de saúde para fins de faturamento.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Com autoridades públicas, quando exigido por lei ou ordem judicial.
                        </Typography>
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Todo compartilhamento é realizado de acordo com as bases legais aplicáveis e
                        respeitando os princípios de finalidade, adequação e necessidade.
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Armazenamento e Segurança
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Seus dados são armazenados de forma segura em servidores localizados no Brasil
                        ou em serviços de computação em nuvem, seguindo padrões rigorosos de segurança:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <Typography component="li" variant="body1" paragraph>
                            Utilizamos criptografia para proteger as informações durante a transmissão e armazenamento.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Implementamos controles de acesso rigorosos, garantindo que apenas pessoas autorizadas
                            acessem suas informações.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Realizamos auditorias regulares nos sistemas para identificar vulnerabilidades.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Mantemos planos de resposta a incidentes e notificamos imediatamente em caso de
                            violação de dados, conforme exigido por lei.
                        </Typography>
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Seus Direitos
                    </Typography>
                    <Typography variant="body1" paragraph>
                        De acordo com a LGPD, você tem os seguintes direitos:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Confirmação e acesso:</strong> saber se seus dados são tratados e acessar
                            todas as informações que temos sobre você.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Correção:</strong> solicitar a correção de dados incompletos, inexatos ou desatualizados.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Anonimização, bloqueio ou eliminação:</strong> solicitar a anonimização,
                            bloqueio ou eliminação de dados desnecessários ou excessivos.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Portabilidade:</strong> solicitar a portabilidade dos seus dados para outro
                            serviço ou produto.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Revogação do consentimento:</strong> revogar seu consentimento a qualquer momento.
                        </Typography>
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Para exercer estes direitos, utilize a seção "Minhas Informações Pessoais" no menu do sistema
                        ou entre em contato com o nosso Encarregado de Proteção de Dados.
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Período de Retenção
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Armazenamos seus dados pelo tempo necessário para cumprir as finalidades para as quais
                        foram coletados, respeitando os seguintes critérios:
                    </Typography>
                    <Typography component="ul" sx={{ pl: 4 }}>
                        <Typography component="li" variant="body1" paragraph>
                            Dados de prontuário médico: mínimo de 20 anos, conforme exigido pelo Conselho Federal de Medicina.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Dados para fins administrativos e fiscais: mínimo de 5 anos.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            Dados baseados exclusivamente no consentimento: até a revogação do consentimento,
                            respeitando os prazos mínimos exigidos por lei.
                        </Typography>
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Contato do Encarregado de Proteção de Dados (DPO)
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Para questões relacionadas à privacidade e proteção de dados, entre em contato com nosso DPO:
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Nome:</strong> Encarregado de Proteção de Dados SGHSS<br />
                        <strong>E-mail:</strong> dpo@sghss.com.br<br />
                        <strong>Telefone:</strong> (11) 1234-5678
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Alterações na Política de Privacidade
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Esta política pode ser atualizada periodicamente. A versão mais recente estará
                        sempre disponível no sistema, com a data da última atualização.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Última atualização:</strong> 10 de julho de 2023
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default PrivacyPolicy; 