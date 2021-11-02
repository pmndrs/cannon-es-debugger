declare module "cannon-es-debugger" {
    import { Shape, ShapeType } from 'cannon-es';
    import { Mesh } from 'three';
    import type { Body } from 'cannon-es';
    import type { Scene, Color } from 'three';
    type ColorFn = (shape: ShapeType) => string | number | Color;
    export type DebugOptions = {
        color?: string | number | Color | ColorFn;
        scale?: number;
        onInit?: (body: Body, mesh: Mesh, shape: Shape) => void;
        onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void;
        autoUpdate?: Boolean;
    };
    export default function cannonDebugger(scene: Scene, bodies: Body[], { color, scale, onInit, onUpdate, autoUpdate }?: DebugOptions): {
        update: () => void;
    };
}
