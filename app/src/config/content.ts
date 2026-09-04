/**
 * All user-facing copy, kept out of the components so wording can be
 * tuned without touching layout. Text matches the approved design.
 */
import { LINKS } from './links';

export const APP = {
  title: 'Pocket Creator',
  version: 'Pocket Creator · v1.0',
  credit: 'developed by spizegirlz',
} as const;

export const HOME = {
  greeting: 'Привет,',
  /** Shown when Telegram gives us no first name (desktop web, privacy). */
  greetingFallback: 'creator',
  greetingSub: 'Съёмка на iPhone, цвет и монтаж',
  /** Members get a greeting that acknowledges they already paid. */
  greetingMember: 'Рады видеть,',
  heroEyebrow: 'Pocket Creator',
  heroTitle: 'Твой личный воркфлоу для контента',
  heroSubtitle: 'Один телефон, понятный пайплайн и результат за один вечер',
  heroCta: 'Вступить',
  /** Hero state for someone who already paid. */
  heroMemberBadge: 'Подписка активна',
  heroCtaMember: 'Перейти в комьюнити',
  tickerStrong: 'Blackmagic Camera стоит 0₽',
  tickerMuted: 'всё дело в руках',
} as const;

export interface Benefit {
  title: string;
  body: string;
  /** Square cover, relative to the app root. */
  image: string;
}

export const BENEFITS: Benefit[] = [
  {
    title: 'Три простых урока',
    body: 'Настройки Blackmagic, Сам себе оператор + Свет, Лут и Экспорт',
    image: 'assets/whatsinside/threeclasses.jpg',
  },
  {
    title: 'GRADA LUT',
    body: 'Мой фирменный Лут который я использую в каждом видео',
    image: 'assets/whatsinside/gradalut.jpg',
  },
  {
    title: 'Обучение по монтажу',
    body: 'Научись базе CapCut а также продвинутым эффектам, цепляющим глаз',
    image: 'assets/whatsinside/editing.jpg',
  },
  {
    title: 'Комьюнити',
    body: 'Общайся с творческими ребятами как ты и делись опытом. Получай фидбэк!',
    image: 'assets/whatsinside/community.jpg',
  },
  {
    title: 'Полезные материалы',
    body: 'Звуковые эффекты, секретные шрифты и оверлеи',
    image: 'assets/whatsinside/materials.jpg',
  },
  {
    title: 'Разборы на прямых эфирах',
    body: 'Смотрю твои ролики по пунктам: цвет, ритм и звук. Собираемся вместе',
    image: 'assets/whatsinside/live.jpg',
  },
];

export const BENEFITS_SECTION = {
  title: 'Что внутри',
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
  meta: 'Бесплатно',
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
  /**
   * Shown when the server could not reach Tribute. Never says the user is
   * not a member — we do not know that — and offers a retry, not a payment.
   */
  unverified: {
    badge: 'Доступ',
    title: 'Не удалось проверить доступ',
    body: 'Если ты уже оплатил подписку, попробуй ещё раз через минуту или напиши в поддержку.',
    cta: 'Проверить ещё раз',
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
    cta: 'Вступить',
    /** Shown once a membership exists. */
    activeTitle: 'Подписка Pocket Creator',
    activeBody: 'Уроки, GRADA LUT, монтаж, материалы, разборы и комьюнити.',
    activeBadge: 'Активна',
    /** Precedes the formatted expiry date. */
    activeUntil: 'Действует до',
  },
  access: {
    title: 'Доступ к комьюнити',
    lockedTitle: 'Доступ закрыт',
    lockedBody:
      'Приватное комьюнити откроется сразу после оформления подписки.',
    lockedCta: 'Вступить',
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
