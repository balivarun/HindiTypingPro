import React, { useRef, useEffect, useCallback } from 'react';
import { TypingLayout } from '../../types';
import { convertChar } from '../../utils/typingUtils';

interface TypingAreaProps {
  paragraph: string;
  typedText: string;
  currentIndex: number;
  onInput: (value: string) => void;
  isFinished: boolean;
  layout?: TypingLayout;
}

const TypingArea = ({
  paragraph,
  typedText,
  currentIndex,
  onInput,
  isFinished,
  layout = 'KRUTIDEV',
}: TypingAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ref holds the authoritative typed text so handleKeyDown never sees
  // a stale closure value (React re-renders are async; rapid keystrokes
  // would overwrite each other if we only used the prop).
  const typedRef = useRef(typedText);

  // Sync ref from prop ONLY on reset (when parent clears typedText to '').
  // During normal typing the ref is always at or ahead of the prop.
  useEffect(() => {
    if (typedText === '') {
      typedRef.current = '';
    }
  }, [typedText]);

  useEffect(() => {
    if (!isFinished && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isFinished]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (isFinished) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        // Walk back by one Unicode codepoint (handles combining marks correctly)
        const codePoints = [...typedRef.current];
        codePoints.pop();
        const newText = codePoints.join('');
        typedRef.current = newText;
        onInput(newText);
        return;
      }

      // Skip function keys, navigation, and modifier-only events
      if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;

      e.preventDefault();

      // Convert the physical key through the selected layout map.
      // If the key is already a Hindi codepoint (sent by an OS-level Hindi
      // keyboard), it won't appear in the English-keyed map and will be
      // returned unchanged — so both usage modes work without double-conversion.
      const hindiChar = convertChar(e.key, layout);
      const newText = typedRef.current + hindiChar;
      typedRef.current = newText; // update synchronously before React re-renders
      onInput(newText);
    },
    [isFinished, layout, onInput],
  );

  const renderParagraph = () => {
    // Use spread-iterator to split on Unicode codepoints, not UTF-16 units,
    // so Devanagari combining marks are treated as single logical characters.
    const paraChars = [...paragraph.normalize('NFC')];
    const typedChars = [...typedText.normalize('NFC')];

    return paraChars.map((char, i) => {
      let className: string;

      if (i < typedChars.length) {
        className =
          typedChars[i] === char
            ? 'text-green-500 dark:text-green-400'
            : 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded';
      } else if (i === currentIndex) {
        className =
          'text-gray-800 dark:text-gray-100 border-b-2 border-primary-500 animate-cursor-blink';
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

      {/* Hidden textarea captures focus and key events.
          value is kept in sync so the browser's caret/IME state stays clean. */}
      <textarea
        ref={textareaRef}
        value={typedText}
        onChange={() => {
          /* controlled via onKeyDown — onChange is intentionally a no-op */
        }}
        onKeyDown={handleKeyDown}
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
