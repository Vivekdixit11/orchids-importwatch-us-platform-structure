import { violationCodes } from './mock-data';

export interface TextSegment {
  type: 'text' | 'link';
  content: string;
  href?: string;
}

export function parseSmartText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let remainingText = text;
  
  const patterns = Object.values(violationCodes).map(v => ({
    pattern: new RegExp(`(${v.code.replace(/[()]/g, '\\$&')})`, 'gi'),
    slug: v.slug,
    code: v.code,
  }));

  let lastIndex = 0;
  const matches: { index: number; length: number; code: string; slug: string }[] = [];

  patterns.forEach(({ pattern, slug, code }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        code: match[0],
        slug,
      });
    }
  });

  matches.sort((a, b) => a.index - b.index);

  const uniqueMatches = matches.filter((match, index, arr) => {
    if (index === 0) return true;
    return match.index >= arr[index - 1].index + arr[index - 1].length;
  });

  uniqueMatches.forEach(match => {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: 'link',
      content: match.code,
      href: `/violation/${match.slug}`,
    });
    lastIndex = match.index + match.length;
  });

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }];
}
