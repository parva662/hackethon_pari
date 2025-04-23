'use client';

import { useState } from 'react';
import { User } from '@/types';

interface AuthProps {
  onAuthenticated: (user: User) => void;
}

export default function Auth({ onAuthenticated }: AuthProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Invalid code');
      }

      const user = await response.json();
      onAuthenticated(user);
    } catch (err) {
      setError('Invalid code. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to LIFTS!</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-6">
          <label 
            htmlFor="code" 
            className="block text-xl mb-2 text-center"
          >
            Enter your 6-digit code
          </label>
          <input
            type="text"
            id="code"
            maxLength={6}
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setCode(value);
              setError('');
            }}
            className="w-full text-center text-3xl tracking-widest py-4 px-6 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none transition-colors text-black bg-white"
            placeholder="123456"
          />
        </div>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <button
          type="submit"
          disabled={code.length !== 6}
          className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg text-xl font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
} 