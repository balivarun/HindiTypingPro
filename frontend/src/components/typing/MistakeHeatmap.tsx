import React from 'react';
import { TypingLayout } from '../../types';
import { krutidevDisplayMap, remingtonDisplayMap } from '../../utils/hindiDisplayMaps';
import { inscriptMap } from '../../utils/inscript';

interface MistakeHeatmapProps {
  keyMistakes: Record<string, number>;
  layout: TypingLayout;
}

// Compact key sizing (scaled from full keyboard K=52 → K=34, H=60 → H=36, G=4 → G=3)
const K = 34, H = 36, G = 3;

type KD = { id: string; label: string; w: number; mod?: boolean };

const R0: KD[] = [
  { id: '`', label: '`', w: K }, { id: '1', label: '1', w: K }, { id: '2', label: '2', w: K },
  { id: '3', label: '3', w: K }, { id: '4', label: '4', w: K }, { id: '5', label: '5', w: K },
  { id: '6', label: '6', w: K }, { id: '7', label: '7', w: K }, { id: '8', label: '8', w: K },
  { id: '9', label: '9', w: K }, { id: '0', label: '0', w: K }, { id: '-', label: '-', w: K },
  { id: '=', label: '=', w: K }, { id: 'Backspace', label: '←', w: 68, mod: true },
];
const R1: KD[] = [
  { id: 'Tab', label: 'Tab', w: 51, mod: true },
  { id: 'q', label: 'Q', w: K }, { id: 'w', label: 'W', w: K }, { id: 'e', label: 'E', w: K },
  { id: 'r', label: 'R', w: K }, { id: 't', label: 'T', w: K }, { id: 'y', label: 'Y', w: K },
  { id: 'u', label: 'U', w: K }, { id: 'i', label: 'I', w: K }, { id: 'o', label: 'O', w: K },
  { id: 'p', label: 'P', w: K }, { id: '[', label: '[', w: K }, { id: ']', label: ']', w: K },
  { id: '\\', label: '\\', w: 51, mod: true },
];
const R2: KD[] = [
  { id: 'Caps', label: 'Caps', w: 63, mod: true },
  { id: 'a', label: 'A', w: K }, { id: 's', label: 'S', w: K }, { id: 'd', label: 'D', w: K },
  { id: 'f', label: 'F', w: K }, { id: 'g', label: 'G', w: K }, { id: 'h', label: 'H', w: K },
  { id: 'j', label: 'J', w: K }, { id: 'k', label: 'K', w: K }, { id: 'l', label: 'L', w: K },
  { id: ';', label: ';', w: K }, { id: "'", label: "'", w: K },
  { id: 'Enter', label: 'Enter', w: 76, mod: true },
];
const R3: KD[] = [
  { id: 'LShift', label: '⇧', w: 78, mod: true },
  { id: 'z', label: 'Z', w: K }, { id: 'x', label: 'X', w: K }, { id: 'c', label: 'C', w: K },
  { id: 'v', label: 'V', w: K }, { id: 'b', label: 'B', w: K }, { id: 'n', label: 'N', w: K },
  { id: 'm', label: 'M', w: K }, { id: ',', label: ',', w: K }, { id: '.', label: '.', w: K },
  { id: '/', label: '/', w: K },
  { id: 'RShift', label: '⇧', w: 97, mod: true },
];

const ROWS = [R0, R1, R2, R3];

const getDisplayHindi = (id: string, layout: TypingLayout): string => {
  const src =
    layout === 'KRUTIDEV'       ? krutidevDisplayMap
    : layout === 'REMINGTON_GAIL' ? remingtonDisplayMap
    :                               inscriptMap;
  const h = (src as Record<string, string>)[id];
  if (!h || h === id) return '';
  if (!/[ऀ-ॿ]/.test(h)) return '';
  return h;
};

const getMistakeColor = (count: number): string => {
  if (count === 0) return '#f1f5f9';
  if (count <= 2) return '#fef9c3';
  if (count <= 5) return '#fed7aa';
  return '#fee2e2';
};

const MistakeHeatmap = ({ keyMistakes, layout }: MistakeHeatmapProps) => {
  return (
    <div>
      {/* Compact keyboard */}
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: G,
          background: '#cbd5e1',
          borderRadius: 10,
          padding: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
          border: '1px solid #94a3b8',
          overflowX: 'auto',
        }}
      >
        {ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: G }}>
            {row.map((key, ki) => {
              const hindiChar = key.mod ? '' : getDisplayHindi(key.id, layout);
              // Look up mistakes by the Hindi character this key produces
              const mistakeCount = hindiChar ? (keyMistakes[hindiChar] || 0) : 0;
              const bg = key.mod ? '#e2e8f0' : getMistakeColor(mistakeCount);

              return (
                <div
                  key={ki}
                  style={{
                    width: key.w,
                    minWidth: key.w,
                    height: H,
                    background: bg,
                    borderRadius: 5,
                    border: '1px solid #94a3b8',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    cursor: 'default',
                  }}
                >
                  {key.mod ? (
                    <span style={{ fontSize: 9, fontWeight: 600, color: '#64748b' }}>{key.label}</span>
                  ) : (
                    <>
                      {hindiChar && (
                        <span
                          style={{
                            fontFamily: "'Noto Sans Devanagari','Mangal',sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#1e293b',
                            lineHeight: 1,
                          }}
                        >
                          {hindiChar}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 8,
                          color: '#64748b',
                          fontFamily: 'monospace',
                          lineHeight: 1,
                          marginTop: hindiChar ? 2 : 0,
                        }}
                      >
                        {key.label}
                      </span>
                      {/* Mistake count badge */}
                      {mistakeCount > 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 1,
                            right: 2,
                            fontSize: 7,
                            fontWeight: 700,
                            color: '#b45309',
                            lineHeight: 1,
                          }}
                        >
                          {mistakeCount}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {([
          ['#f1f5f9', '#94a3b8', 'No mistakes'],
          ['#fef9c3', '#fde047', 'Few (1–2)'],
          ['#fed7aa', '#fb923c', 'Some (3–5)'],
          ['#fee2e2', '#f87171', 'Many (6+)'],
        ] as [string, string, string][]).map(([bg, border, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: bg,
                border: `1.5px solid ${border}`,
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 11, color: '#64748b' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MistakeHeatmap;
