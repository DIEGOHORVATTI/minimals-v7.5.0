'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CreditoSimulacaoProps = {
  saldoAtual: number;
};

type PlanoPagamento = {
  id: string;
  nome: string;
  parcelas: number;
  juros: number;
  descricao: string;
};

const planosPagamento: PlanoPagamento[] = [
  {
    id: 'semanal',
    nome: 'Semanal',
    parcelas: 4,
    juros: 2.5,
    descricao: '4 pagamentos semanais',
  },
  {
    id: 'mensal',
    nome: 'Mensal',
    parcelas: 1,
    juros: 0,
    descricao: 'Pagamento único mensal',
  },
  {
    id: 'trimestral',
    nome: 'Trimestral',
    parcelas: 3,
    juros: 5.0,
    descricao: '3 pagamentos mensais',
  },
  {
    id: 'semestral',
    nome: 'Semestral',
    parcelas: 6,
    juros: 12.0,
    descricao: '6 pagamentos mensais',
  },
];

export function CreditoSimulacao({ saldoAtual }: CreditoSimulacaoProps) {
  const [planoSelecionado, setPlanoSelecionado] = useState('mensal');
  const [valorParcela, setValorParcela] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [jurosTotal, setJurosTotal] = useState(0);

  const calcularSimulacao = (planoId: string) => {
    const plano = planosPagamento.find((p) => p.id === planoId);
    if (!plano) return;

    const juros = (saldoAtual * plano.juros) / 100;
    const total = saldoAtual + juros;
    const parcela = total / plano.parcelas;

    setValorTotal(total);
    setJurosTotal(juros);
    setValorParcela(parcela);
  };

  const handlePlanoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoPlano = event.target.value;
    setPlanoSelecionado(novoPlano);
    calcularSimulacao(novoPlano);
  };

  // Calcular automaticamente quando o componente monta
  useState(() => {
    calcularSimulacao(planoSelecionado);
  });

  const planoAtual = planosPagamento.find((p) => p.id === planoSelecionado);

  return (
    <Card sx={{ p: 3, height: 'fit-content' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Simulador de Pagamento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Escolha como deseja pagar sua dívida
            </Typography>
          </Box>
          <Iconify icon="solar:palette-bold" width={24} />
        </Stack>

        <Divider />

        {/* Valor atual */}
        <Box
          sx={(theme) => ({
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.grey[50],
            border: `1px solid ${theme.palette.grey[200]}`,
          })}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Valor atual da dívida
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {fCurrency(saldoAtual)}
          </Typography>
        </Box>

        {/* Opções de pagamento */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Escolha o plano de pagamento:
          </Typography>
          <RadioGroup value={planoSelecionado} onChange={handlePlanoChange}>
            <Stack spacing={1}>
              {planosPagamento.map((plano) => (
                <Box
                  key={plano.id}
                  sx={(theme) => ({
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${
                      planoSelecionado === plano.id ? theme.palette.primary.main : theme.palette.grey[200]
                    }`,
                    bgcolor: planoSelecionado === plano.id ? theme.palette.primary.lighter : 'transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  })}
                  onClick={() => {
                    setPlanoSelecionado(plano.id);
                    calcularSimulacao(plano.id);
                  }}
                >
                  <FormControlLabel
                    value={plano.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {plano.nome}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {plano.descricao}
                            </Typography>
                          </Box>
                          {plano.juros > 0 && (
                            <Typography variant="caption" color="warning.main" fontWeight={600}>
                              +{plano.juros}% juros
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        </Box>

        {/* Resultado da simulação */}
        {planoAtual && (
          <Box
            sx={(theme) => ({
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.primary.lighter,
              border: `1px solid ${theme.palette.primary.light}`,
            })}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Resumo do pagamento:
            </Typography>
            
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Valor da parcela:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {fCurrency(valorParcela)}
                </Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Número de parcelas:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {planoAtual.parcelas}
                </Typography>
              </Stack>

              {jurosTotal > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="warning.main">Juros:</Typography>
                  <Typography variant="body2" color="warning.main" fontWeight={600}>
                    +{fCurrency(jurosTotal)}
                  </Typography>
                </Stack>
              )}
              
              <Divider />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" fontWeight={600}>Total a pagar:</Typography>
                <Typography variant="body1" fontWeight={700}>
                  {fCurrency(valorTotal)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Alerta sobre juros */}
        {planoAtual?.juros && planoAtual.juros > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="caption">
              Pagamentos em mais parcelas incluem juros. Considere pagar no prazo mensal para evitar custos adicionais.
            </Typography>
          </Alert>
        )}

        {/* Botão de ação */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<Iconify icon="solar:check-circle-bold" />}
          sx={{ mt: 2 }}
        >
          Confirmar Plano de Pagamento
        </Button>
      </Stack>
    </Card>
  );
}
