import React from 'react';
import { TypingLayout } from '../../types';
import { krutidevMap } from '../../utils/krutidev';
import { remingtonMap } from '../../utils/remington';
import { inscriptMap } from '../../utils/inscript';

interface VirtualKeyboardProps {
  pressedKey: string;
  layout: TypingLayout;
  nextChar?: string;
}

type Zone = 'lp'|'lr'|'lm'|'li'|'ri'|'rm'|'rr'|'rp'|'th';

const ZONE: Record<string, Zone> = {
  '`':'lp','1':'lp','Tab':'lp','q':'lp','Caps':'lp','a':'lp','LShift':'lp','z':'lp','Ctrl':'lp',
  '2':'lr','w':'lr','s':'lr','x':'lr',
  '3':'lm','e':'lm','d':'lm','c':'lm',
  '4':'li','5':'li','r':'li','t':'li','f':'li','g':'li','v':'li','b':'li',
  '6':'ri','7':'ri','y':'ri','u':'ri','h':'ri','j':'ri','n':'ri','m':'ri',
  '8':'rm','i':'rm','k':'rm',',':'rm',
  '9':'rr','o':'rr','l':'rr','.':'rr',
  '0':'rp','-':'rp','=':'rp','Backspace':'rp',
  'p':'rp','[':'rp',']':'rp','\\':'rp',
  ';':'rp',"'":'rp','Enter':'rp','/':'rp','RShift':'rp',
  'Space':'th','Alt':'th',
};

const BG:  Record<Zone,string> = { lp:'#2e7d32',lr:'#558b2f',lm:'#827717',li:'#bf360c',ri:'#880e4f',rm:'#827717',rr:'#558b2f',rp:'#2e7d32',th:'#6a1b9a' };
const LIT: Record<Zone,string> = { lp:'#4caf50',lr:'#8bc34a',lm:'#cddc39',li:'#ff7043',ri:'#e91e63',rm:'#cddc39',rr:'#8bc34a',rp:'#4caf50',th:'#ab47bc' };

const getHindi = (id: string, layout: TypingLayout) => {
  const src = layout==='KRUTIDEV'?krutidevMap:layout==='REMINGTON_GAIL'?remingtonMap:inscriptMap;
  const h = src[id];
  return (!h||h===id) ? '' : h.length>2 ? h.slice(0,2) : h;
};

const buildRev = (layout: TypingLayout) => {
  const src = layout==='KRUTIDEV'?krutidevMap:layout==='REMINGTON_GAIL'?remingtonMap:inscriptMap;
  const rev: Record<string,string> = {};
  for (const [e,h] of Object.entries(src)) if (e.length===1 && !rev[h]) rev[h]=e;
  return rev;
};

// ── Key definitions ─────────────────────────────────────────────────────────
// All rows share the same total pixel width. Stagger is achieved purely by
// wider left modifier keys (Tab → 1.5u, Caps → 1.75u, Shift → 2.4u).
// KEY=44px  GAP=4px  → 1u = 48px
// Total row width = 14 × 44 + 13 × 4 = 668px for 14-key rows.
// We target 718px (accounts for wider Backspace / Enter / Shifts).

const G = 4;  // gap
const K = 44; // standard key width

// Each row: keys sum + (n-1)×GAP = TARGET_W
const TARGET = 13*K + 12*G + 96;  // 572 + 48 + 96 = 716px (Backspace=96)

type KD = { id:string; label:string; w:number; isModifier?:boolean };

// Row 0: 13 regular + Backspace; total = 13K + 12G + BSP = TARGET → BSP = TARGET - 13K - 12G = 96
const R0: KD[] = [
  {id:'`',label:'` ~',w:K},{id:'1',label:'1',w:K},{id:'2',label:'2',w:K},
  {id:'3',label:'3',w:K},{id:'4',label:'4',w:K},{id:'5',label:'5',w:K},
  {id:'6',label:'6',w:K},{id:'7',label:'7',w:K},{id:'8',label:'8',w:K},
  {id:'9',label:'9',w:K},{id:'0',label:'0',w:K},{id:'-',label:'- _',w:K},
  {id:'=',label:'= +',w:K},{id:'Backspace',label:'⌫ Back',w:96,isModifier:true},
];

// Row 1: Tab + 12 regular + \; total = Tab + 12K + 11G + \ + G + G = TARGET
// Tab + \ = TARGET - 12K - 13G = 716 - 528 - 52 = 136 → Tab=68, \=68
const R1: KD[] = [
  {id:'Tab',label:'Tab',w:68,isModifier:true},
  {id:'q',label:'Q',w:K},{id:'w',label:'W',w:K},{id:'e',label:'E',w:K},
  {id:'r',label:'R',w:K},{id:'t',label:'T',w:K},{id:'y',label:'Y',w:K},
  {id:'u',label:'U',w:K},{id:'i',label:'I',w:K},{id:'o',label:'O',w:K},
  {id:'p',label:'P',w:K},{id:'[',label:'[ {',w:K},{id:']',label:'] }',w:K},
  {id:'\\',label:'\\ |',w:68,isModifier:true},
];

// Row 2: Caps + 11 regular + Enter; total = Caps + 11K + 10G + Enter + 2G = TARGET
// Caps + Enter = TARGET - 11K - 12G = 716 - 484 - 48 = 184 → Caps=80, Enter=104
const R2: KD[] = [
  {id:'Caps',label:'Caps',w:80,isModifier:true},
  {id:'a',label:'A',w:K},{id:'s',label:'S',w:K},{id:'d',label:'D',w:K},
  {id:'f',label:'F',w:K},{id:'g',label:'G',w:K},{id:'h',label:'H',w:K},
  {id:'j',label:'J',w:K},{id:'k',label:'K',w:K},{id:'l',label:'L',w:K},
  {id:';',label:'; :',w:K},{id:"'",label:"' \"",w:K},
  {id:'Enter',label:'Enter ↵',w:104,isModifier:true},
];

// Row 3: LShift + 10 regular + RShift; total = LShift + 10K + 9G + RShift + 2G = TARGET
// LShift + RShift = TARGET - 10K - 11G = 716 - 440 - 44 = 232 → LShift=112, RShift=120
const R3: KD[] = [
  {id:'LShift',label:'Shift',w:112,isModifier:true},
  {id:'z',label:'Z',w:K},{id:'x',label:'X',w:K},{id:'c',label:'C',w:K},
  {id:'v',label:'V',w:K},{id:'b',label:'B',w:K},{id:'n',label:'N',w:K},
  {id:'m',label:'M',w:K},{id:',',label:', <',w:K},{id:'.',label:'. >',w:K},
  {id:'/',label:'/ ?',w:K},
  {id:'RShift',label:'Shift',w:120,isModifier:true},
];

// Row 4: Ctrl + Alt + Space + Alt + Ctrl; total = 2Ctrl + 2Alt + Space + 4G = TARGET
// Space = TARGET - 2×60 - 2×52 - 4G = 716 - 120 - 104 - 16 = 476
const R4: KD[] = [
  {id:'Ctrl',label:'Ctrl',w:60,isModifier:true},
  {id:'Alt',label:'Alt',w:52,isModifier:true},
  {id:'Space',label:'S P A C E',w:476,isModifier:true},
  {id:'Alt',label:'Alt',w:52,isModifier:true},
  {id:'Ctrl',label:'Ctrl',w:60,isModifier:true},
];

const ROWS = [R0,R1,R2,R3,R4];

// ── Component ────────────────────────────────────────────────────────────────
export default function VirtualKeyboard({ pressedKey, layout, nextChar='' }: VirtualKeyboardProps) {
  const norm = (k: string) => {
    if (!k) return '';
    if (k===' ') return 'Space';
    if (k==='Shift') return 'LShift';
    if (k==='Control') return 'Ctrl';
    if (k==='CapsLock') return 'Caps';
    return ['Backspace','Enter','Tab','Alt'].includes(k) ? k : k.length===1 ? k.toLowerCase() : k;
  };

  const active = norm(pressedKey);
  const rev    = buildRev(layout);
  const hint   = nextChar===' ' ? 'Space' : (rev[nextChar] ?? '');

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      {/* Keyboard body — no hard background, rounded border only */}
      <div style={{
        display:'inline-flex', flexDirection:'column', gap: G,
        background:'#1a1a1a', borderRadius:14,
        padding:'12px 12px 8px', border:'1px solid rgba(255,255,255,0.08)',
      }}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={{ display:'flex', gap: G }}>
            {row.map((key, ki) => {
              const zone: Zone = ZONE[key.id] ?? 'rp';
              const isActive = active === key.id;
              const isHint   = !isActive && hint === key.id;
              const hindi    = key.isModifier ? '' : getHindi(key.id, layout);

              const bg = isActive ? LIT[zone] : BG[zone];

              return (
                <div key={ki} style={{
                  width: key.w, minWidth: key.w, height: 46,
                  background: bg,
                  borderRadius: 7,
                  border: isActive ? '2px solid #90caf9'
                        : isHint   ? '2px solid #ffd54f'
                        : '1px solid rgba(0,0,0,0.35)',
                  boxShadow: isActive
                    ? '0 0 12px rgba(144,202,249,0.55), 0 1px 0 rgba(0,0,0,0.3)'
                    : isHint
                    ? '0 0 10px rgba(255,213,79,0.45), 0 3px 0 rgba(0,0,0,0.4)'
                    : '0 3px 0 rgba(0,0,0,0.4)',
                  transform: isActive ? 'translateY(2px) scale(0.94)' : 'none',
                  transition: 'all 0.08s ease',
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  position:'relative', overflow:'hidden', cursor:'default',
                }}>
                  {/* Circle glow */}
                  {(isActive||isHint) && (
                    <span style={{
                      position:'absolute', top:3, left:3, right:3, bottom:3,
                      borderRadius:'50%',
                      border: `2px solid ${isActive?'#90caf9':'#ffd54f'}`,
                      background: isActive?'rgba(144,202,249,0.12)':'rgba(255,213,79,0.08)',
                    }}/>
                  )}
                  {/* Hindi char */}
                  {hindi && (
                    <span style={{
                      fontFamily:"'Noto Sans Devanagari',sans-serif",
                      fontSize:9, lineHeight:1, marginBottom:2,
                      color: isActive?'#fff':'rgba(255,255,255,0.55)', zIndex:1,
                    }}>{hindi}</span>
                  )}
                  {/* Label */}
                  <span style={{
                    fontSize: key.isModifier ? 10 : 12,
                    fontWeight:700, zIndex:1, lineHeight:1,
                    letterSpacing: key.isModifier ? 0.4 : 0,
                    color: isActive?'#fff':'rgba(255,255,255,0.92)',
                    textTransform: key.isModifier ? 'uppercase' : undefined,
                  }}>{key.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:14, marginTop:8, justifyContent:'center', flexWrap:'wrap' }}>
        {([['lp','Left Pinky'],['lr','Ring'],['lm','Middle'],['li','Index'],['ri','R. Index'],['th','Thumb']] as [Zone,string][]).map(([z,l])=>(
          <div key={z} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:11, height:11, borderRadius:3, background:BG[z], display:'inline-block', border:'1px solid rgba(255,255,255,0.15)' }}/>
            <span style={{ fontSize:10, color:'#9ca3af' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
