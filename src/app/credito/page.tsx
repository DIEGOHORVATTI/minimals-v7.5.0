import type { Metadata } from 'next';

import { CreditoView } from 'src/sections/credito/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Linha de Crédito | Disponebla',
  description: 'Gerencie sua linha de crédito com flexibilidade. Veja seu saldo, histórico de movimentações e simule diferentes opções de pagamento.',
};

export default function Page() {
  return <CreditoView />;
}
