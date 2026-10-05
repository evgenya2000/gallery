import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

export type InfoModalSection = 'guide' | 'contacts';

interface InfoModalProps {
  section: InfoModalSection | null;
  onClose: () => void;
}

const sectionContent = {
  guide: {
    label: 'Как пользоваться',
    title: 'Руководство',
    description: 'Исследуйте коллекцию в удобном темпе.',
    steps: [
      'Перетаскивайте холст мышью, чтобы перемещаться по коллекции.',
      'Используйте колесо мыши, чтобы приблизить или отдалить холст.',
      'Нажмите на изображение, чтобы открыть его описание.',
    ],
  },
  contacts: {
    label: 'Связь',
    title: 'Контакты',
    description: 'По вопросам о проекте, обратной связи и сотрудничеству.',
    steps: [],
  },
} satisfies Record<InfoModalSection, { label: string; title: string; description: string; steps: string[] }>;

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 560px) {
    padding: 16px;
  }
`;

const Dialog = styled(motion.section)`
  position: relative;
  width: min(540px, 100%);
  padding: 42px;
  border: 1px solid rgba(42, 157, 143, 0.48);
  border-radius: ${({ theme }) => theme.radii.modal};
  background:
    radial-gradient(circle at 100% 0%, rgba(42, 157, 143, 0.1), transparent 48%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.modal};

  @media (max-width: 560px) {
    padding: 30px 24px;
    border-radius: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.card};

  &:hover {
    border-color: rgba(255, 255, 255, 0.28);
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.categories.artwork};
    outline-offset: 3px;
  }
`;

const Eyebrow = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.categories.artwork};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const Heading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.05;

  @media (max-width: 560px) {
    font-size: 34px;
  }
`;

const Description = styled.p`
  margin: 18px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;
`;

const Steps = styled.ol`
  display: grid;
  gap: 14px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 22px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    line-height: 1.6;
  }

  li::before {
    position: absolute;
    top: 0.65em;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.categories.artwork};
    content: '';
  }
`;

const modalEase = [0.16, 1, 0.3, 1] as const;

export function InfoModal({ section, onClose }: InfoModalProps) {
  useEffect(() => {
    if (!section) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [section, onClose]);

  return createPortal(
    <AnimatePresence>
      {section && (
        <Overlay
          key="info-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.42, ease: modalEase } }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: modalEase } }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <Dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.75, ease: modalEase } }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.55, ease: modalEase } }}
          >
            <CloseButton type="button" aria-label="Закрыть окно" onClick={onClose}>
              ×
            </CloseButton>
            <Eyebrow>{sectionContent[section].label}</Eyebrow>
            <Heading id="info-modal-title">{sectionContent[section].title}</Heading>
            <Description>{sectionContent[section].description}</Description>
            {sectionContent[section].steps.length > 0 && (
              <Steps>
                {sectionContent[section].steps.map((step) => <li key={step}>{step}</li>)}
              </Steps>
            )}
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body,
  );
}
