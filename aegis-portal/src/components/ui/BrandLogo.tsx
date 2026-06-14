import { BRAND } from '../../constants/brand'

type BrandLogoProps = {
  compact?: boolean
  className?: string
}

export function BrandLogo({ compact = false, className = '' }: BrandLogoProps) {
  return (
    <span className={`brand-lockup ${className}`}>
      <span className="brand-logo-frame" aria-hidden="true">
        <img src={BRAND.logoPath} alt="" className="brand-logo-image" />
      </span>
      {!compact && (
        <span className="brand-text">
          <span className="brand-name">{BRAND.name}</span>
          <span className="brand-subtitle">AI-Powered Transparency and Infrastructure Intelligence</span>
        </span>
      )}
    </span>
  )
}
