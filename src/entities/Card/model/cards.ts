import type {
  CardData,
  CardModalContent,
  CardPosition,
  CardPresentation,
  CentralCardData,
} from './types';

interface CardPlacement {
  presentation: CardPresentation;
  position: CardPosition;
  mobilePosition?: CardPosition;
  image?: string;
  quote?: string;
  externalUrl?: string;
}

export const centralCard: CentralCardData = {
  title: 'дом — это...',
  description: 'Продолжи фразу. Словами, фотографией или рисунком.',
  position: { x: 614, y: 364, width: 212, height: 150, rotation: 0 },
  mobilePosition: { x: 443.97, y: 311.11, width: 160.67, height: 113.68, rotation: 0 },
  modalContent: {
    type: 'participation',
    sectionTitle: 'ПРИНЯТЬ УЧАСТИЕ',
    intro: 'У каждого свое представление о доме. Поделитесь своей историей, фотографией или художественной работой и станьте частью общего визуального архива.',
    actions: [
      {
        audience: 'ДЛЯ ВСЕХ',
        title: 'ЛИЧНАЯ ИСТОРИЯ',
        description: 'Расскажите, что для вас означает дом, через слова, фотографию или рисунок.',
        linkLabel: 'поделиться',
      },
      {
        audience: 'ДЛЯ АВТОРОВ',
        title: 'АВТОРСКИЙ ПРОЕКТ',
        description: 'Предложите художественную работу или фотопроект, раскрывающий тему дома.',
        linkLabel: 'предложить проект',
      },
    ],
    footer: 'Все материалы проходят предварительный просмотр перед публикацией в архиве.',
  },
};

const quote = (text: string, x: number, y: number, width: number, height: number): CardPlacement => ({
  presentation: 'quote',
  quote: text,
  position: { x, y, width, height, rotation: 0 },
});

const image = (
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0,
  imagePath?: string,
  externalUrl?: string,
): CardPlacement => ({
  presentation: 'image',
  position: { x, y, width, height, rotation },
  ...(imagePath ? { image: imagePath } : {}),
  ...(externalUrl ? { externalUrl } : {}),
});

// Мобильные позиции для канваса 1040×800 (viewport < 768px).
// Ключ — id карточки (1..36). Порядок совпадает с placements ниже.
const mobilePositions: Record<number, { x: number; y: number; width: number; height: number }> = {
  1:  { x: 68.81,  y: 72.37,  width: 97.08,  height: 74.23 },
  2:  { x: 196.14, y: 95.86,  width: 97.09,  height: 69.05 },
  3:  { x: 337,    y: 27,     width: 97.09,  height: 69.05 },
  4:  { x: 450,    y: 96,     width: 101.76, height: 67.84 },
  5:  { x: 568,    y: 26,     width: 97.09,  height: 69.05 },
  6:  { x: 687,    y: 91,     width: 97.82,  height: 78.99 },
  7:  { x: 872.18, y: 61.76,  width: 103.85, height: 69.23 },
  8:  { x: 22.58,  y: 176.2,  width: 111.54, height: 79.33 },
  9:  { x: 166.58, y: 248.96, width: 88.74,  height: 59.16 },
  10: { x: 293.91, y: 189.84, width: 104.77, height: 69.82 },
  11: { x: 445,    y: 210,    width: 97.09,  height: 69.05 },
  12: { x: 568,    y: 147,    width: 97.09,  height: 69.05 },
  13: { x: 760.01, y: 229.25, width: 97.09,  height: 69.05 },
  14: { x: 885.06, y: 189.84, width: 97.09,  height: 69.05 },
  15: { x: 26.37,  y: 327.78, width: 120.26, height: 80.14 },
  16: { x: 184.77, y: 402.81, width: 96.33,  height: 64.2  },
  17: { x: 287.08, y: 296.7,  width: 118.27, height: 84.38 },
  18: { x: 625,    y: 237,    width: 89.34,  height: 119.11 },
  19: { x: 767.59, y: 342.94, width: 108.48, height: 74.47 },
  20: { x: 927.51, y: 293.67, width: 97.09,  height: 69.05 },
  21: { x: 15,     y: 445.25, width: 88.28,  height: 58.86 },
  22: { x: 85.48,  y: 538.47, width: 97.09,  height: 69.05 },
  23: { x: 201.44, y: 504.37, width: 119.96, height: 79.94 },
  24: { x: 348.47, y: 445.25, width: 122.6,  height: 69.23 },
  25: { x: 518,    y: 475,    width: 129.09, height: 92.31 },
  26: { x: 647,    y: 394,    width: 97.09,  height: 69.05 },
  27: { x: 789.57, y: 452.07, width: 97.09,  height: 69.05 },
  28: { x: 910.07, y: 402.81, width: 58.02,  height: 86.2  },
  29: { x: 167,    y: 637,    width: 107.84, height: 71.86 },
  30: { x: 365,    y: 673,    width: 97.09,  height: 69.05 },
  31: { x: 363,    y: 562,    width: 88.28,  height: 58.86 },
  32: { x: 487,    y: 598,    width: 97.09,  height: 69.05 },
  33: { x: 647,    y: 605,    width: 123.34, height: 82.2  },
  34: { x: 808.52, y: 573.34, width: 89.34,  height: 119.11 },
  35: { x: 924.47, y: 539.99, width: 97.09,  height: 69.05 },
  36: { x: 520,    y: 710,    width: 96.33,  height: 64.2  },
};

const placements: CardPlacement[] = [
  /* 1  */ image(119, 49, 128.1, 97.95),
  /* 2  */ image(287, 80, 128.1, 91.11),
  /* 3  */ quote('«Его сложно предугадать, но я всегда его узнаю»', 444, 34, 128.1, 91.11),
  /* 4  */ image(616, 114, 134.27, 89.51),
  /* 5  */ quote('«Запах домашней еды»', 784, 43, 128.1, 91.11),
  /* 6  */ image(979, 112, 129.07, 104.22),
  /* 7  */ image(1179, 35, 137.02, 91.35),
  /* 8  */ quote('«Дома я убираю с себя всю улицу»', 58, 186, 147.17, 104.67),
  /* 9  */ image(248, 282, 117.09, 78.06),
  /* 10 */ image(416, 204, 138.24, 92.13),
  /* 11 */ quote('«Отражение меня в пространстве»', 650, 238, 128.1, 91.11),
  /* 12 */ image(812, 198, 128.1, 91.11),
  /* 13 */ quote('«И речь не про деньги»', 1031, 256, 128.1, 91.11),
  /* 14 */ image(1196, 204, 128.1, 91.11),
  /* 15 */ image(63, 386, 158.68, 105.74),
  /* 16 */ image(272, 485, 127.1, 84.7),
  /* 17 */ image(407, 345, 156.06, 111.33),
  /* 18 */ image(873, 332, 117.87, 157.17),
  /* 19 */ image(1041, 406, 143.13, 98.26),
  /* 20 */ quote('«Именно в эти моменты я физически чувствую: мы дома»', 1252, 341, 128.1, 91.11),
  /* 21 */ image(48, 541, 116.49, 77.66),
  /* 22 */ quote('«Если ты один дома, то это совсем другое чувство»', 141, 664, 128.1, 91.11),
  /* 23 */ image(294, 619, 158.28, 105.47),
  /* 24 */ image(488, 541, 161.76, 91.35),
  /* 25 */ image(693, 596, 170.33, 121.8),
  /* 26 */ quote('«Дом там, где я хозяйка»', 879, 514, 128.1, 91.11),
  /* 27 */ image(1070, 550, 128.1, 91.11),
  /* 28 */ image(1229, 485, 76.56, 113.74),
  /* 29 */ image(93, 794, 142, 95),
  /* 30 */ quote('«Дом — это свое убежище от всех проблем»', 357, 795, 128.1, 91.11),
  /* 31 */ image(525, 714, 116.49, 77.66),
  /* 32 */ quote('«Маленькие повседневные ритуалы»', 672, 789, 128.1, 91.11),
  /* 33 */ image(862, 772, 162.75, 108.46),
  /* 34 */ image(1095, 710, 117.87, 157.17),
  /* 35 */ quote('«Место, где можешь быть собой»', 1248, 666, 128.1, 91.11),
  /* 36 */ image(917, 649, 127.1, 84.7),
];

placements.forEach((placement, index) => {
  const mobile = mobilePositions[index + 1];
  if (!mobile) return;
  placement.mobilePosition = {
    x: mobile.x,
    y: mobile.y,
    width: mobile.width,
    height: mobile.height,
    rotation: placement.position.rotation,
  };
});

// Контент модалок хранится по номеру карточки. Добавь запись с нужным id,
// чтобы задать шаблон и заполнить только нужные поля. Для остальных карточек
// автоматически выбирается фоторассказ или личная история по виду карточки.
const modalContentByCardId: Partial<Record<number, CardModalContent>> = {
  2: {
    type: 'artist-work',
    sectionTitle: 'РАБОТЫ ХУДОЖНИКОВ',
    year: '2022',
    title: 'Memory Building — Annette LeMay Burke',
    paragraphs: [
      'Автор проецирует фотографии из семейного архива на стены дома своего детства, соединяя прошлое и настоящее.',
      'В этой работе дом становится хранилищем воспоминаний. Архивные изображения, наложенные на современные интерьеры, показывают, как личная история сохраняется в пространстве.',
    ],
    source: { label: 'Источник: Сайт автора' },
  },
  18: {
    type: 'portrait-photo-story',
    sectionTitle: 'ФОТОИСТОРИИ',
    paragraphs: [],
  },
};

export const cards: CardData[] = placements.map((placement, index) => {
  const id = index + 1;
  const isQuote = placement.presentation === 'quote';
  const title = placement.quote ?? `Фотография о доме ${id}`;
  const modalContent = modalContentByCardId[id] ?? (isQuote
    ? {
        type: 'personal-story' as const,
        sectionTitle: 'ЛИЧНЫЕ ИСТОРИИ',
        quote: placement.quote ?? title,
        paragraphs: [],
        author: 'Анонимно',
      }
    : {
        type: 'photo-story' as const,
        sectionTitle: 'ФОТОИСТОРИИ',
        image: placement.image,
        imageAlt: title,
        paragraphs: [],
      });

  return {
    id,
    title,
    category: isQuote ? 'text' : 'artwork',
    presentation: placement.presentation,
    position: placement.position,
    ...(placement.mobilePosition ? { mobilePosition: placement.mobilePosition } : {}),
    ...(placement.image ? { image: placement.image } : {}),
    ...(placement.quote ? { quote: placement.quote } : {}),
    ...(placement.externalUrl ? { externalUrl: placement.externalUrl } : {}),
    modalContent: {
      ...modalContent,
      ...(('image' in modalContent && !modalContent.image && placement.image)
        ? { image: placement.image }
        : {}),
      ...(('imageAlt' in modalContent && !modalContent.imageAlt)
        ? { imageAlt: title }
        : {}),
    },
  };
});
