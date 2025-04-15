import { Box, Container, Typography, Button, Paper } from '@mui/material'

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            VidaPlus - Sistema de Gestão Hospitalar
          </Typography>
          <Typography variant="body1" paragraph>
            Bem-vindo ao sistema de gestão hospitalar VidaPlus. Este sistema ajuda a gerenciar hospitais, clínicas e serviços de home care.
          </Typography>
          <Button variant="contained" color="primary">
            Começar
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

export default App
