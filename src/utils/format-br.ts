import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

// ----------------------------------------------------------------------

dayjs.locale('pt-br');

// ----------------------------------------------------------------------

/**
 * Formata valor em moeda brasileira (R$ 0.000,00)
 */
export function fCurrencyBR(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ----------------------------------------------------------------------

/**
 * Formata data no padrão brasileiro (dd/MM/yyyy)
 */
export function fDateBR(input: Date | string | number | null | undefined): string {
  if (!input) return '';
  
  const date = dayjs(input);
  if (!date.isValid()) return 'Data inválida';
  
  return date.format('DD/MM/YYYY');
}

// ----------------------------------------------------------------------

/**
 * Formata data e hora no padrão brasileiro (dd/MM/yyyy às HH:mm)
 */
export function fDateTimeBR(input: Date | string | number | null | undefined): string {
  if (!input) return '';
  
  const date = dayjs(input);
  if (!date.isValid()) return 'Data inválida';
  
  return date.format('DD/MM/YYYY [às] HH:mm');
}

// ----------------------------------------------------------------------

/**
 * Formata data por extenso (1 de janeiro de 2024)
 */
export function fDateExtensoBR(input: Date | string | number | null | undefined): string {
  if (!input) return '';
  
  const date = dayjs(input);
  if (!date.isValid()) return 'Data inválida';
  
  return date.format('D [de] MMMM [de] YYYY');
}
