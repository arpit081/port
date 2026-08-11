import { useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type AnimatedTextProps = {
  children: string;
  className?: string;
  style?: CSSProperties;
};

export default function AnimatedText({ children, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const text = children;
  const totalChars = text.length;
  let charIndex = 0;

  const words = text.split(/(\s+)/); // split keeping spaces and newlines as separate tokens

  const wordElements = words.map((word, wIdx) => {
    if (word.trim() === '' && word !== '\n') {
      // It's a space token
      const spaces = [];
      for (let i = 0; i < word.length; i++) {
        const start = charIndex / totalChars;
        const end = start + 1 / totalChars;
        spaces.push(<CharSpan key={`space-${i}`} char={word[i]} scrollYProgress={scrollYProgress} start={start} end={end} />);
        charIndex++;
      }
      return <span key={wIdx}>{spaces}</span>;
    }

    if (word === '\n') {
      charIndex++;
      return <br key={wIdx} />;
    }

    // It's a regular word
    const chars = [];
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const start = charIndex / totalChars;
      const end = start + 1 / totalChars;
      chars.push(
        <CharSpan
          key={i}
          char={char}
          scrollYProgress={scrollYProgress}
          start={start}
          end={end}
        />
      );
      charIndex++;
    }

    return (
      <span key={wIdx} style={{ whiteSpace: 'nowrap' }}>
        {chars}
      </span>
    );
  });

  return (
    <p ref={ref} className={className} style={style}>
      {wordElements}
    </p>
  );
}

type CharSpanProps = {
  char: string;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
  end: number;
};

function CharSpan({ char, scrollYProgress, start, end }: CharSpanProps) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  if (char === ' ') {
    return (
      <span style={{ display: 'inline-block', width: '0.25em' }}>&nbsp;</span>
    );
  }

  if (char === '\n') {
    return <br />;
  }

  return (
    <span style={{ display: 'inline-block', position: 'relative' }}>
      <span style={{ opacity: 0, pointerEvents: 'none' }}>{char}</span>
      <motion.span
        style={{
          opacity,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}
