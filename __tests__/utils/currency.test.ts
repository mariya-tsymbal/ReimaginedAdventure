import { formatMoney } from '../../src/utils/currency';

describe('formatMoney', () => {
  it('formats CAD amount', () => {
    expect(formatMoney({ amount: '28.96', currencyCode: 'CAD' })).toBe('CA$28.96');
  });

  it('formats USD amount', () => {
    expect(formatMoney({ amount: '10.00', currencyCode: 'USD' })).toBe('$10.00');
  });

  it('handles zero', () => {
    expect(formatMoney({ amount: '0', currencyCode: 'USD' })).toBe('$0.00');
  });

  it('handles large amounts', () => {
    expect(formatMoney({ amount: '1234.56', currencyCode: 'USD' })).toBe('$1,234.56');
  });

  it('handles string with extra decimals', () => {
    const result = formatMoney({ amount: '9.999', currencyCode: 'USD' });
    expect(result).toBe('$10.00');
  });

  it('handles whole number strings', () => {
    expect(formatMoney({ amount: '5', currencyCode: 'USD' })).toBe('$5.00');
  });
});
