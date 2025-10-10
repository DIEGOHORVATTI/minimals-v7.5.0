import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CadastroView } from 'src/sections/cadastro/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Cadastro - ${CONFIG.appName}`,
};

export default function Page() {
  return <CadastroView />;
}

