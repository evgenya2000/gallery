import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import styled from 'styled-components';
import { Card, cards, type CardData } from '../../../entities/Card';
import { CardModal } from '../../../features/CardModal';

const Grid = styled(motion.div)`
  position: relative;
  width: 1600px;
  height: 1300px;

  @media (max-width: 1199px) {
    display: grid;
    width: 100%;
    height: auto;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
    padding: 16px 32px 42px;
  }

  @media (max-width: 850px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    padding: 12px 24px 36px;
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    padding: 6px 18px 32px;
  }
`;

const revealOrder = [12, 3, 18, 6, 14, 1, 9, 20, 5, 16, 2, 11, 7, 19, 4, 13, 8, 17, 10, 15];
const cardsInRevealOrder = [...cards].sort(
  (first, second) => revealOrder.indexOf(first.id) - revealOrder.indexOf(second.id),
);
const featuredCardId = 18;
const compactCardsInRevealOrder = [
  ...cardsInRevealOrder.filter((card) => card.id === featuredCardId),
  ...cardsInRevealOrder.filter((card) => card.id !== featuredCardId),
];

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

interface InteractiveGridProps {
  onRevealComplete: () => void;
}

export function InteractiveGrid({ onRevealComplete }: InteractiveGridProps) {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1199px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1199px)');
    const updateLayout = (event: MediaQueryListEvent) => setIsCompact(event.matches);

    setIsCompact(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  const visibleOrder = isCompact ? compactCardsInRevealOrder : cardsInRevealOrder;
  const menuTriggerIndex = isCompact ? 3 : cardsInRevealOrder.length - 1;

  return (
    <>
      <Grid variants={gridVariants} initial="hidden" animate="visible" aria-label="Gallery cards">
        {visibleOrder.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onSelect={setSelectedCard}
            isFeatured={card.id === featuredCardId}
            onRevealComplete={index === menuTriggerIndex ? onRevealComplete : undefined}
          />
        ))}
      </Grid>
      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </>
  );
}
