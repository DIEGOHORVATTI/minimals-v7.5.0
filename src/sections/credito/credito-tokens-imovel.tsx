'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrencyBR } from 'src/utils/format-br';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type CreditoTokensImovelProps = {
  valorDivida: number;
  valorOriginalCredito: number; // Valor total que foi sacado (base para o cálculo)
  percentualTokens: number; // % de tokens do imóvel que correspondem à dívida total
  valorImovel: number;
  enderecoImovel: string;
};

export function CreditoTokensImovel({
  valorDivida,
  valorOriginalCredito,
  percentualTokens,
  valorImovel,
  enderecoImovel,
}: CreditoTokensImovelProps) {
  // Cálculos corrigidos
  const valorTokensVinculados = (valorImovel * percentualTokens) / 100;
  
  // Percentual quitado = quanto já foi pago do crédito original
  // Ex: Paguei R$ 625 de R$ 2500 = 25% quitado
  const valorPago = valorOriginalCredito - valorDivida;
  const percentualQuitado = (valorPago / valorOriginalCredito) * 100;
  
  // Tokens liberados = % quitado aplicado aos tokens vinculados
  // Ex: 25% de 30% = 7,5% de tokens liberados
  const tokensQuitados = (percentualQuitado / 100) * percentualTokens;
  const tokensRestantes = percentualTokens - tokensQuitados;

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Tokens do Imóvel Vinculados
              </Typography>
              <Chip 
                label="Garantia" 
                size="small" 
                color="primary" 
                variant="soft"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {enderecoImovel}
            </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 2,
              bgcolor: theme.palette.primary.lighter,
              color: theme.palette.primary.main,
            })}
          >
            <Iconify icon="solar:home-2-outline" width={32} />
          </Box>
        </Stack>

        {/* Alerta informativo */}
        <Alert severity="info" icon={<Iconify icon="solar:info-circle-bold" />}>
          <Typography variant="caption">
            <strong>{percentualTokens}% dos tokens</strong> deste imóvel foram vinculados como garantia da sua dívida.  
            <strong>{tokensRestantes.toFixed(2).replace('.', ',')}%</strong> ainda estão vinculados.  
            Conforme você paga, os tokens são liberados proporcionalmente.
          </Typography>
        </Alert>

        {/* Informações do imóvel */}
        <Box
          sx={(theme) => ({
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Valor do imóvel
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {fCurrencyBR(valorImovel)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Tokens vinculados ({percentualTokens}%)
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {fCurrencyBR(valorTokensVinculados)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Progresso de liberação */}
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Progresso de liberação dos tokens
          </Typography>

          <LinearProgress
            variant="determinate"
            value={(tokensQuitados / percentualTokens) * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                bgcolor: 'primary.main',
              },
            }}
          />

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography variant="caption" color="primary.main">
              {tokensQuitados.toFixed(2).replace('.', ',')}% liberados
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {tokensRestantes.toFixed(2).replace('.', ',')}% vinculados
            </Typography>
          </Stack>
        </Box>

        {/* Resumo dos tokens */}
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
              border: `2px solid ${theme.palette.divider}`,
            })}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Iconify icon="solar:check-circle-bold" width={20} color="primary.main" />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Tokens liberados
              </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={700} color="primary.main" component="div">
              {tokensQuitados.toFixed(2).replace('.', ',')}%{' '}
              <Typography component="span" variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                do imóvel
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fCurrencyBR((valorImovel * tokensQuitados) / 100)}
            </Typography>
          </Box>

          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: 2,
              border: `2px solid ${theme.palette.divider}`,
            })}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Iconify icon="solar:lock-password-outline" width={20} color="text.secondary" />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Tokens vinculados
              </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={700} component="div">
              {tokensRestantes.toFixed(2).replace('.', ',')}%{' '}
              <Typography component="span" variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                do imóvel
              </Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fCurrencyBR((valorImovel * tokensRestantes) / 100)}
            </Typography>
          </Box>
        </Box>

        {/* Informação adicional */}
        <Box
          sx={(theme) => ({
            p: 2,
            borderRadius: 2,
            border: `1px dashed ${theme.palette.divider}`,
          })}
        >
          <Stack direction="row" spacing={1.5}>
            <Iconify icon="solar:info-circle-bold" width={24} color="primary.main" />
            <Box>
              <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                Como funciona?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cada pagamento libera proporcionalmente seus tokens do imóvel.  
                Quando quitar 100% da dívida, você terá {percentualTokens}% dos tokens totalmente liberados para negociação.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
