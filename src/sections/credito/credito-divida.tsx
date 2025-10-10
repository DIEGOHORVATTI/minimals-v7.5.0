'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrencyBR, fDateBR } from 'src/utils/format-br';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CreditoDividaProps = {
  valorDivida: number;
  valorParcela: number;
  parcelasPagas: number;
  totalParcelas: number;
  proximoVencimento: Date;
  frequenciaAtual: string;
  valorTotalComJuros: number;
};

export function CreditoDivida({
  valorDivida,
  valorParcela,
  parcelasPagas,
  totalParcelas,
  proximoVencimento,
  frequenciaAtual,
  valorTotalComJuros,
}: CreditoDividaProps) {
  const parcelasRestantes = totalParcelas - parcelasPagas;
  const percentualPago = (parcelasPagas / totalParcelas) * 100;
  const diasParaVencimento = Math.ceil((proximoVencimento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const valorJaQuitado = parcelasPagas * valorParcela;

  return (
    <Card sx={{ p: 4, position: 'relative', overflow: 'hidden', height: 'fit-content' }}>
      {/* Background pattern */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          right: 0,
          width: 200,
          height: 200,
          opacity: 0.08,
          background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        })}
      />

      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Saldo devedor atual
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
              {fCurrencyBR(valorDivida)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              de {fCurrencyBR(valorTotalComJuros)} • Plano {frequenciaAtual}
            </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 2,
              bgcolor: theme.palette.error.lighter,
              color: theme.palette.error.main,
            })}
          >
            <Iconify icon="solar:bill-list-bold-duotone" width={32} />
          </Box>
        </Stack>

        {/* Alerta de próximo vencimento */}
        <Alert
          severity={diasParaVencimento <= 3 ? 'error' : 'warning'}
          icon={<Iconify icon="solar:clock-circle-bold-duotone" />}
        >
          <Typography variant="caption" fontWeight={600}>
            Próximo vencimento: {fDateBR(proximoVencimento)} ({diasParaVencimento} dias)
          </Typography>
        </Alert>

        {/* Informação do plano ativo */}
        <Box
          sx={(theme) => ({
            p: 2.5,
            borderRadius: 2,
            bgcolor: theme.palette.info.lighter,
            border: `1px solid ${theme.palette.info.light}`,
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify icon="solar:calendar-mark-bold-duotone" width={20} color="info.main" />
            <Typography variant="subtitle2" fontWeight={600}>
              Plano Ativo: Pagamento {frequenciaAtual}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {totalParcelas} parcelas • Período: 1 ano • Vencimento a cada {
              frequenciaAtual === 'semanal' ? '7 dias' :
              frequenciaAtual === 'mensal' ? '30 dias' :
              frequenciaAtual === 'trimestral' ? '3 meses' : '6 meses'
            }
          </Typography>
        </Box>

        {/* Informações das parcelas */}
        <Box
          sx={(theme) => ({
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.grey[50],
            border: `1px solid ${theme.palette.grey[200]}`,
          })}
        >
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Valor da parcela
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {fCurrencyBR(valorParcela)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Já quitado
              </Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">
                {fCurrencyBR(valorJaQuitado)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Parcelas pagas
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {parcelasPagas} de {totalParcelas}
              </Typography>
            </Stack>

            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Progresso
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {percentualPago.toFixed(1).replace('.', ',')}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={percentualPago}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    bgcolor: 'success.main',
                  },
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Parcelas restantes
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {parcelasRestantes} × {fCurrencyBR(valorParcela)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Botão de pagamento */}
        <Button
          variant="contained"
          size="large"
          color="primary"
          fullWidth
          startIcon={<Iconify icon="solar:card-transfer-bold-duotone" />}
        >
          Pagar parcela atual
        </Button>
      </Stack>
    </Card>
  );
}
