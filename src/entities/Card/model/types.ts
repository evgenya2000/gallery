export type CardCategory = 'text' | 'artwork' | 'sketch' | 'symbol';
export type CardPresentation = 'image' | 'quote';

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
  description?: string;
  image?: string;
  quote?: string;
  externalUrl?: string;
  presentation: CardPresentation;
  position: CardPosition;
}
