import { useI18n } from '../../contexts/I18nContext'
import { LanguageCode } from '../../constants/brand'
import { Icon } from './Icons'

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, languages, setLanguage, t } = useI18n()

  return (
    <label className={`language-selector ${compact ? 'language-selector-compact' : ''}`}>
      <span className="sr-only">{t('navigation.language')}</span>
      <Icon name="language" />
      <select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)} aria-label={t('navigation.language')}>
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {compact ? item.shortLabel : item.label}
          </option>
        ))}
      </select>
    </label>
  )
}
