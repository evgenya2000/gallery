export type CardCategory = 'text' | 'artwork' | 'sketch' | 'symbol';
export type CardPresentation = 'framed' | 'image';

export interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface CardData {
  id: number;
  title: string;
  category: CardCategory;
  description: string;
  image: string;
  presentation: CardPresentation;
  position: CardPosition;
}
