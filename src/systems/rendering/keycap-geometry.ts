import * as THREE from 'three';

export interface KeycapShape {
  width: number;
  depth: number;
  height: number;
  topShrinkX?: number;
  topShrinkZ?: number;
  dishDepth?: number;
  topSegments?: number;
}

/**
 * Build a tapered, chamfered, dished keycap geometry.
 *
 * Vertical structure (3 rings along Y):
 *   - Bottom ring (y = -H/2):                     full width × depth
 *   - Shoulder ring (y ≈ 0.80 * H above bottom):  ~20% of bottom→top taper done
 *   - Top ring (y = +H/2):                        fully tapered + spherical dish
 *
 * Result: side walls stay nearly-vertical for the lower 80% of the keycap,
 * then fold inward sharply for the top 20%. This produces a clear "stepped"
 * silhouette like a real Cherry-profile cap — the top platform reads as
 * distinct from the side walls, which is the visual depth that was missing.
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

  // Shoulder higher up — the chamfer is now only the top 20% of the keycap.
  const SHOULDER_T = 0.80;
  // Only 20% of total taper happens below the shoulder. The remaining 80% is
  // packed into the top 20% of height → visible chamfer angle.
  const SHOULDER_TAPER_T = 0.20;

  const shoulderY = -halfH + SHOULDER_T * H;
  const shoulderHalfW = halfW + (topHalfW - halfW) * SHOULDER_TAPER_T;
  const shoulderHalfD = halfD + (topHalfD - halfD) * SHOULDER_TAPER_T;

  const geo = new THREE.BoxGeometry(W, H, D, topSegments, 2, topSegments);
  const pos = geo.attributes.position;
  const EPS = 1e-4;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    let newY: number;
    let halfWAtY: number;
    let halfDAtY: number;
    let isTopRing = false;

    if (y < -halfH + EPS) {
      newY = -halfH;
      halfWAtY = halfW;
      halfDAtY = halfD;
    } else if (y > halfH - EPS) {
      newY = halfH;
      halfWAtY = topHalfW;
      halfDAtY = topHalfD;
      isTopRing = true;
    } else {
      newY = shoulderY;
      halfWAtY = shoulderHalfW;
      halfDAtY = shoulderHalfD;
    }

    const newX = (x / halfW) * halfWAtY;
    const newZ = (z / halfD) * halfDAtY;
    pos.setX(i, newX);
    pos.setY(i, newY);
    pos.setZ(i, newZ);

    if (isTopRing) {
      const xn = newX / topHalfW;
      const zn = newZ / topHalfD;
      const r = Math.min(1, Math.sqrt(xn * xn + zn * zn));
      const indent = Math.cos(r * Math.PI * 0.5);
      pos.setY(i, halfH - indent * dishDepth);
    }
  }

  geo.computeVertexNormals();
  return geo;
}
