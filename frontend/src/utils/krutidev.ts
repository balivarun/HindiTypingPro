// Krutidev 010 keyboard layout mapping
// Maps English keyboard keys to Hindi Devanagari characters

export const krutidevMap: Record<string, string> = {
  // Row 1 - Numbers row
  '`': '~', '~': '~',
  '1': '1', '!': '!',
  '2': '2', '@': 'à',
  '3': '3', '#': '#',
  '4': '4', '$': '$',
  '5': '5', '%': '%',
  '6': '6', '^': '^',
  '7': '7', '&': '&',
  '8': '8', '*': '*',
  '9': '9', '(': ')',
  '0': '0', ')': '(',

  // Row 2 - QWERTY row
  'q': 'kS', 'Q': 'ks',
  'w': 'es', 'W': 'E',
  'e': 's', 'E': 'S',
  'r': 'j', 'R': 'j',
  't': 'r', 'T': 'R',
  'y': 'ç', 'Y': 'Y',
  'u': 'g', 'U': 'G',
  'i': 'f', 'I': 'f',
  'o': 'v', 'O': 'v',
  'p': 'i', 'P': 'I',
  '[': 'q', '{': 'Q',
  ']': ']', '}': '}',
  '\\': '\\', '|': '|',

  // Row 3 - ASDF row
  'a': 'k', 'A': 'K',
  's': ';s', 'S': 'ls',
  'd': 'b', 'D': 'B',
  'f': 'u', 'F': 'U',
  'g': 'x', 'G': 'X',
  'h': 'g', 'H': 'G',
  'j': 'g', 'J': 'J',
  'k': 'dk', 'K': 'dk',
  'l': 'y', 'L': 'Y',
  ';': ';', ':': ':',
  "'": "'", '"': '"',

  // Row 4 - ZXCV row
  'z': 'T', 'Z': 'B',
  'x': 'N', 'X': 'Þ',
  'c': 'p', 'C': 'P',
  'v': 'o', 'V': 'O',
  'b': 'c', 'B': 'C',
  'n': 'u', 'N': 'U',
  'm': 'e', 'M': 'E',
  ',': ',', '<': '<',
  '.': '.', '>': '>',
  '/': '/', '?': '?',
  ' ': ' ',
};

export const convertToKrutidev = (englishChar: string): string => {
  return krutidevMap[englishChar] || englishChar;
};
