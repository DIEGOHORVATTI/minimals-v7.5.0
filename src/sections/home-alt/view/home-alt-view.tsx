'use client';

import Stack from '@mui/material/Stack';

import { BackToTopButton } from 'src/components/animate/back-to-top-button';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeFAQs } from 'src/sections/home/home-faqs';
import { HomeMinimal } from 'src/sections/home/home-minimal';
import { HomePricing } from 'src/sections/home/home-pricing';
import { HomeAltHero } from 'src/sections/home-alt/home-alt-hero';
import { HomeIntegrations } from 'src/sections/home/home-integrations';

// ----------------------------------------------------------------------

export function HomeAltView() {
  const pageProgress = useScrollProgress();

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1 })]}
      />

      <BackToTopButton />

      {/* Alternate layout: hero, integrations, pricing, minimal, faqs */}
      <HomeAltHero />

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>
        <HomeIntegrations />
        <HomePricing />
        <HomeMinimal />
        <HomeFAQs />
      </Stack>
    </>
  );
}


