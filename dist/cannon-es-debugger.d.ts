declare module "cannon-es-debugger" {
    import { Shape } from 'cannon-es';
    import { Mesh } from 'three';
    import type { Body } from 'cannon-es';
    import type { Scene, Color } from 'three';
    type DebugOptions = {
        color?: string | number | Color;
        onInit?: (body: Body, mesh: Mesh, shape: Shape) => void;
        onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void;
        autoUpdate?: Boolean;
    };
    export default function cannonDebugger(scene: Scene, bodies: Body[], options?: DebugOptions): {
        update: () => void;
    };
}
