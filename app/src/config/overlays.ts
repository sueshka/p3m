/**
 * Free overlay pack shown on the Overlays screen.
 *
 * Files live in `public/assets/overlays` and are served as static assets.
 * Titles describe what each clip shows so people know what they are
 * saving before they open it.
 */

export interface Overlay {
  id: string;
  title: string;
  /** Video file, relative to the app root. */
  file: string;
  /** Poster frame grabbed from the clip. */
  thumb: string;
}

export const OVERLAYS_SCREEN = {
  category: 'Overlays · 12 штук',
  title: 'Плёнка, засветы, пыль',
  lead: 'Титульные оверлеи для влогов: 1080×1920, около 10 секунд каждый. Кидаешь на таймлайн поверх кадра, ставишь режим наложения Screen, и кадр перестаёт выглядеть телефонным.',
  hint: 'Тап по оверлею откроет его в браузере: оттуда сохраняешь в галерею.',
  saveCta: 'Открыть',
} as const;

export const OVERLAYS: Overlay[] = [
  { id: 'ov01', title: 'Day in the Life', file: 'assets/overlays/overlay-01.mp4', thumb: 'assets/overlay-thumbs/ov-01.jpg' },
  { id: 'ov02', title: 'A Day in My Life · цветной', file: 'assets/overlays/overlay-02.mp4', thumb: 'assets/overlay-thumbs/ov-02.jpg' },
  { id: 'ov03', title: 'Vlog · Summer', file: 'assets/overlays/overlay-03.mp4', thumb: 'assets/overlay-thumbs/ov-03.jpg' },
  { id: 'ov04', title: 'Экранная запись', file: 'assets/overlays/overlay-04.mp4', thumb: 'assets/overlay-thumbs/ov-04.jpg' },
  { id: 'ov05', title: 'REC · виньетка', file: 'assets/overlays/overlay-05.mp4', thumb: 'assets/overlay-thumbs/ov-05.jpg' },
  { id: 'ov06', title: 'Morning · Grinding', file: 'assets/overlays/overlay-06.mp4', thumb: 'assets/overlay-thumbs/ov-06.jpg' },
  { id: 'ov07', title: 'A Day in My Life · минимал', file: 'assets/overlays/overlay-07.mp4', thumb: 'assets/overlay-thumbs/ov-07.jpg' },
  { id: 'ov08', title: 'VLOG · крупный шрифт', file: 'assets/overlays/overlay-08.mp4', thumb: 'assets/overlay-thumbs/ov-08.jpg' },
  { id: 'ov09', title: 'A day in June', file: 'assets/overlays/overlay-09.mp4', thumb: 'assets/overlay-thumbs/ov-09.jpg' },
  { id: 'ov10', title: 'VLOG · starts in 2', file: 'assets/overlays/overlay-10.mp4', thumb: 'assets/overlay-thumbs/ov-10.jpg' },
  { id: 'ov11', title: 'Life lately', file: 'assets/overlays/overlay-11.mp4', thumb: 'assets/overlay-thumbs/ov-11.jpg' },
  { id: 'ov12', title: 'A Chill Day in the Life', file: 'assets/overlays/overlay-12.mp4', thumb: 'assets/overlay-thumbs/ov-12.jpg' },
];
