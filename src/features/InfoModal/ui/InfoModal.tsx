import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { ThemeGuideBadge } from '../../../shared/styles/types';
import { mediaBreakpointBetween, mediaBreakpointDown } from '../../../shared/styles/mixins';

export type InfoModalSection = 'guide' | 'contacts';

interface InfoModalProps {
  section: InfoModalSection | null;
  onClose: () => void;
}

const modalEase = [0.16, 1, 0.3, 1] as const;

const guideContent = {
  title: '[руководство]',
  intro: [
    'Перед вами коллекция разных представлений о&nbsp;доме.',
    'Исследуйте художественные проекты, читайте личные истории и&nbsp;перемещайтесь между карточками.',
  ],
  exploreHeading: 'Как исследовать карту',
  exploreSteps: [
    { icon: 'cursor' as const, text: 'Нажмите на&nbsp;карточку, чтобы прочитать историю или узнать больше о&nbsp;проекте.' },
    { icon: 'move' as const, text: 'Перемещайтесь по&nbsp;карте и&nbsp;исследуйте материалы в&nbsp;любом порядке.' },
  ],
  typesHeading: 'Типы материалов',
  types: [
    { id: 'projects' as ThemeGuideBadge, label: 'Авторские проекты', description: 'Фотографические и&nbsp;художественные проекты, исследующие понятие дома.' },
    { id: 'stories' as ThemeGuideBadge, label: 'Личные истории', description: 'Ответы участников на&nbsp;вопрос &laquo;Что для тебя дом?&raquo;, выраженные словами.' },
    { id: 'photos' as ThemeGuideBadge, label: 'Фотоистории', description: 'Личные фотографии и&nbsp;связанные с&nbsp;ними воспоминания, ощущения и&nbsp;истории.' },
  ],
};

const contactsContent = {
  title: '[контакты]',
  lead: 'Есть вопросы о&nbsp;проекте, идеи для сотрудничества или предложения?',
  note: 'Напишите нам&nbsp;&mdash; мы&nbsp;будем рады обратной связи.',
  contactHeading: 'Связаться',
  email: 'melnichnikova.project@gmail.com',
  telegramLabel: '[Telegram-канал]',
  telegramUrl: 'https://t.me/whatishomeproject',
  authorHeading: 'Автор проекта',
  authorName: 'Анна Мельничникова',
  authorNote: '&laquo;Что такое дом?&raquo;<br> &mdash;&nbsp;дипломный проект магистратуры НИУ ВШЭ&nbsp;&mdash; Санкт-Петербург',
};

function CursorIcon() {
  return (
    <svg className="guide-cursor-icon" width="23" height="22" viewBox="0 0 23 22" fill="none" aria-hidden="true">
      <path d="M2.30405 2.20468L9.8626 19.1123L12.5449 11.6996L20.2819 9.46113L2.30405 2.20468ZM0.430236 0C0.567625 0 0.733786 0.0371808 0.927282 0.114985L22.3866 8.83112C23.1598 9.14509 23.2087 9.75031 22.4952 10.1751L13.6095 12.8343L10.7013 21.5111C10.4927 21.8375 10.241 22 9.99855 22C9.73024 22 9.47489 21.8031 9.30081 21.4134L0.123089 0.892339C-0.125794 0.335315 0.0166303 0 0.430236 0Z" fill="currentColor" />
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg className="guide-move-icon" width="28.17" height="28.17" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M15.3524 0.217947C15.0628 -0.071583 14.5934 -0.071583 14.3039 0.217947L9.58572 4.93611C9.29619 5.22564 9.29619 5.69506 9.58572 5.98459C9.87525 6.27412 10.3447 6.27412 10.6342 5.98459L14.8281 1.79067L19.022 5.98459C19.3116 6.27412 19.781 6.27412 20.0705 5.98459C20.3601 5.69506 20.3601 5.22564 20.0705 4.93611L15.3524 0.217947ZM14.3039 29.4392C14.5934 29.7287 15.0628 29.7287 15.3524 29.4392L20.0705 24.721C20.3601 24.4315 20.3601 23.9621 20.0705 23.6725C19.781 23.383 19.3116 23.383 19.022 23.6725L14.8281 27.8665L10.6342 23.6725C10.3447 23.383 9.87525 23.383 9.58572 23.6725C9.29619 23.9621 9.29619 24.4315 9.58572 24.721L14.3039 29.4392ZM14.8281 0.742188H14.0867V28.9149H14.8281H15.5695V0.742188H14.8281Z" fill="currentColor" />
      <path d="M0.217947 14.3039C-0.071583 14.5934 -0.071583 15.0628 0.217947 15.3524L4.93611 20.0705C5.22564 20.3601 5.69506 20.3601 5.98459 20.0705C6.27412 19.781 6.27412 19.3116 5.98459 19.022L1.79067 14.8281L5.98459 10.6342C6.27412 10.3447 6.27412 9.87525 5.98459 9.58572C5.69506 9.29619 5.22564 9.29619 4.93611 9.58572L0.217947 14.3039ZM29.4392 15.3524C29.7287 15.0628 29.7287 14.5934 29.4392 14.3039L24.721 9.58572C24.4315 9.29619 23.9621 9.29619 23.6725 9.58572C23.383 9.87525 23.383 10.3447 23.6725 10.6342L27.8665 14.8281L23.6725 19.022C23.383 19.3116 23.383 19.781 23.6725 20.0705C23.9621 20.3601 24.4315 20.3601 24.721 20.0705L29.4392 15.3524ZM0.742188 14.8281L0.742188 15.5695L28.9149 15.5695L28.9149 14.8281L28.9149 14.0867L0.742187 14.0867L0.742188 14.8281Z" fill="currentColor" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1.66219 11.4251C8.10019 8.65158 12.3932 6.82458 14.5412 5.94108C20.6732 3.41808 21.9482 2.98008 22.7792 2.96508C23.7992 2.94858 24.0692 3.79158 23.9852 4.67058C23.6537 8.12358 22.2152 16.5011 21.4832 20.3681C20.8382 23.7836 18.5462 22.3061 16.4762 20.9636C14.5322 19.7036 13.4342 18.9206 11.5472 17.6906C9.36769 16.2701 10.7807 15.4901 12.0227 14.2136C12.3482 13.8791 17.9987 8.79858 18.1082 8.33658C18.1982 7.95258 17.8577 7.83708 17.5487 7.90758C17.3537 7.95108 14.2487 9.98058 8.23369 13.9946C7.35169 14.5931 6.55369 14.8841 5.83819 14.8691C4.84819 14.8481 2.44819 13.9946 0.0181856 12.6311C-0.127314 12.2156 0.616686 11.8361 1.66219 11.4251Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 55 55" fill="none" aria-hidden="true" focusable="false">
      <path d="M22.5216 19.8413C21.7814 19.1011 20.5811 19.1011 19.8408 19.8413C19.1006 20.5816 19.1006 21.7819 19.8408 22.5221L24.8191 27.5005L19.8409 32.4788C19.1006 33.2189 19.1006 34.4192 19.8409 35.1595C20.5812 35.8998 21.7814 35.8998 22.5216 35.1595L27.5 30.1814L32.4781 35.1595C33.2184 35.8998 34.4187 35.8998 35.159 35.1595C35.8993 34.4192 35.8993 33.2189 35.159 32.4786L30.1806 27.5005L35.159 22.5221C35.8993 21.7819 35.8993 20.5817 35.159 19.8414C34.4187 19.1011 33.2184 19.1011 32.4781 19.8414L27.5 24.8196L22.5216 19.8413Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M27.5 0C12.3122 0 0 12.3122 0 27.5C0 42.6879 12.3122 55 27.5 55C42.6879 55 55 42.6879 55 27.5C55 12.3122 42.6879 0 27.5 0ZM3.83721 27.5C3.83721 14.4314 14.4314 3.83721 27.5 3.83721C40.5685 3.83721 51.1628 14.4314 51.1628 27.5C51.1628 40.5685 40.5685 51.1628 27.5 51.1628C14.4314 51.1628 3.83721 40.5685 3.83721 27.5Z" fill="currentColor" />
    </svg>
  );
}

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

const Dialog = styled(motion.section)`
  position: relative;
  width: min(960px, calc(100vw - 112px));
  height: min(682px, calc(100lvh - 96px));
  border-radius: 40px;
  background: #ffffff;
  color: #111111;
  box-shadow: 0 18px 80px rgba(25, 25, 25, 0.16);
  overflow: visible;

  ${mediaBreakpointBetween('compact', 'xxl')} {
    width: min(796px, calc(100vw - 112px));
    height: min(531px, calc(100lvh - 96px));
  }

  ${mediaBreakpointDown('compact')} {
    width: 100%;
    height: 100lvh;
    min-height: 100lvh;
    max-height: none;
    border-radius: 0;
  }
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 61px 70px 25px 70px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: inherit;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    padding: 35px 58px 45px 58px;
  }

  ${mediaBreakpointDown('compact')} {
    padding: 60px 22px 32px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  z-index: 10;
  top: 20px;
  right: 20px;
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
    top: 16px;
    right: 16px;
  }

  ${mediaBreakpointDown('compact')} {
    top: 22px;
    right: 22px;
    width: 28px;
    height: 28px;
  }
`;

const Title = styled.h2`
  margin: 0 0 30px;
  color: #111111;
  font-size: 48px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 49px;
  text-align: center;
  text-transform: uppercase;

  ${mediaBreakpointBetween('compact', 'xxl')} {
    margin: 0 0 32px;
    font-size: 38px;
    line-height: 41px;
    letter-spacing: 0.03em;
  }

  ${mediaBreakpointDown('compact')} {
    font-size: 32px;
    margin-bottom: 28px;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 26px;
    margin-bottom: 24px;
  }
`;

const Paragraph = styled.p`
  margin: 0 0 27px;
  color: #111111;
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  letter-spacing: 0;
  hyphens: auto;

  &:last-of-type {
    margin-bottom: 0;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    margin: 0 0 20px;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: 0.02em;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const Lead = styled.p`
  margin: 0px 0 21px;
  color: #111111;
  font-size: 32px;
  font-weight: 400;
  line-height: 36px;
  letter-spacing: 0;
  hyphens: auto;

  ${mediaBreakpointDown('compact')} {
    font-size: 20px;
    line-height: 1.25;
    margin: -2px 0 15px;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 17px;
  }
`;

const Note = styled.p`
  margin: 0 0 54px;
  color: #333333;
  font-size: 20px;
  line-height: 36px;
  letter-spacing: 0;

  ${mediaBreakpointDown('compact')} {
    margin-bottom: 32px;
    font-size: 14px;
    line-height: 1.5;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 13px;
  }
`;

const SectionTitle = styled.h3<{ $contacts?: boolean }>`
  margin: 47px 0 17px;
  color: #111111;
  font-size: ${({ $contacts }) => ($contacts ? '32px' : '36px')};
  font-weight: 400;
  letter-spacing: 0;
  line-height: ${({ $contacts }) => ($contacts ? '36px' : '37px')};

  ${mediaBreakpointBetween('compact', 'xxl')} {
    margin: 29px 0 11px;
    font-size: 28px;
    line-height: 23px;
    letter-spacing: 0.04em;
  }

  ${mediaBreakpointDown('compact')} {
    font-size: 22px;
    line-height: 1.15;
    margin: 32px 0 16px;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 18px;
    margin: 28px 0 14px;
  }
`;

const Steps = styled.div`
  display: grid;
  gap: 16px;
`;

const Step = styled.div`
  position: relative;
  display: flex;
  gap: 20px;
  align-items: center;

  &:nth-child(2) > span {
    top: -2.3px;
  }

  p {
    margin: 0;
    color: #111111;
    font-size: 20px;
    line-height: 23px;
    letter-spacing: 0;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    gap: 14px;

    p {
      font-size: 16px;
      line-height: 18px;
      letter-spacing: 0.02em;
    }
  }

  ${mediaBreakpointDown('compact')} {
    display: grid;
    grid-template-columns: 30px 1fr;
    gap: 14px;

    p {
      font-size: 16px;
      line-height: 1.5;
    }
  }

  ${mediaBreakpointDown('phone')} {
    grid-template-columns: 26px 1fr;
    gap: 10px;

    p {
      font-size: 14px;
    }
  }
`;

const StepIcon = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: -47px;
  width: 30px;
  height: 30px;
  color: #111111;

  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  ${mediaBreakpointBetween('compact', 'xxl')} {
    width: 24px;
    height: 22px;

    .guide-cursor-icon {
      width: 19px;
      height: 17px;
    }

    .guide-move-icon {
      width: 24px;
      height: 22px;
    }
  }

  ${mediaBreakpointDown('compact')} {
    position: relative;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
  }

  ${mediaBreakpointDown('phone')} {
    width: 26px;
    height: 26px;

    .guide-cursor-icon {
      width: 20px;
      height: 19px;
    }

    .guide-move-icon {
      width: 22px;
      height: 22px;
    }
  }
`;

const Types = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  margin-top: 4px;

  ${mediaBreakpointDown('compact')} {
    gap: 20px;
  }

  ${mediaBreakpointDown('smallTablet')} {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TypeItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const TypeBadge = styled.span<{ $badge: ThemeGuideBadge }>`
  width: 100%;
  align-self: flex-start;
  padding: 8px 9px;
  border-radius: 10px;
  background: ${({ theme, $badge }) => theme.colors.guide.badge[$badge]};
  color: #ffffff;
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  letter-spacing: 0;

  ${mediaBreakpointBetween('compact', 'xxl')} {
    padding: 6px 14px;
    font-size: 16px;
    line-height: 23px;
    letter-spacing: 0.02em;
  }

  ${mediaBreakpointDown('compact')} {
    padding: 6px 14px;
    font-size: 14px;
    line-height: 1.4;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 13px;
    padding: 5px 12px;
  }
`;

const TypeText = styled.p`
  margin: 14px 0 0;
  color: #333333;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: 0;
  hyphens: auto;

  ${mediaBreakpointBetween('compact', 'xxl')} {
    font-size: 13px;
    line-height: 14.5px;
    letter-spacing: 0.01em;
  }

  ${mediaBreakpointDown('compact')} {
    font-size: 13px;
    line-height: 1.5;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 12.5px;
  }
`;

const ContactsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  margin-top: 4px;

  ${mediaBreakpointDown('smallTablet')} {
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
  font-size: 32px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 36px;

  ${mediaBreakpointDown('compact')} {
    font-size: 22px;
    line-height: 1.2;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 18px;
  }
`;

const ContactLink = styled.a`
  color: #111111;
  font-size: 20px;
  line-height: 23px;
  letter-spacing: 0;
  text-decoration: none;
  word-break: break-word;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.6;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  ${mediaBreakpointDown('compact')} {
    font-size: 15px;
    line-height: 1.4;
  }

  ${mediaBreakpointDown('phone')} {
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
  font-size: 20px;
  line-height: 23px;
  letter-spacing: 0;

  ${mediaBreakpointDown('compact')} {
    font-size: 16px;
    line-height: 1.4;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 14px;
  }
`;

const AuthorNote = styled.p`
  margin: 18px 0 0;
  color: #333333;
  font-size: 20px;
  line-height: 23px;
  letter-spacing: 0;
  hyphens: auto;

  ${mediaBreakpointDown('compact')} {
    font-size: 14px;
    line-height: 1.5;
  }

  ${mediaBreakpointDown('phone')} {
    font-size: 13px;
    margin-top: 14px;
  }
`;

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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: modalEase } }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4, ease: modalEase } }}
          >
            <CloseButton type="button" aria-label="Закрыть окно" onClick={onClose}>
              <CloseIcon />
            </CloseButton>

            <Content>
              {section === 'guide' ? (
                <>
                  <Title id="info-modal-title">{guideContent.title}</Title>
                  {guideContent.intro.map((paragraph, index) => (
                    <Paragraph key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                  ))}

                  <SectionTitle>{guideContent.exploreHeading}</SectionTitle>
                  <Steps>
                    {guideContent.exploreSteps.map((step, index) => (
                      <Step key={index}>
                        <StepIcon>
                          {step.icon === 'cursor' ? <CursorIcon /> : <MoveIcon />}
                        </StepIcon>
                        <p dangerouslySetInnerHTML={{ __html: step.text }} />
                      </Step>
                    ))}
                  </Steps>

                  <SectionTitle>{guideContent.typesHeading}</SectionTitle>
                  <Types>
                    {guideContent.types.map((item) => (
                      <TypeItem key={item.id}>
                        <TypeBadge $badge={item.id}>{item.label}</TypeBadge>
                        <TypeText dangerouslySetInnerHTML={{ __html: item.description }} />
                      </TypeItem>
                    ))}
                  </Types>
                </>
              ) : (
                <>
                  <Title id="info-modal-title">{contactsContent.title}</Title>
                  <Lead dangerouslySetInnerHTML={{ __html: contactsContent.lead }} />
                  <Note dangerouslySetInnerHTML={{ __html: contactsContent.note }} />

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

                  <SectionTitle $contacts>{contactsContent.authorHeading}</SectionTitle>
                  <AuthorName>{contactsContent.authorName}</AuthorName>
                  <AuthorNote dangerouslySetInnerHTML={{ __html: contactsContent.authorNote }} />
                </>
              )}
            </Content>
          </Dialog>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body,
  );
}