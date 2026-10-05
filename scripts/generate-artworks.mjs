import { mkdir, writeFile } from 'node:fs/promises';

const outputDirectory = new URL('../public/artworks/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });

const palettes = [
  ['#e8ddc9', '#d64a3b', '#171817', '#b4aa94'], ['#202624', '#6cc0aa', '#e3d4b8', '#b64b3f'],
  ['#e9dfcf', '#294e48', '#df4c3d', '#282927'], ['#171b1b', '#e0bd67', '#7da99e', '#f0e7d7'],
  ['#e8d6bf', '#db4a3d', '#264e48', '#242524'], ['#d9d0bd', '#30534e', '#d96a4d', '#292a29'],
  ['#171a19', '#df4b3f', '#e7d8c0', '#4c7770'], ['#e7dcc8', '#e3b84f', '#354b48', '#d35343'],
  ['#202422', '#daba69', '#c7493d', '#d9d1bf'], ['#eadfcb', '#d24c3e', '#4c7168', '#262827'],
  ['#e7dac3', '#44756c', '#d54c3e', '#272827'], ['#191d1c', '#d9b757', '#e8ddc9', '#c94b40'],
  ['#e9dfcf', '#df4c40', '#3e7069', '#282a29'], ['#1b201e', '#d7b35c', '#df5547', '#d4d1c6'],
  ['#e4d7c2', '#395f59', '#d54d40', '#1d2220'], ['#171b1a', '#d4ae51', '#4e8880', '#dfd6c2'],
  ['#e8decd', '#cc4d41', '#36665f', '#222624'], ['#171b1a', '#d7b45b', '#d95043', '#dbd3c2'],
  ['#e7dac4', '#d24e43', '#386c63', '#222625'], ['#1a1d1c', '#d7b356', '#d74b3e', '#d5d0c2'],
];

const poster = (i, c) => `
  <rect width="480" height="480" fill="${c[0]}"/>
  <rect x="34" y="34" width="412" height="412" fill="none" stroke="${c[2]}" stroke-width="2" opacity=".45"/>
  <path d="M0 ${280 + (i % 4) * 15}H480" stroke="${c[2]}" stroke-width="2" opacity=".4"/>
  <circle cx="${178 + (i % 5) * 20}" cy="${173 + (i % 3) * 14}" r="${78 + (i % 4) * 9}" fill="${c[1]}"/>
  <path d="M${205 + (i % 5) * 12} 76L420 383H${120 + (i % 4) * 18}Z" fill="${c[3]}" opacity=".88"/>
  <path d="M52 390H428M52 405H${188 + (i % 6) * 18}" stroke="${c[2]}" stroke-width="5" opacity=".72"/>
  <circle cx="${292 - (i % 3) * 16}" cy="${218 + (i % 4) * 11}" r="26" fill="${c[0]}"/>
`;

const contours = (i, c) => {
  const lines = Array.from({ length: 13 }, (_, n) => {
    const y = 34 + n * 34;
    const offset = ((i * 17 + n * 13) % 46) - 23;
    return `<path d="M-30 ${y + offset} C70 ${y - 48 - offset} 112 ${y + 82} 226 ${y + 15} S380 ${y - 35 + offset} 515 ${y + 30}" fill="none" stroke="${n % 4 === 0 ? c[1] : c[2]}" stroke-width="${n % 4 === 0 ? 3 : 1.5}" opacity="${n % 4 === 0 ? .82 : .42}"/>`;
  }).join('');
  return `<rect width="480" height="480" fill="${c[0]}"/>${lines}<path d="M88 326C151 290 198 340 256 300S364 270 410 312" fill="none" stroke="${c[3]}" stroke-width="5"/><circle cx="256" cy="300" r="8" fill="${c[1]}"/>`;
};

const diagram = (i, c) => {
  const bars = Array.from({ length: 8 }, (_, n) => {
    const x = 64 + n * 45;
    const h = 70 + ((i * 29 + n * 47) % 230);
    return `<rect x="${x}" y="${366 - h}" width="24" height="${h}" fill="${n % 3 === 0 ? c[1] : n % 2 ? c[3] : c[2]}" opacity=".88"/>`;
  }).join('');
  return `<rect width="480" height="480" fill="${c[0]}"/><path d="M48 370H434M56 76V372" stroke="${c[2]}" stroke-width="2" opacity=".55"/>${bars}<path d="M58 281C112 246 144 284 197 210S292 238 340 156 391 140 426 93" fill="none" stroke="${c[2]}" stroke-width="5"/><circle cx="${426 - (i % 4) * 20}" cy="${93 + (i % 4) * 25}" r="9" fill="${c[1]}"/>`;
};

const botanical = (i, c) => {
  const leaves = Array.from({ length: 7 }, (_, n) => {
    const y = 368 - n * 42;
    const side = n % 2 ? -1 : 1;
    const x = 238 + side * (24 + (n % 3) * 11);
    return `<path d="M240 ${y} Q${x + side * 48} ${y - 42} ${x} ${y - 74} Q${x - side * 20} ${y - 36} 240 ${y}" fill="${n % 2 ? c[1] : c[3]}" stroke="${c[2]}" stroke-width="2"/>`;
  }).join('');
  return `<rect width="480" height="480" fill="${c[0]}"/><path d="M240 418C236 333 248 228 232 73" fill="none" stroke="${c[2]}" stroke-width="6"/>${leaves}<circle cx="${218 + (i % 4) * 14}" cy="${92 + (i % 3) * 16}" r="23" fill="${c[1]}"/><path d="M74 420H406" stroke="${c[2]}" stroke-width="2" opacity=".5"/>`;
};

const orbit = (i, c) => {
  const center = 240 + (i % 3) * 10 - 10;
  return `<rect width="480" height="480" fill="${c[0]}"/><circle cx="${center}" cy="232" r="${118 + (i % 4) * 9}" fill="none" stroke="${c[2]}" stroke-width="2" opacity=".65"/><circle cx="${center}" cy="232" r="${82 + (i % 4) * 6}" fill="none" stroke="${c[1]}" stroke-width="8"/><circle cx="${center}" cy="232" r="40" fill="${c[3]}"/><circle cx="${center + 10}" cy="221" r="14" fill="${c[0]}"/><path d="M55 232H425M${center} 45V420" stroke="${c[2]}" stroke-width="1.5" opacity=".4"/><circle cx="${84 + (i % 5) * 30}" cy="${92 + (i % 4) * 22}" r="7" fill="${c[1]}"/>`;
};

const weave = (i, c) => {
  const marks = Array.from({ length: 11 }, (_, n) => {
    const p = 54 + n * 37;
    return `<path d="M${p} 46C${p - 24} 123 ${p + 27} 180 ${p} 240S${p - 22} 354 ${p} 434" fill="none" stroke="${n % 3 ? c[2] : c[1]}" stroke-width="${n % 3 ? 9 : 17}" opacity=".88"/><path d="M48 ${p}C126 ${p - 18} 180 ${p + 20} 240 ${p}S354 ${p - 15} 432 ${p}" fill="none" stroke="${n % 2 ? c[3] : c[1]}" stroke-width="${n % 2 ? 4 : 8}" opacity=".76"/>`;
  }).join('');
  return `<rect width="480" height="480" fill="${c[0]}"/><rect x="38" y="38" width="404" height="404" fill="none" stroke="${c[3]}" stroke-width="2"/>${marks}<circle cx="${240 + (i % 5) * 8}" cy="240" r="20" fill="${c[0]}"/>`;
};

const documentArt = (i, c) => {
  const rows = Array.from({ length: 12 }, (_, n) => {
    const y = 82 + n * 26;
    const end = 284 + ((i * 31 + n * 37) % 118);
    return `<path d="M72 ${y}H${end}" stroke="${n % 4 === 0 ? c[1] : c[2]}" stroke-width="${n % 4 === 0 ? 4 : 2}" opacity="${n % 4 === 0 ? .86 : .52}"/>`;
  }).join('');
  return `<rect width="480" height="480" fill="${c[0]}"/><rect x="42" y="38" width="396" height="404" fill="none" stroke="${c[2]}" stroke-width="2" opacity=".6"/><rect x="72" y="56" width="${128 + (i % 4) * 22}" height="8" fill="${c[1]}"/>${rows}<path d="M96 380l60-47 44 19 65-89 67 35" fill="none" stroke="${c[3]}" stroke-width="5"/><circle cx="${330 - (i % 4) * 18}" cy="${298 + (i % 3) * 12}" r="17" fill="${c[1]}"/>`;
};

const spiral = (i, c) => {
  const paths = Array.from({ length: 9 }, (_, n) => {
    const radius = 35 + n * 23;
    const rotation = (i * 13 + n * 8) % 30 - 15;
    return `<ellipse cx="240" cy="240" rx="${radius}" ry="${radius * .72}" transform="rotate(${rotation} 240 240)" fill="none" stroke="${n % 3 === 0 ? c[1] : c[2]}" stroke-width="${n % 3 === 0 ? 5 : 2}" opacity=".82"/>`;
  }).join('');
  return `<rect width="480" height="480" fill="${c[0]}"/>${paths}<circle cx="240" cy="240" r="22" fill="${c[3]}"/><circle cx="${300 + (i % 4) * 13}" cy="${160 + (i % 3) * 22}" r="9" fill="${c[1]}"/>`;
};

const mosaic = (i, c) => {
  const tiles = Array.from({ length: 6 }, (_, row) => Array.from({ length: 6 }, (_, col) => {
    const colors = [c[1], c[2], c[3], c[0]];
    const color = colors[(row * 3 + col * 5 + i) % colors.length];
    const inset = (row + col + i) % 3 === 0 ? 8 : 2;
    return `<rect x="${55 + col * 62 + inset}" y="${55 + row * 62 + inset}" width="${50 - inset}" height="${50 - inset}" fill="${color}"/>`;
  }).join('')).join('');
  return `<rect width="480" height="480" fill="${c[0]}"/><rect x="42" y="42" width="396" height="396" fill="none" stroke="${c[2]}" stroke-width="2"/>${tiles}<circle cx="${240 + (i % 3) * 12}" cy="${240 - (i % 4) * 8}" r="25" fill="${c[0]}"/>`;
};

const templates = [poster, contours, diagram, botanical, orbit, weave, documentArt, spiral, mosaic];

for (let index = 0; index < 20; index += 1) {
  const [background, accent, ink, secondary] = palettes[index];
  const artwork = templates[(index * 5 + Math.floor(index / 2)) % templates.length](index, [background, accent, ink, secondary]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img"><rect width="480" height="480" fill="${background}"/><g>${artwork}</g><rect width="480" height="480" fill="url(#paper-grain)" opacity=".09"/><defs><filter id="paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs></svg>`;
  await writeFile(new URL(`artwork-${String(index + 1).padStart(2, '0')}.svg`, outputDirectory), svg);
}
