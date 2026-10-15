import { useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import styled from 'styled-components';
import { Card, cards, centralCard, type CardData, type CardPosition } from '../../../entities/Card';
import { CardModal } from '../../../features/CardModal';

const Grid = styled(motion.div)`
  position: relative;
  width: 1440px;
  height: 935px;
`;

const CentralPrompt = styled.section<{ $position: CardPosition }>`
  position: absolute;
  z-index: 100;
  top: ${({ $position }) => `${$position.y}px`};
  left: ${({ $position }) => `${$position.x}px`};
  display: flex;
  width: ${({ $position }) => `${$position.width}px`};
  height: ${({ $position }) => `${$position.height}px`};
  flex-direction: column;
  justify-content: center;
  padding: 20px 22px;
  rotate: ${({ $position }) => `${$position.rotation}deg`};
  border: 3px solid #c4c4c4;
  border-radius: 8px;
  background: rgba(250, 250, 250, 0.97);
  color: #111;

  h2 {
    margin: 0 0 12px;
    font-size: 26px;
    font-weight: 400;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  p {
    margin: 0;
    font-size: 11px;
    line-height: 1.45;
  }

`;

const gridVariants: Variants = {
  hidden: {},
  visible: {},
};

interface InteractiveGridProps {
  onAllCardsRevealed: () => void;
}

export function InteractiveGrid({ onAllCardsRevealed }: InteractiveGridProps) {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
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
      revealDelays: new Map(randomizedCards.map((card, index) => [card.id, index * 0.045])),
      lastRevealCardId: randomizedCards[randomizedCards.length - 1].id,
    };
  }, []);

  return (
    <>
      <Grid variants={gridVariants} initial="hidden" animate="visible" aria-label="Галерея о доме">
        <CentralPrompt $position={centralCard.position}>
          <h2>{centralCard.title}</h2>
          <p>{centralCard.description}</p>
        </CentralPrompt>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onSelect={setSelectedCard}
            revealDelay={revealDelays.get(card.id) ?? 0}
            onRevealComplete={card.id === lastRevealCardId ? onAllCardsRevealed : undefined}
          />
        ))}
      </Grid>
      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </>
  );
}
