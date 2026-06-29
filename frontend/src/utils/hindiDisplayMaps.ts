// Unicode Devanagari display maps for keyboard visualization.
// These are DISPLAY-ONLY — separate from the typing maps (krutidev/remington
// use legacy ASCII font-encoding for actual input comparison).
//
// Key format: lowercase key id (e.g. 'a') for base char,
//             uppercase key id (e.g. 'A') for shift char.

export const krutidevDisplayMap: Record<string, string> = {
  // Number row — Krutidev keeps digits as-is; shift chars are symbols/matras
  '`': '~',  '~': '~',
  '1': '१',  '!': '!',
  '2': '२',  '@': '॰',
  '3': '३',  '#': '#',
  '4': '४',  '$': '$',
  '5': '५',  '%': '%',
  '6': '६',  '^': '^',
  '7': '७',  '&': '&',
  '8': '८',  '*': '*',
  '9': '९',  '(': '(',
  '0': '०',  ')': ')',
  '-': '-',  '_': '_',
  '=': 'ृ',  '+': '+',

  // QWERTY row
  'q': 'क्ष', 'Q': 'क्ष',
  'w': 'ौ',  'W': 'ऐ',
  'e': 'म',  'E': 'श',
  'r': 'र',  'R': 'ऋ',
  't': 'ट',  'T': 'ठ',
  'y': 'फ',  'Y': 'य़',
  'u': 'ू',  'U': 'ऊ',
  'i': 'ि',  'I': 'ई',
  'o': 'ो',  'O': 'ओ',
  'p': 'प',  'P': 'फ',
  '[': 'ल',  '{': 'ळ',
  ']': '़',  '}': '}',
  '\\': '।', '|': '॥',

  // ASDF row
  'a': 'क',  'A': 'ख',
  's': 'स',  'S': 'ष',
  'd': 'ब',  'D': 'भ',
  'f': 'ट',  'F': 'ठ',
  'g': 'ग',  'G': 'घ',
  'h': 'ह',  'H': 'ख',
  'j': 'ज',  'J': 'झ',
  'k': 'ा',  'K': 'ा',
  'l': 'ल',  'L': 'य',
  ';': ';',  ':': ':',
  "'": 'ं',  '"': 'ँ',

  // ZXCV row
  'z': 'त',  'Z': 'त',
  'x': 'ण',  'X': 'ञ',
  'c': 'च',  'C': 'छ',
  'v': 'न',  'V': 'ण',
  'b': 'व',  'B': 'ब',
  'n': 'ट',  'N': 'ड',
  'm': 'े',  'M': 'श',
  ',': ',',  '<': '<',
  '.': '.',  '>': '।',
  '/': '/',  '?': '?',
};

// Remington Gail has the same key positions as Krutidev 010
// (both are based on the original Remington typewriter layout)
export const remingtonDisplayMap: Record<string, string> = { ...krutidevDisplayMap };

// InScript uses standard Unicode; re-export for uniform access
export { inscriptMap as inscriptDisplayMap } from './inscript';
