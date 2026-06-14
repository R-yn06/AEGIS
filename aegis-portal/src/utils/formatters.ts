export function peso(value: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function shortPeso(value: number) {
  if (value >= 1_000_000_000) return `PHP ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `PHP ${(value / 1_000_000).toFixed(1)}M`
  return peso(value)
}

export function signedPercent(value: number) {
  return `${value > 0 ? '+' : ''}${value}%`
}
