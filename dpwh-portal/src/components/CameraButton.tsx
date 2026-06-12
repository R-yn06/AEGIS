import React from 'react';

export default function CameraButton({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  function trigger() {
    fileRef.current?.click();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onCapture(reader.result);
    };
    reader.readAsDataURL(f);
    e.currentTarget.value = '';
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onChange}
        className="hidden"
      />
      <button type="button" onClick={trigger} className="px-3 py-2 bg-emerald-500 text-white rounded">
        Take photo / Upload
      </button>
    </div>
  );
}