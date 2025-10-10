'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

import { Box, Card, Alert, Radio, Stack, Button, Container, RadioGroup, Typography, FormControlLabel } from '@mui/material';

import { Iconify } from 'src/components/iconify';
// import { varFade } from 'src/components/animate/variants';

// ----------------------------------------------------------------------

type MatriculaChoice = 'sim' | 'nao';

interface StepData {
  step: number;
  totalSteps: number;
  title: string;
  hasMatricula: boolean;
}

export function CadastroView() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasMatricula, setHasMatricula] = useState<MatriculaChoice | null>(null);

  const handleMatriculaChange = (value: MatriculaChoice) => {
    setHasMatricula(value);
  };

  const handleNext = () => {
    if (hasMatricula === 'sim') {
      // Fluxo com matrícula - mais rápido
      setCurrentStep(2);
    } else if (hasMatricula === 'nao') {
      // Fluxo sem matrícula - coleta mais informações
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepData = (): StepData => {
    if (currentStep === 1) {
      return {
        step: 1,
        totalSteps: hasMatricula ? (hasMatricula === 'sim' ? 3 : 5) : 1, // Só mostra total quando selecionado
        title: 'Pergunta Inicial',
        hasMatricula: true, // Para mostrar a pergunta da matrícula
      };
    }
    
    // Aqui você pode definir os próximos steps baseados na escolha
    return {
      step: currentStep,
      totalSteps: hasMatricula === 'sim' ? 3 : 5,
      title: 'Informações do Imóvel',
      hasMatricula: hasMatricula === 'sim',
    };
  };

  const stepData = getStepData();
  const progressPercentage = hasMatricula ? (stepData.step / stepData.totalSteps) * 100 : 0;

  const renderStepIndicator = () => (
    <Box sx={{ mb: 1 }}>
      {/* Progress Bar */}
      <Box
        sx={{
          height: 4,
          bgcolor: 'grey.200',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${progressPercentage}%`,
            bgcolor: 'primary.main',
            transition: 'width 0.3s ease',
          }}
        />
      </Box>

      {/* Step Info */}
      {hasMatricula ? (
        // Layout com steps verticais espalhados horizontalmente quando selecionado
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          {(hasMatricula === 'sim' ? [
            { num: 1, label: 'Pergunta Inicial', active: true },
            { num: 2, label: 'Matrícula', active: false },
            { num: 3, label: 'Crédito', active: false },
            { num: 4, label: 'Finalização', active: false },
          ] : [
            { num: 1, label: 'Pergunta Inicial', active: true },
            { num: 2, label: 'Endereço', active: false },
            { num: 3, label: 'Crédito', active: false },
            { num: 4, label: 'Perguntas Gerais', active: false },
            { num: 5, label: 'Finalização', active: false },
          ]).map((step) => (
            <Box key={step.num} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 'fit-content' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: step.active ? 'primary.main' : 'grey.300',
                  color: step.active ? 'white' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  alignSelf: 'center',
                }}
              >
                {step.num}
              </Box>
              <Typography 
                variant="body2" 
                fontWeight={step.active ? 600 : 400}
                color={step.active ? 'primary.main' : 'text.secondary'}
                sx={{ textAlign: 'center', width: '100%', mt: 0.5 }}
              >
                {step.label}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        // Layout simples quando não selecionado
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 'fit-content' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              alignSelf: 'center',
            }}
          >
            {stepData.step}
          </Box>
          <Typography variant="h6" fontWeight={600} sx={{ textAlign: 'center', width: '100%' }}>
            Pergunta Inicial
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderInitialQuestion = () => (
    <m.div>
      <Card sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Banner explicativo */}
          <Alert
            severity="success"
            icon={<Iconify icon="solar:file-text-bold" />}
            sx={{
              bgcolor: 'primary.lighter',
              color: 'primary.darker',
              '& .MuiAlert-icon': {
                color: 'primary.main',
              },
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Vamos começar
              </Typography>
              <Typography variant="body2">
                A matrícula é o documento que comprova a propriedade do imóvel no cartório de registro de imóveis.
              </Typography>
            </Stack>
          </Alert>

          {/* Pergunta principal */}
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Você tem a matrícula do imóvel? <Typography component="span" color="error.main">*</Typography>
            </Typography>

            <RadioGroup
              value={hasMatricula || ''}
              onChange={(e) => handleMatriculaChange(e.target.value as MatriculaChoice)}
            >
              <Stack spacing={2}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: hasMatricula === 'sim' ? 2 : 1,
                    borderColor: hasMatricula === 'sim' ? 'primary.main' : 'divider',
                    bgcolor: hasMatricula === 'sim' ? 'primary.lighter' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.lighter',
                    },
                  }}
                  onClick={() => setHasMatricula('sim')}
                >
                  <FormControlLabel
                    value="sim"
                    control={<Radio color="primary" />}
                    label={
                      <Stack>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Sim, tenho a matrícula
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Processo mais rápido com dados da matrícula
                        </Typography>
                      </Stack>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Card>

                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: hasMatricula === 'nao' ? 2 : 1,
                    borderColor: hasMatricula === 'nao' ? 'primary.main' : 'divider',
                    bgcolor: hasMatricula === 'nao' ? 'primary.lighter' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.lighter',
                    },
                  }}
                  onClick={() => setHasMatricula('nao')}
                >
                  <FormControlLabel
                    value="nao"
                    control={<Radio color="primary" />}
                    label={
                      <Stack>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Não, não tenho a matrícula
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Vamos coletar as informações necessárias
                        </Typography>
                      </Stack>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Card>
              </Stack>
            </RadioGroup>
          </Box>

          {/* Navegação */}
          <Stack direction="row" justifyContent="space-between" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              onClick={handlePrevious}
              disabled={currentStep === 1}
              sx={{ minWidth: 120 }}
            >
              Anterior
            </Button>

            <Button
              variant="contained"
              color="primary"
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              onClick={handleNext}
              disabled={!hasMatricula}
              sx={{ minWidth: 120 }}
            >
              Próximo
            </Button>
          </Stack>
        </Stack>
      </Card>
    </m.div>
  );

  const renderNextSteps = () => (
    <m.div>
      <Card sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Próximos passos
          </Typography>
          
          <Alert severity="success">
            <Typography variant="body2">
              {hasMatricula === 'sim' 
                ? 'Ótimo! Com a matrícula, o processo será mais rápido.' 
                : 'Sem problemas! Vamos coletar todas as informações necessárias.'
              }
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary">
            Em breve implementaremos os próximos passos do formulário baseados na sua escolha.
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setCurrentStep(1);
              setHasMatricula(null);
            }}
          >
            Voltar ao início
          </Button>
        </Stack>
      </Card>
    </m.div>
  );

  return (
    <Box
      sx={(theme) => ({
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default',
        minHeight: '100vh',
      })}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
              Cadastro
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Preencha as informações necessárias para criar sua conta.
            </Typography>
          </Box>

          {/* Step Indicator */}
          <Box>
            {renderStepIndicator()}
          </Box>
          
          {/* Content */}
          <Box sx={{ mt: 1 }}>
            {currentStep === 1 ? renderInitialQuestion() : renderNextSteps()}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
