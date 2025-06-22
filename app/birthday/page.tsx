'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';

// A simple confetti function
const createConfetti = (container: HTMLElement) => {
  const colors = ['#ff80ab', '#f06292', '#ce93d8', '#9575cd'];
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = styles.confetti;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
};

export default function BirthdayPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleRevealClick = () => {
    if (isRevealed) return; // Prevent re-triggering
    setIsRevealed(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio failed to play:", err));
    }
    if (mainRef.current) {
      createConfetti(mainRef.current);
    }
  };

  return (
    <main ref={mainRef} className={styles.main}>
      <div className={`${styles.card} ${isRevealed ? styles.cardRevealed : ''}`}>
        
        {/* Front of the card (visible initially) */}
        <div className={styles.cardFront}>
          <div className={styles.frontContent}>
            <h2>A Special Message for Janki</h2>
            <p>Click the envelope to open</p>
            <button onClick={handleRevealClick} className={styles.revealButton}>
              💌
            </button>
          </div>
        </div>

        {/* Back of the card (visible after click) */}
        <div className={styles.cardBack}>
          <div className={styles.posterPlaceholder}>
            <p className={styles.posterText}>[ Your friend's beautiful poster will be here! ]</p>
          </div>
          <div className={styles.message}>
            <h1>Happy Birthday, Janki!</h1>
            <p>
              Wishing you a day that's as amazing as you are. May your year be filled with BTS concerts, F1 race wins, and all the happiness in the world!
            </p>
            <p>
              We're so lucky to have a friend like you. Cheers to another year of fun, laughter, and unforgettable memories (like wheelies 😉).
            </p>
            <div className={styles.signature}>
              <p>With love,</p>
              <p>Your Friends</p>
            </div>
          </div>
        </div>

      </div>

      {/* Add a music file (e.g., bts-dynamite.mp3) to your `public` folder for this to work */}
      <audio ref={audioRef} src="/birthday-song.mp3" loop />
    </main>
  );
}
