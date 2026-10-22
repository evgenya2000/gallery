import { motion, type Variants } from 'framer-motion';
import styled from 'styled-components';
import type { CardData, CardModalContent } from '../model/types';
import { mediaBreakpointDown } from '../../../shared/styles/mixins';
import { getResponsiveImageSources } from '../../../shared/lib/images';

interface CardProps {
  card: CardData;
  onSelect: (content: CardModalContent) => void;
  revealDelay: number;
  onRevealComplete?: () => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const CardButton = styled(motion.button) <{ $card: CardData }>`
  position: absolute;
  top: ${({ $card }) => `${$card.position.y}px`};
  left: ${({ $card }) => `${$card.position.x}px`};
  z-index: ${({ $card }) => 10 + $card.id};
  display: block;
  width: ${({ $card }) => `${$card.position.width}px`};
  height: ${({ $card }) => `${$card.position.height}px`};
  padding: ${({ $card }) =>
    $card.presentation === 'quote' ? '0 7.54px 0 8.22px' : '0'};
  overflow: hidden;
  border: ${({ $card }) =>
  $card.presentation === 'quote'
    ? '0'
    : `2.42px solid ${$card.modalContent.type === 'artist-work' ? '#7D2726' : '#2F2F2F'}`};
  border-radius: ${({ $card }) => ($card.presentation === 'quote' ? '5.19px' : '6.06px')};
  background: ${({ $card, theme }) =>
    $card.presentation === 'quote'
      ? '#627984'
      : $card.image
        ? theme.colors.surface
        : 'linear-gradient(145deg, #dedbd5, #c5c2bb)'};
  color: ${({ $card, theme }) => ($card.presentation === 'quote' ? '#fff' : theme.colors.text)};
  cursor: pointer;
  rotate: ${({ $card }) => `${$card.position.rotation}deg`};
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  // Мобильный канвас 1040×800
  ${mediaBreakpointDown('tablet', true)} {
    top: ${({ $card }) => `${($card.mobilePosition ?? $card.position).y}px`};
    left: ${({ $card }) => `${($card.mobilePosition ?? $card.position).x}px`};
    width: ${({ $card }) => `${($card.mobilePosition ?? $card.position).width}px`};
    height: ${({ $card }) => `${($card.mobilePosition ?? $card.position).height}px`};
    rotate: ${({ $card }) => `${($card.mobilePosition ?? $card.position).rotation}deg`};
    padding: ${({ $card }) =>
    $card.presentation === 'quote' ? '0 5.71px 0 6.23px' : '0'};
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
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
  }

  .quote-text {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    font-size: 9.59px;
    font-weight: 400;
    line-height: 11px;
    text-align: center;
    text-wrap: pretty;
    transition: transform 0.24s cubic-bezier(0.4, 0, 0.2, 1);

    ${mediaBreakpointDown('tablet', true)} {
      font-size: 7.27px;
      line-height: 8.3px;
    }
  }

  &:hover .quote-text {
    transform: translateY(-8px);

    ${mediaBreakpointDown('tablet', true)} {
      transform: translateY(-5px);
    }
  }
`;


const CardImage = ({ image, alt }: { image: string; alt: string }) => {
  const { mobile, desktop, fallback } = getResponsiveImageSources(image);
  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={mobile} type="image/webp" />
      <source srcSet={desktop} type="image/webp" />
      <img src={fallback} alt={alt} decoding="async" draggable={false} />
    </picture>
  );
};

export function Card({ card, onSelect, revealDelay, onRevealComplete }: CardProps) {
  return (
    <CardButton
      $card={card}
      type="button"
      aria-label={card.externalUrl ? 'Открыть профиль в Telegram' : card.quote ? `Цитата: ${card.quote}` : card.title}
      custom={revealDelay}
      variants={cardVariants}
      transformTemplate={(_, generatedTransform) => generatedTransform === 'none'
        ? 'translate3d(0, 0, 0)'
        : `${generatedTransform} translate3d(0, 0, 0)`}
      onAnimationComplete={onRevealComplete}
      whileHover={
        card.presentation === 'quote'
          ? { transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] } }
          : { y: -8, transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] } }
      }
      whileTap={{ scale: 0.985, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] } }}
      onClick={() => {
        if (card.externalUrl) {
          window.open(card.externalUrl, '_blank', 'noopener,noreferrer');
          return;
        }

        onSelect(card.modalContent);
      }}
    >
      {card.presentation === 'quote' ? (
        <span className="quote-text">{card.quote}</span>
      ) : card.image ? (
        <CardImage image={card.image} alt={card.title} />
      ) : (
        <span className="image-placeholder" aria-hidden="true" />
      )}
    </CardButton>
  );
}
