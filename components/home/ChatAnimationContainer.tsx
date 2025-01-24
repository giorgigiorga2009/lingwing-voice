import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatAnimationContainer.module.scss';
import { useTranslation } from '@utils/useTranslation';

interface Message {
  id: number;
  text: string;
  isLeft: boolean;
}

interface ChatAnimationContainerProps {
  onAnimationEnd: () => void;
}

const messages = [
  { text: 'ლინგვინგი თუ...?', isLeft: true },
  { text: 'რა თუ, რის თუ, რა თქმა უნდა ლინგვინგი!', isLeft: false },
  { text: 'ძალიან რთულია სწავლა?', isLeft: true },
  { text: 'რა სწავლა, რის სწავლა, თავისით შემოგესწავლება!', isLeft: false },
  { text: 'არცერთი სიტყვა არ ვიცი', isLeft: true },
  { text: 'ლათინური ასოები ხო იცი? საკმარისია!', isLeft: false },
  { text: 'გრამატიკას ვერ ვიტან!', isLeft: true },
  { text: 'რა გრამატიკა?პრაქტიკით ისწავლი!', isLeft: false },
  { text: 'იცი რამდენი წლის ვარ?!', isLeft: true },
  { text: 'გინდა 9 წლის იყავი, გინდა69-ის მაინც ისწავლი', isLeft: false },
  { text: 'ენების სწავლის ნიჭი რომ არ მაქვს?', isLeft: true },
  { text: 'გაქვს! დაიწყე და 10 წუთში დარწმუნდები!', isLeft: false },
  { text: 'საზეპიროები რომ მიჭირს?', isLeft: true },
  { text: 'მხოლოდ უნდა გადაწერო. გადაწერა მოსულა!', isLeft: false },
  { text: 'სასაუბრო დონეზე ვისწავლი?', isLeft: true },
  { text: 'გამოცდებსაც ჩააბარებ! დაიწყე, ნუ მევაჭრები!', isLeft: false },
  { text: 'ორშაბათიდან დავიწყებ!', isLeft: true },
  {
    text: 'ჩვენთან ორშაბათიც შაბათია! დააჭირე სწავლის დაწყებას',
    isLeft: false,
  },
];


// const messages = [
//   { text: 'ლინგვინგი თუ...?', isLeft: true },
//   { text: 'რა თუ, რის თუ, რა თქმა უნდა ლინგვინგი!', isLeft: false },
//   { text: 'ძალიან რთულია სწავლა?', isLeft: true },
//   { text: 'რა სწავლა, რის სწავლა, თავისით შემოგესწავლება!', isLeft: false },
//   { text: 'არცერთი სიტყვა არ ვიცი', isLeft: true },
//   { text: 'ლათინური ასოები ხო იცი? საკმარისია!', isLeft: false },
//   { text: 'გრამატიკას ვერ ვიტან!', isLeft: true },
//   { text: 'რა გრამატიკა?პრაქტიკით ისწავლი!', isLeft: false },
//   { text: 'იცი რამდენი წლის ვარ?!', isLeft: true },
//   { text: 'გინდა 9 წლის იყავი, გინდა69-ის მაინც ისწავლი', isLeft: false },
//   { text: 'ენების სწავლის ნიჭი რომ არ მაქვს?', isLeft: true },
//   { text: 'გაქვს! დაიწყე და 10 წუთში დარწმუნდები!', isLeft: false },
//   { text: 'საზეპიროები რომ მიჭირს?', isLeft: true },
//   { text: 'მხოლოდ უნდა გადაწერო. გადაწერა მოსულა!', isLeft: false },
//   { text: 'სასაუბრო დონეზე ვისწავლი?', isLeft: true },
//   { text: 'გამოცდებსაც ჩააბარებ! დაიწყე, ნუ მევაჭრები!', isLeft: false },
//   { text: 'ორშაბათიდან დავიწყებ!', isLeft: true },
//   {
//     text: 'ჩვენთან ორშაბათიც შაბათია! დააჭირე სწავლის დაწყებას',
//     isLeft: false,
//   },
// ];


const interval = 2050;
const MOBILE_MESSAGE_GAP = 19; // Gap between messages on mobile
const DESKTOP_MESSAGE_GAP = 40; // Gap between messages on larger screens
export const MOBILE_BREAKPOINT = 768; // Define the breakpoint for mobile devices

export const ChatAnimationContainer: React.FC<ChatAnimationContainerProps> = ({
  onAnimationEnd,
}) => {
  const { t  } = useTranslation();
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([{
    id:0,
    ...messages[0]
  }]);
  const [messageId, setMessageId] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMessageHeight, setCurrentMessageHeight] = useState(0);
  const messageHeightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);

    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {

      if (messageId < messages.length) {
        setCurrentMessageHeight(0); // Reset height for new message
        setVisibleMessages((prevMessages) => {
          const newMessage = { ...messages[messageId], id: messageId };
          return [...prevMessages, newMessage];
        });
        setMessageId((prev) => prev + 1);

        // Animate the height of the new message
        setTimeout(() => {
          const newMessageEl = messageRefs.current[messageId];
          if (newMessageEl) {
            setCurrentMessageHeight(newMessageEl.offsetHeight);
          }
        }, 10); // Small delay to ensure the new message is rendered
      } else {
        onAnimationEnd();
        clearInterval(timer);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [interval, messageId]);

  const getMessageBottomPosition = (index: number) => {
    let totalHeight = 0;
    for (let i = index + 1; i < visibleMessages.length; i++) {
      const messageHeight = messageRefs.current[i]?.offsetHeight || 0;
      totalHeight += messageHeight;
      totalHeight += isMobile ? MOBILE_MESSAGE_GAP : DESKTOP_MESSAGE_GAP;
    }
    // Add current message height for immediate upward movement
    if (index < visibleMessages.length - 1) {
      // totalHeight += currentMessageHeight;
      // We no longer add an extra gap here
    }
    return totalHeight;
  };

  return (
    <div className={styles.chatContainer} ref={containerRef}>
      {visibleMessages.map((message, index) => {

        const bottomPosition = getMessageBottomPosition(index);
        const isVisible = bottomPosition < containerHeight;
        const opacity = isVisible ? 1 : 0;
 
        return (
          <div
            key={message.id}
            ref={(el: HTMLDivElement | null) => { messageRefs.current[index] = el; }}
            className={`${styles.message} ${
              message.isLeft ? styles.left : styles.right
            } ${styles.animate}`}
            style={{
              bottom: `${bottomPosition}px`,
              opacity,
              transition: `bottom 500ms ease-out, opacity 2000ms ease-out`,
              marginBottom: isMobile ? `${MOBILE_MESSAGE_GAP}px` : `${DESKTOP_MESSAGE_GAP}px`,
            }}
          >
            {t('CHAT_ANIMATION_MESSAGE_' + ( index + 1))}
          </div>
        );
      })}
    </div>
  );
};