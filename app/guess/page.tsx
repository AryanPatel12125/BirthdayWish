'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function GatePage() {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const riddle = `Some goodbyes are never forever,
Sometimes love finds its way back... with fur.

"You once lost a friend who purred so true,
But now tiny paws remind you of her too.
Not quite the same, but still they stay,
Little shadows of love that never fade away."

One word is the key to unlock your surprise —
Guess it right, and let the joy rise.`;  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.toLowerCase().trim() === 'chinku' || keyword.toLowerCase().trim() === 'bachli') {
      router.push('/magazine');
    } else {
      setError(true);
      setKeyword('');
      setTimeout(() => setError(false), 600); // Reset error state after animation
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.gateContainer}>
        <p className={styles.riddle}>{riddle}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter the secret word"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            autoFocus
          />
          <button type="submit" className={styles.submitButton}>
            Unlock Surprise
          </button>
        </form>
      </div>
    </main>
  );
}