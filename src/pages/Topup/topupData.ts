import ICON_TRIAL from '../../assets/icons/student/topup/trial.svg';
import ICON_START from '../../assets/icons/student/topup/start.svg';
import ICON_STANDARD from '../../assets/icons/student/topup/standard.svg';
import ICON_INTENSIVE from '../../assets/icons/student/topup/intensive.svg';

export type PackageTone = 'trial' | 'start' | 'standard' | 'intensive';

export type LessonPackage = {
  id: string;
  name: string;
  tone: PackageTone;
  icon: string;
  pricePerLesson: string;
  pricePackage: string;
  lessons: string;
  tagline: string;
  fit: string;
  recommended?: boolean;
};

export const PACKAGES: LessonPackage[] = [
  {
    id: 'trial',
    name: 'Пробный',
    tone: 'trial',
    icon: ICON_TRIAL,
    pricePerLesson: '595 ₽',
    pricePackage: '1 190 ₽',
    lessons: '2 урока',
    tagline: 'Чтобы попробовать формат',
    fit: 'Подходит чтобы попробовать формат',
  },
  {
    id: 'start',
    name: 'Старт',
    tone: 'start',
    icon: ICON_START,
    pricePerLesson: '548 ₽',
    pricePackage: '2 190 ₽',
    lessons: '4 урока',
    tagline: 'Для спокойного старта',
    fit: 'Подходит для спокойного старта',
  },
  {
    id: 'standard',
    name: 'Стандарт',
    tone: 'standard',
    icon: ICON_STANDARD,
    pricePerLesson: '499 ₽',
    pricePackage: '3 990 ₽',
    lessons: '8 уроков',
    tagline: 'Для стабильного темпа',
    fit: 'Подходит для стабильного темпа обучения',
    recommended: true,
  },
  {
    id: 'intensive',
    name: 'Интенсив',
    tone: 'intensive',
    icon: ICON_INTENSIVE,
    pricePerLesson: '437 ₽',
    pricePackage: '6 990 ₽',
    lessons: '16 уроков',
    tagline: 'Для плотного графика',
    fit: 'Подходит для плотного графика',
  },
];
