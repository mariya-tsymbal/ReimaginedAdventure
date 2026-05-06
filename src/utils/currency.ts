import type { MoneyV2 } from '../types/product';

export function formatMoney(money: MoneyV2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseFloat(money.amount));
}
