import type { Metadata } from 'next';

import { HomeAltView } from 'src/sections/home-alt/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Alternate Home | Minimals UI',
  description: 'An alternate landing layout built with the same design system.',
};

export default function Page() {
  return <HomeAltView />;
}


