import { useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import styled from 'styled-components';
import {
  Card,
  cards,
  centralCard,
  type CardModalContent,
  type CardPosition,
} from '../../../entities/Card';
import { CardModal } from '../../../features/CardModal';
import {
  mediaBreakpointDown,
} from '../../../shared/styles/mixins';

const Grid = styled(motion.div)`
  position: relative;
  width: 1440px;
  height: 935px;

  ${mediaBreakpointDown('tablet', true)} {
    width: 1040px;
    height: 800px;
  }
`;

const CentralPrompt = styled(motion.button) <{ $position: CardPosition; $mobilePosition: CardPosition }>`
  position: absolute;
  z-index: 100;
  top: ${({ $position }) => `${$position.y}px`};
  left: ${({ $position }) => `${$position.x}px`};
  display: flex;
  width: ${({ $position }) => `${$position.width}px`};
  height: ${({ $position }) => `${$position.height}px`};
  flex-direction: column;
  justify-content: center;
  padding: 45px 0 36px;
  rotate: ${({ $position }) => `${$position.rotation}deg`};
  border: 3px solid #c4c4c4;
  border-radius: 8px;
  background: rgba(250, 250, 250, 0.97);
  color: #111;
  text-align: left;
  cursor: pointer;
  transition: opacity 180ms ease;

  &:active {
    opacity: 0.72;
  }

  &:focus-visible {
    outline: 2px solid #2f2f2f;
    outline-offset: 4px;
  }

  h2 {
    margin: 0 auto 13px;
    font-size: 22px;
    font-weight: 400;
    line-height: 27px;
    text-transform: uppercase;
  }

  p {
    margin: 0 auto;
    width: 158px;
    font-size: 10.08px;
    line-height: 14px;
  }

  ${mediaBreakpointDown('tablet', true)} {
    top: ${({ $mobilePosition }) => `${$mobilePosition.y}px`};
    left: ${({ $mobilePosition }) => `${$mobilePosition.x}px`};
    width: ${({ $mobilePosition }) => `${$mobilePosition.width}px`};
    height: ${({ $mobilePosition }) => `${$mobilePosition.height}px`};
    padding: 34.11px 0 25px;

    h2 {
      margin: 0 auto 9.32px;
      font-size: 16.67px;
      line-height:20.5px; 
    }

    p {
      font-size: 7.64px;
      line-height: 10.06px;
      width: 119.75px;
    }
  }

`;

const gridVariants: Variants = {
  hidden: {},
  visible: {},
};

interface InteractiveGridProps {
  onAllCardsRevealed: () => void;
  shouldReveal: boolean;
}

export function InteractiveGrid({ onAllCardsRevealed, shouldReveal }: InteractiveGridProps) {
  const [selectedContent, setSelectedContent] = useState<CardModalContent | null>(null);
  const { revealDelays, lastRevealCardId } = useMemo(() => {
    const randomizedCards = [...cards];

    for (let index = randomizedCards.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [randomizedCards[index], randomizedCards[randomIndex]] = [
        randomizedCards[randomIndex],
        randomizedCards[index],
      ];
    }

    return {
      revealDelays: new Map(randomizedCards.map((card, index) => [card.id, index * 0.12])),
      lastRevealCardId: randomizedCards[randomizedCards.length - 1].id,
    };
  }, []);

  return (
    <>
      <Grid variants={gridVariants} initial="hidden" animate={shouldReveal ? "visible" : 'hidden'} aria-label="Галерея о доме">
        <CentralPrompt
          type="button"
          $position={centralCard.position}
          $mobilePosition={centralCard.mobilePosition}
          aria-label="Принять участие в проекте"
          onClick={() => setSelectedContent(centralCard.modalContent)}
          initial={{ opacity: 0 }}
          animate={shouldReveal ? { opacity: 1 } : { opacity: 0 }}
          transition={{duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1]}}
        >
          <h2>{centralCard.title}</h2>
          <p>{centralCard.description}</p>
        </CentralPrompt>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onSelect={setSelectedContent}
            revealDelay={revealDelays.get(card.id) ?? 0}
            onRevealComplete={card.id === lastRevealCardId ? onAllCardsRevealed : undefined}
          />
        ))}
      </Grid>
      <CardModal content={selectedContent} onClose={() => setSelectedContent(null)} />
    </>
  );
}
