'use client';

import { useState } from 'react';
import { User } from '@/types';

interface NameInputProps {
  user: User;
  onNameSet: (name: string) => void;
}

export default function NameInput({ user, onNameSet }: NameInputProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    onNameSet(name.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">What's your name?</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-6">
          <label 
            htmlFor="name" 
            className="block text-xl mb-2 text-center"
          >
            Enter your game name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            className="w-full text-center text-2xl py-4 px-6 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none transition-colors text-black bg-white"
            placeholder="Your name"
            maxLength={20}
          />
        </div>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg text-xl font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
} 