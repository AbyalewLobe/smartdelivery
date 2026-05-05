import { useState } from 'react';

interface BilingualValue {
  en: string;
  am: string;
}

interface BilingualInputProps {
  label: string;
  value: BilingualValue;
  onChange: (value: BilingualValue) => void;
  placeholder?: { en: string; am: string };
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  className?: string;
}

export function BilingualInput({
  label, value, onChange, placeholder, multiline = false, rows = 3, required, className = ''
}: BilingualInputProps) {
  const [lang, setLang] = useState<'en' | 'am'>('en');

  const fieldClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all resize-none";

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-white/60">{label}{required && ' *'}</label>
        {/* Language toggle */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
          <button type="button" onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === 'en' ? 'bg-primary-500 text-white' : 'text-white/40 hover:text-white'
            }`}>EN</button>
          <button type="button" onClick={() => setLang('am')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === 'am' ? 'bg-primary-500 text-white' : 'text-white/40 hover:text-white'
            }`}>አማ</button>
        </div>
      </div>

      {multiline ? (
        <textarea
          value={value[lang]}
          onChange={e => onChange({ ...value, [lang]: e.target.value })}
          placeholder={placeholder?.[lang] || ''}
          rows={rows}
          required={required && !value.en && !value.am}
          className={fieldClass}
          dir={lang === 'am' ? 'auto' : 'ltr'}
        />
      ) : (
        <input
          type="text"
          value={value[lang]}
          onChange={e => onChange({ ...value, [lang]: e.target.value })}
          placeholder={placeholder?.[lang] || ''}
          required={required && !value.en && !value.am}
          className={fieldClass}
          dir={lang === 'am' ? 'auto' : 'ltr'}
        />
      )}

      {/* Show both values as hints if both filled */}
      {value.en && value.am && (
        <p className="mt-1 text-xs text-white/20">
          EN: {value.en} · አማ: {value.am}
        </p>
      )}
    </div>
  );
}
