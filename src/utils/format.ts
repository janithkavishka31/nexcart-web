export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value?: string) {
  return value
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
    : 'Not available';
}
