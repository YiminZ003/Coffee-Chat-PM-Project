import type { Profile } from "@/lib/types";

/**
 * Deterministic abstract tile built from a person's name.
 * Same name, same tile, on the server and the client. Two palette colors,
 * two or three flat geometric shapes, no faces.
 */
const INK = "#0E0E0E";
const PAPER = "#F4F4F0";
const ACCENT = "#2B3BFF";
const SIGNAL = "#FFD60A";

// [background, foreground]
const PAIRS: [string, string][] = [
  [ACCENT, PAPER],
  [INK, SIGNAL],
  [SIGNAL, INK],
  [PAPER, ACCENT],
  [ACCENT, SIGNAL],
  [PAPER, INK],
  [INK, PAPER],
  [SIGNAL, ACCENT],
];

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Corners of the 40x40 tile: top-left, top-right, bottom-right, bottom-left.
const CORNERS: [number, number][] = [[0, 0], [40, 0], [40, 40], [0, 40]];
const QUADS: [number, number][] = [[0, 0], [20, 0], [20, 20], [0, 20]];

function bigShape(kind: number, pos: number, fill: string) {
  const [cx, cy] = CORNERS[pos];
  switch (kind) {
    case 0: {
      // Quarter circle, radius 40, centered on a corner.
      const sx = cx === 0 ? 40 : 0;
      const ey = cy === 0 ? 40 : 0;
      const sweep = (cx === 0) === (cy === 0) ? 1 : 0;
      return <path d={`M${cx} ${cy}L${sx} ${cy}A40 40 0 0 ${sweep} ${cx} ${ey}Z`} fill={fill} />;
    }
    case 1: {
      // Half circle sitting on one edge.
      const edges = ["M0 40A20 20 0 0 1 40 40Z", "M0 0A20 20 0 0 1 0 40Z", "M0 0A20 20 0 0 0 40 0Z", "M40 0A20 20 0 0 0 40 40Z"];
      return <path d={edges[pos]} fill={fill} />;
    }
    case 2: {
      // Diagonal half.
      const tris = ["M0 0H40L0 40Z", "M0 0H40V40Z", "M40 0V40H0Z", "M0 0V40H40Z"];
      return <path d={tris[pos]} fill={fill} />;
    }
    default: {
      // Half block.
      const blocks: [number, number, number, number][] = [[0, 0, 40, 20], [20, 0, 20, 40], [0, 20, 40, 20], [0, 0, 20, 40]];
      const [x, y, w, h] = blocks[pos];
      return <rect x={x} y={y} width={w} height={h} fill={fill} />;
    }
  }
}

function smallShape(kind: number, pos: number, fill: string) {
  const [x, y] = QUADS[pos];
  if (kind === 0) return <circle cx={x + 10} cy={y + 10} r={7} fill={fill} />;
  if (kind === 1) return <rect x={x + 3} y={y + 3} width={14} height={14} fill={fill} />;
  return <path d={`M${x + 3} ${y + 17}L${x + 10} ${y + 3}L${x + 17} ${y + 17}Z`} fill={fill} />;
}

function insideBig(kind: number, pos: number, x: number, y: number) {
  if (kind === 0) {
    const [cx, cy] = CORNERS[pos];
    return Math.hypot(x - cx, y - cy) < 40;
  }
  if (kind === 1) {
    const centers: [number, number][] = [[20, 40], [0, 20], [20, 0], [40, 20]];
    const [cx, cy] = centers[pos];
    return Math.hypot(x - cx, y - cy) < 20;
  }
  if (kind === 2) return [x + y < 40, x > y, x + y > 40, y > x][pos];
  const blocks: [number, number, number, number][] = [[0, 0, 40, 20], [20, 0, 20, 40], [0, 20, 40, 20], [0, 0, 20, 40]];
  const [bx, by, bw, bh] = blocks[pos];
  return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
}

export function avatarParts(name: string) {
  const h = hash(name.trim().toLowerCase() || "?");
  const [bg, fg] = PAIRS[h % PAIRS.length];
  const bigKind = (h >>> 3) & 3;
  const bigPos = (h >>> 5) & 3;
  const smallKind = ((h >>> 7) & 7) % 3;
  let smallPos = (h >>> 10) & 3;
  // A diagonal split runs through two quadrant centers; keep the small shape off that line.
  if (bigKind === 2) {
    const clear = bigPos % 2 === 0 ? [0, 2] : [1, 3];
    if (!clear.includes(smallPos)) smallPos = clear[(h >>> 12) & 1];
  }
  const [qx, qy] = QUADS[smallPos];
  // Draw the small shape in whichever color contrasts with what sits under it.
  const smallFill = insideBig(bigKind, bigPos, qx + 10, qy + 10) ? bg : fg;
  const withBar = ((h >>> 14) & 3) === 0;
  const barY = 8 + ((h >>> 16) & 3) * 8;
  return { bg, fg, bigKind, bigPos, smallKind, smallPos, smallFill, withBar, barY };
}

const SIZES = { sm: 36, md: 48, lg: 64, xl: 128 } as const;

export function Avatar({ profile, size = "md" }: { profile: Pick<Profile, "name">; size?: keyof typeof SIZES }) {
  const px = SIZES[size];
  const p = avatarParts(profile.name);
  return (
    <svg className={`avatar-tile avatar-${size}`} width={px} height={px} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" fill={p.bg} />
      {bigShape(p.bigKind, p.bigPos, p.fg)}
      {smallShape(p.smallKind, p.smallPos, p.smallFill)}
      {p.withBar && <rect x="0" y={p.barY} width="40" height="3" fill={p.bg} />}
    </svg>
  );
}
