import * as THREE from 'three';

export interface KeycapShape {
  width: number;        // bottom width
  depth: number;        // bottom depth
  height: number;
  topShrinkX?: number;  // total amount X shrinks at top (sum of both sides), in scene units
  topShrinkZ?: number;
  dishDepth?: number;   // peak indent at top center
  topSegments?: number; // resolution of top face for dish smoothness
}

/**
 * Build a tapered, chamfered, dished keycap geometry.
 *
 * Vertical structure (3 rings along Y):
 *   - Bottom ring (y = -H/2):         full width × depth
 *   - Shoulder ring (y ≈ 0.7H above bottom): mostly tapered (≈35% of total taper)
 *   - Top ring (y = +H/2):            fully tapered + spherical dish
 *
 * This produces a real-keycap silhouette: nearly-vertical lower walls, a
 * visible chamfer fold near the top, and a concave bowl on the top face.
 */
export function makeKeycapGeometry({
  width: W,
  depth: D,
  height: H,
  topShrinkX = W * 0.14,
  topShrinkZ = D * 0.14,
  dishDepth = 0.025,
  topSegments = 6,
}: KeycapShape): THREE.BufferGeometry {
  const halfW = W / 2;
  const halfD = D / 2;
  const halfH = H / 2;
  const topHalfW = Math.max(0.001, halfW - topShrinkX / 2);
  const topHalfD = Math.max(0.001, halfD - topShrinkZ / 2);

  // Position of the chamfer "shoulder" within the height (0 = bottom, 1 = top).
  const SHOULDER_T = 0.70;
  // Fraction of the bottom→top taper that has happened by the shoulder.
  // Lower values = more pronounced chamfer (since more taper happens above the
  // shoulder, in a shorter vertical distance).
  const SHOULDER_TAPER_T = 0.35;

  const shoulderY = -halfH + SHOULDER_T * H;
  const shoulderHalfW = halfW + (topHalfW - halfW) * SHOULDER_TAPER_T;
  const shoulderHalfD = halfD + (topHalfD - halfD) * SHOULDER_TAPER_T;

  // heightSegments = 2 gives us 3 rings (bottom, middle, top). We reposition
  // the middle ring up to shoulderY to form the chamfer.
  const geo = new THREE.BoxGeometry(W, H, D, topSegments, 2, topSegments);
  const pos = geo.attributes.position;
  const EPS = 1e-4;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Pick the target ring based on the original Y position.
    let newY: number;
    let halfWAtY: number;
    let halfDAtY: number;
    let isTopRing = false;

    if (y < -halfH + EPS) {
      // Bottom ring
      newY = -halfH;
      halfWAtY = halfW;
      halfDAtY = halfD;
    } else if (y > halfH - EPS) {
      // Top ring
      newY = halfH;
      halfWAtY = topHalfW;
      halfDAtY = topHalfD;
      isTopRing = true;
    } else {
      // Middle ring (originally at y=0). Promote to the shoulder height
      // and apply the shoulder taper. This is where the chamfer kink lives.
      newY = shoulderY;
      halfWAtY = shoulderHalfW;
      halfDAtY = shoulderHalfD;
    }

    const newX = (x / halfW) * halfWAtY;
    const newZ = (z / halfD) * halfDAtY;
    pos.setX(i, newX);
    pos.setY(i, newY);
    pos.setZ(i, newZ);

    // Top face dish: cosine bowl from centre to edge.
    if (isTopRing) {
      const xn = newX / topHalfW;
      const zn = newZ / topHalfD;
      const r = Math.min(1, Math.sqrt(xn * xn + zn * zn));
      const indent = Math.cos(r * Math.PI * 0.5); // 1 at centre, 0 at edge
      pos.setY(i, halfH - indent * dishDepth);
    }
  }

  geo.computeVertexNormals();
  return geo;
}
