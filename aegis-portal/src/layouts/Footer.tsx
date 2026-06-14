import { BRAND } from '../constants/brand'
import { LANDING_LINKS } from '../constants/navigation'
import { useI18n } from '../contexts/I18nContext'
import { BrandLogo } from '../components/ui/BrandLogo'

export function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-grid">
        <div>
          <BrandLogo />
          <p>{t('footer.tagline')}</p>
        </div>
        <div>
          <h3>{t('footer.quickLinks')}</h3>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t('navigation.home')}</button>
          {LANDING_LINKS.map((item) => (
            <button key={item.id} type="button" onClick={() => onNavigate(item.id)}>
              {t(item.labelKey)}
            </button>
          ))}
        </div>
        <div>
          <h3>{t('footer.contact')}</h3>
          <p>{BRAND.contactEmail}</p>
          <p>{BRAND.contactPhone}</p>
          <p>{BRAND.address}</p>
        </div>
        <div>
          <h3>{t('footer.social')}</h3>
          <p>LinkedIn</p>
          <p>GitHub</p>
          <p>Transparency Network</p>
        </div>
      </div>
      <div className="footer-bottom">© {year} {BRAND.productName}. {t('footer.rights')}</div>
    </footer>
  )
}
