'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { CreditoDivida } from '../credito-divida';
import { CreditoWallet } from '../credito-wallet';
import { CreditoHistorico } from '../credito-historico';
import { CreditoTokensImovel } from '../credito-tokens-imovel';
import { CreditoPlanoPagamento } from '../credito-plano-pagamento';

// ----------------------------------------------------------------------

export function CreditoView() {
  const [abaAtual, setAbaAtual] = useState(0);

  // ========== FONTE ÚNICA DE VERDADE ==========
  
  // ===== 1. LINHA DE CRÉDITO (WALLET) - FIXO E INDEPENDENTE =====
  // Valor recebido pelos tokens do imóvel - NUNCA MUDA!
  const valorCreditoRecebido = 200000; // R$ 200.000 recebidos pelos 30% do imóvel
  const valorJaSacado = 50000; // Quanto já foi sacado/usado da linha de crédito
  const saldoDisponivel = valorCreditoRecebido - valorJaSacado; // R$ 150.000 ainda disponível para saque
  const saldoUtilizado = valorJaSacado; // R$ 50.000 já sacado
  
  // ===== 2. IMÓVEL E TOKENS =====
  const valorImovel = 666666; // Valor do imóvel
  const percentualTokensVinculados = 30; // 30% vinculados = R$ 200.000
  const enderecoImovel = 'Rua das Flores, 123 - São Paulo/SP';
  
  // ===== 3. DÍVIDA (PAGAMENTOS) - BASEADA NOS TOKENS VINCULADOS =====
  // A dívida é o valor dos tokens vinculados que você precisa pagar para liberá-los
  const valorTokensVinculados = (valorImovel * percentualTokensVinculados) / 100; // R$ 200.000
  const valorOriginalDivida = valorTokensVinculados; // Dívida = valor dos tokens vinculados
  
  // Configuração do parcelamento (PERÍODO FIXO: 1 ANO)
  const frequenciaAtual: 'semanal' | 'mensal' | 'trimestral' | 'semestral' = 'mensal';
  
  // Parcelas baseadas na frequência escolhida
  const configParcelas = {
    semanal: { dias: 7, total: 52, juros: 15.0 },
    mensal: { dias: 30, total: 12, juros: 0 },
    trimestral: { dias: 91, total: 4, juros: 5.0 },
    semestral: { dias: 182, total: 2, juros: 12.0 },
  };
  
  const config = configParcelas[frequenciaAtual];
  const totalParcelas = config.total;
  const parcelasPagas = 1; // Número de parcelas já pagas
  const intervaloDias = config.dias;
  
  // Calcular valor da parcela com juros
  const jurosAplicados = (valorOriginalDivida * config.juros) / 100;
  const valorTotalComJuros = valorOriginalDivida + jurosAplicados;
  const valorParcela = valorTotalComJuros / totalParcelas;
  
  // Data de início (outubro de 2025)
  const dataInicioParcelas = new Date('2025-10-01'); // Data do primeiro pagamento
  
  // Pagamentos e Dívida
  const valorPago = parcelasPagas * valorParcela; // Quanto já foi pago
  const valorDivida = valorTotalComJuros - valorPago; // Dívida restante (= valor dos tokens ainda vinculados)
  
  // Próximo vencimento
  const proximoVencimento = new Date(dataInicioParcelas);
  proximoVencimento.setDate(proximoVencimento.getDate() + (parcelasPagas * intervaloDias));

  const handleAbaChange = (_event: React.SyntheticEvent, novaAba: number) => {
    setAbaAtual(novaAba);
  };

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
              Minha Conta
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Gerencie sua linha de crédito e acompanhe seus pagamentos.
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={abaAtual}
              onChange={handleAbaChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 64,
                },
              }}
            >
              <Tab
                icon={<Iconify icon="solar:bill-list-bold-duotone" width={24} />}
                iconPosition="start"
                label="Linha de Crédito"
              />
              <Tab
                icon={<Iconify icon="solar:home-2-outline" width={24} />}
                iconPosition="start"
                label="Imóvel Vinculado"
              />
              <Tab
                icon={<Iconify icon="solar:transfer-horizontal-bold-duotone" width={24} />}
                iconPosition="start"
                label="Pagamento"
              />
            </Tabs>
          </Box>

          {/* Conteúdo das abas */}
          <Box sx={{ pt: 2 }}>
            {/* Aba 1: Linha de Crédito */}
            {abaAtual === 0 && (
              <Stack spacing={4}>
                <CreditoWallet 
                  limiteTotal={valorCreditoRecebido}
                  saldoDisponivel={saldoDisponivel}
                  saldoUtilizado={saldoUtilizado}
                />
                <CreditoHistorico 
                  tipo="saques"
                  valorOriginalCredito={valorJaSacado}
                />
              </Stack>
            )}

            {/* Aba 2: Imóvel Vinculado */}
            {abaAtual === 1 && (
              <CreditoTokensImovel
                valorDivida={valorDivida}
                valorOriginalCredito={valorOriginalDivida}
                percentualTokens={percentualTokensVinculados}
                valorImovel={valorImovel}
                enderecoImovel={enderecoImovel}
              />
            )}

            {/* Aba 3: Pagamento */}
            {abaAtual === 2 && (
              <Stack spacing={4}>
                {/* Cards de Dívida e Plano de Pagamento lado a lado */}
                <Box
                  sx={{
                    display: 'grid',
                    gap: 4,
                    gridTemplateColumns: {
                      xs: '1fr',
                      lg: '1fr 1fr',
                    },
                  }}
                >
                  <CreditoDivida
                    valorDivida={valorDivida}
                    valorParcela={valorParcela}
                    parcelasPagas={parcelasPagas}
                    totalParcelas={totalParcelas}
                    proximoVencimento={proximoVencimento}
                    frequenciaAtual={frequenciaAtual}
                    valorTotalComJuros={valorTotalComJuros}
                  />

                  <CreditoPlanoPagamento
                    valorDivida={valorDivida}
                    valorParcela={valorParcela}
                    parcelasPagas={parcelasPagas}
                    totalParcelas={totalParcelas}
                    proximoVencimento={proximoVencimento}
                    dataInicioDivida={dataInicioParcelas}
                    intervaloDiasOriginal={intervaloDias}
                  />
                </Box>

                {/* Histórico de Pagamentos */}
                <CreditoHistorico 
                  tipo="pagamentos"
                  valorOriginalCredito={valorOriginalDivida}
                  parcelasPagas={parcelasPagas}
                  valorParcela={valorParcela}
                  dataInicioParcelas={dataInicioParcelas}
                  intervaloDias={intervaloDias}
                  jurosAplicados={jurosAplicados}
                />
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
