import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { InteractiveGrid } from '../../../widgets/InteractiveGrid';
import { PanZoomCanvas } from '../../../features/PanZoomCanvas';
import { InfoModal, type InfoModalSection } from '../../../features/InfoModal';
import galleryBackdrop from '../../../shared/assets/nasa-2.jpg';

const PageFrame = styled.div`
  position: relative;
  isolation: isolate;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 140px minmax(0, 1fr);
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bg};
  background-image:
    linear-gradient(rgba(5, 7, 9, 0.76), rgba(5, 7, 9, 0.97)),
    url(${galleryBackdrop});
  background-position: center;
  background-size: cover;

  @media (max-width: 1199px) {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    height: auto;
    flex-direction: column;
    overflow: visible;
    background-attachment: fixed;
  }
`;

const CanvasContent = styled.main`
  position: relative;
  width: 1400px;
  height: 1100px;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 0%, rgba(42, 157, 143, 0.08), transparent 36%);

  &::before {
    position: absolute;
    z-index: 0;
    inset: 0;
    background-image: linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
    background-size: 72px 72px;
    content: '';
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.34), transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 1199px) {
    width: 100%;
    height: auto;
    min-height: 0;
    overflow: visible;
    background: transparent;

    &::before {
      display: none;
    }
  }
`;

const IntroLayer = styled.div`
  position: fixed;
  z-index: 8;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
`;

const IntroTitle = styled(motion.button)`
  padding: 14px 18px;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(42px, 8vw, 88px);
  font-weight: 500;
  letter-spacing: -0.07em;
  line-height: 1;
  cursor: pointer;
  text-align: center;
  text-shadow: 0 8px 48px rgba(0, 0, 0, 0.5);

  &:focus-visible {
    border-radius: 8px;
    outline: 2px solid ${({ theme }) => theme.colors.categories.artwork};
    outline-offset: 6px;
  }
`;

const AboutCard = styled(motion.section)`
  width: min(580px, 100%);
  padding: 48px;
  border: 1px solid rgba(42, 157, 143, 0.42);
  border-radius: ${({ theme }) => theme.radii.modal};
  background:
    radial-gradient(circle at 100% 0%, rgba(42, 157, 143, 0.12), transparent 48%),
    rgba(20, 20, 20, 0.94);
  box-shadow: ${({ theme }) => theme.shadows.modal};
  backdrop-filter: blur(18px);

  @media (max-width: 560px) {
    padding: 32px 24px;
    border-radius: 20px;
  }
`;

const AboutEyebrow = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.categories.artwork};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const AboutTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 42px;
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 1.05;

  @media (max-width: 560px) {
    font-size: 34px;
  }
`;

const AboutCopy = styled.p`
  margin: 20px 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.75;
`;

const ContinueButton = styled.button`
  margin-top: 32px;
  padding: 14px 18px;
  border: 1px solid rgba(42, 157, 143, 0.64);
  border-radius: 999px;
  background: rgba(42, 157, 143, 0.12);
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.card};

  &:hover {
    border-color: ${({ theme }) => theme.colors.categories.artwork};
    background: rgba(42, 157, 143, 0.2);
    box-shadow: 0 0 26px rgba(42, 157, 143, 0.16);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.categories.artwork};
    outline-offset: 4px;
  }
`;

const PageHeading = styled(motion.header)<{ $visible: boolean }>`
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(24px, 5vw, 72px);
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};

  @media (max-width: 1199px) {
    min-height: 96px;
    padding: 18px 22px;
    gap: 16px;
  }

  @media (max-width: 560px) {
    padding: 16px;
    gap: 10px;
  }
`;

const HeadingNav = styled.nav`
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 46px);

  @media (max-width: 560px) {
    gap: 12px;
  }
`;

const HeadingLink = styled.button`
  padding: 10px 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.card};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    border-radius: 4px;
    outline: 2px solid ${({ theme }) => theme.colors.categories.artwork};
    outline-offset: 5px;
  }

  @media (max-width: 560px) {
    font-size: 11px;
  }
`;

const ImageCredit = styled.div`
  position: absolute;
  z-index: 3;
  right: 18px;
  bottom: 12px;
  color: rgba(244, 241, 236, 0.56);
  font-size: 10px;
  letter-spacing: 0.015em;

  @media (max-width: 1199px) {
    position: relative;
    right: auto;
    bottom: auto;
    align-self: flex-end;
    max-width: calc(100% - 32px);
    margin: 0 16px 14px;
    line-height: 1.6;
    text-align: right;
  }

  a {
    color: inherit;
    text-decoration-color: rgba(244, 241, 236, 0.32);
    text-underline-offset: 2px;
    transition: color 180ms ease;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 48px;
  font-weight: 500;
  letter-spacing: -0.065em;
  line-height: 1;

  @media (max-width: 1199px) {
    font-size: clamp(24px, 4.5vw, 38px);
    letter-spacing: -0.055em;
  }

  @media (max-width: 560px) {
    font-size: clamp(20px, 5.4vw, 29px);
    white-space: nowrap;
  }

  span {
    color: ${({ theme }) => theme.colors.categories.artwork};
  }
`;

export function HomePage() {
  const [introStage, setIntroStage] = useState<'title' | 'about' | 'content'>('title');
  const [mainContentVisible, setMainContentVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeInfo, setActiveInfo] = useState<InfoModalSection | null>(null);

  return (
    <PageFrame>
      {!mainContentVisible ? (
        <IntroLayer>
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              if (introStage === 'content') setMainContentVisible(true);
            }}
          >
            {introStage === 'title' && (
              <IntroTitle
                key="intro-title"
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.95, ease: [0.4, 0, 0.2, 1] } }}
                onClick={() => setIntroStage('about')}
              >
                Что такое дом?
              </IntroTitle>
            )}
            {introStage === 'about' && (
              <AboutCard
                key="about-project"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }}
                aria-labelledby="about-title"
              >
                <AboutEyebrow>Коллекция образов</AboutEyebrow>
                <AboutTitle id="about-title">О проекте</AboutTitle>
                <AboutCopy>
                  Дом — это не только место, но и чувство, память и привычные детали. Эта коллекция
                  собирает визуальные фрагменты, из которых складывается личное ощущение дома.
                  Рассматривайте карточки как части одного открытого разговора.
                </AboutCopy>
                <ContinueButton type="button" onClick={() => setIntroStage('content')}>
                  Перейти к содержимому
                </ContinueButton>
              </AboutCard>
            )}
          </AnimatePresence>
        </IntroLayer>
      ) : (
        <>
          <PageHeading
            $visible={menuVisible}
            aria-hidden={!menuVisible}
            initial={{ opacity: 0 }}
            animate={{ opacity: menuVisible ? 1 : 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Title>Что такое дом?</Title>
            <HeadingNav aria-label="Информация о проекте">
              <HeadingLink type="button" tabIndex={menuVisible ? 0 : -1} disabled={!menuVisible} onClick={() => setActiveInfo('guide')}>
                Руководство
              </HeadingLink>
              <HeadingLink type="button" tabIndex={menuVisible ? 0 : -1} disabled={!menuVisible} onClick={() => setActiveInfo('contacts')}>
                Контакты
              </HeadingLink>
            </HeadingNav>
          </PageHeading>
          <PanZoomCanvas>
            <CanvasContent>
              <InteractiveGrid onRevealComplete={() => setMenuVisible(true)} />
            </CanvasContent>
          </PanZoomCanvas>
          <ImageCredit>
            Image: <a href="https://www.esa.int/ESA_Multimedia/Images/2022/09/Galactic_overlap" target="_blank" rel="noreferrer">ESA/Hubble &amp; NASA, W. Keel</a>
            {' · '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
          </ImageCredit>
          <InfoModal section={activeInfo} onClose={() => setActiveInfo(null)} />
        </>
      )}
    </PageFrame>
  );
}
