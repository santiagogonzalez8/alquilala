'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.logo}>
          <svg
            width="50"
            height="50"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="10" y="20" width="20" height="16" fill="#1e3a5f" />
            <path d="M20 8 L32 20 L8 20 Z" fill="#1e3a5f" />
            <rect x="16" y="24" width="8" height="8" fill="white" />
            <line
              x1="16"
              y1="28"
              x2="24"
              y2="28"
              stroke="#1e3a5f"
              strokeWidth="0.8"
            />
            <line
              x1="20"
              y1="24"
              x2="20"
              y2="32"
              stroke="#1e3a5f"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        <h2>Alquilala</h2>
        <p className={styles.subtitle}>
          {isRegistering ? 'Crea tu cuenta' : 'Inicia sesión'}
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.btnPrimary}>
            {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </form>

        <div className={styles.divider}>o</div>

        <button onClick={handleGoogleLogin} className={styles.btnGoogle}>
          <img src="https://www.google.com/favicon.ico" alt="Google" />
          Continuar con Google
        </button>

        <p className={styles.toggleAuth}>
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? ' Inicia sesión' : ' Regístrate'}
          </span>
        </p>
      </div>
    </div>
  );
}
