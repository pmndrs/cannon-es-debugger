declare module "cannon-es-debugger" {
    import { Shape } from 'cannon-es';
    import { Mesh } from 'three';
    import type { Body } from 'cannon-es';
    import type { Color } from 'three';
    interface Scene {
        add: (mesh: Mesh) => void;
        remove: (mesh: Mesh) => void;
    }
    interface World {
        bodies: Body[];
    }
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
