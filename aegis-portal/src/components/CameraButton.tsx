import React from 'react'
import { useI18n } from '../contexts/I18nContext'
import { Icon } from './ui/Icons'

export default function CameraButton({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const { t } = useI18n()
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onCapture(reader.result)
    }
    reader.readAsDataURL(file)
    event.currentTarget.value = ''
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onChange}
        className="sr-only"
        aria-label={t('upload.photoEvidence')}
      />
      <button type="button" onClick={() => fileRef.current?.click()} className="camera-dropzone">
        <Icon name="camera" />
        <strong>{t('upload.openCamera')}</strong>
        <span>{t('upload.photoHint')}</span>
      </button>
    </div>
  )
}
