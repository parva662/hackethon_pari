'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/types';
import cardData from '@/app/cards/card-definitions.json';

interface CardSelectionProps {
  onCardsSelected: (cards: Card[]) => void;
}

export default function CardSelection({ onCardsSelected }: CardSelectionProps) {
  const [allCards, setAllCards] = useState<Card[]>(cardData.cards);
  const [displayedCards, setDisplayedCards] = useState<Card[]>(cardData.cards);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleCardSelect = (card: Card) => {
    if (isAnimating) return;
    
    if (selectedCards.length === 0) {
      // First card selection
      setIsAnimating(true);
      setSelectedCards([card]);
      
      // Animate cards shaking
      setTimeout(() => {
        // Filter to only show compatible cards
        const compatibleCards = allCards.filter(c => 
          card.compatibleCardIds.includes(c.id) && c.id !== card.id
        );
        setDisplayedCards(compatibleCards);
        setIsAnimating(false);
      }, 1500); // Animation time
    } else if (selectedCards.length === 1) {
      // Second card selection
      const updatedSelection = [...selectedCards, card];
      
      // Sort cards by ID to ensure consistent ordering
      updatedSelection.sort((a, b) => a.id.localeCompare(b.id));
      
      setSelectedCards(updatedSelection);
    }
  };
  
  const handleSubmit = () => {
    if (selectedCards.length === 2) {
      onCardsSelected(selectedCards);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Activity Cards</h1>
      
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 w-full max-w-5xl ${
        isAnimating ? 'animate-cards' : ''
      }`}>
        {displayedCards.map((card) => (
          <div 
            key={card.id}
            onClick={() => handleCardSelect(card)}
            className={`
              relative cursor-pointer transform transition-all duration-300 
              hover:scale-105 rounded-lg overflow-hidden border-4
              ${selectedCards.some(c => c.id === card.id) 
                ? 'border-purple-600 ring-4 ring-purple-300' 
                : 'border-gray-200 hover:border-purple-300'}
              ${isAnimating ? 'animate-shake' : ''}
            `}
            style={{ aspectRatio: '3/4' }}
          >
            <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold text-center px-2">{card.title}</h3>
            </div>
            <Image
              src={card.imageUrl}
              alt={card.title}
              width={200}
              height={250}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* User's hand */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200">
        <div className="flex justify-center gap-4 max-w-md mx-auto">
          {selectedCards.map((card, index) => (
            <div 
              key={card.id}
              className="relative w-24 h-32 rounded-lg overflow-hidden border-4 border-purple-600"
            >
              <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                <h3 className="text-white text-sm font-bold text-center px-1">{card.title}</h3>
              </div>
              <Image
                src={card.imageUrl}
                alt={card.title}
                width={96}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {selectedCards.length < 2 && Array(2 - selectedCards.length).fill(0).map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="w-24 h-32 rounded-lg border-4 border-dashed border-gray-300 flex items-center justify-center"
            >
              <span className="text-gray-400">Empty</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={selectedCards.length !== 2}
          className="mt-4 bg-purple-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mx-auto block"
        >
          Submit
        </button>
      </div>
    </div>
  );
} 