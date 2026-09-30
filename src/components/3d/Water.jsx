import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPhysicalMaterial } from 'three';

// Surface d'eau animée : de petites vagues déforment le maillage et ses
// normales dans le vertex shader, ce qui fait danser les reflets du ciel.
// Horloge partagée par tous les plans d'eau.
const time = { value: 0 };

function createWaterMaterial() {
  const m = new MeshPhysicalMaterial({
    color: '#3fc3e3',
    roughness: 0.06,
    metalness: 0,
    transparent: true,
    opacity: 0.78,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.6,
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`
      .replace(
        '#include <beginnormal_vertex>',
        `
        vec2 wp = position.xy;
        float t = uTime;
        float wave = 0.022 * sin(wp.x * 1.6 + t * 1.3)
                   + 0.018 * sin(wp.y * 2.1 - t * 1.1)
                   + 0.012 * sin((wp.x + wp.y) * 3.4 + t * 1.9)
                   + 0.008 * sin((wp.x - wp.y) * 5.2 - t * 2.4);
        float dx = 0.022 * 1.6 * cos(wp.x * 1.6 + t * 1.3)
                 + 0.012 * 3.4 * cos((wp.x + wp.y) * 3.4 + t * 1.9)
                 + 0.008 * 5.2 * cos((wp.x - wp.y) * 5.2 - t * 2.4);
        float dy = 0.018 * 2.1 * cos(wp.y * 2.1 - t * 1.1)
                 + 0.012 * 3.4 * cos((wp.x + wp.y) * 3.4 + t * 1.9)
                 - 0.008 * 5.2 * cos((wp.x - wp.y) * 5.2 - t * 2.4);
        vec3 objectNormal = normalize(vec3(-dx * 2.2, -dy * 2.2, 1.0));
        `,
      )
      .replace(
        '#include <begin_vertex>',
        'vec3 transformed = vec3(position.xy, position.z + wave);',
      );
  };
  return m;
}

// Plan d'eau de `length` × `width` m, centré sur l'origine, grand axe sur X.
export default function Water({ length, width, segments = 3 }) {
  const material = useMemo(() => createWaterMaterial(), []);

  useFrame((state) => {
    time.value = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={material}>
      <planeGeometry
        args={[length, width, Math.ceil(length * segments), Math.ceil(width * segments)]}
      />
    </mesh>
  );
}
