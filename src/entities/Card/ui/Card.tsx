import { motion, type Variants } from 'framer-motion';
import styled from 'styled-components';
import type { CardData } from '../model/types';
import { mediaBreakpointDown } from '../../../shared/styles/mixins';

interface CardProps {
  card: CardData;
  onSelect: (card: CardData) => void;
  revealDelay: number;
  onRevealComplete?: () => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const CardButton = styled(motion.button)<{ $card: CardData }>`
  position: absolute;
  top: ${({ $card }) => `${$card.position.y}px`};
  left: ${({ $card }) => `${$card.position.x}px`};
  z-index: ${({ $card }) => 10 + $card.id};
  display: block;
  width: ${({ $card }) => `${$card.position.width}px`};
  height: ${({ $card }) => `${$card.position.height}px`};
  padding: ${({ $card }) => ($card.presentation === 'quote' ? '16px' : '0')};
  overflow: hidden;
  border: ${({ $card }) =>
    $card.presentation === 'quote' ? '0' : `3px solid ${$card.id % 3 === 0 ? '#30302e' : '#842e2b'}`};
  border-radius: ${({ $card }) => ($card.presentation === 'quote' ? '8px' : '10px')};
  background: ${({ $card, theme }) =>
    $card.presentation === 'quote'
      ? '#627984'
      : $card.image
        ? theme.colors.surface
        : 'linear-gradient(145deg, #dedbd5, #c5c2bb)'};
  box-shadow: ${({ $card }) => ($card.presentation === 'quote' ? 'none' : '0 2px 5px rgba(0, 0, 0, 0.18)')};
  color: ${({ $card, theme }) => ($card.presentation === 'quote' ? '#fff' : theme.colors.text)};
  cursor: pointer;
  rotate: ${({ $card }) => `${$card.position.rotation}deg`};
  transition: ${({ theme }) => theme.transitions.card};
  will-change: transform;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    -webkit-user-drag: none;
  }

  .image-placeholder {
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.17),
      transparent 48%,
      rgba(42, 39, 35, 0.08)
    );
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .quote-text {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    font-size: clamp(10px, 0.7vw, 12px);
    font-weight: 400;
    line-height: 1.18;
    text-align: center;
    text-wrap: pretty;

    ${mediaBreakpointDown('phone', true)} {
      font-size: 10px;
    }
  }

  &:hover {
    z-index: 1000;
    border-color: ${({ $card }) => ($card.presentation === 'quote' ? 'transparent' : '#30302e')};
    box-shadow: ${({ $card }) =>
      $card.presentation === 'quote'
        ? '0 8px 18px rgba(0, 0, 0, 0.12)'
        : '0 12px 28px rgba(0, 0, 0, 0.25)'};
  }
`;

export function Card({ card, onSelect, revealDelay, onRevealComplete }: CardProps) {
  return (
    <CardButton
      $card={card}
      type="button"
      aria-label={card.externalUrl ? 'Открыть профиль в Telegram' : card.quote ? `Цитата: ${card.quote}` : card.title}
      custom={revealDelay}
      variants={cardVariants}
      onAnimationComplete={onRevealComplete}
      whileHover={{ y: -7, scale: 1.045, transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] } }}
      whileTap={{ scale: 0.985, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] } }}
      onClick={() => {
        if (card.externalUrl) {
          window.open(card.externalUrl, '_blank', 'noopener,noreferrer');
          return;
        }

        onSelect(card);
      }}
    >
      {card.presentation === 'quote' ? (
        <span className="quote-text">{card.quote}</span>
      ) : card.image ? (
        <img src={card.image} alt={card.title} draggable={false} />
      ) : (
        <span className="image-placeholder" aria-hidden="true" />
      )}
    </CardButton>
  );
}
