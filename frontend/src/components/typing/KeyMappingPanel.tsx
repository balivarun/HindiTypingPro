import React from 'react';
import { TypingLayout } from '../../types';
import { krutidevDisplayMap, remingtonDisplayMap } from '../../utils/hindiDisplayMaps';
import { inscriptMap } from '../../utils/inscript';

interface KeyMappingPanelProps {
  layout: TypingLayout;
  pressedKey: string;
  side: 'left' | 'right';
}

const DEVANAGARI_RE = /[ऀ-ॿ]/;

// Left hand: Q-T, A-G, Z-B   |   Right hand: Y-P, H-L, N-M
const ROWS: Record<'left'|'right', { label:string; keys:string[] }[]> = {
  left: [
    { label: 'Q – T', keys: ['q','w','e','r','t'] },
    { label: 'A – G', keys: ['a','s','d','f','g'] },
    { label: 'Z – B', keys: ['z','x','c','v','b'] },
  ],
  right: [
    { label: 'Y – P', keys: ['y','u','i','o','p'] },
    { label: 'H – L', keys: ['h','j','k','l'] },
    { label: 'N – M', keys: ['n','m'] },
  ],
};

export default function KeyMappingPanel({ layout, pressedKey, side }: KeyMappingPanelProps) {
  const src = layout === 'KRUTIDEV'       ? krutidevDisplayMap
            : layout === 'REMINGTON_GAIL' ? remingtonDisplayMap
            :                               inscriptMap;

  const getHindi = (key: string) => {
    const h = src[key];
    return h && DEVANAGARI_RE.test(h) ? h : '';
  };
  const getShift = (key: string) => {
    const h = src[key.toUpperCase()];
    return h && DEVANAGARI_RE.test(h) ? h : '';
  };

  const active = pressedKey.length === 1 ? pressedKey.toLowerCase() : '';
  const rows = ROWS[side];

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '12px 14px',
      width: 175,
      flexShrink: 0,
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      alignSelf: 'flex-start',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#475569',
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>
          {side === 'left' ? '← Left Hand' : 'Right Hand →'}
        </span>
      </div>

      {rows.map(({ label, keys }) => {
        const entries = keys
          .map(k => ({ key: k, hindi: getHindi(k), shift: getShift(k) }))
          .filter(e => e.hindi);

        if (!entries.length) return null;

        return (
          <div key={label} style={{ marginBottom: 8 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, color: '#cbd5e1',
              letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase',
            }}>
              {label}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {entries.map(({ key, hindi, shift }) => {
                const isActive = active === key;
                return (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '3px 7px',
                    borderRadius: 6,
                    background: isActive ? '#eff6ff' : 'transparent',
                    border: `1px solid ${isActive ? '#bfdbfe' : 'transparent'}`,
                    transition: 'all 0.1s ease',
                  }}>
                    {/* English key chip */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, borderRadius: 5,
                      background: isActive ? '#3b82f6' : '#e2e8f0',
                      color: isActive ? '#fff' : '#475569',
                      fontSize: 11, fontWeight: 700,
                      fontFamily: 'monospace',
                      flexShrink: 0,
                      boxShadow: isActive ? 'none' : '0 1px 0 #cbd5e1',
                      transition: 'all 0.1s ease',
                    }}>
                      {key.toUpperCase()}
                    </span>

                    <span style={{ color: '#cbd5e1', fontSize: 10 }}>→</span>

                    {/* Hindi chars: base + shift */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flex: 1 }}>
                      <span style={{
                        fontFamily: "'Noto Sans Devanagari','Mangal',sans-serif",
                        fontSize: 18, fontWeight: 700, lineHeight: 1,
                        color: isActive ? '#1d4ed8' : '#1e293b',
                        transition: 'color 0.1s',
                      }}>{hindi}</span>

                      {shift && shift !== hindi && (
                        <>
                          <span style={{ color: '#e2e8f0', fontSize: 10 }}>/</span>
                          <span style={{
                            fontFamily: "'Noto Sans Devanagari','Mangal',sans-serif",
                            fontSize: 12, fontWeight: 500, lineHeight: 1,
                            color: isActive ? '#93c5fd' : '#94a3b8',
                          }}>{shift}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
