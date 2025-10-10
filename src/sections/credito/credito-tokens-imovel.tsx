'use client';

import { fCurrencyBR } from 'src/utils/format-br';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';

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
    <Card 
      sx={{ 
        p: 4, 
        position: 'relative', 
        overflow: 'hidden',
        background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter} 100%)`,
      }}
    >
      {/* Background pattern */}
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          right: 0,
          width: 300,
          height: 300,
          opacity: 0.05,
          background: `radial-gradient(circle, ${theme.palette.primary.main}, transparent)`,
          transform: 'translate(30%, -30%)',
        })}
      />

      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
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
            <Iconify icon="solar:home-2-bold-duotone" width={32} />
          </Box>
        </Stack>

        {/* Alerta informativo */}
        <Alert severity="info" icon={<Iconify icon="solar:info-circle-bold-duotone" />}>
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

        {/* Progresso de quitação */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Progresso de liberação dos tokens
            </Typography>
            <Typography variant="body2" fontWeight={600} color="success.main">
              {percentualQuitado.toFixed(1).replace('.', ',')}% liberado
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={percentualQuitado}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: (theme) => 
                  `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
              },
            }}
          />

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography variant="caption" color="success.main">
              {tokensQuitados.toFixed(2).replace('.', ',')}% liberados
            </Typography>
            <Typography variant="caption" color="warning.main">
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
              bgcolor: theme.palette.success.lighter,
              border: `1px solid ${theme.palette.success.light}`,
            })}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Iconify icon="solar:check-circle-bold-duotone" width={20} color="success.main" />
              <Typography variant="caption" color="success.dark" fontWeight={600}>
                Tokens liberados
              </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={700} color="success.main">
              {tokensQuitados.toFixed(2).replace('.', ',')}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fCurrencyBR((valorImovel * tokensQuitados) / 100)}
            </Typography>
          </Box>

          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.warning.lighter,
              border: `1px solid ${theme.palette.warning.light}`,
            })}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Iconify icon="solar:lock-bold-duotone" width={20} color="warning.main" />
              <Typography variant="caption" color="warning.dark" fontWeight={600}>
                Tokens vinculados
              </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={700} color="warning.main">
              {tokensRestantes.toFixed(2).replace('.', ',')}%
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
            bgcolor: theme.palette.grey[50],
            border: `1px dashed ${theme.palette.divider}`,
          })}
        >
          <Stack direction="row" spacing={1.5}>
            <Iconify icon="solar:lightbulb-bolt-bold-duotone" width={24} color="primary.main" />
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
