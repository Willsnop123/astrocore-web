import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Particle vertex shader ────────────────────────────────────────────────────
const vert = /* glsl */ `
  attribute float aRadius;
  attribute float aInitAngle;
  attribute float aHeight;
  attribute float aSpeed;
  attribute float aSize;

  uniform float u_time;
  uniform vec2  u_mouse;

  varying vec3 vColor;

  void main() {
    float angle = aInitAngle + aSpeed * u_time;
    vec3 pos = vec3(
      cos(angle) * aRadius,
      aHeight,
      sin(angle) * aRadius
    );

    // Mouse parallax — subtle per-star shimmer on hover
    vec2 mw  = u_mouse * 3.5;
    vec2 dv  = pos.xz - mw;
    float ld = max(length(dv), 0.01);
    float inf = exp(-ld * ld * 0.45) * 0.28;
    pos.xz += (dv / ld) * inf;
    pos.y  += inf * 0.10;

    vColor = color;

    vec4 mvp = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = clamp(aSize * (18.0 / -mvp.z), 0.5, 14.0);
    gl_Position  = projectionMatrix * mvp;
  }
`;

// ── Particle fragment — gaussian star glow ────────────────────────────────────
const frag = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vec2  c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0) discard;

    float alpha    = exp(-d * d * 2.5) * 0.92;
    float pinpoint = exp(-d * d * 26.0) * 0.22;
    vec3  col      = vColor + pinpoint;

    gl_FragColor = vec4(min(col, 1.0), alpha);
  }
`;

// ── Nucleus billboard shaders — no sphere edge, pure glow ────────────────────
const billVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const billFrag = /* glsl */ `
  uniform float u_time;
  varying vec2  vUv;

  void main() {
    vec2  c = vUv - 0.5;
    float d = length(c) * 2.0;

    // Three concentric glow layers — no hard edge
    float tight  = exp(-d * d * 7.0);          // inner white core
    float medium = exp(-d * d * 2.2) * 0.55;   // mid gold halo
    float wide   = exp(-d * d * 0.75) * 0.22;  // outer purple corona

    float pulse = 0.92 + 0.08 * sin(u_time * 0.65);

    vec3 coreCol  = vec3(1.00, 0.98, 0.92) * pulse;
    vec3 goldCol  = vec3(0.98, 0.78, 0.28);
    vec3 outerCol = vec3(0.55, 0.20, 0.88);

    vec3  col   = coreCol * tight + goldCol * medium + outerCol * wide;
    float alpha = (tight + medium * 0.55 + wide * 0.35) * pulse;

    gl_FragColor = vec4(col, alpha);
  }
`;

// ── Nucleus — billboard (always faces camera, zero visible edge) ──────────────
function NucleusBillboard() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ u_time: { value: 0 } }), []);

  useFrame(({ clock, camera }) => {
    if (meshRef.current) meshRef.current.quaternion.copy(camera.quaternion);
    if (matRef.current)  matRef.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} renderOrder={2}>
      <planeGeometry args={[1.6, 1.6]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={billVert}
        fragmentShader={billFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ── Galaxy geometry builder ───────────────────────────────────────────────────
function buildGalaxy() {
  const MAIN  = 38000;
  const BULGE =  5500; // 3D spherical bulge wrapping the nucleus
  const HALO  =  2500;
  const TOTAL = MAIN + BULGE + HALO;

  const ARMS   = 3;
  const RADIUS = 5.5;
  const SPIN   = 1.25;
  const RAND_P = 3.6;

  const bufPos    = new Float32Array(TOTAL * 3);
  const bufCol    = new Float32Array(TOTAL * 3);
  const bufRadius = new Float32Array(TOTAL);
  const bufAngle  = new Float32Array(TOTAL);
  const bufHeight = new Float32Array(TOTAL);
  const bufSpeed  = new Float32Array(TOTAL);
  const bufSize   = new Float32Array(TOTAL);

  const white = new THREE.Color('#ffffff');
  const warm  = new THREE.Color('#ffc87a');
  const mid   = new THREE.Color('#9d7bff');
  const outer = new THREE.Color('#4A90FF');
  const haloC = new THREE.Color('#6680cc');

  const rand = () =>
    Math.pow(Math.random(), RAND_P) * (Math.random() < 0.5 ? 1 : -1);

  // ── Spiral arms ──────────────────────────────────────────────────────────
  for (let i = 0; i < MAIN; i++) {
    const r      = Math.pow(Math.random(), 0.52) * RADIUS;
    const branch = (i % ARMS) / ARMS * Math.PI * 2;
    const spin   = r * SPIN;

    // More scatter near center → separation feel when zooming in
    const scatter = 0.22 + (1.0 - r / RADIUS) * 0.18;
    const px = Math.cos(branch + spin) * r + rand() * scatter * r;
    const pz = Math.sin(branch + spin) * r + rand() * scatter * r;
    const py = rand() * 0.06 * r;

    const ar = Math.sqrt(px * px + pz * pz);
    const aa = Math.atan2(pz, px);

    bufRadius[i] = ar;
    bufAngle[i]  = aa;
    bufHeight[i] = py;
    bufSpeed[i]  = 0.13 / Math.sqrt(ar + 0.12);

    // Inner stars slightly larger — feel closer
    const innerBoost = Math.max(0, 1.0 - r / (RADIUS * 0.4));
    bufSize[i] = Math.random() * 2.0 + 0.5 + innerBoost * 1.5;

    bufPos[i*3] = px; bufPos[i*3+1] = py; bufPos[i*3+2] = pz;

    const t = Math.min(r / RADIUS, 1);
    let c: THREE.Color;
    if      (t < 0.12) c = white.clone().lerp(warm, t / 0.12);
    else if (t < 0.45) c = warm.clone().lerp(mid,  (t - 0.12) / 0.33);
    else               c = mid.clone().lerp(outer, (t - 0.45) / 0.55);

    bufCol[i*3] = c.r; bufCol[i*3+1] = c.g; bufCol[i*3+2] = c.b;
  }

  // ── 3D spherical bulge wrapping the billboard nucleus ────────────────────
  for (let i = MAIN; i < MAIN + BULGE; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = Math.pow(Math.random(), 1.2) * 0.65;

    const px = r * Math.sin(phi) * Math.cos(theta);
    const py = r * Math.cos(phi) * 0.60;
    const pz = r * Math.sin(phi) * Math.sin(theta);

    const ar = Math.sqrt(px * px + pz * pz);
    const aa = Math.atan2(pz, px);

    bufRadius[i] = ar;
    bufAngle[i]  = aa;
    bufHeight[i] = py;
    bufSpeed[i]  = ar > 0.01 ? 0.24 / Math.sqrt(ar + 0.03) : 0;
    bufSize[i]   = Math.random() * 2.8 + 1.0;
    bufPos[i*3]  = px; bufPos[i*3+1] = py; bufPos[i*3+2] = pz;

    const t = r / 0.65;
    const c = white.clone().lerp(warm, t * 0.72);
    bufCol[i*3] = c.r; bufCol[i*3+1] = c.g; bufCol[i*3+2] = c.b;
  }

  // ── Outer halo ────────────────────────────────────────────────────────────
  for (let i = MAIN + BULGE; i < TOTAL; i++) {
    const r  = RADIUS + Math.random() * RADIUS * 0.9;
    const a  = Math.random() * Math.PI * 2;
    const py = (Math.random() - 0.5) * r * 0.28;

    bufRadius[i] = r;
    bufAngle[i]  = a;
    bufHeight[i] = py;
    bufSpeed[i]  = 0.030 / Math.sqrt(r);
    bufSize[i]   = Math.random() * 1.0 + 0.3;
    bufPos[i*3]  = Math.cos(a)*r; bufPos[i*3+1] = py; bufPos[i*3+2] = Math.sin(a)*r;
    bufCol[i*3]  = haloC.r * 0.38; bufCol[i*3+1] = haloC.g * 0.38; bufCol[i*3+2] = haloC.b * 0.48;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',   new THREE.BufferAttribute(bufPos,    3));
  geo.setAttribute('color',      new THREE.BufferAttribute(bufCol,    3));
  geo.setAttribute('aRadius',    new THREE.BufferAttribute(bufRadius, 1));
  geo.setAttribute('aInitAngle', new THREE.BufferAttribute(bufAngle,  1));
  geo.setAttribute('aHeight',    new THREE.BufferAttribute(bufHeight, 1));
  geo.setAttribute('aSpeed',     new THREE.BufferAttribute(bufSpeed,  1));
  geo.setAttribute('aSize',      new THREE.BufferAttribute(bufSize,   1));

  const mat = new THREE.ShaderMaterial({
    vertexShader:   vert,
    fragmentShader: frag,
    uniforms: {
      u_time:  { value: 0 },
      u_mouse: { value: new THREE.Vector2() },
    },
    transparent:  true,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
    vertexColors: true,
  });

  return { geo, mat };
}

// ── Galaxy particle mesh ──────────────────────────────────────────────────────
function GalaxyMesh() {
  const mouseRaw  = useRef(new THREE.Vector2());
  const mouseSoft = useRef(new THREE.Vector2());

  const { geo, mat } = useMemo(buildGalaxy, []);
  const points       = useMemo(() => new THREE.Points(geo, mat), [geo, mat]);
  const ptRef        = useRef<THREE.Points>(points);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouseRaw.current.set(
        (e.clientX / window.innerWidth)  * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mouseSoft.current.lerp(mouseRaw.current, 0.035);

    mat.uniforms.u_time.value = t;
    mat.uniforms.u_mouse.value.copy(mouseSoft.current);

    points.rotation.x = -0.18;
    points.rotation.y = t * 0.008;
  });

  return <primitive object={points} ref={ptRef} />;
}

// ── Full scene ────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <GalaxyMesh />
      <NucleusBillboard />
    </>
  );
}

export default function GalaxyCenter() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 5.0, 9.5], fov: 62 }}
        dpr={[1, 1.2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
