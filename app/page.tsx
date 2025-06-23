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

// This interface defines the possible fullscreen methods for cross-browser safety
interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export default function TrialPage() {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [stars, setStars] = useState<{left: string, top: string, width: string, duration: string}[]>([]);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false); // 1. Add state for the button
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const emojiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Helper Functions ---
  // This function now uses our safe interface instead of 'any'
  const goFullScreen = (element: HTMLElement) => {
    const el = element as HTMLElementWithFullscreen;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) { /* Safari */
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) { /* IE11 */
      el.msRequestFullscreen();
    }
  };

  // --- Effects ---
  useEffect(() => {
    // Create stars on component mount
    const generatedStars = Array.from({ length: 200 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3}px`,
      duration: `${Math.random() * 3 + 1}s`,
    }));
    setStars(generatedStars);

    // Cleanup interval on component unmount
    return () => {
      if (emojiIntervalRef.current) {
        clearInterval(emojiIntervalRef.current);
      }
    };
  }, []);

  // --- Audio and Effects Control ---
  // This corrected type signature EXACTLY matches the type of bgMusicRef
  const playAudio = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (ref.current) {
      ref.current.volume = 0.5;
      ref.current.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  const typeWriter = async (text: string) => {
    for (const char of text) { // Changed 'let' to 'const'
      setDisplayText((prev) => prev + char);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  // This function should ONLY be responsible for the typing animation.
  // All state management will be moved to handleStart.
  const startTypingAnimation = async () => {
    setDisplayText('');
    for (const wish of wishes) {
      await typeWriter(wish);
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (wishes.indexOf(wish) < wishes.length - 1) {
        setDisplayText('');
      }
    }
  };

  // --- Event Handlers ---
  // This function is restructured to be more iOS-friendly.
  const handleStart = () => {
    setIsStarted(true);
    setIsAnimationFinished(false);
    playAudio(bgMusicRef);

    // Use our new, robust fullscreen function
    if (mainRef.current) {
      goFullScreen(mainRef.current);
    }
    
    emojiIntervalRef.current = setInterval(createEmoji, 300);

    startTypingAnimation().then(() => {
      if (emojiIntervalRef.current) {
        clearInterval(emojiIntervalRef.current);
      }
      // Show the 'Continue' button after everything else is finished.
      setIsAnimationFinished(true);
    });
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
          Click to Start✨
        </button>
      ) : (
        <div className={styles.wishesContainer}>
          <div className={`${styles.wishes} ${styles.neonText}`}>{displayText}</div>
          {/* 4. Conditionally render the button */}
          {isAnimationFinished && (
            <button className={styles.nextButton} onClick={handleNextClick}>
              Continue →
            </button>
          )}
        </div>
      )}

      {/* Music Player Slider (now separate) */}
      <div className={styles.musicPlayer}>
        <div className={styles.songInfoSlider}>
          <div className={styles.songInfoTrack}>
            <span>Mikrokosmos - BTS Playing...&nbsp;&nbsp;&nbsp;</span>
            <span>Mikrokosmos - BTS Playing...&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>

      {/* Standalone Mute Button */}
      <button className={styles.muteBtn} onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>

      <audio ref={bgMusicRef} src="/mikrokosmos.mp3" loop />
    </main>
  );
}