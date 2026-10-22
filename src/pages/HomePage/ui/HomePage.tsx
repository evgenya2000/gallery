import { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { InteractiveGrid } from '../../../widgets/InteractiveGrid';
import { PanZoomCanvas } from '../../../features/PanZoomCanvas';
import { InfoModal, type InfoModalSection } from '../../../features/InfoModal';
import { cards, centralCard } from '../../../entities/Card';
import { useImagePreloader } from '../../../shared/lib/useImagePreloader';
import { aboutProjectContent } from '../../../shared/lib/aboutProjectContent';
import galleryBackdrop from '../../../shared/assets/background.png';
import introLeft from '../../../shared/assets/intro-left.png';
import introRight from '../../../shared/assets/intro-right.png';
import {
  hyphens,
  mediaBreakpointBetween,
  mediaBreakpointDown,
  mediaBreakpointUp,
  smoothValue,
  vw,
} from '../../../shared/styles/mixins';

const PageFrame = styled.div<{ $dimmed: boolean }>`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  --house-art-width: min(100dvh, 75vw);
  --roof-anchor-x: 43vw;
  --house-art-left: calc(var(--roof-anchor-x) - 12.07dvh);
  --roof-anchor-y: 39dvh;
  --face-anchor-x: calc(var(--house-art-left) + 23dvh);
  --description-left-x: 23.6vw;
  --header-height: clamp(90px, 13.67dvh, 140px);
  overflow: hidden;
  background-color: #f7f7f7;

  &::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    background-image: url(${galleryBackdrop});
    background-position: 40vw calc(var(--roof-anchor-y) - 31.4dvh);
    background-repeat: no-repeat;
    background-size: var(--house-art-width);
    content: '';
    opacity: ${({ $dimmed }) => ($dimmed ? 0.2 : 1)};
    transition: opacity 900ms ease;
    pointer-events: none;
  }

  ${mediaBreakpointDown('desktop', true)} {
    &::before {
      background-position: right -155px bottom -3svh;
      background-size: auto 94svh;
    }
    
  }
  ${mediaBreakpointDown('xxl', true)} {
    &::before {
      background-position: right -130px bottom -3svh;
      background-size: auto 94svh;
    }
    
  }

  ${mediaBreakpointDown('compact')} {
    --header-height: 72px;
    --house-art-width: min(100dvh, 70vw);
    --house-art-left: calc(100vw - var(--house-art-width) + 17vw);
    --roof-anchor-x: calc(var(--house-art-left) + min(8.45vw, 12.07dvh));
    --roof-anchor-y: 44dvh;
    --face-anchor-x: calc(var(--house-art-left) + min(14.35vw, 20.5dvh));
    --description-left-x: 28.5vw;
    display: flex;
    min-height: 100dvh;
    height: auto;
    flex-direction: column;
    overflow: visible;
    background-color: #f7f7f7;

    &::before {
      background-position: right -100px bottom -2svh;
      background-size: auto 55svh;
      background-attachment: fixed;
    }
  }

  ${mediaBreakpointDown('tablet', true)} {
    --header-height: 48px;

    &::before {
      background-image: none;
      background-attachment: scroll;
    }
  }
`;

const CanvasContent = styled.main`
  position: relative;
  width: 1440px;
  height: 935px;
  overflow: hidden;

  ${mediaBreakpointDown('tablet')} {
    width: 1040px;
    height: 800px;
  }

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

  ${mediaBreakpointDown('compact')} {
    background: transparent;

    &::before {
      display: none;
    }
  }
`;

const GridReveal = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const IntroLayer = styled.div<{ $isAbout: boolean; $clickable: boolean }>`
  position: absolute;
  z-index: 8;
  inset: clamp(90px, 13.67dvh, 140px) 0 0;
  --intro-pad: clamp(20px, 1.5vw, 40px);
  display: flex;
  align-items: center;
  justify-content: ${({ $isAbout }) => ($isAbout ? 'center' : 'flex-start')};
  padding: 0 var(--intro-pad);
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'auto')};
  -webkit-tap-highlight-color: transparent;

  ${mediaBreakpointDown('wide', true)} {
    top: 80px;
  }

  ${mediaBreakpointDown('compact')} {
    --intro-pad: clamp(16px, 4vw, 48px);
    position: relative;
    inset: auto;
    flex: 1 0 auto;
    flex-direction: column;
    min-height: calc(100dvh - var(--header-height));
    align-items: ${({ $isAbout }) => ($isAbout ? 'center' : 'flex-start')};
    justify-content: ${({ $isAbout }) => ($isAbout ? 'center' : 'flex-start')};
    padding: ${({ $isAbout }) =>
    $isAbout
      ? '0 var(--intro-pad)'
      : '5vh var(--intro-pad) clamp(28px, 7vh, 78px)'};
  }

  ${mediaBreakpointDown('tablet', true)} {
    --intro-pad: 16px;
    padding: 67px var(--intro-pad) 36px;
    min-height: calc(100dvh - 48px);
    justify-content: flex-start;
    align-items: flex-start;
    line-height: 13px;

    @media (max-height: 800px) {
      padding-top: 20px;
    }

    @media (min-height: 700px) {
      padding-bottom: 5.14svh;
    }

    @media (max-height: 750px) {
      padding-bottom: 10px;
    }
  }

  ${mediaBreakpointDown('phoneSmall', true)} {
    padding: 35px 22px 20px;

    @media (min-height: 700px) {
      padding-bottom: 36px;
    }
  }
`;

const IntroImagesOverlay = styled.div<{ $dimmed: boolean }>`
  display: none;

  opacity: ${({ $dimmed }) => ($dimmed ? 0.2 : 1)};
  transition: opacity 900ms ease;

  ${mediaBreakpointDown('compact', true)} {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }
`;

const IntroImageRight = styled(motion.img)`
  display: none;

  ${mediaBreakpointDown('tablet', true)} {
    display: block;
    position: absolute;
    right: 0;
    top: 30svh;
    height: auto;
    max-height: 48svh;
    object-fit: contain;
    object-position: bottom right;
    z-index: 0;
    pointer-events: none;
    user-select: none;

    @media (min-height: 1000px) {
      height: 100vh;
    }
  }

  ${mediaBreakpointDown('phoneSmall', true)} {
    max-height: 48svh;

  }
`;

const IntroImageLeft = styled(motion.img)`
  display: none;

  ${mediaBreakpointDown('compact')} {
    display: block;
    position: absolute;
    left: 0;
    top: 22svh;
    height: auto;
    max-height: 60svh;
    object-fit: contain;
    object-position: bottom left;
    z-index: 0;
    pointer-events: none;
    user-select: none;

    @media (min-height: 1000px) {
      height: 1000px;
    }
  }

  ${mediaBreakpointDown('tablet', true)} {
    top: 18svh;
    max-height: 60svh;

    @media (min-height: 1000px) {
      height: 100vh;
    }
  }
`;

const SplashContent = styled(motion.section)`
  position: absolute;
  top: calc(var(--roof-anchor-y) - var(--header-height) - 20px);
  left: var(--intro-pad);
  width: calc(var(--roof-anchor-x) - var(--intro-pad));

  ${mediaBreakpointDown('desktop', true)} {
    width: calc(48vw - var(--intro-pad));
  }

  ${mediaBreakpointDown('compact')} {
    position: relative;
    top: auto;
    left: auto;
    width: calc(var(--roof-anchor-x) - var(--intro-pad));
  }

  ${mediaBreakpointBetween('tablet', 'compact')} {
    width: 100%;
    max-width: 100%;
  }

  ${mediaBreakpointDown('tablet', true)} {
    width: 100%;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;

const IntroTitle = styled(motion.button)`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-end;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  letter-spacing: -0.07em;
  line-height: 1;
  cursor: pointer;
  text-align: right;
  font-size: clamp(48px, calc(6.4vw + 45px), 194px);

  .continue-hint {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: max-content;
    max-width: calc(100vw - 32px);
    color: ${({ theme }) => theme.colors.text};
    font-size: clamp(10px, 0.75vw, 12px);
    font-weight: 400;
    letter-spacing: 0.02em;
    opacity: 0;
    text-align: right;
    transform: translateY(-4px);
    transition: opacity 220ms ease, transform 220ms ease;
    pointer-events: none;
  }

  &:hover .continue-hint,
  &:focus-visible .continue-hint {
    opacity: 1;
    transform: translateY(0);
  }

  span:nth-child(2) {
    font-weight: 352;
  }

  ${mediaBreakpointUp('wide')} {
    font-size: calc(${vw(90, 1920)} + 55px);
  }

  ${mediaBreakpointBetween('xxl', 'wide')} {
     span:nth-child(1) {
      font-size: ${smoothValue(124.5, 136.1, 1440, 1728)};
     }
     span:nth-child(2) {
      font-size: ${smoothValue(157.88, 172, 1440, 1728)};
     }
  }
  
  ${mediaBreakpointBetween('compact', 'xxl')} {

    span:nth-child(1) {
      font-size: ${smoothValue(115.02, 124.5, 1200, 1440)};
     }
     span:nth-child(2) {
      font-size: ${smoothValue(124.5, 157.88, 1200, 1440)};
     }
    
  }

  ${mediaBreakpointDown('tabletWide')} {
    @media (max-height: 680px) {
      font-size: clamp(20px, 6.4vw, 54px);
    }
    @media (max-height: 480px) {
      font-size: clamp(18px, 5.8vw, 38px);
    }
  }

  @media (max-width: 850px) and (max-height: 680px) {
    font-size: clamp(20px, 6.4vw, 54px);
  }

  @media (max-width: 850px) and (max-height: 480px) {
    font-size: clamp(18px, 5.8vw, 38px);
  }

  span:nth-child(2) {
    font-weight: 352;
    ${mediaBreakpointDown('compact')} {
      font-size: 120px;
    }

    ${mediaBreakpointBetween('compact', 'wide')} {
      font-size: ${smoothValue(145.96, 171.93, 1200, 1728)};
    }

    ${mediaBreakpointUp('wide')} {
      font-size: calc(${vw(115.392, 1920)} + 68.15px);
    }

    ${mediaBreakpointDown('tabletWide')} {
      @media (max-height: 680px) {
        font-size: clamp(50px, 6.4vw, 84px);
      }
      @media (max-height: 480px) {
        font-size: clamp(48px, 5.8vw, 68px);
      }
    }
  }

  ${mediaBreakpointBetween('tablet', 'compact')} {
    padding-right: 10vw;
    span:nth-child(1) {
      font-size: 97.46px;
      line-height: 105.8px;
    }

    span:nth-child(2) {
      font-size: 123.59px;
      line-height: 150.3px;
    }
  }

  ${mediaBreakpointDown('tablet', true)} {
    align-items: flex-end;
    text-align: left;
    letter-spacing: -0.04em;
    line-height: 0.9;

    .continue-hint {
      display: none;
    }

    span:nth-child(1) {
      font-size: 66px;
    }

    span:nth-child(2) {
      font-size: 84px;
      font-weight: 340;
      line-height: 92.18px;
    } 

    @media (max-height: 750px) {
      span:nth-child(1) {
        font-size: 56px;
      }

      span:nth-child(2) {
        font-size: 74px;
      }
    }
  }

  ${mediaBreakpointDown('phoneSmall', true)} {
    span:nth-child(1) {
      font-size: 54px;
    }

    span:nth-child(2) {
      font-size: 74px;
      line-height: 81px;
    }
  }
`;

const IntroDescription = styled(motion.div)`
  width: calc(var(--face-anchor-x) - var(--description-left-x));
  margin: clamp(28px, 4.5dvh, 52px) 0 0 calc(var(--description-left-x) - var(--intro-pad));
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(20px, 1.5vw, 28px);
  line-height: 1.28;
  ${hyphens}

  p {
    margin: 0;
  }

  p + p {
    margin-top: 18px;
  }

  ${mediaBreakpointDown('desktop', true)} {
    max-width: 32.5vw;
    margin: clamp(28px, 4.5dvh, 52px) 0 0 calc(23vw - var(--intro-pad));
    font-size: 21.5px;
    line-height: 27.5px;
  }

  ${mediaBreakpointBetween('xxl', 'wide')} {
    width: 537px;
  }
  
  ${mediaBreakpointBetween('compact', 'xxl')} {
    width: 468px;
  }

  ${mediaBreakpointBetween('tablet', 'compact')} {
    width: auto;
    max-width: 100%;
    margin: clamp(20px, 3dvh, 36px) 0 0;
    font-size: 16.83px;
    line-height: 17.59px;
  }

  ${mediaBreakpointDown('tablet', true)} {
    width: 100%;
    max-width: 275px;
    margin: auto auto 0;
    font-size: 14px;
    line-height: 1.25;

    p:first-child {
      width: 100%;
    }

    p + p {
      margin-top: 12px;
    }
  }

  ${mediaBreakpointDown('phoneSmall', true)} {
    font-size: 12px;
    max-width: 100%;
    width: 275px;
  }

`;

const AboutCard = styled(motion.section) <{ $modal?: boolean }>`
  position: relative;
  width: 980px;
  height: auto;
  max-width: calc(100vw - 48px);
  max-height: ${({ $modal }) => ($modal ? 'calc(100dvh - 48px)' : 'calc(100dvh - var(--header-height))')};
  overflow-y: auto;
  padding: 56px 64px 52px;
  border-radius: 30px;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  ${mediaBreakpointDown('xxl', true)} {
    padding: 28px 32px 26px;
  }

  ${mediaBreakpointDown('modal', true)} {
    overflow-y: auto;
    position: fixed;
    z-index: 15;
    top: 48px;
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    height: auto;
    max-width: none;
    max-height: none;
    border: none;
    border-radius: 0;
    padding: clamp(24px, 5vw, 48px) clamp(20px, 5vw, 40px) 40px;
  }

  ${mediaBreakpointDown('phone', true)} {
    padding: 54px 22px 40px;
  }
`;

const AboutTitle = styled.h2`
  margin: 0 0 40px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 48px;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.05;
  text-align: center;
  text-transform: uppercase;

  ${mediaBreakpointDown('xxl', true)} {
    margin-bottom: 28px;
  }

  ${mediaBreakpointDown('smallDesktop', true)} {
    font-size: clamp(28px, 6vw, 40px);
    margin-bottom: 28px;
  }

  ${mediaBreakpointDown('phone', true)} {
    font-size: 32px;
  }
`;

const AboutSubtitle = styled.h3`
  margin: 40px 0 20px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 36px;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.1;
  text-align: center;
  text-transform: uppercase;

  ${mediaBreakpointDown('smallDesktop', true)} {
    margin: 28px 0 16px;
  }
  ${mediaBreakpointDown('smallDesktop', true)} {
    font-size: clamp(22px, 4.5vw, 30px);
    margin: 28px 0 16px;
  }

  ${mediaBreakpointDown('phone', true)} {
    font-size: 32px;
  }
`;

const AboutCopy = styled.p`
  margin: 0 0 18px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.005em;

  &:last-of-type {
    margin-bottom: 0;
  }

  ${mediaBreakpointDown('smallDesktop', true)} {
    font-size: 17px;
  }

  ${mediaBreakpointDown('phone', true)} {
    font-size: 14px;
    line-height: 16px;
  }
`;

const ContinueButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 44px 0 0;
  padding: 0 0 6px;
  border: 0;
  border-bottom: 1px solid rgba(20, 20, 20, 0.7);
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.2;
  cursor: pointer;
  transition: opacity 200ms ease, border-color 200ms ease;

  position: relative;
  left: 50%;
  transform: translateX(-50%);

  svg {
    position: relative;
    top: 3px;
    width: 0.5em;
    height: 0.5em;
    flex-shrink: 0;
    display: block;
  }

  svg path {
    stroke: currentColor;
  }

  &:hover {
    opacity: 0.7;
    border-color: rgba(20, 20, 20, 0.4);
  }

  ${mediaBreakpointDown('smallDesktop', true)} {
    font-size: 20px;
    margin-top: 32px;
  }

  ${mediaBreakpointDown('phone', true)} {
    font-size: 18px;
  }
`;

const AboutModalOverlay = styled(motion.div)`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(247, 247, 247, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  ${mediaBreakpointDown('modal', true)} {
    padding: 0;
  }
`;

const AboutCloseButton = styled.button`
  position: absolute;
  z-index: 2;
  top: 20px;
  right: 20px;
  display: grid;
  width: 55px;
  height: 55px;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 180ms ease;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  &:hover,
  &:active {
    opacity: 0.6;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    width: 44px;
    height: 44px;
  }

  ${mediaBreakpointDown('modal', true)} {
    top: 12px;
    right: 16px;
    width: 28px;
    height: 28px;
  }
`;

function AboutProjectContent({ onContinue, titleId = 'about-title' }: { onContinue: () => void; titleId?: string }) {
  return (
    <>
      <AboutTitle id={titleId}>{aboutProjectContent.title}</AboutTitle>

      {aboutProjectContent.introduction.map((paragraph) => (
        <AboutCopy key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}

      <AboutSubtitle>{aboutProjectContent.participationHeading}</AboutSubtitle>

      {aboutProjectContent.participation.map((paragraph) => (
        <AboutCopy key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}

      <ContinueButton type="button" onClick={onContinue}>
        перейти к карте
        <svg
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0.5 11.5L11.5 0.5M11.5 10.4V0.5H1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ContinueButton>
    </>
  );
}

const PageHeading = styled(motion.header)`
  position: relative;
  z-index: 9;
  display: flex;
  justify-content: space-between;

  ${mediaBreakpointUp('tablet')} {
    padding: 18px 1.9vw 9px;
  }

  ${mediaBreakpointUp('compact')} {
    padding: 29px 5.3vw 9px 3.2vw;
  }

  ${mediaBreakpointUp('wide')} {
    padding: 34px 8.62vw 9px;
  }

  ${mediaBreakpointUp('qhd')} {
    padding: 45px 10vw 9px;
  }

  ${mediaBreakpointDown('tablet', true)} {
    padding: 20px 22px 9px;
  }
`;

const HeadingNav = styled.nav`
  display: flex;
  gap: 7.65vw;

  ${mediaBreakpointUp('desktop')} {
    gap: clamp(80px, 7.5vw, 200px);
  }

  ${mediaBreakpointBetween('compact', 'desktop')} {
    gap: clamp(48px, 10vw, 150px);
  }

  ${mediaBreakpointDown('compact')} {
    gap: 105px;
  }

  ${mediaBreakpointDown('tablet', true)} {
    gap: 12px;
  }
`;

const HeadingLink = styled.button<{ $hidden?: boolean }>`
  z-index: 10;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
  transition: opacity ease-out 300ms;

  &:hover{
    opacity: 0.5;
  }

  ${mediaBreakpointBetween('compact', 'wide')} {
    font-size: 24px;
  }

  ${mediaBreakpointBetween('wide', 'uhd')} {
    font-size: 26px;
  }

  ${mediaBreakpointUp('uhd')} {
    font-size: 34px;
  }

  ${mediaBreakpointDown('compact')} {
    font-size: clamp(10px, 1.8vw, 16px);
  }

  ${mediaBreakpointDown('narrowPhone', true)} {
    font-size: 9px;
  }

  ${mediaBreakpointDown('tablet', true)} {
    font-size: 11px;
  }
`;

const SharpLinkLabel = styled(motion.span)`
  position: fixed;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  text-align: right;
  pointer-events: none;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;

  span {
    color: ${({ theme }) => theme.colors.categories.artwork};
  }

  ${mediaBreakpointBetween('compact', 'wide')} {
    font-size: 24px;
  }

  ${mediaBreakpointBetween('wide', 'uhd')} {
    font-size: 26px;
  }

  ${mediaBreakpointUp('uhd')} {
    font-size: 34px;
  }

  ${mediaBreakpointDown('compact')} {
    font-size: clamp(10px, 1.8vw, 16px);
  }

  ${mediaBreakpointDown('tablet', true)} {
    font-size: 11px;
  }
`;

const TitleButton = styled.button`
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 200ms ease;

  &:hover,
  &:active {
    opacity: 0.65;
  }
`;

export function HomePage() {
  const [introStage, setIntroStage] = useState<'title' | 'about' | 'content'>('title');
  const [mainContentVisible, setMainContentVisible] = useState(false);
  const [gridRevealed, setGridRevealed] = useState(false);
  const [gridRevealComplete, setGridRevealComplete] = useState(false);
  const [activeInfo, setActiveInfo] = useState<InfoModalSection | null>(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [descriptionOffset, setDescriptionOffset] = useState<number | null>(null);
  const [sharpLink, setSharpLink] = useState<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: string;
  } | null>(null);

  const secondSpanRef = useRef<HTMLSpanElement>(null);
  const guideLinkRef = useRef<HTMLButtonElement>(null);
  const contactsLinkRef = useRef<HTMLButtonElement>(null);

  const cardImagePaths = useMemo(
    () => cards.map((card) => card.image).filter((image): image is string => Boolean(image)),
    []
  );
  const cardImagesReady = useImagePreloader(cardImagePaths, introStage !== 'content');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!aboutModalOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAboutModalOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aboutModalOpen]);

  // Ждём декодирования изображений, затем начинаем появление карточек
  // через 0.5 с после того, как mainContentVisible = true.
  useEffect(() => {
    if (!mainContentVisible) {
      setGridRevealed(false);
      setGridRevealComplete(false);
      return undefined;
    }

    if (!cardImagesReady) return undefined;

    const timeout = window.setTimeout(() => setGridRevealed(true), 500);
    return () => window.clearTimeout(timeout);
  }, [mainContentVisible, cardImagesReady]);

  // Измеряем смещение буквы "Д" относительно SplashContent
  useLayoutEffect(() => {
    if (isMobile || introStage !== 'title') {
      setDescriptionOffset(null);
      return;
    }
    const span = secondSpanRef.current;
    if (!span) return;

    const updateOffset = () => {
      setDescriptionOffset(span.offsetLeft);
    };

    updateOffset();

    window.addEventListener('resize', updateOffset);
    if (document.fonts) {
      document.fonts.ready.then(updateOffset);
    }

    return () => window.removeEventListener('resize', updateOffset);
  }, [isMobile, introStage]);

  // Синхронизируем позицию "острого" дубликата активной ссылки в хедере.
  // На мобиле (< 768px) фича отключена — работает обычное блюр-затемнение.
  useLayoutEffect(() => {
    if (isMobile || !activeInfo || activeInfo === 'participation') {
      setSharpLink(null);
      return;
    }

    const el = activeInfo === 'guide' ? guideLinkRef.current : contactsLinkRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      setSharpLink({
        text: (el.textContent ?? '').trim(),
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        fontSize: cs.fontSize,
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [activeInfo, isMobile]);

  const isIntroTitleClickable = isMobile && introStage === 'title';
  
  const isAboutLayout = introStage === 'about' || (introStage === 'content' && !mainContentVisible);

  const handleIntroClick = () => {
    if (!isIntroTitleClickable) return;
    setIntroStage('about');
  };

  const handleAboutContinue = () => {
    setAboutModalOpen(false);
    setIntroStage('content');
  };

  return (
    <PageFrame $dimmed={mainContentVisible}>
      <IntroImagesOverlay aria-hidden="true" $dimmed={mainContentVisible}>
        <IntroImageLeft src={introLeft} alt="" draggable={false} />
        <IntroImageRight src={introRight} alt="" draggable={false} />
      </IntroImagesOverlay>

      <PageHeading>
        <Title>
          <TitleButton
            type="button"
            onClick={() => {
              setActiveInfo(null);
              setAboutModalOpen(true);
            }}
            aria-haspopup="dialog"
          >
            [что такое дом?]
          </TitleButton>
        </Title>
        <HeadingNav aria-label="Информация о проекте">
          <HeadingLink
            ref={guideLinkRef}
            type="button"
            $hidden={!isMobile && activeInfo === 'guide'}
            onClick={() => setActiveInfo('guide')}
          >
            [руководство]
          </HeadingLink>
          <HeadingLink
            ref={contactsLinkRef}
            type="button"
            $hidden={!isMobile && activeInfo === 'contacts'}
            onClick={() => setActiveInfo('contacts')}
          >
            [контакты]
          </HeadingLink>
        </HeadingNav>
      </PageHeading>

      {!mainContentVisible ? (
        <IntroLayer
          $isAbout={isAboutLayout}
          $clickable={isIntroTitleClickable}
          onClick={handleIntroClick}
        >
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              if (introStage === 'content') setMainContentVisible(true);
            }}
          >
            {introStage === 'title' && (
              <SplashContent
                key="intro-title"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.95, ease: [0.4, 0, 0.2, 1] } }}
              >
                <IntroTitle
                  type="button"
                  aria-describedby="intro-continue-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 2, ease: [0.4, 0, 0.2, 1] } }}
                  onClick={() => setIntroStage('about')}
                >
                  <span>ЧТО ТАКОЕ</span>
                  <span ref={secondSpanRef}>ДОМ?</span>
                  <span id="intro-continue-hint" className="continue-hint">
                    [нажмите, чтобы продолжить]
                  </span>
                </IntroTitle>
                <IntroDescription
                  style={
                    !isMobile && descriptionOffset != null
                      ? { marginLeft: descriptionOffset + 4 }
                      : undefined
                  }
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      delay: 1.35,
                      duration: 1.5,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                >
                  <p dangerouslySetInnerHTML={{ __html: 'Исследование разных представлений о&nbsp;доме.' }} />
                  <p dangerouslySetInnerHTML={{ __html: 'Через художественные образы и&nbsp;личные истории предлагаем взглянуть на&nbsp;привычное понятие с&nbsp;разных сторон и&nbsp;задуматься, что делает пространство настоящим домом для человека.' }} />
                </IntroDescription>
              </SplashContent>
            )}
            {introStage === 'about' && (
              <AboutCard
                key="about-project"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } }}
                aria-labelledby="about-title"
              >
                <AboutProjectContent onContinue={handleAboutContinue} />
              </AboutCard>
            )}
          </AnimatePresence>
        </IntroLayer>
      ) : (
        <PanZoomCanvas zoomAfterLoad={gridRevealComplete}>
          <CanvasContent>
            <GridReveal>
              <InteractiveGrid
                onAllCardsRevealed={() => setGridRevealComplete(true)}
                onOpenParticipation={() => setActiveInfo('participation')}
                shouldReveal={gridRevealed}
              />
            </GridReveal>
          </CanvasContent>
        </PanZoomCanvas>
      )}

      <InfoModal
        section={activeInfo}
        participationContent={centralCard.modalContent}
        onClose={() => setActiveInfo(null)}
      />

      {createPortal(
        <AnimatePresence>
          {aboutModalOpen && (
            <AboutModalOverlay
              key="about-project-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setAboutModalOpen(false);
              }}
            >
              <AboutCard
                $modal
                role="dialog"
                aria-modal="true"
                aria-labelledby="about-modal-title"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
              >
                <AboutCloseButton type="button" aria-label="Закрыть окно" onClick={() => setAboutModalOpen(false)}>
                  <svg viewBox="0 0 55 55" fill="none" aria-hidden="true" focusable="false">
                    <path d="M22.5216 19.8413C21.7814 19.1011 20.5811 19.1011 19.8408 19.8413C19.1006 20.5816 19.1006 21.7819 19.8408 22.5221L24.8191 27.5005L19.8409 32.4788C19.1006 33.2189 19.1006 34.4192 19.8409 35.1595C20.5812 35.8998 21.7814 35.8998 22.5216 35.1595L27.5 30.1814L32.4781 35.1595C33.2184 35.8998 34.4187 35.8998 35.159 35.1595C35.8993 34.4192 35.8993 33.2189 35.159 32.4786L30.1806 27.5005L35.159 22.5221C35.8993 21.7819 35.8993 20.5817 35.159 19.8414C34.4187 19.1011 33.2184 19.1011 32.4781 19.8414L27.5 24.8196L22.5216 19.8413Z" fill="currentColor" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M27.5 0C12.3122 0 0 12.3122 0 27.5C0 42.6879 12.3122 55 27.5 55C42.6879 55 55 42.6879 55 27.5C55 12.3122 42.6879 0 27.5 0ZM3.83721 27.5C3.83721 14.4314 14.4314 3.83721 27.5 3.83721C40.5685 3.83721 51.1628 14.4314 51.1628 27.5C51.1628 40.5685 40.5685 51.1628 27.5 51.1628C14.4314 51.1628 3.83721 40.5685 3.83721 27.5Z" fill="currentColor" />
                  </svg>
                </AboutCloseButton>
                <AboutProjectContent onContinue={handleAboutContinue} titleId="about-modal-title" />
              </AboutCard>
            </AboutModalOverlay>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {!isMobile &&
        createPortal(
          <AnimatePresence>
            {sharpLink && (
              <SharpLinkLabel
                key="sharp-active-link"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] },
                }}
                exit={{ opacity: 0, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
                style={{
                  top: sharpLink.y,
                  left: sharpLink.x,
                  width: sharpLink.width,
                  height: sharpLink.height,
                  fontSize: sharpLink.fontSize,
                }}
              >
                {sharpLink.text}
              </SharpLinkLabel>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </PageFrame>
  );
}
