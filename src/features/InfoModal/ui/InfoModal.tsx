import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import type { ThemeGuideBadge } from '../../../shared/styles/types';

export type InfoModalSection = 'guide' | 'contacts';

interface InfoModalProps {
  section: InfoModalSection | null;
  onClose: () => void;
}

const modalEase = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────  Content  ──────────────────────────── */

const guideContent = {
  title: '[ руководство ]',
  intro: [
    'Перед вами коллекция разных представлений о доме.',
    'Исследуйте художественные проекты, читайте личные истории и перемещайтесь между карточками.',
  ],
  exploreHeading: 'Как исследовать карту',
  exploreSteps: [
    {
      icon: 'cursor' as const,
      text: 'Нажмите на карточку, чтобы прочитать историю или узнать больше о проекте.',
    },
    {
      icon: 'move' as const,
      text: 'Перемещайтесь по карте и исследуйте материалы в любом порядке.',
    },
  ],
  typesHeading: 'Типы материалов',
  types: [
    {
      id: 'projects' as ThemeGuideBadge,
      label: 'Авторские проекты',
      description: 'Фотографические и художественные проекты, исследующие понятие дома.',
    },
    {
      id: 'stories' as ThemeGuideBadge,
      label: 'Личные истории',
      description: 'Ответы участников на вопрос «Что для тебя дом?», выраженные словами.',
    },
    {
      id: 'photos' as ThemeGuideBadge,
      label: 'Фотоистории',
      description: 'Личные фотографии и связанные с ними воспоминания, ощущения и истории.',
    },
  ],
};

const contactsContent = {
  title: '[ контакты ]',
  lead: 'Есть вопросы о проекте, идеи для сотрудничества или предложения?',
  note: 'Напишите нам — мы будем рады обратной связи.',
  contactHeading: 'Связаться',
  email: 'melnichnikova.project@gmail.com',
  telegramLabel: '[Telegram-канал]',
  telegramUrl: 'https://t.me/',
  authorHeading: 'Автор проекта',
  authorName: 'Анна Мельничникова',
  authorNote:
    '«Что такое дом?» — дипломный проект магистратуры НИУ ВШЭ — Санкт-Петербург',
};

/* ─────────────────────────────  Icons  ───────────────────────────── */

function CursorIcon() {
  return (
    <svg width="20" height="19" viewBox="0 0 23 22" fill="none" aria-hidden="true">
      <path
        d="M2.30405 2.20468L9.8626 19.1123L12.5449 11.6996L20.2819 9.46113L2.30405 2.20468ZM0.430236 0C0.567625 0 0.733786 0.0371808 0.927282 0.114985L22.3866 8.83112C23.1598 9.14509 23.2087 9.75031 22.4952 10.1751L13.6095 12.8343L10.7013 21.5111C10.4927 21.8375 10.241 22 9.99855 22C9.73024 22 9.47489 21.8031 9.30081 21.4134L0.123089 0.892339C-0.125794 0.335315 0.0166303 0 0.430236 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path
        d="M15.3524 0.217947C15.0628 -0.071583 14.5934 -0.071583 14.3039 0.217947L9.58572 4.93611C9.29619 5.22564 9.29619 5.69506 9.58572 5.98459C9.87525 6.27412 10.3447 6.27412 10.6342 5.98459L14.8281 1.79067L19.022 5.98459C19.3116 6.27412 19.781 6.27412 20.0705 5.98459C20.3601 5.69506 20.3601 5.22564 20.0705 4.93611L15.3524 0.217947ZM14.3039 29.4392C14.5934 29.7287 15.0628 29.7287 15.3524 29.4392L20.0705 24.721C20.3601 24.4315 20.3601 23.9621 20.0705 23.6725C19.781 23.383 19.3116 23.383 19.022 23.6725L14.8281 27.8665L10.6342 23.6725C10.3447 23.383 9.87525 23.383 9.58572 23.6725C9.29619 23.9621 9.29619 24.4315 9.58572 24.721L14.3039 29.4392ZM14.8281 0.742188H14.0867V28.9149H14.8281H15.5695V0.742188H14.8281Z"
        fill="currentColor"
      />
      <path
        d="M0.217947 14.3039C-0.071583 14.5934 -0.071583 15.0628 0.217947 15.3524L4.93611 20.0705C5.22564 20.3601 5.69506 20.3601 5.98459 20.0705C6.27412 19.781 6.27412 19.3116 5.98459 19.022L1.79067 14.8281L5.98459 10.6342C6.27412 10.3447 6.27412 9.87525 5.98459 9.58572C5.69506 9.29619 5.22564 9.29619 4.93611 9.58572L0.217947 14.3039ZM29.4392 15.3524C29.7287 15.0628 29.7287 14.5934 29.4392 14.3039L24.721 9.58572C24.4315 9.29619 23.9621 9.29619 23.6725 9.58572C23.383 9.87525 23.383 10.3447 23.6725 10.6342L27.8665 14.8281L23.6725 19.022C23.383 19.3116 23.383 19.781 23.6725 20.0705C23.9621 20.3601 24.4315 20.3601 24.721 20.0705L29.4392 15.3524ZM0.742188 14.8281L0.742188 15.5695L28.9149 15.5695L28.9149 14.8281L28.9149 14.0867L0.742187 14.0867L0.742188 14.8281Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.66219 11.4251C8.10019 8.65158 12.3932 6.82458 14.5412 5.94108C20.6732 3.41808 21.9482 2.98008 22.7792 2.96508C23.7992 2.94858 24.0692 3.79158 23.9852 4.67058C23.6537 8.12358 22.2152 16.5011 21.4832 20.3681C20.8382 23.7836 18.5462 22.3061 16.4762 20.9636C14.5322 19.7036 13.4342 18.9206 11.5472 17.6906C9.36769 16.2701 10.7807 15.4901 12.0227 14.2136C12.3482 13.8791 17.9987 8.79858 18.1082 8.33658C18.1982 7.95258 17.8577 7.83708 17.5487 7.90758C17.3537 7.95108 14.2487 9.98058 8.23369 13.9946C7.35169 14.5931 6.55369 14.8841 5.83819 14.8691C4.84819 14.8481 2.44819 13.9946 0.0181856 12.6311C-0.127314 12.2156 0.616686 11.8361 1.66219 11.4251Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" aria-hidden="true">
      <path
        d="M2.5 2.5L17.5 17.5M17.5 2.5L2.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────────  Overlay  ─────────────────────────── */

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(247, 247, 247, 0.55);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);

  @media (max-width: 767px) {
    padding: 12px;
  }
`;

/* ─────────────────────────────  Dialog  ──────────────────────────── */

const Dialog = styled(motion.section)`
  position: relative;
  width: min(960px, 100%);
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  padding: 64px 64px 56px;
  border-radius: 32px;
  background: #ffffff;
  color: #111111;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.16);
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }

  @media (max-width: 900px) {
    padding: 48px 40px 40px;
    border-radius: 24px;
  }

  @media (max-width: 767px) {
    padding: 60px 22px 32px;
    border-radius: 20px;
    max-height: calc(100dvh - 24px);
  }
`;

/* ────────────────────────────  CloseButton  ──────────────────────── */

const closeButtonBase = css`
  display: grid;
  place-items: center;
  padding: 0;
  border: 1.5px solid #111111;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  color: #111111;
  cursor: pointer;
  transition: background 200ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
  }

  svg {
    display: block;
  }
`;

// Desktop: висит в правом верхнем углу вьюпорта, вне карточки
const DesktopCloseButton = styled(motion.button)`
  ${closeButtonBase};
  position: absolute;
  top: 72px;
  right: 32px;
  z-index: 1;
  width: 48px;
  height: 48px;
  display: none;

  @media (min-width: 768px) {
    display: grid;
  }
`;

// Mobile: прикреплён к верхнему правому углу самой карточки
const MobileCloseButton = styled(motion.button)`
  ${closeButtonBase};
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  display: grid;

  svg {
    width: 15px;
    height: 15px;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

/* ─────────────────────────────  Typo  ────────────────────────────── */

const Title = styled.h2`
  margin: 0 0 36px;
  color: #111111;
  font-size: 40px;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.1;
  text-align: center;
  text-transform: uppercase;

  @media (max-width: 900px) {
    font-size: 32px;
    margin-bottom: 28px;
  }

  @media (max-width: 560px) {
    font-size: 26px;
    margin-bottom: 24px;
  }
`;

const Paragraph = styled.p`
  margin: 0 0 6px;
  color: #111111;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.005em;
  hyphens: auto;

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 560px) {
    font-size: 14px;
  }
`;

const Lead = styled.p`
  margin: 0 0 14px;
  color: #111111;
  font-size: 26px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.015em;
  hyphens: auto;

  @media (max-width: 900px) {
    font-size: 20px;
    margin-bottom: 12px;
  }

  @media (max-width: 560px) {
    font-size: 17px;
  }
`;

const Note = styled.p`
  margin: 0;
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: -0.005em;

  @media (max-width: 560px) {
    font-size: 13px;
  }
`;

const SectionTitle = styled.h3`
  margin: 44px 0 20px;
  color: #111111;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.15;

  @media (max-width: 900px) {
    font-size: 22px;
    margin: 32px 0 16px;
  }

  @media (max-width: 560px) {
    font-size: 18px;
    margin: 28px 0 14px;
  }
`;

/* ─────────────────────────────  Guide  ───────────────────────────── */

const Steps = styled.div`
  display: grid;
  gap: 16px;
`;

const Step = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 14px;
  align-items: start;

  p {
    margin: 0;
    color: #111111;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: -0.005em;
  }

  @media (max-width: 560px) {
    grid-template-columns: 26px 1fr;
    gap: 10px;

    p {
      font-size: 14px;
    }
  }
`;

const StepIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 24px;
  color: #111111;

  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  @media (max-width: 560px) {
    width: 26px;
    height: 20px;
  }
`;

const Types = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  margin-top: 4px;

  @media (max-width: 900px) {
    gap: 20px;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TypeItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const TypeBadge = styled.span<{ $badge: ThemeGuideBadge }>`
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 6px;
  background: ${({ theme, $badge }) => theme.colors.guide.badge[$badge]};
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.005em;

  @media (max-width: 560px) {
    font-size: 13px;
    padding: 5px 12px;
  }
`;

const TypeText = styled.p`
  margin: 14px 0 0;
  color: #333333;
  font-size: 13px;
  line-height: 1.5;
  letter-spacing: -0.005em;

  @media (max-width: 560px) {
    font-size: 12.5px;
  }
`;

/* ────────────────────────────  Contacts  ─────────────────────────── */

const ContactsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  margin-top: 4px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ContactsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ContactsHeading = styled.h3`
  margin: 0;
  color: #111111;
  font-size: 26px;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.2;

  @media (max-width: 900px) {
    font-size: 22px;
  }

  @media (max-width: 560px) {
    font-size: 18px;
  }
`;

const ContactLink = styled.a`
  color: #111111;
  font-size: 15px;
  line-height: 1.4;
  letter-spacing: -0.005em;
  text-decoration: none;
  word-break: break-word;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.6;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 560px) {
    font-size: 13.5px;
  }
`;

const TelegramRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  color: #111111;

  svg {
    flex-shrink: 0;
    display: block;
  }
`;

const AuthorName = styled.p`
  margin: 0;
  color: #111111;
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: -0.005em;

  @media (max-width: 560px) {
    font-size: 14px;
  }
`;

const AuthorNote = styled.p`
  margin: 18px 0 0;
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: -0.005em;
  hyphens: auto;

  @media (max-width: 560px) {
    font-size: 13px;
    margin-top: 14px;
  }
`;

/* ─────────────────────────────  Component  ───────────────────────── */

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
          key={`info-modal-${section}`}
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
            lang="ru"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.75, ease: modalEase } }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.55, ease: modalEase } }}
          >
            {/* Мобильный крестик — прикреплён к верхнему правому углу карточки */}
            <MobileCloseButton
              type="button"
              aria-label="Закрыть окно"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.4, delay: 0.15, ease: modalEase },
              }}
              exit={{ opacity: 0, transition: { duration: 0.25, ease: modalEase } }}
            >
              <CloseIcon size={15} />
            </MobileCloseButton>

            {section === 'guide' ? (
              <>
                <Title id="info-modal-title">{guideContent.title}</Title>

                {guideContent.intro.map((paragraph) => (
                  <Paragraph key={paragraph}>{paragraph}</Paragraph>
                ))}

                <SectionTitle>{guideContent.exploreHeading}</SectionTitle>
                <Steps>
                  {guideContent.exploreSteps.map((step) => (
                    <Step key={step.text}>
                      <StepIcon>
                        {step.icon === 'cursor' ? <CursorIcon /> : <MoveIcon />}
                      </StepIcon>
                      <p>{step.text}</p>
                    </Step>
                  ))}
                </Steps>

                <SectionTitle>{guideContent.typesHeading}</SectionTitle>
                <Types>
                  {guideContent.types.map((item) => (
                    <TypeItem key={item.id}>
                      <TypeBadge $badge={item.id}>{item.label}</TypeBadge>
                      <TypeText>{item.description}</TypeText>
                    </TypeItem>
                  ))}
                </Types>
              </>
            ) : (
              <>
                <Title id="info-modal-title">{contactsContent.title}</Title>

                <Lead>{contactsContent.lead}</Lead>
                <Note>{contactsContent.note}</Note>

                <ContactsGrid>
                  <ContactsColumn>
                    <ContactsHeading>{contactsContent.contactHeading}</ContactsHeading>
                    <ContactLink href={`mailto:${contactsContent.email}`}>
                      {contactsContent.email}
                    </ContactLink>
                  </ContactsColumn>

                  <ContactsColumn>
                    <TelegramRow>
                      <TelegramIcon />
                    </TelegramRow>
                    <ContactLink
                      href={contactsContent.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contactsContent.telegramLabel}
                    </ContactLink>
                  </ContactsColumn>
                </ContactsGrid>

                <SectionTitle>{contactsContent.authorHeading}</SectionTitle>
                <AuthorName>{contactsContent.authorName}</AuthorName>
                <AuthorNote>{contactsContent.authorNote}</AuthorNote>
              </>
            )}
          </Dialog>

          {/* Десктопный крестик — снаружи карточки, в правом верхнем углу вьюпорта */}
          <DesktopCloseButton
            type="button"
            aria-label="Закрыть окно"
            onClick={onClose}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, delay: 0.1, ease: modalEase },
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: modalEase } }}
          >
            <CloseIcon size={18} />
          </DesktopCloseButton>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body,
  );
}