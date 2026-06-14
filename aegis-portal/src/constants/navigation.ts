export type AppView = 'home' | 'dashboard' | 'upload' | 'suppliers'

export const APP_NAVIGATION: Array<{ id: AppView; labelKey: string }> = [
  { id: 'home', labelKey: 'navigation.home' },
  { id: 'dashboard', labelKey: 'navigation.dashboard' },
  { id: 'upload', labelKey: 'navigation.upload' },
  { id: 'suppliers', labelKey: 'navigation.suppliers' },
]

export const LANDING_LINKS = [
  { id: 'features', labelKey: 'navigation.features' },
  { id: 'about', labelKey: 'navigation.about' },
  { id: 'contact', labelKey: 'navigation.contact' },
] as const
