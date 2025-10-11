'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fCurrencyBR, fDateTimeBR } from 'src/utils/format-br';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Transacao = {
  id: string;
  tipo: 'saque' | 'pagamento' | 'juros';
  valor: number;
  data: Date;
  descricao: string;
  status: 'concluido' | 'pendente' | 'processando';
};

type CreditoHistoricoProps = {
  tipo: 'saques' | 'pagamentos';
  valorOriginalCredito: number;
  parcelasPagas?: number;
  valorParcela?: number;
  dataInicioParcelas?: Date;
  intervaloDias?: number;
  jurosAplicados?: number;
};

export function CreditoHistorico({ 
  tipo, 
  valorOriginalCredito,
  parcelasPagas = 0,
  valorParcela = 0,
  dataInicioParcelas = new Date(),
  intervaloDias = 30,
  jurosAplicados = 0,
}: CreditoHistoricoProps) {
  // Gerar transações baseadas nos dados reais
  const gerarTransacoes = (): Transacao[] => {
    const transacoes: Transacao[] = [];

    if (tipo === 'saques') {
      // Saque inicial do crédito
      const dataSaque = new Date(dataInicioParcelas);
      dataSaque.setDate(dataSaque.getDate() - 10); // 10 dias antes do primeiro pagamento
      
      transacoes.push({
        id: 'saque-1',
        tipo: 'saque',
        valor: -valorOriginalCredito,
        data: dataSaque,
        descricao: 'Saque via PIX - Linha de crédito',
        status: 'concluido',
      });
    } else {
      // Gerar pagamentos já realizados (com valor correto da parcela)
      for (let i = 0; i < parcelasPagas; i++) {
        const dataPagamento = new Date(dataInicioParcelas);
        dataPagamento.setDate(dataPagamento.getDate() + (i * intervaloDias));
        
        transacoes.push({
          id: `pagamento-${i + 1}`,
          tipo: 'pagamento',
          valor: valorParcela,
          data: dataPagamento,
          descricao: `Pagamento da ${i + 1}ª parcela`,
          status: 'concluido',
        });
      }

      // Adicionar entrada dos juros (se houver juros aplicados ao plano)
      if (jurosAplicados > 0 && parcelasPagas > 0) {
        const dataJuros = new Date(dataInicioParcelas);
        dataJuros.setDate(dataJuros.getDate() - 2);
        
        transacoes.push({
          id: 'juros-plano',
          tipo: 'juros',
          valor: -jurosAplicados,
          data: dataJuros,
          descricao: 'Juros do plano de pagamento',
          status: 'concluido',
        });
      }
    }

    // Ordenar do mais recente para o mais antigo
    return transacoes.sort((a, b) => b.data.getTime() - a.data.getTime());
  };

  const transacoesFiltradas = gerarTransacoes();
  const getTipoColor = (tipoTransacao: string): 'error' | 'success' | 'warning' | 'info' => {
    switch (tipoTransacao) {
      case 'saque':
        return 'error';
      case 'pagamento':
        return 'success';
      case 'juros':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getTipoIcon = (tipoTransacao: string) => {
    switch (tipoTransacao) {
      case 'saque':
        return 'solar:export-bold';
      case 'pagamento':
        return 'solar:import-bold';
      case 'juros':
        return 'solar:wad-of-money-bold';
      default:
        return 'solar:info-circle-bold';
    }
  };

  const getStatusColor = (statusTransacao: string): 'success' | 'warning' | 'info' => {
    switch (statusTransacao) {
      case 'concluido':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'processando':
        return 'info';
      default:
        return 'info';
    }
  };

  const titulo = tipo === 'saques' ? 'Histórico de Saques' : 'Histórico de Pagamentos';
  const subtitulo = tipo === 'saques' 
    ? 'Todas as retiradas da sua linha de crédito' 
    : 'Todos os pagamentos e juros da sua dívida';

  return (
    <Card sx={{ p: 4, height: 'fit-content' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitulo}
            </Typography>
          </Box>
          <Iconify icon="solar:clock-circle-bold" width={24} />
        </Stack>

        <Divider />

        {/* Lista de transações */}
        <Stack spacing={2}>
          {transacoesFiltradas.map((transacao, index) => (
            <Box key={transacao.id}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {/* Ícone do tipo */}
                <Box
                  sx={(theme) => {
                    const tipoColor = getTipoColor(transacao.tipo);
                    return {
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: `${tipoColor}.lighter`,
                      color: `${tipoColor}.main`,
                      ...theme.applyStyles('dark', {
                        bgcolor: `${tipoColor}.darker`,
                      }),
                    };
                  }}
                >
                  <Iconify icon={getTipoIcon(transacao.tipo)} width={20} />
                </Box>

                {/* Informações da transação */}
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {transacao.descricao}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fDateTimeBR(transacao.data)}
                      </Typography>
                    </Box>
                    <Stack alignItems="flex-end" spacing={0.5}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={transacao.valor > 0 ? 'success.main' : 'error.main'}
                      >
                        {transacao.valor > 0 ? '+' : ''}{fCurrencyBR(Math.abs(transacao.valor))}
                      </Typography>
                      <Chip
                        size="small"
                        label={transacao.status}
                        color={getStatusColor(transacao.status)}
                        variant="soft"
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
              {index < transacoesFiltradas.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>

        {/* Botão ver mais */}
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Ver histórico completo
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
