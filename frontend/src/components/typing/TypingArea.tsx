import React, { useRef, useEffect } from 'react';

interface TypingAreaProps {
  paragraph: string;
  typedText: string;
  currentIndex: number;
  onInput: (value: string) => void;
  isFinished: boolean;
}

const TypingArea = ({ paragraph, typedText, currentIndex, onInput, isFinished }: TypingAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isFinished && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isFinished]);

  const renderParagraph = () => {
    return paragraph.split('').map((char, i) => {
      let className = 'text-gray-400 dark:text-gray-500';
      if (i < typedText.length) {
        className = typedText[i] === char
          ? 'text-green-500 dark:text-green-400'
          : 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded';
      } else if (i === currentIndex) {
        className = 'text-gray-800 dark:text-gray-100 border-b-2 border-primary-500 animate-cursor-blink';
      } else {
        className = 'text-gray-700 dark:text-gray-300';
      }

      return (
        <span key={i} className={`${className} transition-colors`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="relative">
      <div
        className="font-hindi text-2xl leading-relaxed p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700 min-h-[160px] cursor-text select-none"
        onClick={() => textareaRef.current?.focus()}
      >
        {renderParagraph()}
      </div>

      <textarea
        ref={textareaRef}
        value={typedText}
        onChange={e => onInput(e.target.value)}
        disabled={isFinished}
        className="absolute inset-0 opacity-0 resize-none cursor-text"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        aria-label="Type here"
      />
    </div>
  );
};

export default TypingArea;
