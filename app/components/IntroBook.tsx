'use client';

import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useRouter } from 'next/navigation';
import styles from './IntroBook.module.css';

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div className={`${styles.page} ${className}`} ref={ref}>
        {children}
      </div>
    );
  }
);

Page.displayName = 'Page';

export default function IntroBook({ onToggleMode }: { onToggleMode?: () => void }) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isBookFinished, setIsBookFinished] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect for text
  const typeWriter = async (text: string) => {
    setIsTyping(true);
    setDisplayText('');
    for (let i = 0; i <= text.length; i++) {
      setDisplayText(text.slice(0, i));
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    setIsTyping(false);  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageFlip = (e: any) => {
    setCurrentPage(e.data);
    if (e.data >= 6) { // Last page index
      setIsBookFinished(true);
    }
  };

  const handleContinue = () => {
    router.push('/guess');
  };

  // Start typing animation when reaching certain pages
  useEffect(() => {
    if (currentPage === 1) {
      typeWriter("🌟 Dear Heli... 🌟");
    } else if (currentPage === 2) {
      typeWriter("On this special day... ✨");
    } else if (currentPage === 3) {
      typeWriter("We wanted to wish you in a very unique way... 🎉");
    } else if (currentPage === 4) {
      typeWriter("Let's take you on a little journey!... 🚀");
    }
  }, [currentPage]);

  return (
    <div className={styles.bookContainer}>
      <div className={styles.starField}>
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i} 
            className={styles.star}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className={styles.bookWrapper}>
        {onToggleMode && (
          <button 
            className={styles.modeToggle} 
            onClick={onToggleMode}
            title="Switch to Original Mode"
          >
            ⭐
          </button>
        )}
        <HTMLFlipBook
          ref={bookRef}
          width={350}
          height={500}
          size="stretch"
          minWidth={280}
          maxWidth={800}
          minHeight={400}
          maxHeight={1200}
          maxShadowOpacity={0.8}
          showCover={true}
          mobileScrollSupport={false}
          className={styles.flipBook}
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={50}
          showPageCorners={true}
          disableFlipByClick={false}
          onFlip={handlePageFlip}
        >
          {/* Cover Page */}
          <Page className={styles.coverPage}>
            <div className={styles.coverContent}>
              <h1 className={styles.coverTitle}>A Special Story</h1>
              <div className={styles.coverEmoji}>📖</div>
              <p className={styles.coverSubtitle}>For Someone Very Special</p>
              <div className={styles.tapHint}>Click to begin the story →</div>
            </div>
          </Page>

          {/* Story Pages */}
          <Page className={styles.storyPage}>
            <div className={styles.pageContent}>
              <div className={styles.storyText}>
                {currentPage >= 1 && (
                  <div className={styles.typingContainer}>
                    <span className={styles.typedText}>{displayText}</span>
                    {isTyping && <span className={styles.cursor}>|</span>}
                  </div>
                )}
              </div>
              <div className={styles.pageDecoration}>
                <div className={styles.decorativeEmojis}>
                  ⭐ ✨ 🌟
                </div>
              </div>
            </div>
          </Page>

          <Page className={styles.storyPage}>
            <div className={styles.pageContent}>
              <div className={styles.storyText}>
                {currentPage >= 2 && (
                  <div className={styles.typingContainer}>
                    <span className={styles.typedText}>{displayText}</span>
                    {isTyping && <span className={styles.cursor}>|</span>}
                  </div>
                )}
              </div>
              <div className={styles.pageDecoration}>
                <div className={styles.magicalElements}>
                  <span className={styles.floatingEmoji} style={{animationDelay: '0s'}}>🎂</span>
                  <span className={styles.floatingEmoji} style={{animationDelay: '1s'}}>🎈</span>
                  <span className={styles.floatingEmoji} style={{animationDelay: '2s'}}>🎁</span>
                </div>
              </div>
            </div>
          </Page>

          <Page className={styles.storyPage}>
            <div className={styles.pageContent}>
              <div className={styles.storyText}>
                {currentPage >= 3 && (
                  <div className={styles.typingContainer}>
                    <span className={styles.typedText}>{displayText}</span>
                    {isTyping && <span className={styles.cursor}>|</span>}
                  </div>
                )}
              </div>
              <div className={styles.pageDecoration}>
                <div className={styles.celebrationEmojis}>
                  🎉 🎊 🥳 🎭 🎪
                </div>
              </div>
            </div>
          </Page>

          <Page className={styles.storyPage}>
            <div className={styles.pageContent}>
              <div className={styles.storyText}>
                {currentPage >= 4 && (
                  <div className={styles.typingContainer}>
                    <span className={styles.typedText}>{displayText}</span>
                    {isTyping && <span className={styles.cursor}>|</span>}
                  </div>
                )}
              </div>
              <div className={styles.pageDecoration}>
                <div className={styles.journeyEmojis}>
                  🚀 🌙 ⭐ 🌠 ✨
                </div>
              </div>
            </div>
          </Page>

          {/* Adventure Begins Page */}
          <Page className={styles.adventurePage}>
            <div className={styles.pageContent}>
              <h2 className={styles.adventureTitle}>Your Adventure Begins!</h2>
              <p className={styles.adventureText}>
                Are you ready to solve a special riddle and unlock your birthday surprise?
              </p>
              <div className={styles.adventureEmojis}>
                🗝️ 🏰 🎯 🎪 🎊
              </div>
              {isBookFinished && (
                <button 
                  className={styles.continueButton}
                  onClick={handleContinue}
                >
                  Start the Adventure! →
                </button>
              )}
            </div>
          </Page>

          {/* Back Cover */}
          <Page className={styles.backCover}>
            <div className={styles.backContent}>
              <p className={styles.backText}>Every story needs a beginning...</p>
              <div className={styles.backEmojis}>📚 ✨ 💫</div>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>

      {!isBookFinished && (
        <div className={styles.hint}>
          <p>Click on the pages to turn them and continue the story</p>
        </div>
      )}
    </div>
  );
}
