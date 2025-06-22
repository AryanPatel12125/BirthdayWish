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
  const [isMuted, setIsMuted] = useState(false);
  const [stars, setStars] = useState<{left: string, top: string, width: string, duration: string}[]>([]);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false); // 1. Add state for the button
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const emojiIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
  const playAudio = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (ref.current) {
      ref.current.volume = 0.5;
      ref.current.play().catch(err => console.log("Audio play failed:", err));
    }
  };

  // --- Typewriter Effect ---
  const typeWriter = async (text: string) => {
    for (const char of text) { // Changed 'let' to 'const'
      setDisplayText((prev) => prev + char);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const startTypingAnimation = async () => {
    setIsAnimationFinished(false);
    setDisplayText('');

    for (const wish of wishes) { // Changed 'let' to 'const'
      await typeWriter(wish);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Pause between wishes
      if (wishes.indexOf(wish) < wishes.length - 1) {
        setDisplayText('');
      }
    }

    setIsAnimationFinished(true);
  };

  // --- Event Handlers ---
  const handleStart = async () => {
    setIsStarted(true);
    if (mainRef.current) mainRef.current.requestFullscreen().catch(err => console.log(err));
    
    playAudio(bgMusicRef);
    emojiIntervalRef.current = setInterval(createEmoji, 300);

    await startTypingAnimation();
    
    if (emojiIntervalRef.current) {
      clearInterval(emojiIntervalRef.current);
    }
    
    // 2. Show the button instead of redirecting
    setIsAnimationFinished(true);
  };

  // 3. Create a handler for the new button
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