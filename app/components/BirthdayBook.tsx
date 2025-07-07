'use client';

import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';
import birthdayPoster from '../birthday/birthday-poster.png';
import styles from './BirthdayBook.module.css';

// Define the props for individual pages
interface PageProps {
  children: React.ReactNode;
  className?: string;
}

// Forward ref component for each page
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

export default function BirthdayBook() {
  const bookRef = useRef<any>(null);

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

  return (
    <div className={styles.bookContainer}>
      <div className={styles.bookWrapper}>
        <HTMLFlipBook
          ref={bookRef}
          width={400}
          height={600}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={false}
          className={styles.flipBook}
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={50}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Cover Page */}
          <Page className={styles.coverPage}>
            <div className={styles.coverContent}>
              <h1 className={styles.coverTitle}>Happy Birthday!</h1>
              <div className={styles.coverEmoji}>🎉</div>
              <p className={styles.coverSubtitle}>A Special Message for Heli</p>
              <div className={styles.tapHint}>Tap to open →</div>
            </div>
          </Page>

          {/* Page 1 - Introduction */}
          <Page>
            <div className={styles.pageContent}>
              <h2 className={styles.pageTitle}>Dear Heli...</h2>
              <p className={styles.pageText}>
                On this special day, we wanted to create something magical just for you! 
              </p>
              <div className={styles.decorativeEmojis}>
                <span>⭐</span>
                <span>✨</span>
                <span>🌟</span>
              </div>
              <p className={styles.pageText}>
                Every page of this book holds a piece of our heart and wishes for you.
              </p>
            </div>
          </Page>

          {/* Page 2 - Memories */}
          <Page>
            <div className={styles.pageContent}>
              <h2 className={styles.pageTitle}>Amazing Memories</h2>
              <div className={styles.memoryBox}>
                <div className={styles.memoryItem}>
                  <span className={styles.memoryEmoji}>🏍️</span>
                  <p>That unforgettable wheelie adventure!</p>
                </div>
                <div className={styles.memoryItem}>
                  <span className={styles.memoryEmoji}>🎵</span>
                  <p>Dancing to BTS Mikrokosmos</p>
                </div>
                <div className={styles.memoryItem}>
                  <span className={styles.memoryEmoji}>🏎️</span>
                  <p>Cheering for F1 races together</p>
                </div>
              </div>
            </div>
          </Page>

          {/* Page 3 - Birthday Poster */}
          <Page>
            <div className={styles.posterPage}>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={birthdayPoster}
                  alt="Special Birthday Poster for Heli"
                  width={300}
                  height={400}
                  style={{ objectFit: 'contain' }}
                  className={styles.posterImage}
                />
              </div>
            </div>
          </Page>

          {/* Page 4 - Wishes */}
          <Page>
            <div className={styles.pageContent}>
              <h2 className={styles.pageTitle}>Our Wishes for You</h2>
              <div className={styles.wishList}>
                <div className={styles.wish}>
                  <span>🎂</span>
                  <p>May this year bring you endless joy and laughter</p>
                </div>
                <div className={styles.wish}>
                  <span>🌟</span>
                  <p>May all your dreams take flight like your wheelie</p>
                </div>
                <div className={styles.wish}>
                  <span>💜</span>
                  <p>May you find your own Mikrokosmos in every moment</p>
                </div>
                <div className={styles.wish}>
                  <span>🏆</span>
                  <p>May you always be the champion of your own race</p>
                </div>
              </div>
            </div>
          </Page>

          {/* Final Page - Signature */}
          <Page>
            <div className={styles.pageContent}>
              <div className={styles.finalMessage}>
                <h2 className={styles.pageTitle}>With All Our Love</h2>
                <p className={styles.pageText}>
                  You're not just a friend, you're family. Thank you for being the amazing person you are!
                </p>
                <div className={styles.signature}>
                  <p>Happy Birthday, Heli! 🎉</p>
                  <p className={styles.signatureFrom}>- Your Friends</p>
                </div>
                <div className={styles.hearts}>
                  💖 💖 💖
                </div>
              </div>
            </div>
          </Page>

          {/* Back Cover */}
          <Page className={styles.backCover}>
            <div className={styles.backContent}>
              <div className={styles.backEmojis}>
                🎂 🎈 🎁 ✨ 🌟 💖
              </div>
              <p className={styles.backText}>
                Hope you enjoyed this little birthday journey!
              </p>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>

      {/* Navigation Controls */}
      <div className={styles.controls}>
        <button onClick={prevPage} className={styles.navButton}>
          ← Previous
        </button>
        <button onClick={nextPage} className={styles.navButton}>
          Next →
        </button>
      </div>
    </div>
  );
}
