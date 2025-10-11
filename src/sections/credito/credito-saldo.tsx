'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CreditoSaldoProps = {
  saldoAtual: number;
  saldoDisponivel: number;
};

export function CreditoSaldo({ saldoAtual, saldoDisponivel }: CreditoSaldoProps) {
  const limiteTotal = saldoAtual + saldoDisponivel;
  const percentualUsado = (saldoAtual / limiteTotal) * 100;

  return (
    <Card sx={{ p: 4, position: 'relative', overflow: 'hidden' }}>
      {/* Background pattern */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          right: 0,
          width: 200,
          height: 200,
          opacity: 0.1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        })}
      />

      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              {fCurrency(saldoAtual)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saldo atual utilizado
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
            <Iconify icon="solar:bill-list-bold-duotone" width={32} />
          </Box>
        </Stack>

        {/* Progress bar */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Limite utilizado
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {percentualUsado.toFixed(0)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={percentualUsado}
            sx={(theme) => ({
              height: 8,
              borderRadius: 4,
              bgcolor: 'grey.200',
              ...theme.applyStyles('dark', {
                bgcolor: 'grey.700',
              }),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #8E33FF 0%, #00A76F 100%)',
              },
            })}
          />
        </Box>

        {/* Info cards */}
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
              p: 2,
              borderRadius: 2,
              bgcolor: 'grey.50',
              border: `1px solid`,
              borderColor: 'grey.200',
              ...theme.applyStyles('dark', {
                bgcolor: 'grey.800',
                borderColor: 'grey.700',
              }),
            })}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Disponível
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {fCurrency(saldoDisponivel)}
            </Typography>
          </Box>

          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: 2,
              bgcolor: 'grey.50',
              border: `1px solid`,
              borderColor: 'grey.200',
              ...theme.applyStyles('dark', {
                bgcolor: 'grey.800',
                borderColor: 'grey.700',
              }),
            })}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Limite total
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {fCurrency(limiteTotal)}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}
