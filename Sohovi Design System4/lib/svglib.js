/* Sohovi SVG helper library.
   Loaded inside run_script via:  const L = new Function(await readFile('lib/svglib.js'))();
   Returns an object of builder functions. All builders return SVG-string fragments. */

const P = {
  cream:  '#F4F4F5',
  ink:    '#0A0A0A',
  blue:   '#2D7FF9',
  mint:   '#00C9A7',
  butter: '#FFE439',
  white:  '#FFFFFF',
  hair:   '#E2E8F2',
  gray:   '#8A8F98'
};
const FONT = "Inter, 'DM Sans', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, monospace";

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// tint a hex color toward white by amount 0..1 -> returns rgba-ish via fill+opacity not ideal; produce hex mix
function mix(hex, t){ // mix hex with white by t (0=hex,1=white)
  const c = hex.replace('#',''); const r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16);
  const m=(x)=>Math.round(x+(255-x)*t).toString(16).padStart(2,'0');
  return '#'+m(r)+m(g)+m(b);
}

function svg(w,h,body,opts){
  opts = opts||{};
  const bg = opts.bg===undefined ? P.cream : opts.bg;
  const bgRect = bg==='none' ? '' : `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`
    + `<defs>`
    + `<style>text{font-family:${FONT};} .mono{font-family:${MONO};}</style>`
    + `<marker id="ah" markerWidth="10" markerHeight="10" refX="7.5" refY="4.5" orient="auto"><path d="M0,0.5 L9,4.5 L0,8.5" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>`
    + `<marker id="ahb" markerWidth="10" markerHeight="10" refX="7.5" refY="4.5" orient="auto"><path d="M0,0.5 L9,4.5 L0,8.5" fill="none" stroke="${P.blue}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker>`
    + (opts.defs||'')
    + `</defs>`
    + bgRect + body + `</svg>`;
}

function rrect(x,y,w,h,o){ o=o||{};
  const fill=o.fill===undefined?P.white:o.fill;
  const stroke=o.stroke===undefined?P.ink:o.stroke;
  const sw=o.sw===undefined?1.5:o.sw;
  const r=o.r===undefined?8:o.r;
  const dash=o.dash?` stroke-dasharray="${o.dash}"`:'';
  const op=o.opacity!==undefined?` opacity="${o.opacity}"`:'';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}${op}/>`;
}

function text(x,y,s,o){ o=o||{};
  const size=o.size||14, fill=o.fill||P.ink, weight=o.weight||400;
  const anchor=o.anchor||'middle';
  const ff=o.mono?MONO:FONT;
  const ls=o.ls?` letter-spacing="${o.ls}"`:'';
  const baseline=o.baseline||'middle';
  // font-family set as a direct attribute (SVG <style> blocks get stripped by the file sanitizer)
  return `<text x="${x}" y="${y}" font-family="${ff}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}" dominant-baseline="${baseline}"${ls}>${esc(s)}</text>`;
}

// multi-line centered text (lines: string or array; supports '\n')
function mtext(x,y,lines,o){ o=o||{};
  if(!Array.isArray(lines)) lines=String(lines).split('\n');
  const size=o.size||14, gap=o.gap===undefined?5:o.gap, lh=size+gap;
  const start=y-(lines.length-1)*lh/2;
  return lines.map((l,i)=>text(x,start+i*lh,l,o)).join('');
}

function line(x1,y1,x2,y2,o){ o=o||{};
  const stroke=o.stroke||P.ink, sw=o.sw===undefined?1.5:o.sw;
  const dash=o.dash?` stroke-dasharray="${o.dash}"`:'';
  const cap=o.cap?` stroke-linecap="${o.cap}"`:'';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${dash}${cap}/>`;
}

function arrow(x1,y1,x2,y2,o){ o=o||{};
  const stroke=o.stroke||P.ink, sw=o.sw===undefined?1.5:o.sw;
  const dash=o.dash?` stroke-dasharray="${o.dash}"`:'';
  const head=o.head||(stroke===P.blue?'ahb':'ah');
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${dash} marker-end="url(#${head})" stroke-linecap="round"/>`;
}

// centered rounded box with label (string|array). auto picks text color for dark fills.
function box(cx,cy,w,h,label,o){ o=o||{};
  const fill=o.fill===undefined?P.white:o.fill;
  const dark = (fill===P.ink||fill===P.blue||fill===P.mint);
  const textFill=o.textFill|| (dark?P.white:P.ink);
  const out = rrect(cx-w/2,cy-h/2,w,h,{fill,stroke:o.stroke===undefined?P.ink:o.stroke,sw:o.sw===undefined?1.5:o.sw,r:o.r===undefined?8:o.r,dash:o.dash});
  const tf = mtext(cx,cy+(o.dy||0),label,{size:o.size||15,weight:o.weight||600,fill:textFill,gap:o.gap||5});
  return out+tf;
}

function diamond(cx,cy,w,h,label,o){ o=o||{};
  const fill=o.fill===undefined?P.blue:o.fill;
  const dark=(fill===P.ink||fill===P.blue||fill===P.mint);
  const tf=o.textFill||(dark?P.white:P.ink);
  const pts=`${cx},${cy-h/2} ${cx+w/2},${cy} ${cx},${cy+h/2} ${cx-w/2},${cy}`;
  return `<polygon points="${pts}" fill="${fill}" stroke="${o.stroke||P.ink}" stroke-width="${o.sw||1.5}"/>`+mtext(cx,cy,label,{size:o.size||13,weight:600,fill:tf});
}

function circle(cx,cy,r,o){ o=o||{};
  const fill=o.fill===undefined?P.white:o.fill, stroke=o.stroke===undefined?P.ink:o.stroke, sw=o.sw===undefined?1.5:o.sw;
  const dash=o.dash?` stroke-dasharray="${o.dash}"`:'';
  const op=o.opacity!==undefined?` opacity="${o.opacity}"`:'';
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash}${op}/>`;
}

function nodeCircle(cx,cy,r,label,o){ o=o||{};
  const fill=o.fill===undefined?P.white:o.fill;
  const dark=(fill===P.ink||fill===P.blue||fill===P.mint);
  const tf=o.textFill||(dark?P.white:P.ink);
  return circle(cx,cy,r,{fill,stroke:o.stroke,sw:o.sw})+mtext(cx,cy,label,{size:o.size||14,weight:o.weight||600,fill:tf,gap:3});
}

function badge(cx,cy,label,o){ o=o||{};
  const fill=o.fill===undefined?P.blue:o.fill, size=o.size||12;
  const dark=(fill===P.ink||fill===P.blue||fill===P.mint);
  const tf=o.textFill||(dark?P.white:P.ink);
  const w=o.w|| (String(label).length*size*0.64+26), h=o.h||(size+14);
  const stroke=o.stroke||'none', sw=stroke==='none'?0:(o.sw||1.5);
  return rrect(cx-w/2,cy-h/2,w,h,{fill,stroke,sw,r:h/2})+text(cx,cy,label,{size,weight:700,fill:tf});
}

function check(cx,cy,o){ o=o||{}; const s=o.s||22, c=o.color||P.mint;
  return `<path d="M${cx-s*0.34},${cy+s*0.02} l${s*0.22},${s*0.24} l${s*0.46},${-s*0.52}" fill="none" stroke="${c}" stroke-width="${o.sw||s*0.16}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function xmark(cx,cy,o){ o=o||{}; const s=o.s||22, c=o.color||P.ink, k=s*0.3;
  return `<path d="M${cx-k},${cy-k} L${cx+k},${cy+k} M${cx+k},${cy-k} L${cx-k},${cy+k}" stroke="${c}" stroke-width="${o.sw||s*0.16}" stroke-linecap="round"/>`;
}

// shield with check inside
function shield(cx,cy,o){ o=o||{}; const s=o.s||26, c=o.color||P.blue, w=s*0.78,h=s;
  const top=cy-h/2;
  const d=`M${cx},${top} L${cx+w/2},${top+h*0.18} L${cx+w/2},${top+h*0.55} Q${cx+w/2},${top+h*0.92} ${cx},${cy+h/2} Q${cx-w/2},${top+h*0.92} ${cx-w/2},${top+h*0.55} L${cx-w/2},${top+h*0.18} Z`;
  const fillShield = o.filled!==false;
  return `<path d="${d}" fill="${fillShield?c:'none'}" stroke="${c}" stroke-width="${o.sw||1.6}"/>`
    + (o.check!==false? check(cx,cy,{s:s*0.5,color:fillShield?P.white:c,sw:s*0.09}):'');
}

function cylinder(cx,cy,w,h,o){ o=o||{}; const fill=o.fill===undefined?P.ink:o.fill, stroke=o.stroke||(fill===P.white?P.ink:fill), sw=o.sw||1.5;
  const rx=w/2, ry=Math.min(14,h*0.16); const top=cy-h/2, bot=cy+h/2;
  const body=`<path d="M${cx-rx},${top} L${cx-rx},${bot} A${rx},${ry} 0 0 0 ${cx+rx},${bot} L${cx+rx},${top}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const topE=`<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const dark=(fill===P.ink||fill===P.blue||fill===P.mint);
  const tf=o.textFill||(dark?P.white:P.ink);
  const lbl=o.label?mtext(cx,cy+ry*0.5,o.label,{size:o.size||14,weight:600,fill:tf,gap:3}):'';
  return body+topE+lbl;
}

// hatched fill rect (diagonal lines) — used for "bad"/quarantine
function hatch(x,y,w,h,o){ o=o||{}; const c=o.color||P.ink, gap=o.gap||9, sw=o.sw||1;
  const id='h'+Math.random().toString(36).slice(2,8);
  const pat=`<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="${gap}" stroke="${c}" stroke-width="${sw}"/></pattern>`;
  const r=o.r===undefined?8:o.r;
  return `<defs>${pat}</defs><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${id})" opacity="${o.opacity||0.9}"/>`
    + (o.stroke!==false?`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${o.strokeColor||P.ink}" stroke-width="1.5"/>`:'');
}

// generic data table. cols:[{label,w,align}], rows:[[{t,...cellopts}|string]], header style
function table(x,y,cols,rows,o){ o=o||{};
  const rowH=o.rowH||44, headH=o.headH||rowH, pad=o.pad||16, size=o.size||14;
  const totalW=cols.reduce((a,c)=>a+c.w,0);
  const totalH=headH+rows.length*rowH;
  let out='';
  // header
  const headFill=o.headFill||P.ink, headText=o.headText|| (headFill===P.white||headFill===P.cream?P.ink:P.white);
  let cx=x;
  out += `<rect x="${x}" y="${y}" width="${totalW}" height="${headH}" fill="${headFill}" rx="0"/>`;
  cols.forEach(c=>{
    const align=c.align||'left';
    const tx= align==='left'? cx+pad : align==='right'? cx+c.w-pad : cx+c.w/2;
    out += text(tx,y+headH/2,c.label,{size,weight:700,fill:headText,anchor:align==='center'?'middle':(align==='right'?'end':'start')});
    cx+=c.w;
  });
  // rows
  rows.forEach((row,ri)=>{
    const ry=y+headH+ri*rowH;
    const rowOpt=row.__row||{};
    const zebra = ri%2===1 ? (o.zebra||P.cream) : P.white;
    const rfill = rowOpt.fill || zebra;
    out += `<rect x="${x}" y="${ry}" width="${totalW}" height="${rowH}" fill="${rfill}"/>`;
    if(rowOpt.leftBorder) out += `<rect x="${x}" y="${ry}" width="4" height="${rowH}" fill="${rowOpt.leftBorder}"/>`;
    let ccx=x;
    cols.forEach((c,ci)=>{
      let cell=row[ci]; if(cell===undefined||cell===null) cell='';
      const co= (typeof cell==='object')?cell:{t:cell};
      const align=co.align||c.align||'left';
      const tx= align==='left'? ccx+pad : align==='right'? ccx+c.w-pad : ccx+c.w/2;
      const cfill= co.fill || (rowOpt.fill && (rowOpt.fill===P.ink||rowOpt.fill===P.blue||rowOpt.fill===P.mint)?P.white:P.ink);
      if(co.cellFill) out+=`<rect x="${ccx+3}" y="${ry+4}" width="${c.w-6}" height="${rowH-8}" rx="5" fill="${co.cellFill}"/>`;
      if(co.t!=='') out += text(tx,ry+rowH/2,co.t,{size:co.size||size,weight:co.weight||(ci===0?600:400),fill:cfill,anchor:align==='center'?'middle':(align==='right'?'end':'start'),mono:co.mono});
      if(co.after) out += co.after(ccx,ry,c.w,rowH);
      ccx+=c.w;
    });
    // row separators
    if(ri>0) out += line(x,ry,x+totalW,ry,{stroke:P.hair,sw:1});
  });
  // outer border + column separators optional
  out += `<rect x="${x}" y="${y}" width="${totalW}" height="${totalH}" rx="${o.r===undefined?10:o.r}" fill="none" stroke="${o.border||P.ink}" stroke-width="1.5"/>`;
  // clip top corners of header by overlaying rounded border already; header square corners acceptable
  return out;
}

// horizontal bar (for charts)
function hbar(x,y,w,h,fill,o){ o=o||{}; return rrect(x,y,w,h,{fill,stroke:o.stroke||'none',sw:o.stroke?1.5:0,r:o.r===undefined?4:o.r,opacity:o.opacity}); }

// title text top-left of a diagram
function title(x,y,s,o){ o=o||{}; return text(x,y,s,{size:o.size||20,weight:700,fill:o.fill||P.ink,anchor:'start'}); }
function kicker(x,y,s,o){ o=o||{}; return text(x,y,s,{size:o.size||13,weight:700,fill:o.fill||P.blue,anchor:'start',ls:1.5}); }

// small line-art icons (24px nominal) centered at cx,cy
function icon(name,cx,cy,o){ o=o||{}; const s=o.s||22, c=o.color||P.ink, sw=o.sw||1.6; const k=s/2;
  const g=(d,extra)=>`<g fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
  switch(name){
    case 'gear': {
      const teeth=[]; for(let i=0;i<8;i++){const a=i*Math.PI/4; teeth.push(`<line x1="${cx+Math.cos(a)*k*0.62}" y1="${cy+Math.sin(a)*k*0.62}" x2="${cx+Math.cos(a)*k}" y2="${cy+Math.sin(a)*k}"/>`);} 
      return g(`<circle cx="${cx}" cy="${cy}" r="${k*0.5}"/>${teeth.join('')}`);
    }
    case 'bell': return g(`<path d="M${cx-k*0.55},${cy+k*0.35} h${k*1.1} a${k*0.55},${k*0.55} 0 0 0 ${-k*0.18},${-k*0.35} v${-k*0.2} a${k*0.37},${k*0.37} 0 0 0 ${-k*0.74},0 v${k*0.2} a${k*0.55},${k*0.55} 0 0 0 ${-k*0.18},${k*0.35} Z"/><path d="M${cx-k*0.18},${cy+k*0.55} a${k*0.18},${k*0.18} 0 0 0 ${k*0.36},0"/>`);
    case 'clock': return g(`<circle cx="${cx}" cy="${cy}" r="${k*0.85}"/><path d="M${cx},${cy-k*0.45} V${cy} L${cx+k*0.35},${cy+k*0.2}"/>`);
    case 'search': { const r=k*0.55, ox=cx-k*0.12, oy=cy-k*0.12; return g(`<circle cx="${ox}" cy="${oy}" r="${r}"/><line x1="${ox+r*0.72}" y1="${oy+r*0.72}" x2="${cx+k*0.7}" y2="${cy+k*0.7}"/>`); }
    case 'wrench': return g(`<path d="M${cx+k*0.6},${cy-k*0.6} a${k*0.42},${k*0.42} 0 1 0 -${k*0.55},${k*0.78} l-${k*0.55},${k*0.55} l${k*0.3},${k*0.3} l${k*0.55},-${k*0.55} a${k*0.42},${k*0.42} 0 0 0 ${k*0.78},-${k*0.55} l-${k*0.42},${k*0.42} l-${k*0.4},-${k*0.1} l-${k*0.1},-${k*0.4} Z"/>`);
    case 'spark': { const a=`M${cx},${cy-k} C${cx+k*0.18},${cy-k*0.18} ${cx+k*0.18},${cy-k*0.18} ${cx+k},${cy} C${cx+k*0.18},${cy+k*0.18} ${cx+k*0.18},${cy+k*0.18} ${cx},${cy+k} C${cx-k*0.18},${cy+k*0.18} ${cx-k*0.18},${cy+k*0.18} ${cx-k},${cy} C${cx-k*0.18},${cy-k*0.18} ${cx-k*0.18},${cy-k*0.18} ${cx},${cy-k} Z`; return `<path d="${a}" fill="${o.fill||c}" stroke="none"/>`; }
    case 'flag': return g(`<line x1="${cx-k*0.5}" y1="${cy-k*0.7}" x2="${cx-k*0.5}" y2="${cy+k*0.8}"/><path d="M${cx-k*0.5},${cy-k*0.6} h${k*0.95} l-${k*0.25},${k*0.35} l${k*0.25},${k*0.35} h${-k*0.95} Z" fill="${o.fill||'none'}"/>`);
    case 'warn': return g(`<path d="M${cx},${cy-k*0.8} L${cx+k*0.85},${cy+k*0.7} H${cx-k*0.85} Z"/><line x1="${cx}" y1="${cy-k*0.15}" x2="${cx}" y2="${cy+k*0.25}"/><circle cx="${cx}" cy="${cy+k*0.5}" r="0.8" fill="${c}" stroke="none"/>`);
    case 'play': return `<path d="M${cx-k*0.4},${cy-k*0.6} L${cx+k*0.6},${cy} L${cx-k*0.4},${cy+k*0.6} Z" fill="${o.fill||c}" stroke="none"/>`;
    case 'doc': return g(`<path d="M${cx-k*0.55},${cy-k*0.8} h${k*0.75} l${k*0.35},${k*0.35} v${k*1.25} h${-k*1.1} Z"/><line x1="${cx-k*0.3}" y1="${cy-k*0.1}" x2="${cx+k*0.35}" y2="${cy-k*0.1}"/><line x1="${cx-k*0.3}" y1="${cy+k*0.25}" x2="${cx+k*0.35}" y2="${cy+k*0.25}"/>`);
    case 'wave': return g(`<path d="M${cx-k*0.85},${cy} q${k*0.42},${-k*0.7} ${k*0.85},0 q${k*0.42},${k*0.7} ${k*0.85},0"/>`);
    case 'grid': return g(`<rect x="${cx-k*0.7}" y="${cy-k*0.7}" width="${k*1.4}" height="${k*1.4}" rx="2"/><line x1="${cx}" y1="${cy-k*0.7}" x2="${cx}" y2="${cy+k*0.7}"/><line x1="${cx-k*0.7}" y1="${cy}" x2="${cx+k*0.7}" y2="${cy}"/>`);
    case 'bars': return g(`<line x1="${cx-k*0.5}" y1="${cy+k*0.6}" x2="${cx-k*0.5}" y2="${cy+k*0.1}"/><line x1="${cx}" y1="${cy+k*0.6}" x2="${cx}" y2="${cy-k*0.3}"/><line x1="${cx+k*0.5}" y1="${cy+k*0.6}" x2="${cx+k*0.5}" y2="${cy-k*0.6}"/>`);
    case 'api': return g(`<circle cx="${cx}" cy="${cy}" r="${k*0.3}"/><circle cx="${cx-k*0.7}" cy="${cy}" r="${k*0.16}" fill="${c}"/><circle cx="${cx+k*0.7}" cy="${cy}" r="${k*0.16}" fill="${c}"/><circle cx="${cx}" cy="${cy-k*0.7}" r="${k*0.16}" fill="${c}"/><line x1="${cx-k*0.55}" y1="${cy}" x2="${cx-k*0.3}" y2="${cy}"/><line x1="${cx+k*0.55}" y1="${cy}" x2="${cx+k*0.3}" y2="${cy}"/><line x1="${cx}" y1="${cy-k*0.55}" x2="${cx}" y2="${cy-k*0.3}"/>`);
    default: return '';
  }
}

return { P, FONT, MONO, esc, mix, svg, rrect, text, mtext, line, arrow, box, diamond, circle, nodeCircle, badge, check, xmark, shield, cylinder, hatch, table, hbar, title, kicker, icon };
