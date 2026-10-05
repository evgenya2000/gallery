import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { CardCategory, CardData } from '../../../entities/Card';

interface CardModalProps {
  card: CardData | null;
  onClose: () => void;
}

const categoryLabels: Record<CardCategory, string> = {
  text: 'Text',
  artwork: 'Artwork',
  sketch: 'Sketch',
  symbol: 'Symbol',
};

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 10;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 32px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 560px) {
    padding: 16px;
  }
`;

const Dialog = styled(motion.section)<{ $category: CardCategory }>`
  position: relative;
  width: min(560px, 100%);
  min-height: 330px;
  padding: 40px;
  border: 1px solid ${({ theme, $category }) => theme.colors.categories[$category]}66;
  border-radius: ${({ theme }) => theme.radii.modal};
  background:
    radial-gradient(circle at 100% 0%, ${({ theme, $category }) => theme.colors.categories[$category]}16, transparent 48%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.modal};

  @media (max-width: 560px) {
    min-height: 0;
    padding: 28px 22px;
    border-radius: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 22px;
  right: 22px;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 23px;
  line-height: 1;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.card};

  @media (max-width: 560px) {
    top: 16px;
    right: 16px;
    width: 34px;
    height: 34px;
    font-size: 21px;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.28);
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.text};
    outline-offset: 3px;
  }
`;

const Badge = styled.span<{ $category: CardCategory }>`
  display: inline-flex;
  padding: 8px 11px;
  border: 1px solid ${({ theme, $category }) => theme.colors.categories[$category]}66;
  border-radius: 999px;
  color: ${({ theme, $category }) => theme.colors.categories[$category]};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Heading = styled.h2<{ $category: CardCategory }>`
  max-width: 420px;
  margin: 34px 0 16px;
  color: ${({ theme, $category }) => theme.colors.categories[$category]};
  font-size: 42px;
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.04;

  @media (max-width: 560px) {
    margin: 28px 0 14px;
    font-size: clamp(30px, 9vw, 38px);
  }
`;

const Description = styled.p`
  max-width: 430px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 16px;
  line-height: 1.7;

  @media (max-width: 560px) {
    font-size: 15px;
    line-height: 1.6;
  }
`;

const modalEase = [0.16, 1, 0.3, 1] as const;

export function CardModal({ card, onClose }: CardModalProps) {
  useEffect(() => {
    if (!card) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, onClose]);

  return createPortal(
    <AnimatePresence>
      {card && (
        <Overlay
          key="card-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.42, ease: modalEase } }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: modalEase } }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <Dialog
            $category={card.category}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`card-title-${card.id}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.75, ease: modalEase } }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.55, ease: modalEase } }}
          >
            <CloseButton type="button" aria-label="Close dialog" onClick={onClose}>
              ×
            </CloseButton>
            <Badge $category={card.category}>{categoryLabels[card.category]}</Badge>
            <Heading id={`card-title-${card.id}`} $category={card.category}>
              {card.title}
            </Heading>
            <Description>{card.description}</Description>
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body,
  );
}
