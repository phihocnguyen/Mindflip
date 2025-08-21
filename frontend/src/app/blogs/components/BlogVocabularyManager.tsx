'use client';

import { useState, useEffect } from 'react';
import VocabularyLookupClient from './VocabularyLookupClient';
import VocabularyCollectionClient from './VocabularyCollectionClient';
import { apiHelper, ApiResponse } from '~/libs/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '~/hooks/useAuth';
import { toast } from 'react-toastify';

interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  exampleSentence?: string;
}

interface VocabularySet {
  _id: string;
  title: string;
  terms: { term: string; definition: string }[];
}

interface BlogVocabularyManagerProps {
  blogTitle?: string;
}

export default function BlogVocabularyManager({ blogTitle }: BlogVocabularyManagerProps) {
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [creatingSet, setCreatingSet] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

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
  const handleCreateSet = async () => {
    if (vocabularyWords.length === 0) return;
    
    if (!isAuthenticated) {
      toast.error('Bạn cần đăng nhập để tạo bộ từ vựng.');
      return;
    }
    
    setCreatingSet(true);
    setError(null);
    
    try {
      // Create terms array in the format expected by the API
      const newTerms = vocabularyWords.map(word => ({
        term: word.word,
        definition: word.translation
      }));
      
      // Use the blog title or fallback to a default title
      const setTitle = blogTitle || `Từ vựng bài blog (${new Date().toLocaleDateString('vi-VN')})`;
      
      // Get all existing sets for the user
      const userSetsResponse = await apiHelper.get<VocabularySet[]>('/api/sets');
      
      if (userSetsResponse.success && userSetsResponse.data) {
        const sets : VocabularySet[] = userSetsResponse.data;
        const existingSet = sets.find((set) => set.title === setTitle);
        
        if (existingSet) {
          // If set exists, update it by adding new terms
          // Combine existing terms with new terms, avoiding duplicates
          const existingTerms = existingSet.terms || [];
          const combinedTerms = [...existingTerms];
          
          // Add new terms that don't already exist
          let newTermsAdded = 0;
          newTerms.forEach(newTerm => {
            const exists = existingTerms.some((term: any) => 
              term.term.toLowerCase() === newTerm.term.toLowerCase()
            );
            
            if (!exists) {
              combinedTerms.push(newTerm);
              newTermsAdded++;
            }
          });
          
          // Update the existing set using PATCH
          const updateResponse = await apiHelper.patch(`/api/sets/${existingSet._id}`, {
            terms: combinedTerms
          });
          
          if (updateResponse.success) {
            // Clear collection after updating set
            setVocabularyWords([]);
            toast.success(`Bộ từ vựng đã được cập nhật thành công với ${newTermsAdded} từ mới! Bạn có thể tiếp tục tạo các bộ từ vựng mới.`);
          } else {
            throw new Error(updateResponse.error || 'Failed to update vocabulary set');
          }
        } else {
          // If set doesn't exist, create a new one
          const response = await apiHelper.post('/api/sets', {
            title: setTitle,
            terms: newTerms,
            isPublic: false
          });
          
          if (response.success) {
            // Clear collection after creating set
            setVocabularyWords([]);
            toast.success('Bộ từ vựng đã được tạo thành công! Bạn có thể tiếp tục tạo các bộ từ vựng mới.');
          } else {
            throw new Error(response.error || 'Failed to create vocabulary set');
          }
        }
      } else {
        throw new Error(userSetsResponse.error || 'Failed to fetch user sets');
      }
    } catch (err) {
      console.error('Error creating/updating vocabulary set:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo/cập nhật bộ từ vựng');
      toast.error('Đã xảy ra lỗi khi tạo/cập nhật bộ từ vựng. Vui lòng thử lại.');
    } finally {
      setCreatingSet(false);
    }
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
        creatingSet={creatingSet}
        error={error}
      />
    </>
  );
}