'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrencyBR } from 'src/utils/format-br';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CreditoWalletProps = {
  limiteTotal: number;
  saldoDisponivel: number;
  saldoUtilizado: number;
};

export function CreditoWallet({ limiteTotal, saldoDisponivel, saldoUtilizado }: CreditoWalletProps) {
  const percentualUsado = (saldoUtilizado / limiteTotal) * 100;

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        {/* Header com saldo disponível */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Crédito total
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {fCurrencyBR(limiteTotal)}
            </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              ...theme.applyStyles('dark', {
                bgcolor: 'primary.darker',
              }),
            })}
          >
            <Iconify icon="solar:bill-list-bold-duotone" width={40} />
          </Box>
        </Stack>

        {/* Cards de saldo */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },
          }}
        >
          <Box
            sx={(theme) => ({
              p: 2.5,
              borderRadius: 2,
              border: `2px solid ${theme.palette.divider}`,
            })}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Iconify icon="solar:check-circle-bold" width={18} color="primary.main" />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Disponível para saque
              </Typography>
            </Stack>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {fCurrencyBR(saldoDisponivel)}
            </Typography>
          </Box>

          <Box
            sx={(theme) => ({
              p: 2.5,
              borderRadius: 2,
              border: `2px solid ${theme.palette.divider}`,
            })}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Iconify icon="solar:download-bold" width={18} color="text.secondary" />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Já sacado
              </Typography>
            </Stack>
            <Typography variant="h5" fontWeight={700}>
              {fCurrencyBR(saldoUtilizado)}
            </Typography>
          </Box>
        </Box>

        {/* Barra de progresso */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Utilização do crédito
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {percentualUsado.toFixed(1).replace('.', ',')}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={percentualUsado}
            sx={(theme) => ({
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.300',
              ...theme.applyStyles('dark', {
                bgcolor: 'grey.700',
              }),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: 'primary.main',
              },
            })}
          />
        </Box>

        {/* Botão de saque */}
        <Button
          variant="contained"
          size="large"
          color="primary"
          fullWidth
          startIcon={<Iconify icon="solar:download-bold" />}
          disabled={saldoDisponivel <= 0}
        >
          {saldoDisponivel > 0 ? 'Sacar agora' : 'Sem saldo disponível'}
        </Button>
      </Stack>
    </Card>
  );
}
