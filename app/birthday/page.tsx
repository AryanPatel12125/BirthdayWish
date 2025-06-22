'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import birthdayPoster from './birthday-poster.png'; 
import styles from './page.module.css';

export default function BirthdayPage() {
  const [orbs, setOrbs] = useState<{ style: React.CSSProperties }[]>([]);

  // Generate decorative orbs on component mount
  useEffect(() => {
    const generatedOrbs = Array.from({ length: 20 }).map(() => ({
      style: {
        '--size': `${Math.random() * 80 + 20}px`,
        '--x-start': `${Math.random() * 100}%`,
        '--x-end': `${Math.random() * 100}%`,
        '--duration': `${Math.random() * 15 + 10}s`,
        '--delay': `${Math.random() * -25}s`, // Negative delay starts animations partway through
        '--opacity': `${Math.random() * 0.4 + 0.1}`,
      } as React.CSSProperties,
    }));
    setOrbs(generatedOrbs);
  }, []);

  return (
    <main className={styles.main}>
      {/* Render the floating orbs */}
      <div className={styles.orbContainer}>
        {orbs.map((orb, i) => (
          <div key={i} className={styles.orb} style={orb.style} />
        ))}
      </div>

      <Image
        src={birthdayPoster}
        alt="A special birthday poster for Janki"
        fill
        style={{ objectFit: 'contain' }} // Changed from 'cover' to 'contain'
        className={styles.backgroundImage}
        priority // Helps load the main image faster
      />
      
      {/* 
        The message content is kept here, commented out.
        We will move this into a sidebar in the next step.

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
      */}
    </main>
  );
}
