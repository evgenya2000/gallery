import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { CardModalContent, CardModalType } from '../../../entities/Card';
import { mediaBreakpointDown } from '../../../shared/styles/mixins';
import { getResponsiveImageSources } from '../../../shared/lib/images';

interface CardModalProps {
  content: CardModalContent | null;
  onClose: () => void;
}

const colors: Record<CardModalType, string> = {
  'photo-story': '#2f2f2f',
  'portrait-photo-story': '#2f2f2f',
  'artist-work': '#812926',
  'personal-story': '#607984',
  participation: '#fff',
};

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 48px;
  background: rgba(250, 250, 250, 0.28);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(10px);

  ${mediaBreakpointDown('tablet', true)} {
    padding: 0;
  }
`;

const Dialog = styled(motion.section)<{ $type: CardModalType }>`
  position: relative;
  width: min(1260px, calc(100vw - 112px));
  height: min(895px, calc(100dvh - 96px));
  padding: clamp(32px, 3.6vw, 52px);
  overflow: visible;
  border-radius: 40px;
  background: ${({ $type }) => colors[$type]};
  color: ${({ $type }) => ($type === 'participation' ? '#111' : '#f7f7f7')};
  box-shadow: 0 18px 80px rgba(25, 25, 25, 0.16);
  font-family: inherit;

  ${mediaBreakpointDown('tablet', true)} {
    width: 100%;
    height: 100dvh;
    min-height: 100dvh;
    max-height: none;
    padding: 22px;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 0;
  }
`;

const CloseButton = styled.button<{ $light: boolean }>`
  position: absolute;
  z-index: 2;
  top: calc(-1 * min(72px, max(0px, (100dvh - 895px) / 2 - 24px)));
  right: calc(-1 * min(180px, max(0px, (100vw - 1260px) / 2 - 24px)));
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  padding: 0;
  border: 2px solid ${({ $light }) => ($light ? '#262626' : '#fff')};
  border-radius: 50%;
  background: transparent;
  color: ${({ $light }) => ($light ? '#262626' : '#fff')};
  font: inherit;
  font-size: 38px;
  line-height: 1;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 160ms ease, transform 160ms ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    opacity: 0.62;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }

  ${mediaBreakpointDown('tablet', true)} {
    top: 22px;
    right: 22px;
    width: 30px;
    height: 30px;
    border-width: 1.5px;
    font-size: 22px;
  }
`;

const SectionTitle = styled.h2<{ $center?: boolean }>`
  grid-area: section;
  align-self: start;
  margin: 0;
  padding-right: 54px;
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  text-align: ${({ $center }) => ($center ? 'center' : 'left')};
  text-transform: uppercase;
  white-space: pre-line;

  ${mediaBreakpointDown('tablet', true)} {
    padding-right: 42px;
    font-size: 18px;
    line-height: 1.2;
    text-align: left;
  }
`;

const ImageFrame = styled.div<{ $portrait?: boolean }>`
  grid-area: visual;
  display: flex;
  min-width: 0;
  min-height: 0;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-drag: none;
  }

  .image-placeholder {
    display: block;
    width: 100%;
    height: ${({ $portrait }) => ($portrait ? 'min(68vh, 650px)' : 'min(55vh, 460px)')};
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.08));
  }

  ${mediaBreakpointDown('tablet', true)} {
    min-height: 0;
    max-height: ${({ $portrait }) => ($portrait ? '47dvh' : '34dvh')};
    margin: 18px 0 25px;

    img {
      width: 100%;
      max-height: ${({ $portrait }) => ($portrait ? '47dvh' : '34dvh')};
    }

    .image-placeholder {
      width: ${({ $portrait }) => ($portrait ? '72%' : '100%')};
      height: ${({ $portrait }) => ($portrait ? '47dvh' : 'auto')};
      aspect-ratio: ${({ $portrait }) => ($portrait ? '0.68' : '1.5')};
    }
  }
`;

const Copy = styled.div`
  grid-area: body;
  min-width: 0;
  min-height: 0;
  align-self: center;
  overflow-y: auto;
  font-size: 20px;
  line-height: 23px;
  white-space: pre-wrap;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  p {
    margin: 0 0 22px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ${mediaBreakpointDown('tablet', true)} {
    align-self: start;
    font-size: 14px;
    line-height: 1.22;

    p {
      margin-bottom: 18px;
    }
  }
`;

const Footer = styled.div`
  grid-area: footer;
  align-self: end;
  min-height: 1em;
  padding-top: 24px;
  font-size: 20px;
  line-height: 23px;

  a {
    color: inherit;
    text-decoration: none;
  }

  ${mediaBreakpointDown('tablet', true)} {
    padding-top: 28px;
    font-size: 18px;
  }
`;

const StoryLayout = styled.div<{ $portrait?: boolean }>`
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    'visual section'
    'visual body'
    'visual footer';
  column-gap: clamp(36px, 3vw, 54px);

  ${ImageFrame} {
    padding: 0 ${({ $portrait }) => ($portrait ? '8%' : '0')} 0 0;
  }

  ${mediaBreakpointDown('tablet', true)} {
    display: grid;
    height: auto;
    min-height: calc(100dvh - 44px);
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto 1fr auto;
    grid-template-areas:
      'section'
      'visual'
      'body'
      '. '
      'footer';
    column-gap: 0;
    align-content: start;

    ${ImageFrame} {
      padding: 0;
    }
  }
`;

const ArtworkLayout = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    'visual section'
    'visual body'
    'visual footer';
  column-gap: clamp(36px, 3vw, 54px);

  ${mediaBreakpointDown('tablet', true)} {
    display: grid;
    height: auto;
    min-height: calc(100dvh - 44px);
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto 1fr auto;
    grid-template-areas:
      'section'
      'visual'
      'body'
      '. '
      'footer';
    column-gap: 0;
    align-content: start;
  }
`;

const ArtworkTitle = styled.h3`
  margin: 0 0 26px;
  font-size: 36px;
  font-weight: 400;
  line-height: 40px;

  ${mediaBreakpointDown('tablet', true)} {
    margin-bottom: 20px;
    font-size: 24px;
    line-height: 1.12;
  }
`;

const StoryTitle = styled.h3`
  margin: 0 0 20px;
  font-size: clamp(20px, 2vw, 30px);
  font-weight: 400;
  line-height: 1.15;

  ${mediaBreakpointDown('tablet', true)} {
    margin-bottom: 16px;
    font-size: 18px;
  }
`;

const PersonalLayout = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    'section section'
    'quote body'
    'footer body';
  column-gap: clamp(42px, 4vw, 72px);

  ${mediaBreakpointDown('tablet', true)} {
    display: grid;
    height: auto;
    min-height: calc(100dvh - 44px);
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto auto 1fr auto;
    grid-template-areas:
      'section'
      'quote'
      'body'
      '. '
      'footer';
    column-gap: 0;
    align-content: start;
  }
`;

const Quote = styled.blockquote`
  grid-area: quote;
  align-self: center;
  margin: 0;
  padding: 0 8px;
  font-size: clamp(34px, 3.4vw, 56px);
  font-weight: 400;
  line-height: 1.16;
  text-align: center;
  white-space: pre-wrap;

  ${mediaBreakpointDown('tablet', true)} {
    margin: 58px 0 52px;
    padding: 0 8px;
    font-size: clamp(30px, 9vw, 42px);
    line-height: 1.16;
  }
`;

const ParticipationLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 10px 40px 6px;

  ${SectionTitle} {
    padding: 0;
    font-size: clamp(34px, 3.6vw, 56px);
    line-height: 1.1;
  }

  ${mediaBreakpointDown('tablet', true)} {
    height: auto;
    min-height: calc(100dvh - 44px);
    padding: 34px 0 12px;

    ${SectionTitle} {
      padding-right: 32px;
      font-size: 30px;
      text-align: center;
    }
  }
`;

const Intro = styled.p`
  margin: 34px 0 42px;
  font-size: clamp(16px, 1.45vw, 24px);
  line-height: 1.3;

  ${mediaBreakpointDown('tablet', true)} {
    margin: 28px 0 30px;
    font-size: 15px;
  }
`;

const ActionList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(24px, 5vw, 90px);
  margin-bottom: 36px;

  ${mediaBreakpointDown('tablet', true)} {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    margin-bottom: 26px;
  }
`;

const ActionCard = styled.article<{ $red: boolean }>`
  display: flex;
  min-height: 250px;
  flex-direction: column;
  padding: 28px 30px 24px;
  border-radius: 40px;
  background: ${({ $red }) => ($red ? '#812926' : '#607984')};
  color: #fff;

  ${mediaBreakpointDown('tablet', true)} {
    min-height: 0;
    padding: 22px;
    border-radius: 28px;
  }
`;

const Audience = styled.span`
  margin-bottom: 28px;
  font-size: 16px;
  line-height: 1.2;

  ${mediaBreakpointDown('tablet', true)} {
    margin-bottom: 18px;
    font-size: 14px;
  }
`;

const ActionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: clamp(24px, 2.3vw, 38px);
  font-weight: 400;
  line-height: 1.12;

  ${mediaBreakpointDown('tablet', true)} {
    font-size: 24px;
  }
`;

const ActionDescription = styled.p`
  margin: 0 0 22px;
  font-size: clamp(14px, 1.2vw, 20px);
  line-height: 1.25;

  ${mediaBreakpointDown('tablet', true)} {
    font-size: 14px;
  }
`;

const ActionLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 12px;
  border-bottom: 1px solid currentColor;
  color: inherit;
  font-size: 16px;
  line-height: 1.4;
  text-decoration: none;

  span:last-child {
    font-size: 24px;
    line-height: 1;
  }
`;

const ActionLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 12px;
  border-bottom: 1px solid currentColor;
  font-size: 16px;
  line-height: 1.4;

  span:last-child {
    font-size: 24px;
    line-height: 1;
  }
`;

const ParticipationFooter = styled.p`
  margin: auto 0 0;
  font-size: clamp(16px, 1.45vw, 24px);
  line-height: 1.3;

  ${mediaBreakpointDown('tablet', true)} {
    margin-top: 6px;
    font-size: 14px;
  }
`;

const modalEase = [0.16, 1, 0.3, 1] as const;

function ImageContent({ image, imageAlt, portrait }: {
  image?: string;
  imageAlt?: string;
  portrait?: boolean;
}) {
  return (
    <ImageFrame $portrait={portrait}>
      {image ? (
        <picture>
          <source media="(max-width: 768px)" srcSet={getResponsiveImageSources(image).mobile} type="image/webp" />
          <source srcSet={getResponsiveImageSources(image).desktop} type="image/webp" />
          <img src={getResponsiveImageSources(image).fallback} alt={imageAlt ?? ''} loading="lazy" decoding="async" draggable={false} />
        </picture>
      ) : (
        <span className="image-placeholder" aria-hidden="true" />
      )}
    </ImageFrame>
  );
}

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Copy>
      {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`} dangerouslySetInnerHTML={{__html: paragraph}}/>)}
    </Copy>
  );
}

function PhotoStory({ content }: { content: Extract<CardModalContent, { type: 'photo-story' | 'portrait-photo-story' }> }) {
  const portrait = content.type === 'portrait-photo-story';

  return (
    <StoryLayout $portrait={portrait}>
      <ImageContent image={content.image} imageAlt={content.imageAlt} portrait={portrait} />
      <SectionTitle id="card-modal-title">{content.sectionTitle}</SectionTitle>
      <Copy>
        {content.title && <StoryTitle>{content.title}</StoryTitle>}
        {content.paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`} dangerouslySetInnerHTML={{__html: paragraph}}/>
        ))}
      </Copy>
      <Footer>{content.author}</Footer>
    </StoryLayout>
  );
}

function ArtistWork({ content }: { content: Extract<CardModalContent, { type: 'artist-work' }> }) {
  const sectionLabel = content.year
    ? `${content.sectionTitle}\n${content.year}`
    : content.sectionTitle;

  return (
    <ArtworkLayout>
      <ImageContent image={content.image} imageAlt={content.imageAlt} />
      <SectionTitle id="card-modal-title">{sectionLabel}</SectionTitle>
      <Copy>
        {content.title && <ArtworkTitle>{content.title}</ArtworkTitle>}
        {content.paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`} dangerouslySetInnerHTML={{ __html: paragraph }}/>
        ))}
      </Copy>
      <Footer>
        {content.source?.href
          ? <a href={content.source.href} target="_blank" rel="noreferrer">{content.source.label}</a>
          : content.source?.label}
      </Footer>
    </ArtworkLayout>
  );
}

function PersonalStory({ content }: { content: Extract<CardModalContent, { type: 'personal-story' }> }) {
  return (
    <PersonalLayout>
      <SectionTitle id="card-modal-title">{content.sectionTitle}</SectionTitle>
      <Quote dangerouslySetInnerHTML={{__html: content.quote}}/>
      <Paragraphs paragraphs={content.paragraphs} />
      <Footer>{content.author}</Footer>
    </PersonalLayout>
  );
}

function Participation({ content }: { content: Extract<CardModalContent, { type: 'participation' }> }) {
  return (
    <ParticipationLayout>
      <SectionTitle id="card-modal-title" $center>{content.sectionTitle}</SectionTitle>
      <Intro>{content.intro}</Intro>
      <ActionList>
        {content.actions.map((action, index) => {
          const children = (
            <>
              <Audience>{action.audience}</Audience>
              <ActionTitle>{action.title}</ActionTitle>
              <ActionDescription>{action.description}</ActionDescription>
              {action.href ? (
                <ActionLink href={action.href} target="_blank" rel="noreferrer">
                  <span>{action.linkLabel}</span><span aria-hidden="true">↗</span>
                </ActionLink>
              ) : (
                <ActionLabel><span>{action.linkLabel}</span><span aria-hidden="true">↗</span></ActionLabel>
              )}
            </>
          );

          return <ActionCard key={`${action.title}-${index}`} $red={index % 2 === 1}>{children}</ActionCard>;
        })}
      </ActionList>
      <ParticipationFooter>{content.footer}</ParticipationFooter>
    </ParticipationLayout>
  );
}

function ModalContent({ content }: { content: CardModalContent }) {
  switch (content.type) {
    case 'photo-story':
    case 'portrait-photo-story':
      return <PhotoStory content={content} />;
    case 'artist-work':
      return <ArtistWork content={content} />;
    case 'personal-story':
      return <PersonalStory content={content} />;
    case 'participation':
      return <Participation content={content} />;
  }
}

export function CardModal({ content, onClose }: CardModalProps) {
  useEffect(() => {
    if (!content) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [content, onClose]);

  return createPortal(
    <AnimatePresence>
      {content && (
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
            $type={content.type}
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-modal-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: modalEase } }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4, ease: modalEase } }}
          >
            <CloseButton
              $light={content.type === 'participation'}
              type="button"
              aria-label="Закрыть"
              onClick={onClose}
            >
              ×
            </CloseButton>
            <ModalContent content={content} />
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body,
  );
}
