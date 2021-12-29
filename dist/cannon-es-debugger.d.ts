declare module "cannon-es-debugger" {
    import { Shape } from 'cannon-es';
    import { Mesh } from 'three';
    import type { Body, World } from 'cannon-es';
    import type { Scene, Color } from 'three';
    export type DebugOptions = {
        color?: string | number | Color;
        scale?: number;
        onInit?: (body: Body, mesh: Mesh, shape: Shape) => void;
        onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void;
    };
    export default function CannonDebugger(scene: Scene, world: World, { color, scale, onInit, onUpdate }?: DebugOptions): {
        update: () => void;
    };
}
