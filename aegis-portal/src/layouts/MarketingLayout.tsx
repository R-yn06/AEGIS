import React from 'react'
import { LANDING_LINKS } from '../constants/navigation'
import { useI18n } from '../contexts/I18nContext'
import { useToast } from '../contexts/ToastContext'
import { useScrollState } from '../hooks/useScrollState'
import { BrandLogo } from '../components/ui/BrandLogo'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icons'
import { LanguageSelector } from '../components/ui/LanguageSelector'
import { Footer } from './Footer'

type MarketingLayoutProps = {
  children: React.ReactNode
  onOpenApp: () => void
}

export function MarketingLayout({ children, onOpenApp }: MarketingLayoutProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const isScrolled = useScrollState()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsMenuOpen(false)
  }

  return (
    <div className="app-shell">
      <header className={`top-nav ${isScrolled ? 'top-nav-scrolled' : ''}`}>
        <div className="nav-container">
          <button type="button" className="brand-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <BrandLogo />
          </button>

          <nav className="desktop-nav" aria-label="Primary">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t('navigation.home')}</button>
            {LANDING_LINKS.map((item) => (
              <button key={item.id} type="button" onClick={() => scrollToSection(item.id)}>
                {t(item.labelKey)}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            <LanguageSelector />
            <Button variant="ghost" onClick={() => showToast(t('common.demoToast'))}>{t('navigation.login')}</Button>
            <Button onClick={onOpenApp}>{t('common.getStarted')}</Button>
          </div>

          <button className="mobile-menu-button" type="button" onClick={() => setIsMenuOpen((value) => !value)} aria-expanded={isMenuOpen} aria-label={isMenuOpen ? t('navigation.close') : t('navigation.menu')}>
            <Icon name={isMenuOpen ? 'close' : 'menu'} />
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-nav-panel">
            <button type="button" onClick={() => scrollToSection('top')}>{t('navigation.home')}</button>
            {LANDING_LINKS.map((item) => (
              <button key={item.id} type="button" onClick={() => scrollToSection(item.id)}>
                {t(item.labelKey)}
              </button>
            ))}
            <LanguageSelector />
            <Button onClick={onOpenApp}>{t('common.getStarted')}</Button>
          </div>
        )}
      </header>

      {children}
      <Footer onNavigate={scrollToSection} />
    </div>
  )
}
