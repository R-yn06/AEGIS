export const BRAND = {
  name: 'AEGIS',
  productName: 'AEGIS',
  logoPath: '/aegis-logo.png',
  contactEmail: 'innovationcup@aegis.ph',
  contactPhone: '+63 936 927 3608',
  address: 'Davao City, Philippines',
} as const

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'tl', label: 'Tagalog', shortLabel: 'TL' },
  { code: 'ceb', label: 'Cebuano', shortLabel: 'CEB' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code']
