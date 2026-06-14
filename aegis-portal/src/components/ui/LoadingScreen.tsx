import { BrandLogo } from './BrandLogo'
import { useI18n } from '../../contexts/I18nContext'

export function LoadingScreen() {
  const { t } = useI18n()

  return (
    <div className="loading-screen">
      <BrandLogo />
      <div className="loading-bar" aria-hidden="true">
        <span />
      </div>
      <p>{t('common.loading')}</p>
    </div>
  )
}
