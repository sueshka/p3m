/**
 * Free LUT pack shown on the LUTs screen.
 *
 * Files live in `public/assets/luts` and are served as static assets.
 * Thumbnails are the same reference frame rendered through each LUT, so
 * the grid shows what the colour actually does.
 */

export interface Lut {
  id: string;
  title: string;
  /** Short note on where the LUT is meant to be used. */
  note: string;
  /** .cube file, relative to the app root. */
  file: string;
  thumb: string;
  /** Human-readable file size, shown on the card. */
  size: string;
}

export const LUTS_SCREEN = {
  category: 'Free LUTs · 9 штук',
  title: 'Мои рабочие LUTs',
  lead: 'Тот же цвет, что в моих роликах. Файлы .cube ставятся в Blackmagic Camera, DaVinci Resolve и Premiere Pro. Как импортировать в камеру, разобрано в туториале Open Gate.',
  hint: 'Тап по LUT откроет файл в браузере: оттуда сохраняешь его на телефон.',
  previewNote: 'Превью: один и тот же кадр под каждым LUT. На материале в Apple Log цвет будет чище.',
} as const;

export const LUTS: Lut[] = [
  {
    id: 'lut01',
    title: 'Retro Matte',
    note: 'Плёночный матовый контраст',
    file: 'assets/luts/retro-matte.cube',
    thumb: 'assets/lut-thumbs/lut-01.jpg',
    size: '963 КБ',
  },
  {
    id: 'lut02',
    title: 'Apple Log Conversion 2.0',
    note: 'База: переводит Apple Log в Rec.709',
    file: 'assets/luts/apple-log-conversion.cube',
    thumb: 'assets/lut-thumbs/lut-02.jpg',
    size: '763 КБ',
  },
  {
    id: 'lut03',
    title: 'Chrome 250',
    note: 'Для Apple Log',
    file: 'assets/luts/chrome-250.cube',
    thumb: 'assets/lut-thumbs/lut-03.jpg',
    size: '835 КБ',
  },
  {
    id: 'lut04',
    title: 'Cool 300',
    note: 'Холодный, для Apple Log',
    file: 'assets/luts/cool-300.cube',
    thumb: 'assets/lut-thumbs/lut-04.jpg',
    size: '865 КБ',
  },
  {
    id: 'lut05',
    title: 'LUT by Amir',
    note: 'Мой основной',
    file: 'assets/luts/lut-by-amir.cube',
    thumb: 'assets/lut-thumbs/lut-05.jpg',
    size: '112 КБ',
  },
  {
    id: 'lut06',
    title: 'LUT by Amir 2',
    note: 'Второй вариант, мягче',
    file: 'assets/luts/lut-by-amir-2.cube',
    thumb: 'assets/lut-thumbs/lut-06.jpg',
    size: '621 КБ',
  },
  {
    id: 'lut07',
    title: 'Standard 500',
    note: 'Для обычного видео, не для лога',
    file: 'assets/luts/standard-500.cube',
    thumb: 'assets/lut-thumbs/lut-07.jpg',
    size: '825 КБ',
  },
  {
    id: 'lut08',
    title: 'Vision Legacy',
    note: 'iPhone 15, сетка 65×65×65',
    file: 'assets/luts/vision-legacy.cube',
    thumb: 'assets/lut-thumbs/lut-08.jpg',
    size: '7,4 МБ',
  },
  {
    id: 'lut09',
    title: 'Videowien',
    note: 'Приглушённый кинематографичный',
    file: 'assets/luts/videowien.cube',
    thumb: 'assets/lut-thumbs/lut-09.jpg',
    size: '951 КБ',
  },
];
