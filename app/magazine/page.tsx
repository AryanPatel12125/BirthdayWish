'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

// Magazine content with photos from the Heli folder - organized as book spreads
const magazinePages = [
  "/magazines/Heli/1.png",
  "/magazines/Heli/2.png",
  "/magazines/Heli/3.png",
  "/magazines/Heli/4.png",
  "/magazines/Heli/5.png",
  "/magazines/Heli/6.png",
  "/magazines/Heli/7.png",
  "/magazines/Heli/8.png",
  "/magazines/Heli/9.png",
  "/magazines/Heli/10.png",
  "/magazines/Heli/11.png",
  "/magazines/Heli/12.png",
];

// Create spreads: each spread contains left and right page
const createSpreads = () => {
  const spreads = [];
  
  // First spread: cover (right side only, left side empty)
  spreads.push({
    left: null,
    right: {
      type: 'cover',
      title: "Heli's Birthday Magazine",
      subtitle: "A Special Photo Edition",
      image: null
    }
  });
  
  // Photo spreads: pair up remaining pages
  for (let i = 0; i < magazinePages.length; i += 2) {
    spreads.push({
      left: {
        type: 'photo',
        image: magazinePages[i]
      },
      right: i + 1 < magazinePages.length ? {
        type: 'photo', 
        image: magazinePages[i + 1]
      } : null
    });
  }
  
  return spreads;
};

const bookSpreads = createSpreads();

export default function MagazinePage() {
  const router = useRouter();
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const bookRef = useRef<HTMLDivElement>(null);

  const nextSpread = () => {
    if (currentSpread < bookSpreads.length - 1 && !isFlipping) {
      setFlipDirection('forward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(currentSpread + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevSpread = () => {
    if (currentSpread > 0 && !isFlipping) {
      setFlipDirection('backward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(currentSpread - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const goToSpread = (spreadIndex: number) => {
    if (spreadIndex !== currentSpread && !isFlipping) {
      setFlipDirection(spreadIndex > currentSpread ? 'forward' : 'backward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(spreadIndex);
        setIsFlipping(false);
      }, 600);
    }
  };

  const goHome = () => {
    router.push('/');
  };
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isFlipping) return;
      
      switch (event.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
          event.preventDefault();
          playFlipSound();
          nextSpread();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          playFlipSound();
          prevSpread();
          break;
        case 'Home':
          event.preventDefault();
          goToSpread(0);
          break;
        case 'End':
          event.preventDefault();
          goToSpread(bookSpreads.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSpread, isFlipping]);

  // Add page flip sound effect (optional)
  const playFlipSound = () => {
    // You can add a page flip sound here if you have one
    // const audio = new Audio('/page-flip.mp3');
    // audio.volume = 0.3;
    // audio.play().catch(err => console.log('Audio play failed:', err));
  };

  // Enhanced spread navigation with sound
  const nextSpreadWithEffect = () => {
    playFlipSound();
    nextSpread();
  };

  const prevSpreadWithEffect = () => {
    playFlipSound();
    prevSpread();
  };

  const currentSpreadData = bookSpreads[currentSpread];
  const nextSpreadData = currentSpread < bookSpreads.length - 1 ? bookSpreads[currentSpread + 1] : null;
  const prevSpreadData = currentSpread > 0 ? bookSpreads[currentSpread - 1] : null;
  
  // Determine which spread to show in the flip based on direction
  const flipSpreadData = flipDirection === 'forward' ? nextSpreadData : prevSpreadData;
  // Helper function to render page content
  const renderPageContent = (pageData: { type: string; title?: string; subtitle?: string; image?: string | null } | null) => {
    if (!pageData) {
      return <div className={styles.emptyPage}></div>;
    }

    if (pageData.type === 'cover') {
      return (
        <div className={styles.coverContent}>
          <h1 className={styles.coverTitle}>{pageData.title}</h1>
          <h2 className={styles.coverSubtitle}>{pageData.subtitle}</h2>
          <div className={styles.coverDecoration}>🎉✨🎂✨🎉</div>
          <p className={styles.coverMessage}>Made with love for an amazing person</p>
        </div>
      );    } else if (pageData.type === 'photo' && pageData.image) {
      return (
        <div className={styles.photoContent}>
          <Image
            src={pageData.image}
            alt={`Photo`}
            fill
            className={styles.pageImage}
            style={{ objectFit: 'cover' }}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <main className={styles.container}>
      {/* Background */}
      <div className={styles.background}></div>
      
      {/* Navigation */}
      <button className={styles.homeButton} onClick={goHome}>
        ← Back to Journey
      </button>

      {/* Book Container */}
      <div className={styles.bookContainer}>
        <div 
          ref={bookRef}
          className={`${styles.book} ${isFlipping ? `${styles.flipping} ${styles[flipDirection]}` : ''}`}
        >
          {/* Left Page */}
          <div className={styles.leftPage}>
            <div className={styles.pageContent}>
              {renderPageContent(currentSpreadData.left)}
              {currentSpreadData.left && (
                <div className={styles.pageNumber}>{currentSpread * 2}</div>
              )}
            </div>
          </div>

          {/* Right Page */}
          <div className={styles.rightPage}>
            <div className={styles.pageContent}>
              {renderPageContent(currentSpreadData.right)}
              {currentSpreadData.right && (
                <div className={styles.pageNumber}>{currentSpread * 2 + 1}</div>
              )}
            </div>
          </div>          {/* Page Flip Effect - Forward */}
          <div className={styles.pageFlip}>
            {flipDirection === 'forward' && flipSpreadData && (
              <div className={styles.pageContent}>
                {renderPageContent(flipSpreadData.left)}
                {flipSpreadData.left && (
                  <div className={styles.pageNumber}>{(currentSpread + 1) * 2}</div>
                )}
              </div>
            )}
          </div>

          {/* Page Flip Effect - Backward */}
          <div className={styles.pageFlipBackward}>
            {flipDirection === 'backward' && flipSpreadData && (
              <div className={styles.pageContent}>
                {renderPageContent(flipSpreadData.right)}
                {flipSpreadData.right && (
                  <div className={styles.pageNumber}>{(currentSpread - 1) * 2 + 1}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button 
          className={styles.navButton} 
          onClick={prevSpreadWithEffect}
          disabled={currentSpread === 0 || isFlipping}
        >
          ← Previous
        </button>
        
        <div className={styles.pageIndicator}>
          {bookSpreads.map((_, index) => (
            <div
              key={index}
              className={`${styles.pageIndicatorDot} ${
                index === currentSpread ? styles.active : ''
              }`}
              onClick={() => goToSpread(index)}
            />
          ))}
        </div>
        
        <button 
          className={styles.navButton} 
          onClick={nextSpreadWithEffect}
          disabled={currentSpread === bookSpreads.length - 1 || isFlipping}
        >
          Next →
        </button>
      </div>

      {/* Spread Counter */}
      <div className={styles.pageCounter}>
        Spread {currentSpread + 1} of {bookSpreads.length}
      </div>

      {/* Help Text */}
      <div className={styles.helpText}>
        Use arrow keys, spacebar, or buttons to navigate
      </div>
    </main>
  );
}
