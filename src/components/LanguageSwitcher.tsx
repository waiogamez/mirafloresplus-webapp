/**
 * Language Switcher - Miraflores Plus
 * Componente para cambiar de idioma
 */

import { Globe, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTranslation, SupportedLocale } from '../utils/i18n';
import { trackEvent } from '../utils/analytics';

interface Language {
  code: SupportedLocale;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'es', name: 'Español', flag: '🇬🇹' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    trackEvent('language_changed', { from: locale, to: newLocale });
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Cambiar idioma / Change language"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {locale === language.code && (
              <Check className="h-4 w-4 text-[#0477BF]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente simple de selector (para settings)
export function LanguageSelector() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {t('settings.language')} / Language
      </label>
      <div className="grid grid-cols-2 gap-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => setLocale(language.code)}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
              locale === language.code
                ? 'border-[#0477BF] bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">{language.flag}</span>
            <div className="flex-1 text-left">
              <div className="font-medium">{language.name}</div>
              <div className="text-xs text-gray-500">{language.code.toUpperCase()}</div>
            </div>
            {locale === language.code && (
              <Check className="h-5 w-5 text-[#0477BF]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
