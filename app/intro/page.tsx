'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

// --- Data Arrays ---
const wishes = [
  "🌟 Dear Janki... 🌟",
  "On this special day... ✨",
  "We wanted to wish you in a very unique way... 🎉",
  "Let's take you on a little journey!... 🚀",
];

export default function TrialPage() {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [stars, setStars] = useState<{left: string, top: string, width: string, duration: string}[]>([]);

  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const emojiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Helper Functions ---
  const goFullScreen = (element: HTMLElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) { /* Safari */
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) { /* IE11 */
      (element as any).msRequestFullscreen();
    }
  };

  // This corrected type signature EXACTLY matches the type of bgMusicRef
  const playAudio = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (ref.current) {
      ref.current.volume = 0.5;
      ref.current.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  // --- Typewriter Effect ---
  const typeWriter = async (text: string) => {
    for (const char of text) {
      setDisplayText((prev) => prev + char);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  // This function is now ONLY for the visual animation
  const startTypingAnimation = async () => {
    emojiIntervalRef.current = setInterval(createEmoji, 300);
    setDisplayText('');
    setIsAnimationFinished(false);

    for (const wish of wishes) {
      await typeWriter(wish);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (wishes.indexOf(wish) < wishes.length - 1) {
        setDisplayText('');
      }
    }
    
    if (emojiIntervalRef.current) {
      clearInterval(emojiIntervalRef.current);
    }
    setIsAnimationFinished(true);
  };

  // This is the new, robust start function that handles the user's click
  const handleStart = () => {
    // 1. Immediately update the UI to show the animation area
    setIsStarted(true);

    // 2. Request audio playback. This is a high-priority action.
    playAudio(bgMusicRef);

    // 3. Request fullscreen using our robust helper function.
    if (mainRef.current) {
      goFullScreen(mainRef.current);
    }
    
    // 4. AFTER handling permissions, start the visual animation.
    startTypingAnimation();
  };

  const handleNextClick = () => {
    router.push('/guess');
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = newMutedState;
    }
  };

  const createEmoji = () => {
    if (!mainRef.current) return;
    const emojis = ["💖", "⭐", "✨", "🎉", "🎂", "🎈"];
    const emoji = document.createElement("div");
    emoji.className = styles.emoji;
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = Math.random() * window.innerWidth + "px";
    mainRef.current.appendChild(emoji);
    setTimeout(() => emoji.remove(), 3000);
  };

  // --- Render ---
  return (
    <main ref={mainRef} className={styles.main}>
      <div className={styles.stars}>
        {stars.map((star, i) => (
          <div key={i} className={styles.star} style={{ ...star, height: star.width, '--duration': star.duration } as React.CSSProperties} />
        ))}
      </div>

      {!isStarted ? (
        <button className={styles.startBtn} onClick={handleStart}>
          Click to Start ✨
        </button>
      ) : (
        <div className={styles.wishesContainer}>
          <div className={`${styles.wishes} ${styles.neonText}`}>{displayText}</div>
          {isAnimationFinished && (
            <button className={styles.nextButton} onClick={handleNextClick}>
              Continue →
            </button>
          )}
        </div>
      )}

      <button className={styles.muteBtn} onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>

      <audio ref={bgMusicRef} src="/birthday-song.mp3" loop />
    </main>
  );
}