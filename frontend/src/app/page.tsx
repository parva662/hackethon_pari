'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import NameInput from '@/components/NameInput';
import CardSelection from '@/components/CardSelection';
import { User, GameState, Card } from '@/types';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    selectedCards: [],
    phase: 'auth',
    user: null,
  });

  const handleAuthenticated = (user: User) => {
    setGameState(prev => ({
      ...prev,
      user,
      phase: 'name',
    }));
  };

  const handleNameSet = (name: string) => {
    if (gameState.user) {
      setGameState(prev => ({
        ...prev,
        user: {
          ...prev.user!,
          name,
        },
        phase: 'selection',
      }));
    }
  };

  const handleCardsSelected = (cards: Card[]) => {
    setGameState(prev => ({
      ...prev,
      selectedCards: cards,
      phase: 'results',
    }));

    // In a real app, we would submit the card selection to the server here
    submitCardSelection(cards, gameState.user!);
  };

  const submitCardSelection = async (cards: Card[], user: User) => {
    try {
      // Sort card IDs to ensure consistent order
      const cardIds = cards.map(card => card.id).sort();
      
      await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardIds,
          schoolId: user.schoolId,
          userName: user.name,
        }),
      });
    } catch (error) {
      console.error('Error submitting card selection:', error);
    }
  };

  const renderPhase = () => {
    switch (gameState.phase) {
      case 'auth':
        return <Auth onAuthenticated={handleAuthenticated} />;
      case 'name':
        return gameState.user && (
          <NameInput 
            user={gameState.user} 
            onNameSet={handleNameSet} 
          />
        );
      case 'selection':
        return <CardSelection onCardsSelected={handleCardsSelected} />;
      case 'results':
        return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Thank you for your submission!</h1>
            <p className="text-xl mb-8">
              Your card choices have been recorded. Results coming soon...
            </p>
          </div>
        );
      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPhase()}
    </div>
  );
}
