'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

// Create spreads: each spread contains left and right page
const createSpreads = (images: string[], magazineId: string) => {
  const spreads = [];
  
  // First spread: cover (right side only, left side empty)
  spreads.push({
    left: null,
    right: {
      type: 'cover',
      title: `${magazineId.charAt(0).toUpperCase() + magazineId.slice(1)}'s Birthday Magazine`,
      subtitle: "A Special Photo Edition",
      image: null
    }
  });
  
  // Photo spreads: pair up remaining pages
  for (let i = 0; i < images.length; i += 2) {
    spreads.push({
      left: {
        type: 'photo',
        image: images[i]
      },
      right: i + 1 < images.length ? {
        type: 'photo', 
        image: images[i + 1]
      } : null
    });
  }
  
  return spreads;
};

export default function DynamicMagazinePage() {
  const router = useRouter();
  const params = useParams();
  const magazineId = params.id as string;
    const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [bookSpreads, setBookSpreads] = useState<Array<{
    left: { type: string; image?: string } | null;
    right: { type: string; title?: string; subtitle?: string; image?: string | null } | null;
  }>>([]);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  // Load images dynamically based on magazine ID
  useEffect(() => {
    const loadMagazineImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the list of images from the API
        const response = await fetch(`/api/magazine/${magazineId}/images`);
        
        if (!response.ok) {
          throw new Error(`Failed to load magazine: ${response.statusText}`);
        }
        
        const imageList: string[] = await response.json();
        console.log('Loaded images:', imageList); // Debug log
        
        if (imageList.length === 0) {
          throw new Error('No images found in this magazine folder');
        }
        
        // Sort images by numeric order (1.jpg, 2.jpg, etc.)
        const sortedImages = imageList.sort((a, b) => {
          const aNum = parseInt(a.split('.')[0]);
          const bNum = parseInt(b.split('.')[0]);
          return aNum - bNum;
        });
          // Create full image paths
        const fullImagePaths = sortedImages.map(imageName => `/magazines/${magazineId}/${imageName}`);
          console.log('Generated image paths:', fullImagePaths); // Debug log
        setBookSpreads(createSpreads(fullImagePaths, magazineId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load magazine');
        console.error('Failed to load magazine:', err);
      } finally {
        setLoading(false);
      }
    };

    if (magazineId) {
      loadMagazineImages();
    }
  }, [magazineId]);

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
      if (isFlipping || loading) return;
      
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
  }, [currentSpread, isFlipping, loading, bookSpreads.length]);

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
      );
    } else if (pageData.type === 'photo' && pageData.image) {      return (
        <div className={styles.photoContent}>
          <Image
            src={pageData.image}
            alt={`Photo`}
            fill
            className={styles.pageImage}
            style={{ objectFit: 'contain' }}
          />
        </div>
      );
    }
    
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.background}></div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>Loading Magazine...</h2>
          <p className={styles.loadingSubtext}>Preparing {magazineId}&apos;s special memories</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className={styles.container}>
        <div className={styles.background}></div>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className={styles.homeButton} onClick={goHome}>
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  const currentSpreadData = bookSpreads[currentSpread];
  const nextSpreadData = currentSpread < bookSpreads.length - 1 ? bookSpreads[currentSpread + 1] : null;
  const prevSpreadData = currentSpread > 0 ? bookSpreads[currentSpread - 1] : null;
  
  // Determine which spread to show in the flip based on direction
  const flipSpreadData = flipDirection === 'forward' ? nextSpreadData : prevSpreadData;

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
              {renderPageContent(currentSpreadData?.left)}
              {currentSpreadData?.left && (
                <div className={styles.pageNumber}>{currentSpread * 2}</div>
              )}
            </div>
          </div>

          {/* Right Page */}
          <div className={styles.rightPage}>
            <div className={styles.pageContent}>
              {renderPageContent(currentSpreadData?.right)}
              {currentSpreadData?.right && (
                <div className={styles.pageNumber}>{currentSpread * 2 + 1}</div>
              )}
            </div>
          </div>

          {/* Page Flip Effect - Forward */}
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
