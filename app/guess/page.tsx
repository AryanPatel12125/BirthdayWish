'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function GatePage() {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const riddle = `Two rode ahead, one stayed to see,
A lesson turned to sudden spree.
The engine roared, the front rose high,
A short flight, then wood met thigh.
What word recalls that bumpy thrill—
The shaky start, the flying will?`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.toLowerCase().trim() === 'wheelie') {
      router.push('/birthday');
    } else {
      setError(true);
      setKeyword('');
      setTimeout(() => setError(false), 600); // Reset error state after animation
    }
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.gateContainer} ${error ? styles.shake : ''}`}>
        <div className={styles.riddleBox}>
          <p>{riddle}</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter the secret word"
            className={styles.input}
            aria-label="Secret word input"
          />
          <button type="submit" className={styles.button}>
            Unlock Surprise
          </button>
        </form>
      </div>
    </main>
  );
}