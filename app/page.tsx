'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

// --- Data Arrays ---
const wishes = [
  "🌟 Dear Heli... 🌟",
  "Let's turn your birthday mode on... ✨",
  "We thought we'd wish you a little differently, just like you - thoda sa paagal aur bahot saara pyaara... 🎉",
  "So here's a teeny tiny wish, revolving around Heli Parmaarrrr!... 🚁🚀",
  "Enjoy the chapri music, it was a last minute addition! 🎶",
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
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const emojiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Helper Functions ---
  const goFullScreen = (element: HTMLElement) => {
    const el = element as HTMLElementWithFullscreen;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };

  // --- Effects ---
  useEffect(() => {
    const generatedStars = Array.from({ length: 200 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3}px`,
      duration: `${Math.random() * 3 + 1}s`,
    }));
    setStars(generatedStars);

    return () => {
      if (emojiIntervalRef.current) {
        clearInterval(emojiIntervalRef.current);
      }
    };
  }, []);

  // --- Audio and Effects Control ---
  const playAudio = async (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (ref.current) {
      try {
        ref.current.volume = 0.5;
        await ref.current.play();
        console.log("Audio started playing");
      } catch (err) {
        console.log("Audio play failed:", err);
        // Try to enable audio after user interaction
        setTimeout(async () => {
          try {
            if (ref.current) {
              await ref.current.play();
            }
          } catch (retryErr) {
            console.log("Audio retry failed:", retryErr);
          }
        }, 100);
      }
    }
  };

  const typeWriter = async (text: string) => {
    for (const char of text) {
      setDisplayText((prev) => prev + char);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

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
  const handleStart = () => {
    setIsStarted(true);
    setIsAnimationFinished(false);
    playAudio(bgMusicRef);

    if (mainRef.current) {
      goFullScreen(mainRef.current);
    }
    
    emojiIntervalRef.current = setInterval(createEmoji, 300);

    startTypingAnimation().then(() => {
      if (emojiIntervalRef.current) {
        clearInterval(emojiIntervalRef.current);
      }
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
          {isAnimationFinished && (
            <div className={styles.buttonContainer}>
              <button className={styles.nextButton} onClick={handleNextClick}>
                Continue Journey →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Music Player Slider */}
      <div className={styles.musicPlayer}>
        <div className={styles.songInfoSlider}>
          <div className={styles.songInfoTrack}>
            <span>Pagli Playing...&nbsp;&nbsp;&nbsp;</span>
            <span>Pagli Playing...&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>

      {/* Standalone Mute Button */}
      <button className={styles.muteBtn} onClick={toggleMute}>
        {isMuted ? "🔇" : "🔊"}
      </button>

      <audio 
        ref={bgMusicRef} 
        src="/Pagli.mp3" 
        loop 
        preload="auto"
        onLoadedData={() => console.log("Audio loaded successfully")}
        onError={(e) => console.error("Audio error:", e)}
      />
    </main>
  );
}
