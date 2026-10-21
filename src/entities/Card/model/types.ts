export type CardCategory = 'text' | 'artwork' | 'sketch' | 'symbol';
export type CardPresentation = 'image' | 'quote';

export interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export type CardModalType =
  | 'photo-story'
  | 'portrait-photo-story'
  | 'artist-work'
  | 'personal-story';

export interface PhotoStoryModalContent {
  type: 'photo-story' | 'portrait-photo-story';
  sectionTitle: string;
  title?: string;
  image?: string;
  imageAlt?: string;
  paragraphs: string[];
  author?: string;
}

export interface ArtistWorkModalContent {
  type: 'artist-work';
  sectionTitle: string;
  year?: string;
  title?: string;
  image?: string;
  imageAlt?: string;
  paragraphs: string[];
  source?: {
    label: string;
    href?: string;
  };
}

export interface PersonalStoryModalContent {
  type: 'personal-story';
  sectionTitle: string;
  quote: string;
  paragraphs: string[];
  author?: string;
}

export interface ParticipationModalContent {
  type: 'participation';
  sectionTitle: string;
  intro: string;
  actions: Array<{
    audience: string;
    title: string;
    description: string;
    linkLabel: string;
    href?: string;
  }>;
  footer: string;
}

export type CardModalContent =
  | PhotoStoryModalContent
  | ArtistWorkModalContent
  | PersonalStoryModalContent;

export interface CentralCardData {
  title: string;
  description: string;
  position: CardPosition;
  mobilePosition: CardPosition;
  modalContent: ParticipationModalContent;
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
  mobilePosition?: CardPosition;
  modalContent: CardModalContent;
}
