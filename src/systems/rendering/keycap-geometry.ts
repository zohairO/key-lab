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
 * Build a tapered, top-dished keycap geometry.
 *
 * Approach: start from a BoxGeometry with extra segments on the top face,
 * then deform vertices so:
 *   - X/Z scale lerps from full at the bottom to (full - topShrink) at the top
 *     -> sloped side walls
 *   - Top-face vertices get an additional Y offset based on radial distance from
 *     the top centre, with a cosine falloff -> spherical-ish bowl
 * Recompute normals after deformation so lighting stays correct.
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

  const geo = new THREE.BoxGeometry(W, H, D, topSegments, 1, topSegments);
  const pos = geo.attributes.position;
  const TOP_EPS = 1e-4;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Taper: lerp half-extents by vertical position. t=0 at bottom, 1 at top.
    const t = (y + halfH) / H;
    const sx = THREE.MathUtils.lerp(halfW, topHalfW, t);
    const sz = THREE.MathUtils.lerp(halfD, topHalfD, t);
    const newX = (x / halfW) * sx;
    const newZ = (z / halfD) * sz;
    pos.setX(i, newX);
    pos.setZ(i, newZ);

    // Top face dish: indent vertices on the top face by a smooth cosine bowl.
    if (Math.abs(y - halfH) < TOP_EPS) {
      const xn = newX / topHalfW;
      const zn = newZ / topHalfD;
      const r = Math.min(1, Math.sqrt(xn * xn + zn * zn));
      const indent = Math.cos(r * Math.PI * 0.5); // 1 at centre, 0 at edge
      pos.setY(i, y - indent * dishDepth);
    }
  }

  geo.computeVertexNormals();
  return geo;
}
