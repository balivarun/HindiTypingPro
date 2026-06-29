// Remington Gail keyboard layout mapping
// Standard Remington Gail layout used in SSC, HSSC, Court exams

export const remingtonMap: Record<string, string> = {
  // Vowels and matras
  'q': 'kS', 'Q': 'ks',
  'w': 'S', 'W': 'S',
  'e': 's', 'E': 'l',
  'r': 'j', 'R': 'j',
  't': 'r', 'T': 'R',
  'y': 'ç', 'Y': 'Z',
  'u': 'g', 'U': 'x',
  'i': 'f', 'I': 'h',
  'o': 'v', 'O': 'n',
  'p': 'i', 'P': 'I',
  '[': 'q', '{': 'Q',
  ']': 'Ó', '}': '}',

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

export const convertToRemington = (englishChar: string): string => {
  return remingtonMap[englishChar] || englishChar;
};
