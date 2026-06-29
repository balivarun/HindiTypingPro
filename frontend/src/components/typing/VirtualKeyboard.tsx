import React from 'react';
import { TypingLayout } from '../../types';
import { krutidevDisplayMap, remingtonDisplayMap } from '../../utils/hindiDisplayMaps';
import { inscriptMap } from '../../utils/inscript';
import { krutidevMap } from '../../utils/krutidev';
import { remingtonMap } from '../../utils/remington';

interface VirtualKeyboardProps {
  pressedKey: string;
  layout: TypingLayout;
  nextChar?: string;
}

type Zone = 'lp'|'lr'|'lm'|'li'|'ri'|'rm'|'rr'|'rp'|'mod';

const ZONE: Record<string, Zone> = {
  '`':'lp','1':'lp','Tab':'lp','q':'lp','Caps':'lp','a':'lp','LShift':'lp','z':'lp',
  '2':'lr','w':'lr','s':'lr','x':'lr',
  '3':'lm','e':'lm','d':'lm','c':'lm',
  '4':'li','5':'li','r':'li','t':'li','f':'li','g':'li','v':'li','b':'li',
  '6':'ri','7':'ri','y':'ri','u':'ri','h':'ri','j':'ri','n':'ri','m':'ri',
  '8':'rm','i':'rm','k':'rm',',':'rm',
  '9':'rr','o':'rr','l':'rr','.':'rr',
  '0':'rp','-':'rp','=':'rp','Backspace':'rp',
  'p':'rp','[':'rp',']':'rp','\\':'rp',
  ';':'rp',"'":'rp','Enter':'rp','/':'rp','RShift':'rp',
  'Space':'mod','Alt':'mod','Ctrl':'mod','Win':'mod',
};

const BG: Record<Zone,string> = {
  lp:'#dbeafe', lr:'#dcfce7', lm:'#fef9c3', li:'#ffedd5',
  ri:'#fce7f3', rm:'#fef9c3', rr:'#dcfce7', rp:'#dbeafe', mod:'#f1f5f9',
};
const BORDER: Record<Zone,string> = {
  lp:'#93c5fd', lr:'#86efac', lm:'#fde047', li:'#fdba74',
  ri:'#f9a8d4', rm:'#fde047', rr:'#86efac', rp:'#93c5fd', mod:'#cbd5e1',
};
const PRESSED_BG: Record<Zone,string> = {
  lp:'#3b82f6', lr:'#22c55e', lm:'#ca8a04', li:'#f97316',
  ri:'#ec4899', rm:'#ca8a04', rr:'#22c55e', rp:'#3b82f6', mod:'#64748b',
};

// Returns the Unicode Devanagari char for display (not for typing)
const getDisplayHindi = (id: string, layout: TypingLayout): string => {
  const src = layout === 'KRUTIDEV'      ? krutidevDisplayMap
            : layout === 'REMINGTON_GAIL'? remingtonDisplayMap
            :                              inscriptMap;
  const h = src[id];
  if (!h || h === id) return '';
  // Filter out non-Devanagari / punctuation-only values
  if (!/[ऀ-ॿ]/.test(h)) return '';
  return h;
};

const getShiftDisplayHindi = (id: string, layout: TypingLayout): string => {
  const upper = id.toUpperCase();
  if (upper === id) return '';
  return getDisplayHindi(upper, layout);
};

// Build reverse map for next-key hint using the TYPING maps (not display maps)
const buildRev = (layout: TypingLayout): Record<string,string> => {
  const src = layout === 'KRUTIDEV'       ? krutidevMap
            : layout === 'REMINGTON_GAIL' ? remingtonMap
            :                               inscriptMap;
  const rev: Record<string,string> = {};
  for (const [e, h] of Object.entries(src))
    if (e.length === 1 && !rev[h]) rev[h] = e;
  return rev;
};

// ── Key sizing ───────────────────────────────────────────────────────────────
// K=52  GAP=4  HEIGHT=60
// All rows sum to 832 px:
//   R0: 13×52 + 104(BSP) + 13×4 = 832
//   R1: 78(Tab) + 12×52 + 78(\) + 13×4 = 832
//   R2: 96(Caps) + 11×52 + 116(Enter) + 12×4 = 832
//   R3: 120(LShift) + 10×52 + 148(RShift) + 11×4 = 832
//   R4: 66+50+56+464(Space)+56+50+66 + 6×4 = 832

const K=52, G=4, H=60;
type KD = { id:string; label:string; w:number; mod?:boolean };

const R0:KD[] = [
  {id:'`',label:'`',w:K},{id:'1',label:'1',w:K},{id:'2',label:'2',w:K},
  {id:'3',label:'3',w:K},{id:'4',label:'4',w:K},{id:'5',label:'5',w:K},
  {id:'6',label:'6',w:K},{id:'7',label:'7',w:K},{id:'8',label:'8',w:K},
  {id:'9',label:'9',w:K},{id:'0',label:'0',w:K},{id:'-',label:'-',w:K},
  {id:'=',label:'=',w:K},{id:'Backspace',label:'← Back',w:104,mod:true},
];
const R1:KD[] = [
  {id:'Tab',label:'Tab',w:78,mod:true},
  {id:'q',label:'Q',w:K},{id:'w',label:'W',w:K},{id:'e',label:'E',w:K},
  {id:'r',label:'R',w:K},{id:'t',label:'T',w:K},{id:'y',label:'Y',w:K},
  {id:'u',label:'U',w:K},{id:'i',label:'I',w:K},{id:'o',label:'O',w:K},
  {id:'p',label:'P',w:K},{id:'[',label:'[',w:K},{id:']',label:']',w:K},
  {id:'\\',label:'\\',w:78,mod:true},
];
const R2:KD[] = [
  {id:'Caps',label:'Caps',w:96,mod:true},
  {id:'a',label:'A',w:K},{id:'s',label:'S',w:K},{id:'d',label:'D',w:K},
  {id:'f',label:'F',w:K},{id:'g',label:'G',w:K},{id:'h',label:'H',w:K},
  {id:'j',label:'J',w:K},{id:'k',label:'K',w:K},{id:'l',label:'L',w:K},
  {id:';',label:';',w:K},{id:"'",label:"'",w:K},
  {id:'Enter',label:'Enter',w:116,mod:true},
];
const R3:KD[] = [
  {id:'LShift',label:'⇧ Shift',w:120,mod:true},
  {id:'z',label:'Z',w:K},{id:'x',label:'X',w:K},{id:'c',label:'C',w:K},
  {id:'v',label:'V',w:K},{id:'b',label:'B',w:K},{id:'n',label:'N',w:K},
  {id:'m',label:'M',w:K},{id:',',label:',',w:K},{id:'.',label:'.',w:K},
  {id:'/',label:'/',w:K},
  {id:'RShift',label:'⇧ Shift',w:148,mod:true},
];
const R4:KD[] = [
  {id:'Ctrl',label:'Ctrl',w:66,mod:true},
  {id:'Win',label:'Win',w:50,mod:true},
  {id:'Alt',label:'Alt',w:56,mod:true},
  {id:'Space',label:'Space',w:464,mod:true},
  {id:'Alt',label:'Alt',w:56,mod:true},
  {id:'Win',label:'Win',w:50,mod:true},
  {id:'Ctrl',label:'Ctrl',w:66,mod:true},
];

const ROWS = [R0, R1, R2, R3, R4];

export default function VirtualKeyboard({ pressedKey, layout, nextChar='' }: VirtualKeyboardProps) {
  const norm = (k: string) => {
    if (!k) return '';
    if (k === ' ') return 'Space';
    if (k === 'Shift') return 'LShift';
    if (k === 'Control') return 'Ctrl';
    if (k === 'CapsLock') return 'Caps';
    if (k === 'Meta') return 'Win';
    return ['Backspace','Enter','Tab','Alt'].includes(k) ? k : k.length===1 ? k.toLowerCase() : k;
  };

  const active = norm(pressedKey);
  const rev    = buildRev(layout);
  const hint   = nextChar === ' ' ? 'Space' : (rev[nextChar] ?? '');

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>

      <div style={{
        display:'inline-flex', flexDirection:'column', gap: G,
        background:'#cbd5e1',
        borderRadius: 14,
        padding: '12px',
        boxShadow: '0 6px 28px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.85)',
        border: '1px solid #94a3b8',
      }}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={{ display:'flex', gap: G }}>
            {row.map((key, ki) => {
              const zone: Zone = ZONE[key.id] ?? 'mod';
              const isActive = active === key.id;
              const isHint   = !isActive && hint === key.id;

              const hindi      = key.mod ? '' : getDisplayHindi(key.id, layout);
              const shiftHindi = key.mod ? '' : getShiftDisplayHindi(key.id, layout);

              const bg          = isActive ? PRESSED_BG[zone] : BG[zone];
              const borderColor = isActive ? PRESSED_BG[zone]
                                : isHint   ? '#d97706'
                                : BORDER[zone];
              const fg          = isActive ? '#fff' : '#1e293b';
              const sub         = isActive ? 'rgba(255,255,255,0.7)' : '#94a3b8';

              return (
                <div key={ki} style={{
                  width: key.w, minWidth: key.w, height: H,
                  background: bg,
                  borderRadius: 7,
                  border: `1.5px solid ${borderColor}`,
                  boxShadow: isActive
                    ? `0 1px 0 rgba(0,0,0,0.2), 0 0 0 3px ${PRESSED_BG[zone]}44`
                    : isHint
                    ? '0 0 0 3px #fbbf24aa, 0 3px 0 rgba(0,0,0,0.14)'
                    : '0 3px 0 rgba(0,0,0,0.13), inset 0 1px 0 rgba(255,255,255,0.85)',
                  transform: isActive ? 'translateY(2px)' : 'none',
                  transition: 'transform 0.06s ease, background 0.06s ease, box-shadow 0.06s ease',
                  position: 'relative',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}>

                  {key.mod ? (
                    /* Modifier key */
                    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:10, fontWeight:600, color: isActive ? '#fff' : '#475569', letterSpacing:0.3 }}>
                        {key.label}
                      </span>
                    </div>

                  ) : hindi ? (
                    /* Character key with Hindi */
                    <div style={{ flex:1, position:'relative' }}>

                      {/* Shift-state Hindi — top left, small */}
                      {shiftHindi && (
                        <span style={{
                          position:'absolute', top:2, left:3,
                          fontFamily:"'Noto Sans Devanagari','Mangal',sans-serif",
                          fontSize:9, lineHeight:1, fontWeight:600,
                          color: sub, userSelect:'none',
                        }}>{shiftHindi}</span>
                      )}

                      {/* Main Hindi — large, centered */}
                      <div style={{
                        position:'absolute', inset:0,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        paddingBottom:6,
                      }}>
                        <span style={{
                          fontFamily:"'Noto Sans Devanagari','Mangal',sans-serif",
                          fontSize:20, fontWeight:700, lineHeight:1,
                          color: fg, userSelect:'none',
                        }}>{hindi}</span>
                      </div>

                      {/* English key — bottom right, tiny */}
                      <span style={{
                        position:'absolute', bottom:2, right:3,
                        fontSize:9, fontWeight:700, lineHeight:1,
                        color: sub, fontFamily:'monospace', userSelect:'none',
                      }}>{key.label}</span>
                    </div>

                  ) : (
                    /* Number / symbol key with no Hindi mapping */
                    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:14, fontWeight:700, color: fg, fontFamily:'monospace' }}>
                        {key.label}
                      </span>
                    </div>
                  )}

                  {/* Hint pulsing border */}
                  {isHint && (
                    <span style={{
                      position:'absolute', inset:2, borderRadius:5, pointerEvents:'none',
                      border:'2px solid #fbbf24',
                      animation:'kbpulse 1s ease-in-out infinite',
                    }}/>
                  )}
                  {/* Active inner ring */}
                  {isActive && (
                    <span style={{
                      position:'absolute', inset:2, borderRadius:5, pointerEvents:'none',
                      border:'2px solid rgba(255,255,255,0.5)',
                    }}/>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:12, marginTop:10, flexWrap:'wrap', justifyContent:'center' }}>
        {([
          ['lp','#dbeafe','#93c5fd','L. Pinky'],
          ['lr','#dcfce7','#86efac','Ring'],
          ['lm','#fef9c3','#fde047','Middle'],
          ['li','#ffedd5','#fdba74','L. Index'],
          ['ri','#fce7f3','#f9a8d4','R. Index'],
        ] as [string,string,string,string][]).map(([,bg,bdr,label])=>(
          <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:13, height:13, borderRadius:3, background:bg, display:'inline-block', border:`1.5px solid ${bdr}` }}/>
            <span style={{ fontSize:11, color:'#64748b' }}>{label}</span>
          </div>
        ))}
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:13, height:13, borderRadius:3, background:'#fff', display:'inline-block', border:'2px solid #fbbf24' }}/>
          <span style={{ fontSize:11, color:'#64748b' }}>Next key</span>
        </div>
      </div>

      <style>{`@keyframes kbpulse{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
    </div>
  );
}
