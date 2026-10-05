import { motion, type Variants } from 'framer-motion';
import styled from 'styled-components';
import type { CardData, CardCategory } from '../model/types';

interface CardProps {
  card: CardData;
  onSelect: (card: CardData) => void;
  onRevealComplete?: () => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const CardButton = styled(motion.button)<{ $card: CardData; $category: CardCategory }>`
  position: absolute;
  top: ${({ $card }) => `${$card.position.y}px`};
  left: ${({ $card }) => `${$card.position.x}px`};
  z-index: ${({ $card }) => 10 + $card.id};
  display: block;
  width: ${({ $card }) => `${$card.position.width}px`};
  height: ${({ $card }) => `${$card.position.height}px`};
  padding: ${({ $card }) => ($card.presentation === 'framed' ? '8px' : '0')};
  overflow: hidden;
  border: 1px solid ${({ theme, $card, $category }) =>
    $card.presentation === 'framed' ? `${theme.colors.categories[$category]}B3` : 'transparent'};
  border-radius: ${({ $card, theme }) => ($card.presentation === 'framed' ? theme.radii.card : '2px')};
  background: ${({ $card, theme }) =>
    $card.presentation === 'framed' ? theme.colors.surface : 'transparent'};
  box-shadow: ${({ $card }) => ($card.presentation === 'framed' ? '0 10px 28px rgba(0, 0, 0, 0.24)' : 'none')};
  cursor: pointer;
  rotate: ${({ $card }) => `${$card.position.rotation}deg`};
  transition: ${({ theme }) => theme.transitions.card};
  will-change: transform;

  @media (max-width: 1199px) {
    position: relative;
    top: auto;
    left: auto;
    z-index: auto;
    width: 100%;
    height: auto;
    aspect-ratio: ${({ $card }) =>
      $card.presentation === 'framed' ? '1 / 1' : `${$card.position.width} / ${$card.position.height}`};
    grid-column: ${({ $card }) =>
      $card.presentation === 'image' && $card.position.width / $card.position.height > 1.25 ? 'span 2' : 'span 1'};
    padding: ${({ $card }) => ($card.presentation === 'framed' ? '7px' : '0')};
    rotate: 0deg;
  }

  @media (max-width: 560px) {
    grid-column: ${({ $card }) =>
      $card.presentation === 'image' && $card.position.width / $card.position.height > 1.25 ? 'span 2' : 'span 1'};
    padding: ${({ $card }) => ($card.presentation === 'framed' ? '6px' : '0')};
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    -webkit-user-drag: none;
  }

  &:hover,
  &:focus-visible {
    z-index: 1000;
    border-color: ${({ theme, $category }) => theme.colors.categories[$category]};
    box-shadow: 0 0 30px ${({ theme, $category }) => theme.colors.categories[$category]}42,
      0 18px 44px rgba(0, 0, 0, 0.45);
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme, $category }) => theme.colors.categories[$category]};
    outline-offset: 5px;
  }
`;

export function Card({ card, onSelect, onRevealComplete }: CardProps) {
  return (
    <CardButton
      $card={card}
      $category={card.category}
      type="button"
      aria-label={`Open ${card.title}`}
      variants={cardVariants}
      onAnimationComplete={(definition) => {
        if (definition === 'visible') onRevealComplete?.();
      }}
      whileHover={{ y: -7, scale: 1.045, transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] } }}
      whileTap={{ scale: 0.985, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] } }}
      onClick={() => onSelect(card)}
    >
      <img src={card.image} alt={card.title} draggable={false} />
    </CardButton>
  );
}
