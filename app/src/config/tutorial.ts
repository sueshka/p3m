/**
 * "Open Gate в Blackmagic" tutorial, shown when the material card is
 * tapped. Content mirrors the source article; the Telegram channel links
 * are intentionally dropped — the app already surfaces the LUTs elsewhere.
 */

export interface TutorialBlock {
  /** `note` renders as a highlighted "why this matters" panel. */
  kind: 'text' | 'bullets' | 'numbers' | 'image' | 'note';
  /** Optional sub-heading rendered above the block. */
  heading?: string;
  body?: string;
  items?: string[];
  src?: string;
  alt?: string;
}

export interface TutorialStep {
  index: string;
  title: string;
  blocks: TutorialBlock[];
}

export const TUTORIAL = {
  category: 'Blackmagic · 5 мин',
  title: 'Как снять киношно на айфон',
  lead: 'Настройка Open Gate, Apple Log и работа с LUT в Blackmagic Camera. Всё, что нужно, чтобы получить максимум от материала: и по качеству картинки, и по гибкости на монтаже.',
  cover: 'assets/og-hero.jpg',
  coverAlt: 'Съёмка на iPhone',

  steps: [
    {
      index: '01',
      title: 'Разрешение: выбираем Open Gate',
      blocks: [
        {
          kind: 'text',
          body: 'Откройте Blackmagic Camera и зайдите в Settings → Record → Resolution.',
        },
        { kind: 'image', src: 'assets/og-resolution.jpg', alt: 'Настройки Record' },
        { kind: 'text', body: 'Вы увидите четыре варианта:' },
        { kind: 'bullets', items: ['4K', 'HD', '720p', 'Open Gate'] },
        {
          kind: 'text',
          body: 'Снимаете обычное горизонтальное видео и не планируете кадрировать, берите 4K, этого более чем достаточно. Нужна максимальная свобода на постпродакшене, выбирайте Open Gate.',
        },
        {
          kind: 'note',
          heading: 'Почему Open Gate важен',
          body: 'Камера пишет всю площадь сенсора, без обрезки по сторонам и без привязки к 16:9. Это даёт два преимущества:',
        },
        {
          kind: 'numbers',
          items: [
            'Максимальное разрешение исходника. Сенсор отдаёт всё, что может, и остаётся большой запас по детализации.',
            'Гибкое кадрирование без потери качества. По вертикали пикселей больше, поэтому горизонталь спокойно кропается в вертикаль 9:16 без падения резкости и апскейла.',
          ],
        },
        {
          kind: 'text',
          body: 'По сути Open Gate избавляет от дублей в разных ориентациях: один файл закрывает все форматы: YouTube, Reels, TikTok и Shorts.',
        },
      ],
    },
    {
      index: '02',
      title: 'Цветовое пространство: Apple Log',
      blocks: [
        {
          kind: 'text',
          body: 'В тех же настройках записи выберите Color Space → Apple Log (HDR).',
        },
        { kind: 'image', src: 'assets/og-colorspace.jpg', alt: 'Выбор Apple Log' },
        {
          kind: 'note',
          heading: 'Почему Apple Log',
          body: 'Логарифмический профиль от Apple. В отличие от Rec.709 он сохраняет:',
        },
        {
          kind: 'bullets',
          items: [
            'значительно больший динамический диапазон: детали и в светах, и в тенях',
            'более широкую палитру цветов',
            'запас на цветокоррекцию: «сырую» картинку можно точно подвести под нужный стиль',
          ],
        },
        {
          kind: 'text',
          body: 'Apple Log плюс Open Gate это профессиональный пайплайн в кармане: максимум информации о цвете и максимум разрешения. Картинка сразу выглядит плоско и блёкло, так и должно быть. Вся магия раскрывается на цветокоррекции.',
        },
      ],
    },
    {
      index: '03',
      title: 'Включаем вертикальное видео',
      blocks: [
        { kind: 'image', src: 'assets/og-vertical.jpg', alt: 'Enable Vertical Video' },
        {
          kind: 'text',
          body: 'По умолчанию Blackmagic снимает только горизонтально. В настройках найдите раздел Camera и включите тумблер Enable Vertical Video.',
        },
        {
          kind: 'text',
          body: 'После этого камера корректно записывает вертикальные ролики в портретной ориентации. Если снимаете в Open Gate, вертикальный режим не обязателен: вертикаль всегда можно кропнуть из горизонтали. Но включить полезно на случай, когда вертикалка нужна сразу.',
        },
      ],
    },
    {
      index: '04',
      title: 'Открываем LUTs Manager',
      blocks: [
        { kind: 'image', src: 'assets/og-luts-manager.jpg', alt: 'Раздел LUTs' },
        { kind: 'text', body: 'Прокрутите настройки вниз и найдите раздел LUTs → LUTs Manager.' },
        {
          kind: 'text',
          body: 'Здесь хранятся все таблицы соответствия цветов (Look-Up Tables). Их можно использовать и для предпросмотра, и для применения к финальному файлу.',
        },
      ],
    },
    {
      index: '05',
      title: 'Импортируем LUT',
      blocks: [
        { kind: 'image', src: 'assets/og-import-lut.jpg', alt: 'Import LUT' },
        { kind: 'text', body: 'Когда файл LUT оказался на телефоне:' },
        {
          kind: 'numbers',
          items: [
            'Откройте LUTs Manager.',
            'Нажмите Import LUT, иконка со стрелкой вниз.',
            'Выберите скачанный файл и подтвердите импорт.',
          ],
        },
        { kind: 'text', body: 'LUT появится в общем списке и будет готов к использованию.' },
        {
          kind: 'note',
          heading: 'Зачем нужен LUT',
          body: 'Это «рецепт» цветокоррекции, который мгновенно превращает плоскую логарифмическую картинку в готовый кинематографичный образ. Предсказуемый цвет, единый стиль во всех роликах и часы сэкономленной работы в DaVinci Resolve или Premiere Pro.',
        },
      ],
    },
    {
      index: '06',
      title: 'Включаем Record LUT to Clip',
      blocks: [
        { kind: 'image', src: 'assets/og-record-lut.jpg', alt: 'Record LUT to Clip' },
        {
          kind: 'text',
          body: 'Возвращаемся из LUTs Manager на шаг назад и включаем тумблер Record LUT to Clip.',
        },
        {
          kind: 'note',
          heading: 'Что это даёт',
          body: 'Камера записывает в файл метаданные с привязанным LUT. Значит:',
        },
        {
          kind: 'bullets',
          items: [
            'В монтажной программе LUT применится к клипу автоматически, без ручной настройки.',
            'Исходник остаётся логарифмическим: LUT можно отключить и сделать цветокоррекцию с нуля. Никакой потери информации.',
            'Финальный киношный вид виден сразу на превью в монтажке, а не плоская картинка.',
          ],
        },
        { kind: 'text', body: 'Это лучший баланс между скоростью работы и контролем качества.' },
      ],
    },
  ] as TutorialStep[],

  summary: {
    title: 'Краткое резюме',
    body: 'Для съёмки с максимальной гибкостью и кинематографичным цветом настройки должны выглядеть так:',
    rows: [
      { label: 'Codec', value: 'HEVC (H.265)' },
      { label: 'Resolution', value: 'Open Gate' },
      { label: 'Color Space', value: 'Apple Log – HDR' },
      { label: 'Enable Vertical Video', value: 'включено' },
      { label: 'Record LUT to Clip', value: 'включено' },
    ],
    outro: 'С такой комбинацией получается один универсальный исходник, из которого собирается ролик под любую платформу: горизонтальный, вертикальный, квадратный, без потери качества и с уже готовым цветом.',
  },
} as const;
