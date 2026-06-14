type IconName =
  | 'shield'
  | 'chart'
  | 'database'
  | 'map'
  | 'spark'
  | 'panel'
  | 'report'
  | 'route'
  | 'camera'
  | 'menu'
  | 'close'
  | 'arrow'
  | 'check'
  | 'alert'
  | 'search'
  | 'language'

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const common = `icon ${className}`

  if (name === 'menu') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'close') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'camera') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7.5 8.5 5h7L17 7.5h2.5A1.5 1.5 0 0 1 21 9v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V9a1.5 1.5 0 0 1 1.5-1.5H7Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  if (name === 'arrow') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (name === 'check') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (name === 'alert') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 2.8 19h18.4L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 9v4m0 3h.01" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'search') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Zm5.5-2 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === 'language') {
    return (
      <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h10M9 5c-.5 4-2.3 7.2-5 9m3.2-4c1.2 1.7 3.1 3.2 5.8 4.4M15 19l4-9 4 9m-6.5-3h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  const paths: Record<Exclude<IconName, 'menu' | 'close' | 'camera' | 'arrow' | 'check' | 'alert' | 'search' | 'language'>, string> = {
    shield: 'M12 3 5 6v5c0 4.2 2.7 7.8 7 10 4.3-2.2 7-5.8 7-10V6l-7-3Z',
    chart: 'M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-7',
    database: 'M5 7c0-2 14-2 14 0s-14 2-14 0Zm0 0v5c0 2 14 2 14 0V7m-14 5v5c0 2 14 2 14 0v-5',
    map: 'M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6Zm5-2v14m6-12v14',
    spark: 'M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z',
    panel: 'M4 5h16v14H4V5Zm0 5h16M10 10v9',
    report: 'M7 3h7l3 3v15H7V3Zm7 0v4h4M9 12h6M9 16h6',
    route: 'M6 6h.01M18 18h.01M6 6c7 0 1 12 12 12',
  }

  return (
    <svg className={common} viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
