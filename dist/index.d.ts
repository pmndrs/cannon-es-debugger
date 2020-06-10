import type { Body } from 'cannon-es';
import type { Scene, Color } from 'three';
declare type WireframeOptions = {
    color?: string | number | Color;
};
export default function renderWireframes(scene: Scene, bodies: Body[], options?: WireframeOptions): void;
export {};
