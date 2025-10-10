'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fDateBR, fCurrencyBR } from 'src/utils/format-br';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CreditoPlanoPagamentoProps = {
  valorDivida: number;
  valorParcela: number;
  parcelasPagas: number;
  totalParcelas: number;
  proximoVencimento: Date;
  dataInicioDivida: Date;
  intervaloDiasOriginal: number;
};

type Frequencia = 'semanal' | 'mensal' | 'trimestral' | 'semestral';

const PRAZO_TOTAL_DIAS = 365; // 1 ano

const configuracoes = {
  semanal: { 
    dias: 7, 
    numParcelas: Math.floor(PRAZO_TOTAL_DIAS / 7), // 52 semanas
    juros: 15.0, 
    label: 'Semanal' 
  },
  mensal: { 
    dias: 30, 
    numParcelas: 12, // 12 meses
    juros: 0, 
    label: 'Mensal' 
  },
  trimestral: { 
    dias: 91, 
    numParcelas: 4, // 4 trimestres
    juros: 5.0, 
    label: 'Trimestral' 
  },
  semestral: { 
    dias: 182, 
    numParcelas: 2, // 2 semestres
    juros: 12.0, 
    label: 'Semestral' 
  },
};

export function CreditoPlanoPagamento({
  valorDivida,
  valorParcela,
  parcelasPagas,
  totalParcelas,
  proximoVencimento,
  dataInicioDivida,
  intervaloDiasOriginal,
}: CreditoPlanoPagamentoProps) {
  const [frequencia, setFrequencia] = useState<Frequencia>('mensal');
  
  const config = configuracoes[frequencia];
  
  // Calcular período restante até 1 ano a partir da data inicial
  const dataFinalContrato = new Date(dataInicioDivida);
  dataFinalContrato.setDate(dataFinalContrato.getDate() + PRAZO_TOTAL_DIAS); // +365 dias
  
  const hoje = new Date();
  const diasJaDecorridos = Math.floor((hoje.getTime() - dataInicioDivida.getTime()) / (1000 * 60 * 60 * 24));
  const diasRestantesAteAno = Math.floor((dataFinalContrato.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  const diasRestantes = Math.max(30, diasRestantesAteAno); // Mínimo 30 dias
  const mesesRestantesTotal = Math.floor(diasRestantes / 30);
  
  // Calcular parcelas que cabem no período restante
  const calcularParcelasRestantes = () => {
    // Simular com o saldo devedor atual
    const juros = (valorDivida * config.juros) / 100;
    const valorTotalComJuros = valorDivida + juros;
    
    const parcelas = [];
    
    // ===== LÓGICA ESPECIAL PARA SEMANAL =====
    if (frequencia === 'semanal') {
      const DIAS_SEMANA = 7;
      
      // Calcular quantas semanas completas cabem no período restante
      const semanasRestantes = Math.max(1, Math.floor(diasRestantes / DIAS_SEMANA));
      const valorCadaParcela = valorTotalComJuros / semanasRestantes;
      
      // Gerar parcelas semanais a partir do próximo vencimento
      for (let i = 0; i < semanasRestantes; i++) {
        const dataVencimento = new Date(dataInicioDivida);
        dataVencimento.setDate(dataVencimento.getDate() + ((i + 1) * DIAS_SEMANA));
        
        // Se a data de vencimento já passou, pular
        if (dataVencimento <= hoje) continue;
        
        // Se passar do final do contrato, ajustar para o último dia
        if (dataVencimento > dataFinalContrato) {
          dataVencimento.setTime(dataFinalContrato.getTime());
        }
        
        parcelas.push({
          numero: parcelas.length + 1,
          valor: valorCadaParcela,
          vencimento: new Date(dataVencimento),
          status: parcelas.length === 0 ? 'proxima' : 'pendente',
        });
      }
      
      // Garantir que sempre tenha pelo menos 1 parcela
      if (parcelas.length === 0) {
        parcelas.push({
          numero: 1,
          valor: valorTotalComJuros,
          vencimento: new Date(dataFinalContrato),
          status: 'proxima',
        });
      }
    }
    // ===== LÓGICA ESPECIAL PARA TRIMESTRAL =====
    else if (frequencia === 'trimestral') {
      const DIAS_TRIMESTRE = 91;
      
      // Calcular quantos trimestres completos cabem no período restante
      const trimestresRestantes = Math.max(1, Math.ceil(diasRestantes / DIAS_TRIMESTRE));
      const valorCadaParcela = valorTotalComJuros / trimestresRestantes;
      
      // Gerar parcelas trimestrais a partir do próximo vencimento
      for (let i = 0; i < trimestresRestantes; i++) {
        const dataVencimento = new Date(dataInicioDivida);
        dataVencimento.setDate(dataVencimento.getDate() + ((i + 1) * DIAS_TRIMESTRE));
        
        // Se a data de vencimento já passou, pular
        if (dataVencimento <= hoje) continue;
        
        // Se passar do final do contrato, ajustar para o último dia
        if (dataVencimento > dataFinalContrato) {
          dataVencimento.setTime(dataFinalContrato.getTime());
        }
        
        parcelas.push({
          numero: parcelas.length + 1,
          valor: valorCadaParcela,
          vencimento: new Date(dataVencimento),
          status: parcelas.length === 0 ? 'proxima' : 'pendente',
        });
      }
      
      // Garantir que sempre tenha pelo menos 1 parcela
      if (parcelas.length === 0) {
        parcelas.push({
          numero: 1,
          valor: valorTotalComJuros,
          vencimento: new Date(dataFinalContrato),
          status: 'proxima',
        });
      }
    }
    // ===== LÓGICA ESPECIAL PARA SEMESTRAL =====
    else if (frequencia === 'semestral') {
      const passouMaisDe6Meses = diasJaDecorridos > 182; // 6 meses
      
      if (passouMaisDe6Meses) {
        // Só resta 1 parcela - pagar tudo no último dia do contrato
        parcelas.push({
          numero: 1,
          valor: valorTotalComJuros,
          vencimento: new Date(dataFinalContrato),
          status: 'proxima',
        });
      } else {
        // Divide em 2 parcelas
        const valorCadaParcela = valorTotalComJuros / 2;
        
        // 1ª parcela: 6 meses após o início (182 dias)
        const dataPrimeiraParcela = new Date(dataInicioDivida);
        dataPrimeiraParcela.setDate(dataPrimeiraParcela.getDate() + 182);
        
        // 2ª parcela: no último dia do contrato
        parcelas.push({
          numero: 1,
          valor: valorCadaParcela,
          vencimento: new Date(dataPrimeiraParcela),
          status: 'proxima',
        });
        
        parcelas.push({
          numero: 2,
          valor: valorCadaParcela,
          vencimento: new Date(dataFinalContrato),
          status: 'pendente',
        });
      }
    } else {
      // ===== LÓGICA PARA MENSAL =====
      const DIAS_MES = 30;
      
      // Calcular quantos meses completos cabem no período restante
      const mesesRestantes = Math.max(1, Math.floor(diasRestantes / DIAS_MES));
      const valorCadaParcela = valorTotalComJuros / mesesRestantes;
      
      // Gerar parcelas mensais
      for (let i = 0; i < mesesRestantes; i++) {
        const dataVencimento = new Date(dataInicioDivida);
        dataVencimento.setDate(dataVencimento.getDate() + ((i + 1) * DIAS_MES));
        
        // Se a data de vencimento já passou, pular
        if (dataVencimento <= hoje) continue;
        
        // Se passar do final do contrato, ajustar para o último dia
        if (dataVencimento > dataFinalContrato) {
          dataVencimento.setTime(dataFinalContrato.getTime());
        }
        
        parcelas.push({
          numero: parcelas.length + 1,
          valor: valorCadaParcela,
          vencimento: new Date(dataVencimento),
          status: parcelas.length === 0 ? 'proxima' : 'pendente',
        });
      }
      
      // Garantir que sempre tenha pelo menos 1 parcela
      if (parcelas.length === 0) {
        parcelas.push({
          numero: 1,
          valor: valorTotalComJuros,
          vencimento: new Date(dataFinalContrato),
          status: 'proxima',
        });
      }
    }
    
    return parcelas;
  };

  const parcelas = calcularParcelasRestantes();
  const valorTotalSimulado = parcelas.reduce((acc, p) => acc + p.valor, 0);
  const jurosSimulado = valorTotalSimulado - valorDivida;

  const handleFrequenciaChange = (_event: React.MouseEvent<HTMLElement>, novaFrequencia: Frequencia | null) => {
    if (novaFrequencia !== null) {
      setFrequencia(novaFrequencia);
    }
  };

  return (
    <Card sx={{ p: 4, height: 'fit-content' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Simulador de Renegociação
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Período restante: {mesesRestantesTotal} meses ({diasRestantes} dias)
            </Typography>
          </Box>
          <Iconify icon="solar:calculator-bold-duotone" width={24} />
        </Stack>

        <Divider />

        {/* Seletor de frequência */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Escolha a frequência de pagamento:
          </Typography>
          <ToggleButtonGroup
            value={frequencia}
            exclusive
            onChange={handleFrequenciaChange}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            {(Object.keys(configuracoes) as Frequencia[]).map((freq) => (
              <ToggleButton key={freq} value={freq}>
                <Stack alignItems="center" spacing={0.5}>
                  <Typography variant="body2">{configuracoes[freq].label}</Typography>
                  {configuracoes[freq].juros > 0 && (
                    <Typography variant="caption" color="warning.main">
                      +{configuracoes[freq].juros}%
                    </Typography>
                  )}
                </Stack>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Resumo da simulação */}
        <Box
          sx={(theme) => ({
            p: 2.5,
            borderRadius: 2,
            bgcolor: theme.palette.primary.lighter,
            border: `1px dashed ${theme.palette.primary.main}`,
          })}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Número de parcelas:</Typography>
              <Typography variant="body2" fontWeight={600}>
                {parcelas.length}x
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Valor de cada parcela:</Typography>
              <Typography variant="body2" fontWeight={600}>
                {fCurrencyBR(parcelas[0]?.valor || 0)}
              </Typography>
            </Stack>
            {jurosSimulado > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="warning.main">
                  Juros:
                </Typography>
                <Typography variant="body2" color="warning.main" fontWeight={600}>
                  +{fCurrencyBR(jurosSimulado)}
                </Typography>
              </Stack>
            )}
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1" fontWeight={600}>
                Total:
              </Typography>
              <Typography variant="body1" fontWeight={700} color="primary.main">
                {fCurrencyBR(valorTotalSimulado)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Tabela de parcelas */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Cronograma de pagamentos ({parcelas.length} parcelas restantes):
          </Typography>
          <TableContainer
            sx={(theme) => ({
              maxHeight: 300,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
            })}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Parcela</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parcelas.map((parcela, index) => (
                  <TableRow
                    key={index}
                    sx={(theme) => ({
                      bgcolor:
                        parcela.status === 'proxima'
                          ? theme.palette.primary.lighter
                          : 'transparent',
                    })}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={parcela.status === 'proxima' ? 600 : 400}>
                        {index + 1}/{parcelas.length}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{fDateBR(parcela.vencimento)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={500}>
                        {fCurrencyBR(parcela.valor)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={parcela.status === 'proxima' ? 'Próxima' : 'Pendente'}
                        color={parcela.status === 'proxima' ? 'primary' : 'default'}
                        variant="soft"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Botão de alterar plano */}
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<Iconify icon="solar:refresh-bold-duotone" />}
        >
          Alterar plano de pagamento
        </Button>
      </Stack>
    </Card>
  );
}
