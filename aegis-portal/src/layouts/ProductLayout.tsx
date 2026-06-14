import React from 'react'
import { APP_NAVIGATION, AppView } from '../constants/navigation'
import { useI18n } from '../contexts/I18nContext'
import { useToast } from '../contexts/ToastContext'
import { BrandLogo } from '../components/ui/BrandLogo'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icons'
import { LanguageSelector } from '../components/ui/LanguageSelector'

type ProductLayoutProps = {
  activeView: AppView
  onNavigate: (view: AppView) => void
  children: React.ReactNode
}

export function ProductLayout({ activeView, onNavigate, children }: ProductLayoutProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <div className="product-shell">
      <aside className="product-sidebar">
        <BrandLogo />
        <nav aria-label="Application">
          {APP_NAVIGATION.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={activeView === item.id ? 'active' : ''}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>
      </aside>

      <div className="product-main">
        <header className="product-header">
          <button className="mobile-menu-button" type="button" onClick={() => setIsMenuOpen((value) => !value)} aria-expanded={isMenuOpen} aria-label={isMenuOpen ? t('navigation.close') : t('navigation.menu')}>
            <Icon name={isMenuOpen ? 'close' : 'menu'} />
          </button>
          <BrandLogo compact />
          <div className="product-header-actions">
            <LanguageSelector compact />
            <Button variant="ghost" onClick={() => showToast(t('common.demoToast'))}>{t('navigation.login')}</Button>
          </div>
        </header>

        {isMenuOpen && (
          <div className="mobile-product-nav">
            {APP_NAVIGATION.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id)
                  setIsMenuOpen(false)
                }}
                className={activeView === item.id ? 'active' : ''}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        )}

        <main className="product-content">{children}</main>
      </div>
    </div>
  )
}
