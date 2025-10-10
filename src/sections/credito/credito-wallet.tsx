'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
    <Card sx={{ p: 4, position: 'relative', overflow: 'hidden' }}>
      {/* Background pattern */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          right: 0,
          width: 250,
          height: 250,
          opacity: 0.08,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          borderRadius: '50%',
          transform: 'translate(40%, -40%)',
        })}
      />

      <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header com saldo disponível */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Crédito total
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>
              {fCurrencyBR(limiteTotal)}
            </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.secondary.lighter,
              color: theme.palette.secondary.main,
            })}
          >
            <Iconify icon="solar:wallet-bold-duotone" width={40} />
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
              bgcolor: theme.palette.success.lighter,
              border: `1px solid ${theme.palette.success.light}`,
            })}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Iconify icon="solar:check-circle-bold-duotone" width={18} color="success.main" />
              <Typography variant="caption" color="success.dark" fontWeight={600}>
                Disponível para saque
              </Typography>
            </Stack>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {fCurrencyBR(saldoDisponivel)}
            </Typography>
          </Box>

          <Box
            sx={(theme) => ({
              p: 2.5,
              borderRadius: 2,
              bgcolor: theme.palette.grey[100],
              border: `1px solid ${theme.palette.grey[300]}`,
            })}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Iconify icon="solar:download-minimalistic-bold-duotone" width={18} color="text.secondary" />
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
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: 'secondary.main',
              },
            }}
          />
        </Box>

        {/* Botão de saque */}
        <Button
          variant="contained"
          size="large"
          color="secondary"
          fullWidth
          startIcon={<Iconify icon="solar:download-bold-duotone" />}
          disabled={saldoDisponivel <= 0}
        >
          {saldoDisponivel > 0 ? 'Sacar agora' : 'Sem saldo disponível'}
        </Button>
      </Stack>
    </Card>
  );
}
