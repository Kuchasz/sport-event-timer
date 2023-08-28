import { pl } from './pl';
import { en } from './en';

const languages = {
    pl, en
} as const;

export type Translation = typeof en;

type Languages = keyof typeof languages;

export const translations = (lang: Languages) => languages[lang];

export const useTranslations = () => {
    return en;
    // const { locale } = useRouter();
    // return translations(locale as Languages);
}