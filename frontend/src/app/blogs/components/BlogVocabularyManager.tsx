'use client';

import { useState, useEffect } from 'react';
import VocabularyLookupClient from './VocabularyLookupClient';
import VocabularyCollectionClient from './VocabularyCollectionClient';

interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  exampleSentence?: string;
}

export default function BlogVocabularyManager() {
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);

  // Handle adding words to the collection
  const handleAddWord = (word: string, translation: string, exampleSentence?: string) => {
    // Check if word already exists in collection (case insensitive)
    const exists = vocabularyWords.some(w => w.word.toLowerCase() === word.toLowerCase());
    
    if (!exists) {
      const newWord: VocabularyWord = {
        id: Date.now().toString(),
        word,
        translation,
        exampleSentence
      };
      setVocabularyWords(prev => [...prev, newWord]);
    }
  };

  // Handle removing words from the collection
  const handleRemoveWord = (id: string) => {
    setVocabularyWords(prev => prev.filter(word => word.id !== id));
  };

  // Handle creating a vocabulary set
  const handleCreateSet = () => {
    if (vocabularyWords.length === 0) return;
    
    // In a real app, this would create a new vocabulary set
    alert(`Creating vocabulary set with ${vocabularyWords.length} words! In a real app, this would save to your account.`);
    
    // Clear collection after creating set
    setVocabularyWords([]);
  };

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Any cleanup code if needed
    };
  }, []);

  return (
    <>
      <VocabularyLookupClient onAddWord={handleAddWord} />
      <VocabularyCollectionClient 
        vocabularyWords={vocabularyWords}
        onRemoveWord={handleRemoveWord}
        onCreateSet={handleCreateSet}
      />
    </>
  );
}