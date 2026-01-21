'use client';

import Link from 'next/link';
import { parseSmartText } from '@/lib/smart-text';

interface SmartTextProps {
  text: string;
  className?: string;
}

export function SmartText({ text, className = '' }: SmartTextProps) {
  const segments = parseSmartText(text);

  return (
    <span className={className}>
      {segments.map((segment, idx) => {
        if (segment.type === 'link' && segment.href) {
          return (
            <Link
              key={idx}
              href={segment.href}
              className="font-medium text-amber-500 underline decoration-amber-500/30 underline-offset-2 transition-colors hover:text-amber-400 hover:decoration-amber-400"
            >
              {segment.content}
            </Link>
          );
        }
        return <span key={idx}>{segment.content}</span>;
      })}
    </span>
  );
}
