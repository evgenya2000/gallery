import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { CardModalContent, CardModalType } from '../../../entities/Card';
import {
  hyphens,
  mediaBreakpointBetween,
  mediaBreakpointDown,
  mediaBreakpointUp,
} from '../../../shared/styles/mixins';
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
};

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 48px;
  background: rgba(250, 250, 250, 0.28);
  backdrop-filter: blur(5px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);

  ${mediaBreakpointDown('compact')} {
    padding: 0;
  }
`;

const Dialog = styled(motion.section) <{ $type: CardModalType }>`
  position: relative;
  width: min(960px, calc(100vw - 112px));
  height: min(682px, calc(100lvh - 96px));
  padding: 37px 40px 30px;
  overflow: visible;
  border-radius: 40px;
  background: ${({ $type }) => colors[$type]};
  color: #f7f7f7;
  box-shadow: 0 18px 80px rgba(25, 25, 25, 0.16);
  font-family: inherit;

  ${mediaBreakpointBetween('compact', 'xxl')} {
    width: min(796px, calc(100vw - 112px));
    height: min(531px, calc(100lvh - 96px));
  }

  ${mediaBreakpointDown('compact')} {
    width: 100%;
    height: 100dvh;
    min-height: 100dvh;
    max-height: none;
    padding: 22px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    touch-action: pan-y;
    border-radius: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  z-index: 10;
  top: calc(-1 * min(72px, max(0px, (100lvh - 682px) / 2 - 24px)));
  right: calc(-1 * min(72px, max(0px, (100vw - 960px) / 2 - 24px)));
  display: grid;
  width: 55px;
  height: 55px;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #2f2f2f;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 160ms ease, transform 160ms ease;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    width: 44px;
    height: 44px;
    top: calc(-1 * min(64px, max(0px, (100lvh - 531px) / 2 - 20px)));
    right: calc(-1 * min(64px, max(0px, (100vw - 796px) / 2 - 20px)));
  }

  ${mediaBreakpointDown('compact')} {
    top: 22px;
    right: 22px;
    width: 28px;
    height: 28px;
    color: #fff;
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
  margin-bottom: 10px;

  ${mediaBreakpointBetween('xxl', 'fhd')} {
    font-size: 16px;
    line-height: 1.3;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    padding-right: 44px;
    font-size: 18px;
    line-height: 21px;
  }

  ${mediaBreakpointDown('compact')} {
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

  ${mediaBreakpointDown('compact')} {
    min-height: 0;
    max-height: ${({ $portrait }) => ($portrait ? '47lvh' : '34lvh')};
    margin: 18px 0 25px;

    img {
      width: 100%;
      max-height: ${({ $portrait }) => ($portrait ? '47lvh' : '34lvh')};
    }

    .image-placeholder {
      width: ${({ $portrait }) => ($portrait ? '72%' : '100%')};
      height: ${({ $portrait }) => ($portrait ? '47lvh' : 'auto')};
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
  overscroll-behavior: contain;
  ${hyphens}

  &::-webkit-scrollbar {
    display: none;
  }

  ${mediaBreakpointUp('compact')} {
    max-height: 100%;
  }

  p {
    margin: 0 0 22px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ${mediaBreakpointBetween('xxl', 'fhd')} {
    font-size: 18px;
    line-height: 1.3;
    hyphens: none;
    -webkit-hyphens: none;
    overflow-wrap: normal;
    word-break: normal;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    font-size: 16px;
    line-height: 19px;

    p {
      margin-bottom: 14px;
    }
  }

  ${mediaBreakpointDown('compact')} {
    align-self: start;
    min-height: auto;
    max-height: none;
    overflow-y: visible;
    overscroll-behavior: auto;
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

  ${mediaBreakpointBetween('xxl', 'fhd')} {
    font-size: 16px;
    line-height: 1.3;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    padding-top: 18px;
    font-size: 16px;
    line-height: 19px;
  }

  ${mediaBreakpointDown('compact')} {
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

  ${mediaBreakpointDown('compact')} {
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

  ${mediaBreakpointDown('compact')} {
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


  ${mediaBreakpointBetween('xxl', 'fhd')} {
    font-size: 32px;
    line-height: 1.1;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    margin-bottom: 16px;
    font-size: 28px;
    line-height: 32px;
  }

  ${mediaBreakpointDown('compact')} {
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

  ${mediaBreakpointBetween('compact', 'xxl')} {
    margin-bottom: 16px;
    font-size: 24px;
  }

  ${mediaBreakpointDown('compact')} {
    margin-bottom: 16px;
    font-size: 18px;
  }
`;

const PersonalLayout = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    'section section'
    'quote body'
    'footer body';
  column-gap: clamp(42px, 4vw, 72px);

  ${mediaBreakpointDown('compact')} {
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
  font-size: 36px;
  font-weight: 400;
  line-height: 40px;
  text-align: center;
  white-space: pre-wrap;
  overflow-y: auto;
  scrollbar-width: none;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    display: none;
  }

  ${mediaBreakpointBetween('xxl', 'fhd')} {
    font-size: 32px;
    line-height: 1.3;
  }

  ${mediaBreakpointUp('compact')} {
    max-height: 100%;
  }

  ${mediaBreakpointDown('compact')} {
    margin: 58px 0 52px;
    padding: 0 8px;
    min-height: auto;
    max-height: none;
    overflow-y: visible;
    overscroll-behavior: auto;
    font-size: clamp(30px, 9vw, 42px);
    line-height: 1.16;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    font-size: 28px;
    line-height: 32px;
  }

  ${mediaBreakpointDown('compact')} {
    font-size: 24px;
    line-height: 25px;
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
          <source media="(max-width: 1199px)" srcSet={getResponsiveImageSources(image).mobile} type="image/webp" />
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
      {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`} dangerouslySetInnerHTML={{ __html: paragraph }} />)}
    </Copy>
  );
}

function PhotoStory({ content }: { content: Extract<CardModalContent, { type: 'photo-story' | 'portrait-photo-story' }> }) {
  const portrait = content.type === 'portrait-photo-story';

  return (
    <StoryLayout $portrait={portrait}>
      <ImageContent image={content.image} imageAlt={content.imageAlt} portrait={portrait} />
      <SectionTitle id="card-modal-title" dangerouslySetInnerHTML={{__html: content.sectionTitle}}/>
      <Copy>
        {content.title && <StoryTitle dangerouslySetInnerHTML={{__html: content.title}}/>}
        {content.paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`} dangerouslySetInnerHTML={{ __html: paragraph }} />
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
      <SectionTitle id="card-modal-title" dangerouslySetInnerHTML={{__html: sectionLabel}}/>
      <Copy>
        {content.title && <ArtworkTitle dangerouslySetInnerHTML={{__html: content.title}}/>}
        {content.paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`} dangerouslySetInnerHTML={{ __html: paragraph }} />
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
      <SectionTitle id="card-modal-title" dangerouslySetInnerHTML={{__html: content.sectionTitle}}/>
      <Quote dangerouslySetInnerHTML={{ __html: content.quote }} />
      <Paragraphs paragraphs={content.paragraphs} />
      <Footer>{content.author}</Footer>
    </PersonalLayout>
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
            lang="ru"
            $type={content.type}
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-modal-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: modalEase } }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4, ease: modalEase } }}
          >
            <CloseButton
              type="button"
              aria-label="Закрыть"
              onClick={onClose}
            >
              <svg
                viewBox="0 0 55 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M22.5216 19.8413C21.7814 19.1011 20.5811 19.1011 19.8408 19.8413C19.1006 20.5816 19.1006 21.7819 19.8408 22.5221L24.8191 27.5005L19.8409 32.4788C19.1006 33.2189 19.1006 34.4192 19.8409 35.1595C20.5812 35.8998 21.7814 35.8998 22.5216 35.1595L27.5 30.1814L32.4781 35.1595C33.2184 35.8998 34.4187 35.8998 35.159 35.1595C35.8993 34.4192 35.8993 33.2189 35.159 32.4786L30.1806 27.5005L35.159 22.5221C35.8993 21.7819 35.8993 20.5817 35.159 19.8414C34.4187 19.1011 33.2184 19.1011 32.4781 19.8414L27.5 24.8196L22.5216 19.8413Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M27.5 0C12.3122 0 0 12.3122 0 27.5C0 42.6879 12.3122 55 27.5 55C42.6879 55 55 42.6879 55 27.5C55 12.3122 42.6879 0 27.5 0ZM3.83721 27.5C3.83721 14.4314 14.4314 3.83721 27.5 3.83721C40.5685 3.83721 51.1628 14.4314 51.1628 27.5C51.1628 40.5685 40.5685 51.1628 27.5 51.1628C14.4314 51.1628 3.83721 40.5685 3.83721 27.5Z"
                  fill="currentColor"
                />
              </svg>
            </CloseButton>
            <ModalContent content={content} />
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body,
  );
}
