'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

interface MagazinePage {
  id: number;
  type: 'cover' | 'image';
  title?: string;
  subtitle?: string;
  imagePath?: string;
  content?: string;
}

export default function DynamicMagazinePage() {
  const router = useRouter();
  const params = useParams();
  const magazineId = params.id as string;
  
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [magazinePages, setMagazinePages] = useState<MagazinePage[]>([]);
  const [loading, setLoading] = useState(true);
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
        
        // Create magazine pages from images
        const pages: MagazinePage[] = [
          // Cover page
          {
            id: 0,
            type: 'cover',
            title: `${magazineId.charAt(0).toUpperCase() + magazineId.slice(1)}'s Special Magazine`,
            subtitle: 'A Birthday Memory Collection',
          }
        ];
          // Add image pages
        sortedImages.forEach((imageName, index) => {
          pages.push({
            id: index + 1,
            type: 'image',
            imagePath: `/magazines/${magazineId}/${imageName}`,
            title: `Memory ${index + 1}`,
            content: `Page ${index + 1} of your special memories`
          });
        });
        
        console.log('Generated pages:', pages); // Debug log
        setMagazinePages(pages);
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

  const nextPage = () => {
    if (currentPage < magazinePages.length - 1 && !isFlipping) {
      setFlipDirection('forward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('backward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isFlipping) {
      setFlipDirection(pageIndex > currentPage ? 'forward' : 'backward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setIsFlipping(false);
      }, 600);
    }
  };

  const goHome = () => {
    router.push('/');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isFlipping || loading) return;
      
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          nextPage();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevPage();
          break;
        case 'Home':
          event.preventDefault();
          goToPage(0);
          break;
        case 'End':
          event.preventDefault();
          goToPage(magazinePages.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, isFlipping, loading, magazinePages.length]);

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

  // Main magazine
  const currentPageData = magazinePages[currentPage];
  const nextPageData = currentPage < magazinePages.length - 1 ? magazinePages[currentPage + 1] : null;
  const prevPageData = currentPage > 0 ? magazinePages[currentPage - 1] : null;
  const flipPageData = flipDirection === 'forward' ? nextPageData : prevPageData;

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
          {/* Left Page (Previous) */}
          <div className={styles.leftPage}>
            {currentPage > 0 && (
              <div className={styles.pageContent}>
                {magazinePages[currentPage - 1]?.type === 'cover' ? (
                  <div className={styles.coverContent}>
                    <h1 className={styles.coverTitle}>{magazinePages[currentPage - 1]?.title}</h1>
                    <h2 className={styles.coverSubtitle}>{magazinePages[currentPage - 1]?.subtitle}</h2>
                    <div className={styles.coverDecoration}>🎉✨🎂✨🎉</div>
                    <p className={styles.coverMessage}>Made with love for special memories</p>
                  </div>
                ) : (                  <div className={styles.imagePageContent}>
                    <div className={styles.imageContainer}>
                      {magazinePages[currentPage - 1]?.imagePath && (
                        <Image
                          src={magazinePages[currentPage - 1].imagePath!}
                          alt={`Memory ${currentPage}`}
                          fill
                          style={{ objectFit: 'contain' }}
                          className={styles.pageImage}
                          priority={currentPage <= 3}
                        />
                      )}
                    </div>
                    <div className={styles.pageNumber}>{currentPage}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Page (Current) */}
          <div className={styles.rightPage}>
            <div className={styles.pageContent}>
              {currentPageData?.type === 'cover' ? (
                <div className={styles.coverContent}>
                  <h1 className={styles.coverTitle}>{currentPageData.title}</h1>
                  <h2 className={styles.coverSubtitle}>{currentPageData.subtitle}</h2>
                  <div className={styles.coverDecoration}>🎉✨🎂✨🎉</div>
                  <p className={styles.coverMessage}>Made with love for special memories</p>
                </div>
              ) : (                  <div className={styles.imagePageContent}>
                    <div className={styles.imageContainer}>
                      {currentPageData?.imagePath ? (
                        <Image
                          src={currentPageData.imagePath}
                          alt={`Memory ${currentPage + 1}`}
                          fill
                          style={{ objectFit: 'contain' }}
                          className={styles.pageImage}
                          priority={currentPage <= 2}
                          onError={(e) => {
                            console.error('Failed to load image:', currentPageData.imagePath);
                            // Hide the image if it fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <p>Image not found</p>
                          <p>{currentPageData?.imagePath}</p>
                        </div>
                      )}
                    </div>
                    <div className={styles.pageNumber}>{currentPage + 1}</div>
                  </div>
              )}
            </div>
          </div>

          {/* Page Flip Effect - Forward */}
          <div className={styles.pageFlip}>
            {flipDirection === 'forward' && flipPageData && (
              <div className={styles.pageContent}>
                {flipPageData.type === 'cover' ? (
                  <div className={styles.coverContent}>
                    <h1 className={styles.coverTitle}>{flipPageData.title}</h1>
                    <h2 className={styles.coverSubtitle}>{flipPageData.subtitle}</h2>
                    <div className={styles.coverDecoration}>🎉✨🎂✨🎉</div>
                    <p className={styles.coverMessage}>Made with love for special memories</p>
                  </div>
                ) : (                  <div className={styles.imagePageContent}>
                    <div className={styles.imageContainer}>
                      {flipPageData.imagePath && (
                        <Image
                          src={flipPageData.imagePath}
                          alt={`Memory ${currentPage + 2}`}
                          fill
                          style={{ objectFit: 'contain' }}
                          className={styles.pageImage}
                        />
                      )}
                    </div>
                    <div className={styles.pageNumber}>{currentPage + 2}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Page Flip Effect - Backward */}
          <div className={styles.pageFlipBackward}>
            {flipDirection === 'backward' && flipPageData && (
              <div className={styles.pageContent}>
                {flipPageData.type === 'cover' ? (
                  <div className={styles.coverContent}>
                    <h1 className={styles.coverTitle}>{flipPageData.title}</h1>
                    <h2 className={styles.coverSubtitle}>{flipPageData.subtitle}</h2>
                    <div className={styles.coverDecoration}>🎉✨🎂✨🎉</div>
                    <p className={styles.coverMessage}>Made with love for special memories</p>
                  </div>
                ) : (                  <div className={styles.imagePageContent}>
                    <div className={styles.imageContainer}>
                      {flipPageData.imagePath && (
                        <Image
                          src={flipPageData.imagePath}
                          alt={`Memory ${currentPage}`}
                          fill
                          style={{ objectFit: 'contain' }}
                          className={styles.pageImage}
                        />
                      )}
                    </div>
                    <div className={styles.pageNumber}>{currentPage}</div>
                  </div>
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
          onClick={prevPage}
          disabled={currentPage === 0 || isFlipping}
        >
          ← Previous
        </button>
        
        <div className={styles.pageIndicator}>
          {magazinePages.map((_, index) => (
            <div
              key={index}
              className={`${styles.pageIndicatorDot} ${
                index === currentPage ? styles.active : ''
              }`}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
        
        <button 
          className={styles.navButton} 
          onClick={nextPage}
          disabled={currentPage === magazinePages.length - 1 || isFlipping}
        >
          Next →
        </button>
      </div>

      {/* Page Counter */}
      <div className={styles.pageCounter}>
        Page {currentPage + 1} of {magazinePages.length}
      </div>

      {/* Help Text */}
      <div className={styles.helpText}>
        Use arrow keys, spacebar, or buttons to navigate • {magazinePages.length - 1} memories loaded
      </div>
    </main>
  );
}
