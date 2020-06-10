import { Shape } from 'cannon-es';
import { Mesh } from 'three';
import type { Body } from 'cannon-es';
import type { Scene, Color } from 'three';
declare type DebugOptions = {
    color?: string | number | Color;
    onInit?: (body: Body, mesh: Mesh, shape: Shape) => void;
    onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void;
};
export default function renderWireframes(scene: Scene, bodies: Body[], options?: DebugOptions): void;
export {};
