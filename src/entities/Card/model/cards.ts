import type { CardData, CardPosition, CardPresentation } from './types';

interface CardPlacement {
  presentation: CardPresentation;
  position: CardPosition;
  image?: string;
  quote?: string;
  externalUrl?: string;
}

export const centralCard = {
  title: 'дом — это...',
  description: 'Продолжи фразу. Словами, фотографией или рисунком.',
  position: { x: 614, y: 364, width: 212, height: 150, rotation: 0 },
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

// Image paths can be added to these image placements when the photographs are ready.
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

export const cards: CardData[] = placements.map((placement, index) => {
  const id = index + 1;
  const isQuote = placement.presentation === 'quote';
  const title = placement.quote ?? `Фотография о доме ${id}`;

  return {
    id,
    title,
    category: isQuote ? 'text' : 'artwork',
    presentation: placement.presentation,
    position: placement.position,
    ...(placement.image ? { image: placement.image } : {}),
    ...(placement.quote ? { quote: placement.quote } : {}),
    ...(placement.externalUrl ? { externalUrl: placement.externalUrl } : {}),
  };
});
