import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { MotionContainer } from 'src/components/animate';

import { HeroBackground } from 'src/sections/home/components/hero-background';

// ----------------------------------------------------------------------

export function HomeAltHero({ sx, ...other }: BoxProps) {
  const renderHeading = () => (
    <m.div>
      <Box
        component="h1"
        sx={[(theme) => ({
          my: 0,
          mx: 'auto',
          maxWidth: 680,
          display: 'flex',
          flexWrap: 'wrap',
          typography: 'h2',
          justifyContent: 'center',
          fontFamily: theme.typography.fontSecondaryFamily,
          [theme.breakpoints.up('lg')]: {
            fontSize: theme.typography.pxToRem(72),
            lineHeight: '90px',
          },
        })]}
      >
        <Box component="span" sx={{ width: 1, opacity: 0.24 }}>
          Crédito rápido e flexível com
        </Box>
        <Box component="span" sx={(theme) => ({ px: 1 })} />
        <Box component="span" sx={(theme) => ({ color: theme.vars.palette.secondary.light })}>
          Disponebla
        </Box>
      </Box>
    </m.div>
  );

  return (
    <Box
      component="section"
      sx={[(theme) => ({
        overflow: 'hidden',
        position: 'relative',
        minHeight: 'calc(100vh - var(--layout-header-mobile-height))',
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.up('md')]: {
          minHeight: 'calc(100vh - var(--layout-header-desktop-height))',
        },
      }), ...(Array.isArray(sx) ? sx : [sx]) ]}
      {...other}
    >
      <Box
        component={m.div}
        sx={[(theme) => ({
          width: 1,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
        })]}
      >
        <Container
          component={MotionContainer}
          sx={[(theme) => ({
            py: 4,
            gap: 5,
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [theme.breakpoints.up('md')]: { py: 6 },
          })]}
        >
          <Stack spacing={3} sx={{ textAlign: 'center' }}>
            {renderHeading()}
          </Stack>
        </Container>

        <HeroBackground />
      </Box>
    </Box>
  );
}


