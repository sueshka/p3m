/**
 * All user-facing copy, kept out of the components so wording can be
 * tuned without touching layout. Text matches the approved design.
 */
import { LINKS } from './links';

export const APP = {
  title: 'Pocket Creator',
  version: 'Pocket Creator · v1.0',
} as const;

export const HOME = {
  greeting: 'Привет,',
  /** Shown when Telegram gives us no first name (desktop web, privacy). */
  greetingFallback: 'creator',
  greetingSub: 'Съёмка на iPhone, цвет и монтаж',
  /** Members get a greeting that acknowledges they already paid. */
  greetingMember: 'Рады видеть,',
  greetingSubMember: 'Подписка активна',
  heroEyebrow: 'Pocket Creator',
  heroTitle: 'Твой личный воркфлоу для контента',
  heroSubtitle: 'Один телефон, понятный пайплайн и результат за один вечер',
  heroCta: 'Вступить в комьюнити',
  tickerStrong: 'Blackmagic Camera стоит 0₽',
  tickerMuted: 'всё дело в руках',
} as const;

export interface Benefit {
  index: string;
  title: string;
  body: string;
}

export const BENEFITS: Benefit[] = [
  {
    index: '01',
    title: '3 урока',
    body: 'Свет, движение камеры и цвет от первого кадра до экспорта.',
  },
  {
    index: '02',
    title: 'Приватное комьюнити',
    body: 'Кидаешь черновик и получаешь честный фидбек, а не лайки.',
  },
  {
    index: '03',
    title: 'Полезные материалы',
    body: 'LUTs, overlays и мои настройки Blackmagic. Забрал и работаешь.',
  },
  {
    index: '04',
    title: 'Разборы',
    body: 'Смотрю твои ролики по пунктам: кадр, ритм, цвет, звук.',
  },
  {
    index: '05',
    title: 'Прямые эфиры',
    body: 'Собираемся вместе: монтируем, грейдим, отвечаю на вопросы.',
  },
];

export const BENEFITS_SECTION = {
  title: 'Что внутри комьюнити',
  meta: '5 блоков',
} as const;

export const COMPARE = {
  title: 'Один кадр, два мира',
  meta: 'тяни в сторону',
  labelAfter: 'Grada LUT',
  labelBefore: 'Log · как с камеры',
  caption:
    'Слева мой грейд из комьюнити, справа сырой файл с телефона. Разница только в цвете и настройках съёмки.',
  altBefore: 'До грейда',
  altAfter: 'После грейда',
} as const;

export const MEMBERSHIP = {
  badge: 'Private community',
  title: 'Внутри то, что не выкладываю в канал',
  meta: '3 урока · материалы · разборы · эфиры',
  cta: 'Вступить',
} as const;

export interface Material {
  id: string;
  category: string;
  title: string;
  body: string;
  cta: string;
  cover: string;
  alt: string;
  url: string;
}

export const MATERIALS_SECTION = {
  title: 'Полезные материалы',
  meta: 'бесплатно',
} as const;

export const MATERIALS: Material[] = [
  {
    id: 'overlays',
    category: 'Overlays',
    title: 'Плёнка, засветы, пыль',
    body: 'Кидаешь на таймлайн, и кадр перестаёт выглядеть телефонным.',
    cta: 'Забрать overlays →',
    cover: 'assets/overlays-cover.jpg',
    alt: 'Overlays',
    url: LINKS.OVERLAYS_URL,
  },
  {
    id: 'luts',
    category: 'Free LUTs',
    title: 'Мои рабочие LUTs',
    body: 'Тот же цвет, что в моих роликах. Ставятся в один клик.',
    cta: 'Забрать LUTs →',
    cover: 'assets/luts-cover.jpg',
    alt: 'LUTs',
    url: LINKS.LUTS_URL,
  },
  {
    id: 'opengate',
    category: 'Blackmagic · 5 мин',
    title: 'Open Gate в Blackmagic',
    body: 'Весь сенсор, запас на кроп и вертикаль из горизонтали.',
    cta: 'Смотреть туториал →',
    cover: 'assets/opengate-cover.jpg',
    alt: 'Open Gate',
    url: LINKS.OPEN_GATE_URL,
  },
];

export const ACCOUNT = {
  title: 'Мой аккаунт',
  fallbackName: 'Creator',
  fallbackHandle: '@pocketcreator',
  locked: {
    badge: 'Доступ',
    title: 'Ты пока не в приватном комьюнити',
    body: 'Уроки, LUTs, разборы и эфиры откроются сразу после вступления.',
    cta: 'Вступить',
  },
  active: {
    badge: 'Доступ активен',
    title: 'Ты в Pocket Creator',
    perks: ['3 урока', 'Материалы', 'Разборы', 'Эфиры'],
    cta: 'Открыть комьюнити',
  },
  groups: [
    {
      label: 'Аккаунт',
      items: [
        { id: 'purchases', label: 'Мои покупки' },
        { id: 'access', label: 'Доступ к комьюнити' },
        { id: 'notifications', label: 'Уведомления' },
      ],
    },
    {
      label: 'Поддержка',
      items: [
        { id: 'support', label: 'Помощь и поддержка' },
        { id: 'terms', label: 'Условия и документы' },
      ],
    },
  ],
} as const;

/** Copy for the sheets opened from the account rows. */
export const SHEETS = {
  purchases: {
    title: 'Мои покупки',
    emptyTitle: 'Пока покупок нет',
    emptyBody: 'Здесь появятся твои покупки и подписки Pocket Creator.',
    cta: 'Вступить в комьюнити',
    /** Shown once a membership exists. */
    activeTitle: 'Подписка Pocket Creator',
    activeBody: 'Приватное комьюнити, 3 урока, материалы, разборы и эфиры.',
    activeBadge: 'Активна',
  },
  access: {
    title: 'Доступ к комьюнити',
    lockedTitle: 'Доступ закрыт',
    lockedBody:
      'Приватное комьюнити откроется сразу после оформления подписки.',
    lockedCta: 'Вступить в комьюнити',
    activeTitle: 'Доступ открыт',
    activeBody: 'Ты в приватном Pocket Creator. Заходи и пиши в любое время.',
    activeCta: 'Открыть комьюнити',
  },
  notifications: {
    title: 'Уведомления',
    body: 'Раздел пока в разработке.',
    hint: 'Скоро здесь можно будет настроить, о чём присылать уведомления.',
  },
  terms: {
    title: 'Условия и документы',
    body: 'Раздел пока в разработке.',
    hint: 'Здесь появятся оферта, политика конфиденциальности и условия подписки.',
  },
  support: {
    title: 'Помощь и поддержка',
    body: 'Опиши проблему. По кнопке откроется чат с готовым сообщением, останется нажать отправить.',
    placeholder: 'Что случилось?',
    submit: 'Написать в поддержку',
    sending: 'Отправляем…',
    sentTitle: 'Чат открыт',
    sentBody: 'Текст уже в поле ввода. Нажми отправить в чате, и я отвечу в ближайшее время.',
    sentCta: 'Закрыть',
    tooShort: 'Напиши хотя бы пару слов о проблеме.',
  },
} as const;

export const NAV = {
  home: 'Главная',
  account: 'Аккаунт',
} as const;
