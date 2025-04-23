'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import NameInput from '@/components/NameInput';
import CardSelection from '@/components/CardSelection';
import { User, GameState, Card, GameResult } from '@/types';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    selectedCards: [],
    phase: 'auth',
    user: null,
  });
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    if (cards.length === 2) {
      submitCardSelection(cards);
    }
  };

  const submitCardSelection = async (cards: Card[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/supervisor/combine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card1: cards[0].title,
          card2: cards[1].title,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result: GameResult = await response.json();
      setGameResult(result);
    } catch (error) {
      console.error('Error submitting cards:', error);
      setGameResult({ 
        game_name: 'Error',
        description: 'Failed to generate game combination',
        rules: [],
        materials_needed: [],
        safety_considerations: [],
        error: 'Failed to connect to the server'
      });
    } finally {
      setIsLoading(false);
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
            {isLoading && (
              <div className="mt-8">
                <p className="text-xl">Generating your game combination...</p>
              </div>
            )}

            {gameResult && !isLoading && (
              <div className="mt-8 space-y-6">
                <h2 className="text-3xl font-bold">{gameResult.game_name}</h2>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Description</h3>
                  <p>{gameResult.description}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-2">Rules</h3>
                  <ul className="list-disc pl-6">
                    {gameResult.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-2">Materials Needed</h3>
                  <ul className="list-disc pl-6">
                    {gameResult.materials_needed.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-2">Safety Considerations</h3>
                  <ul className="list-disc pl-6">
                    {gameResult.safety_considerations.map((consideration, index) => (
                      <li key={index}>{consideration}</li>
                    ))}
                  </ul>
                </div>

                {gameResult.error && (
                  <div className="text-red-600">
                    <p>{gameResult.error}</p>
                  </div>
                )}
              </div>
            )}
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
