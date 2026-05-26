import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  isInView: boolean;
  speed?: number;
  className?: string;
  showCursor?: boolean;
}

export default function TypewriterText({
  text,
  isInView,
  speed = 40,
  className = '',
  showCursor = true,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isInView || hasStarted) return;
    setHasStarted(true);
  }, [isInView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [hasStarted, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && hasStarted && !isComplete && (
        <span className="animate-blink text-space-accent">_</span>
      )}
      {showCursor && isComplete && (
        <span className="animate-blink text-space-accent opacity-50">_</span>
      )}
    </span>
  );
}
