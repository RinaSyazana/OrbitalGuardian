import { useEffect, useRef, useState, useCallback } from "react";
import { VOXEL, riskColor } from "@/lib/voxel-palette";
import type { Satellite, DebrisObject } from "@/lib/mission-data";

type Vec3 = { x: number; y: number; z: number };

type Voxel = { x: number; y: number; z: number; color: string };

/** Build a cube-sphere shell of voxels with continent-ish land masses. */
function buildEarth(radius: number): Voxel[] {
  const out: Voxel[] = [];
  const R = radius;
  for (let x = -R; x <= R; x++) {
    for (let y = -R; y <= R; y++) {
      for (let z = -R; z <= R; z++) {
        const d = Math.sqrt(x * x + y * y + z * z);
        if (d > R + 0.5 || d < R - 0.75) continue;
        const lat = Math.asin(y / d); // -pi/2..pi/2
        const lon = Math.atan2(z, x);
        const n =
          Math.sin(lon * 2.1 + lat * 1.7) * 0.5 +
          Math.sin(lon * 3.7 - lat * 2.9) * 0.3 +
          Math.sin(lat * 4.3 + 1.2) * 0.35 +
          Math.sin(lon * 1.3 + 2.4) * 0.3;
        const absLat = Math.abs(lat);
        let color: string;
        if (absLat > 1.26) {
          color = VOXEL.ice;
        } else if (n > 0.24) {
          color = absLat > 0.62 ? VOXEL.landHigh : n > 0.78 ? VOXEL.landDry : VOXEL.land;
        } else if (n > 0.12) {
          color = VOXEL.oceanLight;
        } else if (n > -0.35) {
          color = VOXEL.ocean;
        } else {
          color = VOXEL.oceanDeep;
        }
        out.push({ x, y, z, color });
      }
    }
  }
  return out;
}

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 255) * amount)));
  const g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 255) * amount)));
  const b = Math.max(0, Math.min(255, Math.round((n & 255) * amount)));
  return `rgb(${r},${g},${b})`;
}

const FACES: { n: Vec3; c: Vec3[] }[] = (() => {
  const h = 0.5;
  const corners = (a: Vec3[]) => a;
  return [
    {
      n: { x: 0, y: 1, z: 0 },
      c: corners([
        { x: -h, y: h, z: -h },
        { x: h, y: h, z: -h },
        { x: h, y: h, z: h },
        { x: -h, y: h, z: h },
      ]),
    },
    {
      n: { x: 0, y: -1, z: 0 },
      c: corners([
        { x: -h, y: -h, z: -h },
        { x: -h, y: -h, z: h },
        { x: h, y: -h, z: h },
        { x: h, y: -h, z: -h },
      ]),
    },
    {
      n: { x: 1, y: 0, z: 0 },
      c: corners([
        { x: h, y: -h, z: -h },
        { x: h, y: -h, z: h },
        { x: h, y: h, z: h },
        { x: h, y: h, z: -h },
      ]),
    },
    {
      n: { x: -1, y: 0, z: 0 },
      c: corners([
        { x: -h, y: -h, z: -h },
        { x: -h, y: h, z: -h },
        { x: -h, y: h, z: h },
        { x: -h, y: -h, z: h },
      ]),
    },
    {
      n: { x: 0, y: 0, z: 1 },
      c: corners([
        { x: -h, y: -h, z: h },
        { x: -h, y: h, z: h },
        { x: h, y: h, z: h },
        { x: h, y: -h, z: h },
      ]),
    },
    {
      n: { x: 0, y: 0, z: -1 },
      c: corners([
        { x: -h, y: -h, z: -h },
        { x: h, y: -h, z: -h },
        { x: h, y: h, z: -h },
        { x: -h, y: h, z: -h },
      ]),
    },
  ];
})();

const LIGHT: Vec3 = (() => {
  const v = { x: -0.55, y: 0.68, z: 0.48 };
  const m = Math.hypot(v.x, v.y, v.z);
  return { x: v.x / m, y: v.y / m, z: v.z / m };
})();

function rot(p: Vec3, yaw: number, pitch: number): Vec3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const y2 = p.y * cp - z1 * sp;
  const z2 = p.y * sp + z1 * cp;
  return { x: x1, y: y2, z: z2 };
}

export type EarthMarker = {
  id: string;
  kind: "satellite" | "debris";
  color: string;
  altitude: number; // orbit radius in voxel units
  tilt: number;
  phase: number;
  speed: number;
  label: string;
  selected?: boolean;
};

export type VoxelEarthProps = {
  markers?: EarthMarker[];
  className?: string;
  /** voxel resolution of the globe */
  resolution?: number;
  /** base zoom multiplier */
  zoom?: number;
  autoRotate?: boolean;
  /** show orbit guide rings */
  showRings?: boolean;
  /** highlight a converging conjunction with a pulsing marker */
  collision?: { altitude: number; tilt: number; phase: number } | null;
  /** sandbox: draggable orbit ring, value is a km delta */
  draggableOrbit?: {
    altitude: number;
    tilt: number;
    deltaAltKm: number;
    onChange: (deltaAltKm: number) => void;
    risk: number;
  } | null;
  onSelectMarker?: (id: string) => void;
  /** commit animation trigger — increments to replay */
  burnPulse?: number;
  overlayHint?: string;
  /** hide the reset-view control (use for thumbnails / nested interactive elements) */
  controls?: boolean;
};

export function VoxelEarth({
  markers = [],
  className,
  resolution = 11,
  zoom = 1,
  autoRotate = true,
  showRings = true,
  collision = null,
  draggableOrbit = null,
  onSelectMarker,
  burnPulse = 0,
  overlayHint,
  controls = true,
}: VoxelEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const voxelsRef = useRef<Voxel[]>([]);
  const stateRef = useRef({
    yaw: 0.6,
    pitch: 0.36,
    zoom,
    dragging: false as false | "rotate" | "orbit",
    lastX: 0,
    lastY: 0,
    t: 0,
    burnAt: -1,
    hover: null as string | null,
    hits: [] as { id: string; x: number; y: number }[],
  });
  const propsRef = useRef({ markers, autoRotate, showRings, collision, draggableOrbit, onSelectMarker });
  propsRef.current = { markers, autoRotate, showRings, collision, draggableOrbit, onSelectMarker };
  const [hoverLabel, setHoverLabel] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    voxelsRef.current = buildEarth(resolution);
  }, [resolution]);

  useEffect(() => {
    stateRef.current.zoom = zoom;
  }, [zoom]);

  useEffect(() => {
    if (burnPulse > 0) stateRef.current.burnAt = stateRef.current.t;
  }, [burnPulse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Static starfield seeded once.
    const stars = Array.from({ length: 190 }, (_, i) => ({
      x: ((i * 9301 + 49297) % 233280) / 233280,
      y: ((i * 4243 + 12345) % 199933) / 199933,
      s: i % 7 === 0 ? 2 : 1,
      a: 0.25 + ((i % 5) / 5) * 0.55,
    }));

    const draw = () => {
      const st = stateRef.current;
      const p = propsRef.current;
      st.t += 1 / 60;
      if (p.autoRotate && !st.dragging) st.yaw += 0.0022;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // starfield
      for (const s of stars) {
        ctx.fillStyle = `rgba(226,232,240,${s.a})`;
        ctx.fillRect(Math.floor(s.x * w), Math.floor(s.y * h), s.s, s.s);
      }

      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) / (resolution * 2 + 9);
      const scale = base * st.zoom;
      const yaw = st.yaw;
      const pitch = st.pitch;

      // ---- Earth voxels (painter's algorithm) ----
      const vox = voxelsRef.current;
      const projected: { z: number; v: Voxel; r: Vec3 }[] = [];
      for (const v of vox) {
        const r = rot(v, yaw, pitch);
        if (r.z < -0.4 * resolution) continue;
        projected.push({ z: r.z, v, r });
      }
      projected.sort((a, b) => a.z - b.z);

      const s2 = scale;
      for (const { v, r } of projected) {
        for (const f of FACES) {
          const rn = rot(f.n, yaw, pitch);
          if (rn.z <= 0.001) continue;
          // outward-facing only (skip interior faces of the shell)
          const dot = (v.x * f.n.x + v.y * f.n.y + v.z * f.n.z) / (Math.hypot(v.x, v.y, v.z) || 1);
          if (dot < 0.15) continue;
          const lum = 0.58 + 0.52 * Math.max(0, rn.x * LIGHT.x + rn.y * LIGHT.y + rn.z * LIGHT.z);
          ctx.fillStyle = shade(v.color, lum);
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const c = f.c[i]!;
            const pr = rot({ x: v.x + c.x, y: v.y + c.y, z: v.z + c.z }, yaw, pitch);
            const px = cx + pr.x * s2;
            const py = cy - pr.y * s2;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      // atmosphere rim
      const rim = ctx.createRadialGradient(cx, cy, resolution * scale * 0.9, cx, cy, resolution * scale * 1.35);
      rim.addColorStop(0, "rgba(34,211,238,0.16)");
      rim.addColorStop(1, "rgba(34,211,238,0)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, resolution * scale * 1.35, 0, Math.PI * 2);
      ctx.fill();

      const orbitPoint = (radius: number, tilt: number, angle: number): Vec3 => {
        const p0 = { x: Math.cos(angle) * radius, y: 0, z: Math.sin(angle) * radius };
        const ct = Math.cos(tilt);
        const stt = Math.sin(tilt);
        const tilted = { x: p0.x, y: p0.z * stt, z: p0.z * ct };
        return rot(tilted, yaw, pitch);
      };

      const drawRing = (radius: number, tilt: number, color: string, width: number, dash = false) => {
        const pts: Vec3[] = [];
        for (let a = 0; a <= 64; a++) pts.push(orbitPoint(radius, tilt, (a / 64) * Math.PI * 2));
        ctx.lineWidth = width;
        if (dash) ctx.setLineDash([5, 5]);
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i]!;
          const b = pts[i + 1]!;
          const behind = (a.z + b.z) / 2 < 0;
          const occluded = behind && Math.hypot((a.x + b.x) / 2, (a.y + b.y) / 2) < resolution;
          ctx.strokeStyle = occluded ? `${color}22` : behind ? `${color}55` : `${color}cc`;
          ctx.beginPath();
          ctx.moveTo(cx + a.x * scale, cy - a.y * scale);
          ctx.lineTo(cx + b.x * scale, cy - b.y * scale);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      };

      const drawVoxelMarker = (pos: Vec3, color: string, size: number, glow: boolean) => {
        const px = cx + pos.x * scale;
        const py = cy - pos.y * scale;
        const behind = pos.z < 0 && Math.hypot(pos.x, pos.y) < resolution;
        ctx.globalAlpha = behind ? 0.22 : 1;
        if (glow) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 14;
        }
        ctx.fillStyle = color;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
        ctx.shadowBlur = 0;
        ctx.fillStyle = shade(color, 1.45);
        ctx.fillRect(px - size / 2, py - size / 2, size, Math.max(1, size * 0.28));
        ctx.fillStyle = shade(color, 0.55);
        ctx.fillRect(px - size / 2, py + size / 2 - Math.max(1, size * 0.22), size, Math.max(1, size * 0.22));
        ctx.globalAlpha = 1;
        return { px, py, behind };
      };

      st.hits = [];

      // ---- orbit rings + markers ----
      for (const m of p.markers) {
        if (p.showRings) {
          drawRing(m.altitude, m.tilt, m.selected ? VOXEL.cyan : m.color, m.selected ? 2 : 1);
        }
        const angle = m.phase + st.t * m.speed;
        const pos = orbitPoint(m.altitude, m.tilt, angle);
        const size = (m.selected ? 11 : m.kind === "debris" ? 6 : 8) * Math.max(0.6, st.zoom * 0.85);
        const { px, py } = drawVoxelMarker(pos, m.selected ? VOXEL.cyan : m.color, size, !!m.selected);
        st.hits.push({ id: m.id, x: px, y: py });
        if (m.selected) {
          ctx.strokeStyle = `${VOXEL.cyan}aa`;
          ctx.lineWidth = 1;
          ctx.strokeRect(px - size, py - size, size * 2, size * 2);
        }
      }

      // ---- conjunction marker ----
      if (p.collision) {
        const pos = orbitPoint(p.collision.altitude, p.collision.tilt, p.collision.phase);
        const px = cx + pos.x * scale;
        const py = cy - pos.y * scale;
        const pulse = 0.5 + 0.5 * Math.sin(st.t * 4);
        ctx.strokeStyle = `rgba(239,68,68,${0.35 + pulse * 0.55})`;
        ctx.lineWidth = 2;
        const r = 10 + pulse * 12;
        ctx.strokeRect(px - r, py - r, r * 2, r * 2);
        ctx.fillStyle = VOXEL.red;
        ctx.fillRect(px - 4, py - 4, 8, 8);
        ctx.font = "600 10px 'IBM Plex Mono', monospace";
        ctx.fillStyle = "#FCA5A5";
        ctx.fillText("TCA 14:47:12", px + r + 6, py + 3);
      }

      // ---- draggable sandbox orbit ----
      const d = p.draggableOrbit;
      if (d) {
        const target = d.altitude + d.deltaAltKm * 0.09;
        drawRing(d.altitude, d.tilt, VOXEL.grey, 1, true);
        const col = riskColor(d.risk);
        drawRing(target, d.tilt, col, 3);
        const angle = st.t * 0.35;
        const pos = orbitPoint(target, d.tilt, angle);
        drawVoxelMarker(pos, col, 13, true);

        // burn animation on commit
        if (st.burnAt >= 0 && st.t - st.burnAt < 2.2) {
          const k = (st.t - st.burnAt) / 2.2;
          const bp = orbitPoint(d.altitude + (target - d.altitude) * k, d.tilt, angle - 0.6 + k * 1.2);
          const bx = cx + bp.x * scale;
          const by = cy - bp.y * scale;
          for (let i = 0; i < 5; i++) {
            ctx.fillStyle = `rgba(245,158,11,${0.85 - i * 0.15})`;
            const s = 9 - i * 1.4;
            ctx.fillRect(bx - s / 2 - i * 5, by - s / 2 + i * 2, s, s);
          }
        }
        // altitude handle hint
        const hp = orbitPoint(target, d.tilt, Math.PI * 0.5);
        ctx.fillStyle = col;
        ctx.fillRect(cx + hp.x * scale - 5, cy - hp.y * scale - 5, 10, 10);
        ctx.strokeStyle = "#ffffff88";
        ctx.strokeRect(cx + hp.x * scale - 7, cy - hp.y * scale - 7, 14, 14);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const pointerDown = (e: PointerEvent) => {
      const st = stateRef.current;
      canvas.setPointerCapture(e.pointerId);
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      st.dragging = propsRef.current.draggableOrbit ? "orbit" : "rotate";
      if (propsRef.current.draggableOrbit && e.shiftKey) st.dragging = "rotate";
    };
    const pointerMove = (e: PointerEvent) => {
      const st = stateRef.current;
      const rect = canvas.getBoundingClientRect();
      if (!st.dragging) {
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const hit = st.hits.find((hh) => Math.abs(hh.x - mx) < 12 && Math.abs(hh.y - my) < 12);
        const label = hit ? propsRef.current.markers.find((m) => m.id === hit.id)?.label : undefined;
        setHoverLabel(label ? { text: label, x: mx, y: my } : null);
        canvas.style.cursor = hit ? "pointer" : propsRef.current.draggableOrbit ? "ns-resize" : "grab";
        return;
      }
      const dx = e.clientX - st.lastX;
      const dy = e.clientY - st.lastY;
      st.lastX = e.clientX;
      st.lastY = e.clientY;
      if (st.dragging === "orbit" && propsRef.current.draggableOrbit) {
        const d = propsRef.current.draggableOrbit;
        const next = Math.max(-30, Math.min(30, d.deltaAltKm - dy * 0.22));
        d.onChange(Math.round(next * 10) / 10);
        st.yaw += dx * 0.004;
      } else {
        st.yaw += dx * 0.008;
        st.pitch = Math.max(-1.2, Math.min(1.2, st.pitch + dy * 0.006));
      }
    };
    const pointerUp = (e: PointerEvent) => {
      const st = stateRef.current;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const moved = Math.abs(e.clientX - st.lastX) > 3;
      st.dragging = false;
      if (!moved) {
        const hit = st.hits.find((hh) => Math.abs(hh.x - mx) < 12 && Math.abs(hh.y - my) < 12);
        if (hit) propsRef.current.onSelectMarker?.(hit.id);
      }
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const st = stateRef.current;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      st.zoom = Math.max(0.55, Math.min(2.6, st.zoom * Math.exp(-dy * 0.0015)));
    };

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("wheel", wheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("wheel", wheel);
    };
  }, [resolution]);

  const resetView = useCallback(() => {
    stateRef.current.yaw = 0.6;
    stateRef.current.pitch = 0.36;
    stateRef.current.zoom = zoom;
  }, [zoom]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
      {hoverLabel && (
        <div
          className="pointer-events-none absolute z-10 block-surface-flat block-notch px-2 py-1 tabular text-[11px] text-foreground"
          style={{ left: hoverLabel.x + 14, top: hoverLabel.y - 10 }}
        >
          {hoverLabel.text}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-2 left-3 hud-label text-[10px] opacity-70">
        {overlayHint ?? (draggableOrbit ? "Drag ▲▼ to retarget orbit · Shift+drag to rotate" : "Drag to rotate · Scroll to zoom")}
      </div>
      {controls && (
        <button
          type="button"
          onClick={resetView}
          className="absolute right-2 top-2 z-10 block-surface-flat block-notch px-2 py-1 hud-label text-[10px] transition-colors hover:text-primary"
        >
          Reset view
        </button>
      )}
    </div>
  );
}
