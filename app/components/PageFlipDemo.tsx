'use client';

import React, { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './PageFlipDemo.module.css';

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

export default function PageFlipDemo() {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const goToPage = (pageNum: number) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flip(pageNum);
    }
  };

  const handleFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const handleInit = (e: any) => {
    setTotalPages(e.data);
  };

  return (
    <div className={styles.demoContainer}>
      <h1 className={styles.title}>React-PageFlip Demo Features</h1>
      
      <div className={styles.bookContainer}>
        <HTMLFlipBook
          ref={bookRef}
          width={300}
          height={400}
          size="stretch"
          minWidth={250}
          maxWidth={600}
          minHeight={300}
          maxHeight={800}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={false}
          className={styles.flipBook}
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={600}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={50}
          showPageCorners={true}
          disableFlipByClick={false}
          onFlip={handleFlip}
          onInit={handleInit}
        >
          {/* Feature Demo Pages */}
          <Page className={styles.coverPage}>
            <h2>Feature Demo</h2>
            <p>React-PageFlip Capabilities</p>
            <div className={styles.featureIcon}>📚</div>
          </Page>

          <Page>
            <h3>Basic Features</h3>
            <ul>
              <li>✅ Smooth page animations</li>
              <li>✅ Touch/swipe support</li>
              <li>✅ Responsive design</li>
              <li>✅ Shadow effects</li>
              <li>✅ Page corners</li>
            </ul>
          </Page>

          <Page>
            <h3>Customization</h3>
            <div className={styles.customBox}>
              <p>📐 Adjustable dimensions</p>
              <p>🎨 Custom styling</p>
              <p>⚡ Animation speed control</p>
              <p>📱 Mobile optimization</p>
            </div>
          </Page>

          <Page>
            <h3>Interactive Elements</h3>
            <button className={styles.demoButton} onClick={() => alert('Button works!')}>
              Click Me!
            </button>
            <input type="text" placeholder="Type here..." className={styles.demoInput} />
            <div className={styles.progressBar}>
              <div 
                className={styles.progress} 
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>
          </Page>

          <Page>
            <h3>Media Support</h3>
            <div className={styles.mediaDemo}>
              <div className={styles.imagePlaceholder}>🖼️ Images</div>
              <div className={styles.videoPlaceholder}>🎥 Videos</div>
              <div className={styles.audioPlaceholder}>🎵 Audio</div>
            </div>
          </Page>

          <Page className={styles.gradientPage}>
            <h3>Styling Options</h3>
            <p>Beautiful gradients</p>
            <p>Custom backgrounds</p>
            <p>Animations & effects</p>
            <div className={styles.sparkles}>✨ ⭐ 💫</div>
          </Page>

          <Page>
            <h3>Event Handling</h3>
            <p>Current Page: <strong>{currentPage + 1}</strong></p>
            <p>Total Pages: <strong>{totalPages}</strong></p>
            <p>Progress: <strong>{Math.round(((currentPage + 1) / totalPages) * 100)}%</strong></p>
          </Page>

          <Page className={styles.backCover}>
            <h2>The End</h2>
            <p>Ready to implement in your project!</p>
            <div className={styles.endIcon}>🎉</div>
          </Page>
        </HTMLFlipBook>
      </div>

      {/* Navigation Controls */}
      <div className={styles.controls}>
        <button onClick={prevPage} className={styles.navBtn}>← Prev</button>
        <span className={styles.pageInfo}>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button onClick={nextPage} className={styles.navBtn}>Next →</button>
      </div>

      {/* Quick Navigation */}
      <div className={styles.quickNav}>
        <p>Quick Jump:</p>
        {Array.from({ length: totalPages }, (_, i) => (
          <button 
            key={i} 
            onClick={() => goToPage(i)}
            className={`${styles.pageBtn} ${currentPage === i ? styles.active : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
