'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type CustomSpeechRecognitionEvent = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    length: number;
  };
};

type CustomSpeechRecognitionErrorEvent = Event & {
  error: string;
};

interface SpeakingQuestionProps {
  question: {
    id: string;
    term: string;
    definition: string;
    correctAnswer: string;
    lang: string;
    userAnswer?: boolean;
    recognizedWord?: string;
  };
  index: number;
  isInReviewMode: boolean;
  interactionsDisabled: boolean;
  onAnswer: (questionId: string, isCorrect: boolean, recognizedWord: string) => void;
}

export default function SpeakingQuestion({
  question,
  index,
  isInReviewMode,
  interactionsDisabled,
  onAnswer,
}: SpeakingQuestionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedWord, setRecognizedWord] = useState(question.recognizedWord || '');
  const [error, setError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(false);

  // Check for SpeechRecognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSpeechSupported(!!SpeechRecognition);
  }, []);

  const handleCheckPronunciation = () => {
    if (!isSpeechSupported) {
      setError('Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = question.lang || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);
    setError(null);

    recognition.start();

    recognition.onresult = (event: CustomSpeechRecognitionEvent) => {
      const spokenText = event.results[0][0].transcript.trim();
      setRecognizedWord(spokenText);
      const isCorrect = spokenText.toLowerCase() === question.correctAnswer.toLowerCase();
      onAnswer(question.id, isCorrect, spokenText);
      setIsRecording(false);
    };

    recognition.onerror = (event: CustomSpeechRecognitionErrorEvent) => {
      setIsRecording(false);
      if (event.error === 'no-speech') {
        setError('Không nhận được âm thanh. Vui lòng thử lại.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone bị chặn. Vui lòng cấp quyền truy cập microphone.');
      } else {
        setError('Lỗi nhận diện giọng nói: ' + event.error);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-4">
        <div className="w-8 text-gray-500 dark:text-gray-400">{index + 1}.</div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{question.definition}</div>
        </div>
        <button
          onClick={handleCheckPronunciation}
          disabled={interactionsDisabled || isRecording}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            interactionsDisabled || isRecording
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRecording ? 'Đang ghi âm...' : 'Kiểm tra phát âm'}
        </button>
      </div>
      {recognizedWord && (
        <div className="text-sm ml-12">
          <span className="text-gray-600 dark:text-gray-400">Bạn nói: </span>
          <span
            className={
              question.userAnswer
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }
          >
            {recognizedWord}
          </span>
        </div>
      )}
      {isInReviewMode && (
        <div className="text-sm ml-12">
          {question.userAnswer === undefined ? (
            <span className="text-gray-500 dark:text-gray-400">Chưa kiểm tra</span>
          ) : question.userAnswer ? (
            <span className="text-green-600 dark:text-green-400">Đúng</span>
          ) : (
            <span className="text-red-600 dark:text-red-400">
              Sai, đáp án đúng: {question.correctAnswer}
            </span>
          )}
        </div>
      )}
      {error && (
        <div className="text-sm ml-12 text-red-600 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}